import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATASET_PATH = path.resolve(__dirname, '../../../datasets/surveillance_casablanca.json');

let cached = null;

export function loadSurveillanceDataset() {
  if (cached) return cached;
  const raw = readFileSync(DATASET_PATH, 'utf8');
  cached = JSON.parse(raw);
  return cached;
}

export function getSurveillancePoints({ category, zone } = {}) {
  const ds = loadSurveillanceDataset();
  let points = [...(ds.points || [])];

  if (category && category !== 'all') {
    points = points.filter((p) => p.category === category || p.zone === category);
  }
  if (zone && zone !== 'all') {
    points = points.filter((p) => p.zone === zone);
  }

  const webcams = points.filter((p) => p.category === 'webcam');
  const peages = points.filter((p) => p.category === 'peage');
  const feux = points.filter((p) => p.category === 'feu');
  const surveillance = points.filter((p) => p.category === 'surveillance');

  return {
    ...ds,
    points,
    webcams,
    peages,
    feux,
    surveillance,
    counts: {
      total: points.length,
      webcams: webcams.length,
      live: webcams.filter((p) => p.live && p.streamUrl).length,
      peages: peages.length,
      feux: feux.length,
      surveillance: surveillance.length,
      ville: points.filter((p) => p.zone === 'ville').length,
      autoroute: points.filter((p) => p.zone === 'autoroute').length,
    },
  };
}
