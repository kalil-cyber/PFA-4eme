import { query } from '../config/db.js';
import { store } from '../data/memoryStore.js';

function syncHistoriesFromStore() {
  if (store.segmentHistories && Object.keys(store.segmentHistories).length > 0) {
    segmentHistories = store.segmentHistories;
  }
}

function persistHistoriesToStore() {
  store.segmentHistories = segmentHistories;
}
import { predictAllZones } from './predictionEngine.js';
import { appendHistoryPoint, initAllSegmentHistories } from '../data/simulatedHistory.js';
import { logSystem } from '../utils/logger.js';

let segmentHistories = {};
let lastForecast = null;

export function getSegmentHistories() {
  return segmentHistories;
}

export function initPredictionData(roads) {
  segmentHistories = initAllSegmentHistories(roads);
}

export function recordSegmentObservation(segmentId, congestion_level, speed_kmh, status) {
  syncHistoriesFromStore();
  appendHistoryPoint(segmentHistories, segmentId, {
    timestamp: new Date().toISOString(),
    congestion_level,
    speed_kmh,
    status,
  });
  persistHistoriesToStore();
}

export async function refreshPredictions(horizon = 6) {
  const roadsResult = await query('SELECT * FROM road_segments ORDER BY name');
  const roads = roadsResult.rows.map((r) => ({
    ...r,
    coordinates:
      typeof r.coordinates === 'string' ? JSON.parse(r.coordinates) : r.coordinates,
  }));

  syncHistoriesFromStore();
  if (Object.keys(segmentHistories).length === 0) {
    initPredictionData(roads);
    persistHistoriesToStore();
  }

  const zones = predictAllZones(roads, segmentHistories, horizon);

  const summary = {
    zones_count: zones.length,
    rising: zones.filter((z) => z.trend === 'rising').length,
    falling: zones.filter((z) => z.trend === 'falling').length,
    stable: zones.filter((z) => z.trend === 'stable').length,
    avg_predicted_30min:
      Math.round(
        zones.reduce((s, z) => s + (z.predictions[z.predictions.length - 1]?.congestion_level || 0), 0) /
          (zones.length || 1)
      ),
  };

  lastForecast = {
    generated_at: new Date().toISOString(),
    model: 'linear_regression_v1',
    model_label: 'Régression linéaire · séries temporelles',
    data_source: 'simulated_timeseries',
    pfa_inspiration: 'https://github.com/oumaimaelatiki/pfa-traffic-prediction',
    horizon_minutes: horizon * 5,
    summary,
    zones,
  };

  return lastForecast;
}

export function getLastForecast() {
  return lastForecast;
}

export async function emitPredictionUpdate(io) {
  if (!io) return;
  const forecast = await refreshPredictions();
  io.emit('prediction:update', forecast);
  await logSystem('debug', 'prediction', `Prévisions mises à jour (${forecast.zones.length} zones)`);
}
