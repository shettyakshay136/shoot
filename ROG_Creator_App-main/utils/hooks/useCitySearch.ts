// src/hooks/useCitySearch.ts
import { useEffect } from 'react';
import { useDebouncedAsync } from './useDebouncedAsync';
import {
  searchCities,
  CityResult,
  checkEndpointHealth,
} from '@/utils/services/geocoding';

export function useCitySearch(query: string, enabled = true) {
  const { data, loading } = useDebouncedAsync<{ q: string }, CityResult[]>(
    ({ q }, signal) => searchCities(q, signal),
    { q: query },
    {
      delay: 300,
      immediate: false,
      enabled: enabled && query.trim().length >= 2,
      onError: e => console.warn('[citySearch]', e),
    },
  );

  useEffect(() => {
    if (enabled) {
      checkEndpointHealth();
    }
  }, [enabled]);

  return {
    results: data ?? [],
    loading,
    isIdle: query.trim().length < 2,
  };
}
