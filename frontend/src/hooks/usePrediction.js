import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useSocket } from '../context/SocketContext';

export function usePrediction(horizon = 6) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lastPrediction } = useSocket();

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getPredictions(horizon);
      setForecast(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [horizon]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (lastPrediction?.zones) {
      setForecast(lastPrediction);
    }
  }, [lastPrediction]);

  return { forecast, loading, error, refresh };
}
