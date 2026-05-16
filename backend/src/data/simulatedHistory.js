import { STATUS_FROM_LEVEL, SPEED_FROM_LEVEL } from './roads.js';

/**
 * Génère un historique horaire simulé par zone (inspiré des patterns
 * jour/heure du dépôt PFA, sans dépendance fichier externe).
 */
export function generateSegmentHistory(segmentId, baseCongestion = 55, points = 48) {
  const history = [];
  const now = Date.now();
  const intervalMs = 5 * 60 * 1000;

  const seed = segmentId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now - i * intervalMs);
    const hour = t.getHours();
    const day = t.getDay();

    // Pics matin (8h) et soir (17-18h) — pattern type séries temporelles urbaines
    const morningPeak = Math.exp(-((hour - 8) ** 2) / 8) * 12;
    const eveningPeak = Math.exp(-((hour - 17) ** 2) / 10) * 14;
    const weekendDamp = day === 0 || day === 6 ? -6 : 0;
    const wave = Math.sin((i / points) * Math.PI * 2 + seed * 0.01) * 4;
    const noise = ((seed + i * 7) % 11) - 5;

    let level = baseCongestion + morningPeak + eveningPeak + weekendDamp + wave + noise;
    level = Math.min(100, Math.max(0, Math.round(level)));

    history.push({
      timestamp: t.toISOString(),
      congestion_level: level,
      speed_kmh: SPEED_FROM_LEVEL(level),
      status: STATUS_FROM_LEVEL(level),
    });
  }

  return history;
}

export function initAllSegmentHistories(roads) {
  const histories = {};
  for (const road of roads) {
    histories[road.id] = generateSegmentHistory(road.id, road.congestion_level ?? 55);
  }
  return histories;
}

export function appendHistoryPoint(histories, segmentId, point, maxPoints = 96) {
  if (!histories[segmentId]) histories[segmentId] = [];
  histories[segmentId].push(point);
  if (histories[segmentId].length > maxPoints) {
    histories[segmentId] = histories[segmentId].slice(-maxPoints);
  }
}
