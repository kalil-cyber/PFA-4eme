import { Router } from 'express';
import { getAdmAlerts } from '../services/admTraficService.js';
import { getSurveillancePoints } from '../services/surveillanceDataset.js';
import { getCasablancaWeather } from '../services/weatherService.js';
import { getCasablancaPois } from '../services/poiService.js';

const router = Router();

/** Webcams & surveillance — dataset local uniquement (fiable hors ligne) */
router.get('/webcams', (req, res) => {
  try {
    const category = req.query.category || 'all';
    const zone = req.query.zone || 'all';
    const data = getSurveillancePoints({ category, zone });

    res.set('Cache-Control', 'public, max-age=300');
    res.json({
      source: 'dataset',
      datasetFile: 'datasets/surveillance_casablanca.json',
      updatedAt: data.updatedAt,
      region: data.region,
      description: data.description,
      points: data.points,
      webcams: data.webcams,
      peages: data.peages,
      feux: data.feux,
      surveillance: data.surveillance,
      counts: data.counts,
      categories: data.categories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/webcams/:id', (req, res) => {
  const data = getSurveillancePoints();
  const point = data.points.find((p) => p.id === req.params.id);
  if (!point) return res.status(404).json({ error: 'Point introuvable' });
  res.json(point);
});

router.get('/weather', async (req, res) => {
  try {
    res.json(await getCasablancaWeather());
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/pois', async (req, res) => {
  try {
    res.json(await getCasablancaPois());
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    res.json(await getAdmAlerts());
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
