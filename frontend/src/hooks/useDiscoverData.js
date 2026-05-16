import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { SURVEILLANCE_STATIC } from '../utils/surveillance';

export function useDiscoverResource(fetcher, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(!fallback);
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

/** Affichage instantané (dataset embarqué), sync API optionnelle en arrière-plan */
export function useWebcams() {
  const [data, setData] = useState(SURVEILLANCE_STATIC);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setSyncing(true);
    try {
      const fresh = await api.getDiscoverWebcams();
      setData(fresh);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading: false, syncing, error, refresh };
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
