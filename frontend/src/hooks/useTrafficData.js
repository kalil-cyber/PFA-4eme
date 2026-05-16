import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useSocket } from '../context/SocketContext';

export function useTrafficData() {
  const [roads, setRoads] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [simulation, setSimulation] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const { lastUpdate } = useSocket();

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [roadsData, statsData, incidentsData, simData] = await Promise.all([
        api.getRoads(),
        api.getStats(),
        api.getIncidents(),
        api.getSimulation(),
      ]);
      setRoads(roadsData);
      setStats(statsData.current);
      setHistory(statsData.history || []);
      setIncidents(incidentsData);
      setSimulation(simData.enabled);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!lastUpdate) return;

    if (lastUpdate.roads) setRoads(lastUpdate.roads);
    if (lastUpdate.incidents) setIncidents(lastUpdate.incidents);

    if (lastUpdate.stats) {
      setStats(lastUpdate.stats);
      setHistory((prev) => {
        const point = {
          fluid_count: lastUpdate.stats.fluid,
          moderate_count: lastUpdate.stats.moderate,
          congested_count: lastUpdate.stats.congested,
          active_incidents: lastUpdate.stats.active_incidents,
          avg_speed_kmh: lastUpdate.stats.avg_speed_kmh,
          recorded_at: lastUpdate.timestamp || new Date().toISOString(),
        };
        const next = [...prev, point];
        return next.slice(-24);
      });
    }

    if (lastUpdate.segment?.segmentId) {
      setHighlightId(lastUpdate.segment.segmentId);
      const t = setTimeout(() => setHighlightId(null), 2500);
      return () => clearTimeout(t);
    }
  }, [lastUpdate]);

  const toggleSimulation = async (enabled) => {
    const result = await api.setSimulation(enabled);
    setSimulation(result.enabled);
  };

  const avgCongestion =
    stats?.avg_congestion ??
    (roads.length
      ? Math.round(roads.reduce((s, r) => s + (r.congestion_level || 0), 0) / roads.length)
      : 0);

  return {
    roads,
    incidents,
    stats,
    history,
    simulation,
    loading,
    error,
    refresh,
    toggleSimulation,
    setIncidents,
    lastUpdate,
    highlightId,
    avgCongestion,
  };
}
