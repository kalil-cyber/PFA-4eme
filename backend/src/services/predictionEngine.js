import { STATUS_FROM_LEVEL, SPEED_FROM_LEVEL } from '../data/roads.js';

const MIN_LEVEL = 0;
const MAX_LEVEL = 100;
const DEFAULT_HORIZON = 6; // 6 × 5 min = 30 min ahead

/**
 * Régression linéaire simple (MVP — remplaçable par LSTM via service Python).
 */
export function linearRegression(history) {
  const n = history.length;
  if (n === 0) return { slope: 0, intercept: 55, r2: 0 };
  if (n === 1) return { slope: 0, intercept: history[0].congestion_level, r2: 1 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = history[i].congestion_level;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  const denom = n * sumXX - sumX * sumX;
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / n;

  const yMean = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const predicted = intercept + slope * i;
    ssTot += (history[i].congestion_level - yMean) ** 2;
    ssRes += (history[i].congestion_level - predicted) ** 2;
  }
  const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0.5;

  return { slope, intercept, r2 };
}

export function predictCongestion(history, horizon = DEFAULT_HORIZON, intervalMs = 5 * 60 * 1000) {
  const window = history.slice(-24);
  const { slope, intercept, r2 } = linearRegression(window);
  const startIdx = window.length - 1;
  const last = window[window.length - 1];
  const now = Date.now();

  const predictions = [];
  for (let step = 1; step <= horizon; step++) {
    const idx = startIdx + step;
    let level = Math.round(intercept + slope * idx);
    level = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, level));

    const status = STATUS_FROM_LEVEL(level);
    predictions.push({
      step,
      timestamp: new Date(now + step * intervalMs).toISOString(),
      congestion_level: level,
      speed_kmh: SPEED_FROM_LEVEL(level),
      status,
      is_prediction: true,
      confidence: Math.round(Math.min(0.95, 0.55 + r2 * 0.4) * 100) / 100,
    });
  }

  const trend =
    slope > 0.35 ? 'rising' : slope < -0.35 ? 'falling' : 'stable';

  return {
    model: 'linear_regression_v1',
    model_label: 'Régression linéaire (MVP)',
    horizon_minutes: (horizon * intervalMs) / 60000,
    r2: Math.round(r2 * 100) / 100,
    trend,
    current: last
      ? {
          congestion_level: last.congestion_level,
          status: last.status,
          timestamp: last.timestamp,
        }
      : null,
    predictions,
    next_peak: predictions.reduce(
      (best, p) => (p.congestion_level > (best?.congestion_level ?? 0) ? p : best),
      predictions[0]
    ),
  };
}

export function predictAllZones(roads, segmentHistories, horizon = DEFAULT_HORIZON) {
  return roads.map((road) => {
    const history = segmentHistories[road.id] || [];
    const coords = road.coordinates || [];
    const mid = coords[Math.floor(coords.length / 2)] || [2.3522, 48.8566];

    const forecast = predictCongestion(history, horizon);

    return {
      segment_id: road.id,
      zone_name: road.name,
      latitude: mid[1],
      longitude: mid[0],
      coordinates: coords,
      ...forecast,
    };
  });
}
