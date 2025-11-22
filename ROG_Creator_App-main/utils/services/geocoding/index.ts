// src/services/geocoding/index.ts
import {
  searchCitiesNominatim,
  checkEndpointHealth,
  reverseGeocode,
} from './nominatim';
export type { CityResult } from './nominatim';

export async function searchCities(q: string, signal?: AbortSignal) {
  return searchCitiesNominatim(q, signal);
}

export { checkEndpointHealth, reverseGeocode };
