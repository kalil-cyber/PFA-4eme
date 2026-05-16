import { getCached, setCached } from './cache.js';

const CASA = { lat: 33.5731, lng: -7.5898 };
const RADIUS_M = 12000;

const OVERPASS_QUERY = `
[out:json][timeout:25];
(
  node["tourism"~"attraction|museum|viewpoint"](around:${RADIUS_M},${CASA.lat},${CASA.lng});
  node["historic"](around:${RADIUS_M},${CASA.lat},${CASA.lng});
  node["amenity"~"place_of_worship|theatre|arts_centre"](around:${RADIUS_M},${CASA.lat},${CASA.lng});
  way["tourism"~"attraction|museum"](around:${RADIUS_M},${CASA.lat},${CASA.lng});
);
out center 30;
`;

const CATEGORY_MAP = {
  attraction: 'Monument',
  museum: 'Culture',
  viewpoint: 'Panorama',
  place_of_worship: 'Monument',
  theatre: 'Culture',
  arts_centre: 'Culture',
  historic: 'Patrimoine',
};

function categoryFor(tags) {
  for (const key of ['tourism', 'amenity', 'historic']) {
    const val = tags[key];
    if (val && CATEGORY_MAP[val]) return CATEGORY_MAP[val];
  }
  return 'Quartier';
}

export async function getCasablancaPois() {
  const cacheKey = 'poi:casa';
  const cached = getCached(cacheKey, 60 * 60 * 1000);
  if (cached) return cached;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
  });

  if (!res.ok) throw new Error(`Overpass: ${res.status}`);
  const data = await res.json();

  const pois = (data.elements || [])
    .map((el, index) => {
      const tags = el.tags || {};
      const name = tags.name || tags['name:fr'] || tags['name:ar'];
      if (!name) return null;

      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      if (!lat || !lng) return null;

      const category = categoryFor(tags);
      return {
        id: `osm-${el.type}-${el.id}`,
        name,
        category,
        district: tags['addr:suburb'] || tags['addr:city'] || 'Casablanca',
        description:
          tags.description ||
          tags['description:fr'] ||
          `${category} — données OpenStreetMap.`,
        open: tags.opening_hours || 'Horaires variables',
        tag: tags.tourism === 'museum' ? 'Culture' : 'À visiter',
        latitude: lat,
        longitude: lng,
        source: 'openstreetmap',
      };
    })
    .filter(Boolean)
    .slice(0, 24);

  const payload = {
    source: 'openstreetmap',
    updatedAt: new Date().toISOString(),
    count: pois.length,
    pois,
  };
  setCached(cacheKey, payload);
  return payload;
}
