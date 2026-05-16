/**
 * Présentation — Ville de Casablanca (Pexels, licence gratuite).
 * Images jusqu’à 7680 px de large.
 * https://www.pexels.com/license/
 */

export const CASA_MEDIA_MAX_WIDTH = 7680;

export function pexelsPhotoUrl(photoId, width = CASA_MEDIA_MAX_WIDTH) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?w=${width}&h=4320&fit=crop&q=92&auto=format`;
}

export function pexelsPhotoSrcSet(photoId) {
  return [
    `${pexelsPhotoUrl(photoId, 1920)} 1920w`,
    `${pexelsPhotoUrl(photoId, 3840)} 3840w`,
    `${pexelsPhotoUrl(photoId, 7680)} 7680w`,
  ].join(', ');
}

/** Diaporama — emblèmes et paysages de Casablanca */
export const CASA_PRESENTATION_IMAGES = [
  {
    id: 1118877,
    alt: 'Mosquée Hassan II et front de mer, Casablanca',
  },
  {
    id: 3257682,
    alt: 'Skyline de Casablanca au coucher du soleil',
  },
  {
    id: 2581542,
    alt: 'Centre-ville et architecture, Casablanca',
  },
  {
    id: 2901209,
    alt: 'Corniche et Atlantique, Casablanca',
  },
  {
    id: 2570924,
    alt: 'Quartiers et littoral, Casablanca',
  },
  {
    id: 1181405,
    alt: 'Vue panoramique sur la ville de Casablanca',
  },
  {
    id: 2506923,
    alt: 'Casablanca, façade urbaine et ciel',
  },
].map((item) => ({
  ...item,
  src: pexelsPhotoUrl(item.id, CASA_MEDIA_MAX_WIDTH),
  srcSet: pexelsPhotoSrcSet(item.id),
}));
