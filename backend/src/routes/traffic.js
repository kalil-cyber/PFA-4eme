import { Router } from 'express';
import { query } from '../config/db.js';
import { isSimulationEnabled, setSimulationEnabled } from '../services/trafficSimulator.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/roads', async (req, res) => {
  try {
    const result = await query('SELECT * FROM road_segments ORDER BY name');
    res.json(result.rows.map(formatRoad));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const current = await query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'fluid') AS fluid,
        COUNT(*) FILTER (WHERE status = 'moderate') AS moderate,
        COUNT(*) FILTER (WHERE status = 'congested') AS congested,
        COALESCE(AVG(speed_kmh), 0) AS avg_speed,
        COALESCE(AVG(congestion_level), 0) AS avg_congestion
      FROM road_segments
    `);
    const incidents = await query(`SELECT COUNT(*) FROM incidents WHERE status = 'active'`);
    const history = await query(
      'SELECT * FROM traffic_stats ORDER BY recorded_at DESC LIMIT 24'
    );

    const row = current.rows[0];
    res.json({
      current: {
        fluid: parseInt(row.fluid, 10),
        moderate: parseInt(row.moderate, 10),
        congested: parseInt(row.congested, 10),
        active_incidents: parseInt(incidents.rows[0].count, 10),
        avg_speed_kmh: parseFloat(row.avg_speed),
        avg_congestion: parseFloat(row.avg_congestion || 0),
      },
      history: history.rows.reverse(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/simulation', (req, res) => {
  res.json({ enabled: isSimulationEnabled() });
});

router.post('/simulation', adminMiddleware, (req, res) => {
  const { enabled } = req.body;
  const state = setSimulationEnabled(Boolean(enabled));
  req.app.get('io')?.emit('simulation:toggle', { enabled: state });
  res.json({ enabled: state });
});

function formatRoad(row) {
  return {
    ...row,
    coordinates: typeof row.coordinates === 'string' ? JSON.parse(row.coordinates) : row.coordinates,
  };
}

export default router;
