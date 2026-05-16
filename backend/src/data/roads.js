import {
  loadRoadSegments,
  CASABLANCA_CENTER,
  statusFromLevel,
  speedFromLevel,
  clearSegmentCache,
} from '../services/tarikiDatasetLoader.js';

const defaultDay = process.env.TARIKI_DEFAULT_DAY || 'monday';

export const ROAD_SEGMENTS = loadRoadSegments(defaultDay);
export { CASABLANCA_CENTER, clearSegmentCache };

export const STATUS_FROM_LEVEL = statusFromLevel;
export const SPEED_FROM_LEVEL = speedFromLevel;

export function reloadRoadSegments(day) {
  clearSegmentCache();
  return loadRoadSegments(day);
}
