import { Router } from 'express';
import { refreshPredictions, getSegmentHistories } from '../services/predictionService.js';
import { buildPredictionInsights } from '../services/predictionAnalyst.js';

const router = Router();

router.get('/insights', async (req, res) => {
  try {
    const horizon = Math.min(parseInt(req.query.horizon || '6', 10), 24);
    const forecast = await refreshPredictions(horizon);
    res.json(buildPredictionInsights(forecast));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const horizon = Math.min(parseInt(req.query.horizon || '6', 10), 24);
    const data = await refreshPredictions(horizon);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/zones/:segmentId/history', async (req, res) => {
  try {
    const histories = getSegmentHistories();
    const history = histories[req.params.segmentId] || [];
    res.json({ segment_id: req.params.segmentId, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/zones/:segmentId', async (req, res) => {
  try {
    const horizon = Math.min(parseInt(req.query.horizon || '6', 10), 24);
    const data = await refreshPredictions(horizon);
    const zone = data.zones.find((z) => z.segment_id === req.params.segmentId);
    if (!zone) return res.status(404).json({ error: 'Zone introuvable' });
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
