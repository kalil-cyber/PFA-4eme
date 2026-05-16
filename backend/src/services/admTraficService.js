import { getCached, setCached } from './cache.js';

const ADM_ORIGIN = process.env.ADM_TRAFIC_ORIGIN || 'http://admtrafic.ma';
const CASA = { lat: 33.5731, lng: -7.5898 };
const CASA_RADIUS_KM = Number(process.env.ADM_WEBCAM_RADIUS_KM || 85);

const ADM_HEADERS = {
  'User-Agent': 'Tariki/1.0 (+https://tariki.local)',
  Referer: `${ADM_ORIGIN}/`,
  'X-Requested-With': 'XMLHttpRequest',
  Accept: 'application/json, text/javascript, */*; q=0.01',
};

async function admFetch(path) {
  const res = await fetch(`${ADM_ORIGIN}${path}`, { headers: ADM_HEADERS });
  if (!res.ok) throw new Error(`ADM ${path}: ${res.status}`);
  const text = await res.text();
  const json = JSON.parse(text || 'null');
  if (json?.header === 'NOK') throw new Error(json.result || 'ADM denied');
  return json;
}

function kmDistance(lat1, lng1, lat2, lng2) {
  const dLat = (lat2 - lat1) * 111;
  const dLng = (lng2 - lng1) * 85;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

function nearCasablanca(lat, lng) {
  return kmDistance(CASA.lat, CASA.lng, lat, lng) <= CASA_RADIUS_KM;
}

export async function getAdmWebcams({ region = 'casablanca' } = {}) {
  const cacheKey = `adm:webcams:${region}`;
  const cached = getCached(cacheKey, 10 * 60 * 1000);
  if (cached) return cached;

  const raw = await admFetch('/ajax/cameras');
  const list = Array.isArray(raw) ? raw : [];

  let cameras = list.map((cam) => ({
    id: `adm-${cam.id}`,
    name: cam.nom || cam.description || `Webcam ${cam.id}`,
    description: cam.description || '',
    latitude: parseFloat(cam.latitude),
    longitude: parseFloat(cam.longitude),
    streamUrl: cam.link,
    provider: 'ADM Autoroutes du Maroc',
    source: 'adm',
    live: true,
  }));

  if (region === 'casablanca') {
    cameras = cameras.filter((c) => nearCasablanca(c.latitude, c.longitude));
  } else if (region !== 'all') {
    cameras = cameras.filter((c) => nearCasablanca(c.latitude, c.longitude));
  }

  const payload = {
    source: 'adm',
    region,
    updatedAt: new Date().toISOString(),
    count: cameras.length,
    cameras,
  };
  setCached(cacheKey, payload);
  return payload;
}

export async function getAdmAlerts() {
  const cacheKey = 'adm:alerts';
  const cached = getCached(cacheKey, 5 * 60 * 1000);
  if (cached) return cached;

  const raw = await admFetch('/ajax/aletres');
  const list = Array.isArray(raw) ? raw : [];

  const events = list.map((item, index) => ({
    id: `adm-alert-${index}`,
    title: (item.titre || item.title || 'Alerte trafic').replace(/\r\n/g, ' ').trim(),
    description: (item.description || item.titre || '').replace(/\r\n/g, ' ').trim(),
    date: item.date || item.horodatage || 'En cours',
    place: item.lieu || item.localisation || 'Réseau autoroutier Maroc',
    type: 'Alerte',
    impact: item.description || item.titre || 'Perturbation signalée sur le réseau.',
    source: 'adm',
  }));

  const payload = {
    source: 'adm',
    updatedAt: new Date().toISOString(),
    count: events.length,
    events,
  };
  setCached(cacheKey, payload);
  return payload;
}
