import { useState } from 'react';
import TrafficMap from '../map/TrafficMap';
import CongestionBar from './CongestionBar';
import LiveTrafficFeed from './LiveTrafficFeed';
import HighCongestionBanner from './HighCongestionBanner';
import CityCongestionGauge from './CityCongestionGauge';
import DatasetDayPicker from '../dataset/DatasetDayPicker';

/**
 * Vue carte alignée sur le dashboard / admin — dataset Casablanca (Waze).
 */
export default function TrafficMapWorkspace({
  roads,
  incidents,
  loading,
  lastUpdate,
  highlightId,
  avgCongestion,
  onDatasetApplied,
  mapHeight = '100%',
  intro = null,
}) {
  const [filter, setFilter] = useState('all');

  const filtered = roads.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-4">
      {intro && <p className="text-slate-500 text-sm">{intro}</p>}

      <HighCongestionBanner roads={roads} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 flex flex-col min-h-[min(70vh,520px)] rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          {loading ? (
            <p className="p-8 text-slate-500">Chargement de la carte…</p>
          ) : (
            <TrafficMap roads={roads} incidents={incidents} height={mapHeight} />
          )}
        </div>

        <div className="space-y-4">
          <DatasetDayPicker onApplied={onDatasetApplied} />
          <CityCongestionGauge value={avgCongestion} />
          <LiveTrafficFeed lastUpdate={lastUpdate} />
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-medium text-slate-500">Filtrer les segments</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm dark:bg-slate-800 dark:border-slate-700"
            >
              <option value="all">Tous</option>
              <option value="fluid">Fluide</option>
              <option value="moderate">Modéré</option>
              <option value="congested">Congestionné</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold mb-4 text-slate-900 dark:text-white">
          Congestion par segment (temps réel)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((road) => (
            <CongestionBar key={road.id} road={road} highlight={highlightId === road.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
