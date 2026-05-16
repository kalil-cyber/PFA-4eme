import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useDiscoverResource(fetcher, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

export function useWebcams() {
  return useDiscoverResource(() => api.getDiscoverWebcams('casablanca'), null);
}

export function useWeather() {
  return useDiscoverResource(() => api.getDiscoverWeather(), null);
}

export function usePois() {
  return useDiscoverResource(() => api.getDiscoverPois(), null);
}

export function useEvents() {
  return useDiscoverResource(() => api.getDiscoverEvents(), null);
}
