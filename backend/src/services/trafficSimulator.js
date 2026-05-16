import { query } from '../config/db.js';
import { STATUS_FROM_LEVEL, SPEED_FROM_LEVEL } from '../data/roads.js';
import { logSystem } from '../utils/logger.js';
import { recordSegmentObservation, emitPredictionUpdate } from './predictionService.js';

let simulationEnabled = true;
let intervalId = null;

const MIN_CONGESTION = 0;
const MAX_CONGESTION = 100;

export function isSimulationEnabled() {
  return simulationEnabled;
}

export function setSimulationEnabled(enabled) {
  simulationEnabled = enabled;
  logSystem('info', 'simulator', `Simulation ${enabled ? 'activée' : 'désactivée'}`);
  return simulationEnabled;
}

function nextCongestionLevel(current) {
  // Variations aléatoires sur l'échelle 0–100 %
  const swing = 8 + Math.floor(Math.random() * 18); // +8 à +25 ou inverse
  const direction = Math.random() > 0.45 ? 1 : -1;
  let next = current + direction * swing;

  if (next < MIN_CONGESTION) next = MIN_CONGESTION + Math.floor(Math.random() * 12);
  if (next > MAX_CONGESTION) next = MAX_CONGESTION - Math.floor(Math.random() * 12);

  return Math.min(MAX_CONGESTION, Math.max(MIN_CONGESTION, next));
}

async function updateRandomSegment() {
  const segments = await query('SELECT id, congestion_level FROM road_segments');
  if (segments.rows.length === 0) return null;

  const seg = segments.rows[Math.floor(Math.random() * segments.rows.length)];
  const previousLevel = seg.congestion_level;
  const newLevel = nextCongestionLevel(previousLevel);
  const status = STATUS_FROM_LEVEL(newLevel);
  const speed = SPEED_FROM_LEVEL(newLevel);

  await query(
    `UPDATE road_segments SET congestion_level = $1, status = $2, speed_kmh = $3, updated_at = NOW() WHERE id = $4`,
    [newLevel, status, speed, seg.id]
  );

  recordSegmentObservation(seg.id, newLevel, speed, status);

  const roads = await query('SELECT * FROM road_segments ORDER BY name');
  const road = roads.rows.find((r) => r.id === seg.id);

  return {
    segmentId: seg.id,
    segmentName: road?.name || seg.id,
    previousLevel,
    congestion_level: newLevel,
    status,
    speed_kmh: speed,
  };
}

async function recordStats() {
  const stats = await query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'fluid') AS fluid,
      COUNT(*) FILTER (WHERE status = 'moderate') AS moderate,
      COUNT(*) FILTER (WHERE status = 'congested') AS congested,
      COALESCE(AVG(speed_kmh), 0) AS avg_speed,
      COALESCE(AVG(congestion_level), 0) AS avg_congestion
    FROM road_segments
  `);
  const incidents = await query(`SELECT COUNT(*) FROM incidents WHERE status = 'active'`);
  const row = stats.rows[0];

  await query(
    `INSERT INTO traffic_stats (fluid_count, moderate_count, congested_count, active_incidents, avg_speed_kmh)
     VALUES ($1, $2, $3, $4, $5)`,
    [row.fluid, row.moderate, row.congested, incidents.rows[0].count, parseFloat(row.avg_speed)]
  );

  return {
    fluid: parseInt(row.fluid, 10),
    moderate: parseInt(row.moderate, 10),
    congested: parseInt(row.congested, 10),
    active_incidents: parseInt(incidents.rows[0].count, 10),
    avg_speed_kmh: parseFloat(row.avg_speed),
    avg_congestion: parseFloat(row.avg_congestion || 0),
  };
}

export async function getCurrentStats() {
  const stats = await query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'fluid') AS fluid,
      COUNT(*) FILTER (WHERE status = 'moderate') AS moderate,
      COUNT(*) FILTER (WHERE status = 'congested') AS congested,
      COALESCE(AVG(speed_kmh), 0) AS avg_speed,
      COALESCE(AVG(congestion_level), 0) AS avg_congestion
    FROM road_segments
  `);
  const incidents = await query(`SELECT COUNT(*) FROM incidents WHERE status = 'active'`);
  const row = stats.rows[0];
  return {
    fluid: parseInt(row.fluid, 10),
    moderate: parseInt(row.moderate, 10),
    congested: parseInt(row.congested, 10),
    active_incidents: parseInt(incidents.rows[0].count, 10),
    avg_speed_kmh: parseFloat(row.avg_speed),
    avg_congestion: parseFloat(row.avg_congestion || 0),
  };
}

export async function getTrafficSnapshot() {
  const roads = await query('SELECT * FROM road_segments ORDER BY name');
  const incidents = await query(
    `SELECT * FROM incidents WHERE status = 'active' ORDER BY created_at DESC`
  );
  const stats = await getCurrentStats();
  return { roads: roads.rows, stats, incidents: incidents.rows };
}

export function startTrafficSimulator(io) {
  const intervalMs = parseInt(process.env.SIMULATION_INTERVAL_MS || '3000', 10);

  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(async () => {
    if (!simulationEnabled) return;

    try {
      const update = await updateRandomSegment();
      const stats = await recordStats();
      const roads = await query('SELECT * FROM road_segments ORDER BY name');
      const incidents = await query(
        `SELECT * FROM incidents WHERE status = 'active' ORDER BY created_at DESC`
      );

      io.emit('traffic:update', {
        segment: update,
        roads: roads.rows,
        stats,
        incidents: incidents.rows,
        timestamp: new Date().toISOString(),
      });

      await emitPredictionUpdate(io);
    } catch (err) {
      await logSystem('error', 'simulator', err.message);
    }
  }, intervalMs);

  logSystem('info', 'simulator', `Simulateur démarré (${intervalMs}ms, congestion ${MIN_CONGESTION}-${MAX_CONGESTION}%)`);
}

export function stopTrafficSimulator() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
