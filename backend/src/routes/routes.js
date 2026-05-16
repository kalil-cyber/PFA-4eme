import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// Simple route optimizer using road segment graph (MVP - no external Maps API required)
router.post('/optimize', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      return res.status(400).json({ error: 'Origine et destination requises' });
    }

    const roads = await query('SELECT * FROM road_segments');
    const segments = roads.rows.map((r) => ({
      ...r,
      coordinates: typeof r.coordinates === 'string' ? JSON.parse(r.coordinates) : r.coordinates,
    }));

    const scored = segments
      .map((seg) => {
        const mid = seg.coordinates[Math.floor(seg.coordinates.length / 2)];
        const distToOrigin = haversine(origin.lat, origin.lng, mid[1], mid[0]);
        const distToDest = haversine(destination.lat, destination.lng, mid[1], mid[0]);
        const score = distToOrigin + distToDest + seg.congestion_level * 0.05;
        return { ...seg, score };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 4);

    const totalDistance = haversine(origin.lat, origin.lng, destination.lat, destination.lng);
    const avgCongestion = scored.reduce((s, r) => s + r.congestion_level, 0) / scored.length;
    const avgSpeed = scored.reduce((s, r) => s + r.speed_kmh, 0) / scored.length;
    const durationMinutes = Math.round((totalDistance / 1000) / (avgSpeed / 60) * (1 + avgCongestion / 200));

    const waypoints = [
      [origin.lng, origin.lat],
      ...scored.flatMap((s) => s.coordinates),
      [destination.lng, destination.lat],
    ];

    res.json({
      origin,
      destination,
      segments: scored.map(({ id, name, status, speed_kmh, congestion_level }) => ({
        id, name, status, speed_kmh, congestion_level,
      })),
      geometry: { type: 'LineString', coordinates: dedupeCoords(waypoints) },
      distance_km: Math.round(totalDistance / 100) / 10,
      duration_minutes: Math.max(5, durationMinutes),
      traffic_summary: summarizeTraffic(scored),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function dedupeCoords(coords) {
  return coords.filter((c, i) => i === 0 || c[0] !== coords[i - 1][0] || c[1] !== coords[i - 1][1]);
}

function summarizeTraffic(segments) {
  const congested = segments.filter((s) => s.status === 'congested').length;
  if (congested >= 2) return 'Trafic dense — itinéraire alternatif recommandé';
  if (congested === 1) return 'Trafic modéré sur une portion';
  return 'Circulation fluide';
}

export default router;
