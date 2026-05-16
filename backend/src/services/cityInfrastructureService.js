import { getCached, setCached } from './cache.js';

/** Péages, feux et passages — OpenStreetMap (Casablanca + proche périphérie) */
const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const BBOX = { south: 33.45, west: -7.78, north: 33.68, east: -7.42 };

const QUERY = `
[out:json][timeout:30];
(
  node["highway"="toll_booth"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
  node["barrier"="toll"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
  node["highway"="traffic_signals"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
  way["highway"="toll_booth"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
);
out center tags 200;
`;

function elementToPoint(el, kind) {
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;

  const tags = el.tags || {};
  const name =
    tags.name ||
    tags['name:fr'] ||
    tags.ref ||
    (kind === 'toll' ? 'Point de péage' : 'Feu tricolore');

  return {
    id: `osm-${kind}-${el.type}-${el.id}`,
    name,
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    kind,
    category: kind === 'toll' ? 'peage' : 'feu',
    provider: 'OpenStreetMap',
    source: 'osm',
    live: false,
    description:
      kind === 'toll'
        ? 'Passage / péage recensé sur la carte (pas de flux vidéo OSM).'
        : 'Carrefour signalé — position indicative (données communautaires).',
    tags,
  };
}

export async function getCasablancaInfrastructure() {
  const cacheKey = 'osm:casa:infra';
  const cached = getCached(cacheKey, 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(QUERY)}`,
  });

  if (!res.ok) throw new Error(`Overpass ${res.status}`);

  const json = await res.json();
  const elements = json.elements || [];

  const tolls = [];
  const signals = [];

  for (const el of elements) {
    const tags = el.tags || {};
    if (tags.highway === 'toll_booth' || tags.barrier === 'toll') {
      const p = elementToPoint(el, 'toll');
      if (p) tolls.push(p);
    } else if (tags.highway === 'traffic_signals') {
      const p = elementToPoint(el, 'signal');
      if (p) signals.push(p);
    }
  }

  const payload = {
    source: 'osm',
    updatedAt: new Date().toISOString(),
    bbox: BBOX,
    tolls,
    trafficSignals: signals,
    tollCount: tolls.length,
    signalCount: signals.length,
  };

  setCached(cacheKey, payload);
  return payload;
}
