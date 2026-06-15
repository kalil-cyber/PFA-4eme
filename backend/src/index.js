import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import shopRoutes from './routes/shop.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');
const SERVE_FRONTEND =
  process.env.SERVE_FRONTEND === 'true' ||
  (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(PUBLIC_DIR, 'index.html')));

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origine non autorisee: ${origin}`));
    },
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Kalil Nutrition API',
    domain: 'e-commerce nutrition sportive',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', shopRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: `Route API introuvable: ${req.method} ${req.originalUrl}` });
});

if (SERVE_FRONTEND) {
  app.use(express.static(PUBLIC_DIR, { maxAge: '1h', index: false }));
  app.get(/^\/(?!api\/).*/, (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('[API]', err.message);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log(`\nKalil Nutrition API — ${base}`);
  console.log(`   Sante: ${base}/api/health`);
  console.log(`   Produits: ${base}/api/products`);
  if (SERVE_FRONTEND) console.log(`   Boutique: ${base}/`);
  console.log('');
});

function shutdown(signal) {
  console.log(`\n[${signal}] Arret du serveur...`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});
