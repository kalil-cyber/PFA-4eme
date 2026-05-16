import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incidents.js';
import trafficRoutes from './routes/traffic.js';
import routeRoutes from './routes/routes.js';
import logRoutes from './routes/logs.js';
import alertRoutes from './routes/alerts.js';
import predictionRoutes from './routes/predictions.js';
import datasetRoutes from './routes/dataset.js';
import chatRoutes from './routes/chat.js';
import discoverRoutes from './routes/discover.js';
import { refreshPredictions } from './services/predictionService.js';
import {
  startTrafficSimulator,
  stopTrafficSimulator,
  getTrafficSnapshot,
} from './services/trafficSimulator.js';
import { logSystem } from './utils/logger.js';
import { initDb, isMemoryMode, query } from './config/db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.set('io', io);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (req, res) => {
  const base = {
    status: 'ok',
    service: 'Tariki API',
    city: 'Casablanca',
    mode: isMemoryMode() ? 'memory' : 'postgresql',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };

  try {
    await query('SELECT 1');
    const roads = await query('SELECT COUNT(*) FROM road_segments');
    const count = parseInt(String(roads.rows[0]?.count ?? '0'), 10);
    res.json({ ...base, road_segments: count });
  } catch (err) {
    res.status(503).json({
      ...base,
      status: 'degraded',
      error: err.message,
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/dataset', datasetRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/discover', discoverRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: `Route API introuvable: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('[API]', err.message);
  logSystem('error', 'api', err.message).catch(() => {});
  res.status(500).json({ error: 'Erreur serveur interne' });
});

io.on('connection', async (socket) => {
  logSystem('debug', 'websocket', `Client connecté: ${socket.id}`);
  try {
    const snapshot = await getTrafficSnapshot();
    socket.emit('traffic:update', {
      ...snapshot,
      timestamp: new Date().toISOString(),
      initial: true,
    });
    const forecast = await refreshPredictions();
    socket.emit('prediction:update', forecast);
  } catch {
    // ignore
  }

  socket.on('disconnect', () => {
    logSystem('debug', 'websocket', `Client déconnecté: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

async function start() {
  await initDb();
  httpServer.listen(PORT, async () => {
    console.log(`\n🚦 Tariki API — Casablanca — http://localhost:${PORT}`);
    console.log(`   Mode: ${isMemoryMode() ? 'mémoire (USE_MEMORY)' : 'PostgreSQL'}`);
    console.log(`   Santé: http://localhost:${PORT}/api/health\n`);
    await logSystem('info', 'server', `Serveur démarré sur le port ${PORT}`);
    await refreshPredictions();
    await logSystem('info', 'prediction', 'Module Traffic Prediction initialisé');
    startTrafficSimulator(io);
  });
}

function shutdown(signal) {
  console.log(`\n[${signal}] Arrêt du serveur…`);
  stopTrafficSimulator();
  httpServer.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});

start().catch((err) => {
  console.error('Démarrage impossible:', err);
  process.exit(1);
});
