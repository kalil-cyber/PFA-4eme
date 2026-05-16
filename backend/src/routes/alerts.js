import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();
const HIGH_THRESHOLD = parseInt(process.env.HIGH_CONGESTION_THRESHOLD || '65', 10);

router.get('/', async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold || String(HIGH_THRESHOLD), 10);
    const roads = await query('SELECT * FROM road_segments ORDER BY congestion_level DESC');
    const list = roads.rows
      .map((r) => ({
        ...r,
        coordinates:
          typeof r.coordinates === 'string' ? JSON.parse(r.coordinates) : r.coordinates,
      }))
      .filter((r) => r.congestion_level >= threshold);

    res.json({
      threshold,
      count: list.length,
      alerts: list.map((r) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        congestion_level: r.congestion_level,
        speed_kmh: r.speed_kmh,
        message: `Congestion ${r.congestion_level}% sur ${r.name}`,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
