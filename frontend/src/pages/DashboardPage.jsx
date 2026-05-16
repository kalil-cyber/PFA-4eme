import { Activity, AlertTriangle, Gauge, Percent, Radio } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import TrafficMap from '../components/map/TrafficMap';
import IncidentList from '../components/incidents/IncidentList';
import { SpeedChart, CongestionBarChart } from '../components/charts/TrafficChart';
import CongestionBar from '../components/traffic/CongestionBar';
import LiveTrafficFeed from '../components/traffic/LiveTrafficFeed';
import HighCongestionBanner from '../components/traffic/HighCongestionBanner';
import CityCongestionGauge from '../components/traffic/CityCongestionGauge';
import { useTrafficData } from '../hooks/useTrafficData';

export default function DashboardPage() {
  const {
    roads,
    incidents,
    stats,
    history,
    simulation,
    loading,
    error,
    toggleSimulation,
    lastUpdate,
    highlightId,
    avgCongestion,
  } = useTrafficData();

  const activeIncidents = incidents.filter((i) => i.status === 'active');

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Smart City</h1>
          <p className="text-slate-500 text-sm">
            Simulation active : congestion entre <strong>47 %</strong> et <strong>70 %</strong>
          </p>
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900">
          <Radio className={`h-4 w-4 ${simulation ? 'text-green-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-sm font-medium">Simulation trafic</span>
          <input
            type="checkbox"
            checked={simulation}
            onChange={(e) => toggleSimulation(e.target.checked)}
            className="h-4 w-4 rounded accent-tariki-600"
          />
        </label>
      </header>

      <HighCongestionBanner roads={roads} />

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm dark:bg-red-950/40">
          API indisponible : {error} — lancez le backend sur le port 4000.
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Chargement des données...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <StatCard
              title="Congestion moyenne"
              value={`${Math.round(avgCongestion)}%`}
              subtitle="Plage cible 47–70 %"
              icon={Percent}
              color="blue"
            />
            <StatCard
              title="Segments fluides"
              value={stats?.fluid ?? 0}
              icon={Activity}
              color="green"
            />
            <StatCard
              title="Trafic modéré"
              value={stats?.moderate ?? 0}
              icon={Gauge}
              color="yellow"
            />
            <StatCard
              title="Congestionnés"
              value={stats?.congested ?? 0}
              icon={AlertTriangle}
              color="red"
            />
            <StatCard
              title="Incidents actifs"
              value={stats?.active_incidents ?? activeIncidents.length}
              subtitle={`${stats?.avg_speed_kmh?.toFixed?.(0) ?? '—'} km/h moy.`}
              icon={AlertTriangle}
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <LiveTrafficFeed lastUpdate={lastUpdate} />
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="font-semibold mb-3">Carte du trafic</h2>
                <TrafficMap roads={roads} incidents={incidents} height="360px" />
              </div>
            </div>
            <div className="space-y-4">
              <CityCongestionGauge value={avgCongestion} />
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="font-semibold mb-3">Incidents récents</h2>
                <IncidentList incidents={activeIncidents.slice(0, 5)} compact />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold mb-4">Congestion par segment (temps réel)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roads.map((road) => (
                <CongestionBar
                  key={road.id}
                  road={road}
                  highlight={highlightId === road.id}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold mb-3">Répartition du trafic</h2>
              <CongestionBarChart stats={stats} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold mb-3">Vitesse moyenne (historique)</h2>
              <SpeedChart history={history} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
