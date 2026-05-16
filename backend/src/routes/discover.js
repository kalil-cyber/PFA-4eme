import { Router } from 'express';
import { getAdmWebcams, getAdmAlerts } from '../services/admTraficService.js';
import { getMapcamPointsNearCasablanca } from '../services/mapcamService.js';
import { getCasablancaWeather } from '../services/weatherService.js';
import { getCasablancaPois } from '../services/poiService.js';

const router = Router();

router.get('/webcams', async (req, res) => {
  try {
    const region = req.query.region || 'casablanca';
    const [adm, mapcam] = await Promise.all([
      getAdmWebcams({ region }),
      getMapcamPointsNearCasablanca().catch(() => ({ points: [], count: 0 })),
    ]);

    res.json({
      updatedAt: new Date().toISOString(),
      region,
      sources: ['adm', 'mapcam'],
      cameras: adm.cameras,
      mapcamPoints: mapcam.points || [],
      admCount: adm.count,
      mapcamCount: mapcam.count || 0,
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.get('/webcams/:id/embed', async (req, res) => {
  try {
    const all = await getAdmWebcams({ region: 'all' });
    const cam = all.cameras.find((c) => c.id === req.params.id);
    if (!cam?.streamUrl) return res.status(404).json({ error: 'Webcam introuvable' });
    res.json({ streamUrl: cam.streamUrl, name: cam.name });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
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
