/** Données locales — affichage immédiat sans attendre l’API */
import raw from '../../../datasets/surveillance_casablanca.json';

export function buildSurveillancePayload(points = raw.points) {
  const webcams = points.filter((p) => p.category === 'webcam');
  const peages = points.filter((p) => p.category === 'peage');
  const feux = points.filter((p) => p.category === 'feu');
  const surveillance = points.filter((p) => p.category === 'surveillance');

  return {
    source: 'dataset',
    datasetFile: 'datasets/surveillance_casablanca.json',
    updatedAt: raw.updatedAt,
    region: raw.region,
    description: raw.description,
    categories: raw.categories,
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

export const SURVEILLANCE_STATIC = buildSurveillancePayload();
