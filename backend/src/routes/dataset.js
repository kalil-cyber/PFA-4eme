import { Router } from 'express';
import { query, isMemoryMode } from '../config/db.js';
import { replaceRoadsInMemory } from '../data/memoryStore.js';
import { adminMiddleware } from '../middleware/auth.js';
import {
  getDatasetMeta,
  loadRoadSegments,
  DAY_FILES,
} from '../services/tarikiDatasetLoader.js';
import { logSystem } from '../utils/logger.js';

const router = Router();

router.get('/meta', (req, res) => {
  res.json(getDatasetMeta());
});

router.get('/roads', (req, res) => {
  const day = req.query.day || 'monday';
  if (!DAY_FILES[day]) {
    return res.status(400).json({ error: 'Jour invalide', valid: Object.keys(DAY_FILES) });
  }
  const roads = loadRoadSegments(day);
  res.json({ day, city: 'Casablanca', roads });
});

/** En mode mémoire (démo), pas d'auth requise pour changer le jour du dataset */
function datasetAuth(req, res, next) {
  if (isMemoryMode()) return next();
  return adminMiddleware(req, res, next);
}

router.post('/apply-day', datasetAuth, async (req, res) => {
  try {
    const { day } = req.body;
    if (!DAY_FILES[day]) {
      return res.status(400).json({ error: 'Jour invalide', valid: Object.keys(DAY_FILES) });
    }

    const roads = loadRoadSegments(day);

    if (isMemoryMode()) {
      replaceRoadsInMemory(roads);
      await logSystem('info', 'dataset', `Mode mémoire — ${roads.length} segments (${day})`);
      req.app.get('io')?.emit('traffic:update', {
        roads,
        timestamp: new Date().toISOString(),
        dataset_day: day,
      });
      return res.json({ success: true, day, segments: roads.length, mode: 'memory' });
    }

    for (const road of roads) {
      await query(
        `INSERT INTO road_segments (id, name, coordinates, status, speed_kmh, congestion_level)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           coordinates = EXCLUDED.coordinates,
           status = EXCLUDED.status,
           speed_kmh = EXCLUDED.speed_kmh,
           congestion_level = EXCLUDED.congestion_level`,
        [
          road.id,
          road.name,
          JSON.stringify(road.coordinates),
          road.status,
          road.speed_kmh,
          road.congestion_level,
        ]
      );
    }

    await logSystem('info', 'dataset', `Segments mis à jour pour ${day} (${roads.length} routes)`);

    const result = await query('SELECT * FROM road_segments ORDER BY name');
    req.app.get('io')?.emit('traffic:update', {
      roads: result.rows,
      timestamp: new Date().toISOString(),
      dataset_day: day,
    });

    res.json({ success: true, day, segments: roads.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
