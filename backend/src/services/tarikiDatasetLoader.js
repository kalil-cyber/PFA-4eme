import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Centre Casablanca (dataset Waze trajectories) */
export const CASABLANCA_CENTER = { latitude: 33.5731, longitude: -7.5898 };

export const DAY_FILES = {
  monday: 'table_5_monday.json',
  tuesday: 'table_6_tuesday.json',
  wednesday: 'table_7_wednesday.json',
  thursday: 'table_8_thursday.json',
  friday: 'table_9_friday.json',
  saturday: 'table_10_saturday.json',
  sunday: 'table_11_sunday.json',
};

const CASABLANCA_STREETS = [
  'Boulevard Mohammed V',
  'Avenue Hassan II',
  'Boulevard Zerktouni',
  'Corniche Aïn Diab',
  'Boulevard de la Corniche',
  'Avenue Lalla Yacout',
  'Rue Imam Muslim',
  'Boulevard Anfa',
  'Avenue des FAR',
  'Boulevard Brahim Roudani',
  'Avenue Mers Sultan',
  'Boulevard Ghandi',
  'Avenue 2 Mars',
  'Rue de Rome',
  'Boulevard Sidi Mohammed Ben Abdellah',
];

function resolveDatasetDir() {
  if (process.env.TARIKI_DATASET_PATH) {
    return path.resolve(process.env.TARIKI_DATASET_PATH);
  }
  return path.resolve(__dirname, '../../../datasets');
}

function parseCoordString(str) {
  if (typeof str !== 'string') return null;
  const match = str.trim().match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < 33.4 || lat > 33.7 || lng < -7.75 || lng > -7.35) return null;
  return { lat, lng };
}

export function extractUniqueCoordinates(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const seen = new Set();
  const ordered = [];

  for (const row of raw) {
    const value = Object.values(row)[0];
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (trimmed === 'Coordinates' || trimmed.startsWith('Description')) continue;
    const coord = parseCoordString(trimmed);
    if (!coord) continue;
    const key = `${coord.lat.toFixed(6)},${coord.lng.toFixed(6)}`;
    if (!seen.has(key)) {
      seen.add(key);
      ordered.push(coord);
    }
  }
  return ordered;
}

export function congestionFromSeed(seed, dayIndex = 0) {
  const base = 25 + (Math.abs(seed) % 55);
  const dayShift = (dayIndex * 4) % 12;
  return Math.min(100, Math.max(0, base + dayShift));
}

export function statusFromLevel(level) {
  if (level >= 65) return 'congested';
  if (level >= 52) return 'moderate';
  return 'fluid';
}

export function speedFromLevel(level) {
  return Math.max(10, Math.round(70 - level * 0.6));
}

export function buildRoadSegmentsFromCoords(coords, day = 'monday') {
  if (coords.length < 3) return fallbackSegments();

  const dayIndex = Object.keys(DAY_FILES).indexOf(day);
  const segmentCount = Math.min(15, Math.max(8, Math.floor(coords.length / 8)));
  const step = Math.max(1, Math.floor(coords.length / segmentCount));
  const segments = [];

  for (let i = 0; i < segmentCount; i++) {
    const idx = Math.min(i * step, coords.length - 3);
    const points = [
      coords[idx],
      coords[Math.min(idx + 1, coords.length - 1)],
      coords[Math.min(idx + 2, coords.length - 1)],
    ];
    const coordinates = points.map((p) => [p.lng, p.lat]);
    const seed = Math.round(points[0].lat * 10000 + points[0].lng * 10000) + i * 17;
    const congestion_level = congestionFromSeed(seed, dayIndex);
    const status = statusFromLevel(congestion_level);

    segments.push({
      id: `casa-seg-${String(i + 1).padStart(2, '0')}`,
      name: CASABLANCA_STREETS[i % CASABLANCA_STREETS.length],
      coordinates,
      status,
      speed_kmh: speedFromLevel(congestion_level),
      congestion_level,
      dataset_day: day,
      trajectory_index: i,
    });
  }

  return segments;
}

function fallbackSegments() {
  const center = CASABLANCA_CENTER;
  return [
    {
      id: 'casa-seg-01',
      name: 'Boulevard Mohammed V',
      coordinates: [
        [center.longitude - 0.02, center.latitude],
        [center.longitude, center.latitude + 0.01],
        [center.longitude + 0.02, center.latitude],
      ],
      status: 'moderate',
      speed_kmh: 38,
      congestion_level: 58,
    },
  ];
}

let cachedSegments = null;
let cachedDay = null;

export function loadRoadSegments(day = 'monday') {
  if (cachedSegments && cachedDay === day) return cachedSegments;

  const datasetDir = resolveDatasetDir();
  const fileName = DAY_FILES[day] || DAY_FILES.monday;
  const filePath = path.join(datasetDir, fileName);
  const coords = extractUniqueCoordinates(filePath);

  if (coords.length === 0) {
    console.warn(`[Tariki] Dataset introuvable (${filePath}), segments de secours`);
    cachedSegments = fallbackSegments();
  } else {
    cachedSegments = buildRoadSegmentsFromCoords(coords, day);
    console.log(`[Tariki] ${cachedSegments.length} segments chargés depuis ${fileName} (${coords.length} points)`);
  }
  cachedDay = day;
  return cachedSegments;
}

export function getDatasetMeta() {
  const datasetDir = resolveDatasetDir();
  const days = Object.entries(DAY_FILES).map(([day, file]) => {
    const filePath = path.join(datasetDir, file);
    const exists = fs.existsSync(filePath);
    const coords = exists ? extractUniqueCoordinates(filePath) : [];
    return {
      day,
      file,
      available: exists,
      trajectory_points: coords.length,
      segments: exists ? buildRoadSegmentsFromCoords(coords, day).length : 0,
    };
  });

  return {
    city: 'Casablanca',
    source: 'Waze API trajectories (tariki_cleaned_dataset)',
    dataset_path: datasetDir,
    center: CASABLANCA_CENTER,
    days,
  };
}

export function clearSegmentCache() {
  cachedSegments = null;
  cachedDay = null;
}
