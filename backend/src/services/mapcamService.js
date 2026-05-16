import { getCached, setCached } from './cache.js';

const MAPCAM_ORIGIN = process.env.MAPCAM_ORIGIN || 'https://www.mapcam.info';
const CASA = { lat: 33.5731, lng: -7.5898 };
const BBOX_DELTA = 0.06;

function lonTile(v, z) {
  return Math.floor(((Number(v) + 180) / 360) * 2 ** z);
}

function latTile(v, z) {
  const lat = (Number(v) * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2) * 2 ** z
  );
}

async function loadMapcamTile(a, b, c, d, lat, lng, z) {
  const url = `${MAPCAM_ORIGIN}/speedcam/backend_v7/loadtile.php?a=${a}&b=${b}&c=${c}&d=${d}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      la: String(lat),
      ln: String(lng),
      z: String(z),
      'User-Agent': 'Tariki/1.0',
      Referer: `${MAPCAM_ORIGIN}/speedcam/`,
      Origin: MAPCAM_ORIGIN,
    },
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

function normalizePoint(p, index) {
  const lat = parseFloat(p.la ?? p.lat ?? p.latitude);
  const lng = parseFloat(p.ln ?? p.lng ?? p.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const typeName = (p.type_name || p.type || '').toLowerCase();
  let category = 'radar';
  if (/feu|red.?light|signal|tricolore/.test(typeName)) category = 'feu';
  else if (/toll|péage|peage/.test(typeName)) category = 'peage';

  return {
    id: `mapcam-${p.idm ?? p.id ?? index}`,
    name: p.type_name || p.type || p.n || `Point MapCam ${index + 1}`,
    description: p.comment || p.desc || 'Point routier signalé (MapCam.info)',
    latitude: lat,
    longitude: lng,
    type: p.type_name || p.type || 'camera',
    category,
    provider: 'MapCam.info',
    source: 'mapcam',
    live: false,
  };
}

export async function getMapcamPointsNearCasablanca() {
  const cacheKey = 'mapcam:casa';
  const cached = getCached(cacheKey, 30 * 60 * 1000);
  if (cached) return cached;

  const z = 14;
  const h = [CASA.lng - BBOX_DELTA, CASA.lat - BBOX_DELTA, CASA.lng + BBOX_DELTA, CASA.lat + BBOX_DELTA];
  const a = lonTile(h[0], z);
  const b = latTile(h[3], z);
  const c = lonTile(h[2], z);
  const d = latTile(h[1], z);

  const raw = await loadMapcamTile(a, b, c, d, CASA.lat, CASA.lng, z);
  const points = raw
    .map((p, i) => normalizePoint(p, i))
    .filter(Boolean)
    .filter((p) => {
      const dist = Math.hypot((p.latitude - CASA.lat) * 111, (p.longitude - CASA.lng) * 85);
      return dist <= 50;
    });

  const payload = {
    source: 'mapcam',
    updatedAt: new Date().toISOString(),
    count: points.length,
    points,
  };
  setCached(cacheKey, payload);
  return payload;
}
