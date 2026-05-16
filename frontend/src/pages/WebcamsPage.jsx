import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import PublicShell from '../components/layout/PublicShell';
import DataSourceBanner from '../components/discover/DataSourceBanner';
import WebcamPlayer from '../components/discover/WebcamPlayer';
import { useWebcams } from '../hooks/useDiscoverData';
import {
  Loader2,
  Video,
  CircleDollarSign,
  TrafficCone,
  Eye,
  MapPin,
} from 'lucide-react';

const WebcamsMap = lazy(() => import('../components/discover/WebcamsMap'));

const FILTERS = [
  { id: 'all', label: 'Tout' },
  { id: 'webcam', label: 'Webcams' },
  { id: 'peage', label: 'Péages' },
  { id: 'feu', label: 'Feux' },
  { id: 'surveillance', label: 'Surveillance' },
  { id: 'ville', label: 'Ville' },
  { id: 'autoroute', label: 'Autoroutes' },
];

const CAT_LABEL = {
  webcam: 'Webcam',
  peage: 'Péage',
  feu: 'Feu tricolore',
  surveillance: 'Surveillance',
};

function MapPlaceholder() {
  return (
    <div
      className="rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center"
      style={{ height: 320 }}
    >
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
}

export default function WebcamsPage() {
  const { data, syncing, error } = useWebcams();
  const [filter, setFilter] = useState('all');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMapReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const points = data?.points ?? [];
  const counts = data?.counts ?? {};

  const filtered = useMemo(() => {
    if (filter === 'all') return points;
    if (filter === 'ville' || filter === 'autoroute') {
      return points.filter((p) => p.zone === filter);
    }
    return points.filter((p) => p.category === filter);
  }, [points, filter]);

  const webcamsOnly = filtered.filter((p) => p.category === 'webcam');
  const listOnly = filtered.filter((p) => p.category !== 'webcam');

  return (
    <PublicShell
      title="Webcams & surveillance"
      subtitle="Dataset Tariki — Casablanca & axes autoroutiers"
      wide
    >
      {data && (
        <DataSourceBanner
          sources={[`Dataset ${data.datasetFile}`, `${counts.total ?? 0} points`]}
          updatedAt={data.updatedAt}
        />
      )}

      {syncing && (
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Synchronisation API…
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 mb-4">
          API indisponible ({error}) — affichage du dataset local.
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              filter === f.id
                ? 'bg-tariki-600 text-white border-tariki-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            {f.label}
            {f.id === 'webcam' && counts.webcams != null && ` (${counts.webcams})`}
            {f.id === 'peage' && counts.peages != null && ` (${counts.peages})`}
            {f.id === 'feu' && counts.feux != null && ` (${counts.feux})`}
            {f.id === 'surveillance' && counts.surveillance != null && ` (${counts.surveillance})`}
          </button>
        ))}
      </div>

      {mapReady ? (
        <Suspense fallback={<MapPlaceholder />}>
          <WebcamsMap points={points} filter={filter} height={320} />
        </Suspense>
      ) : (
        <MapPlaceholder />
      )}

      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2 mb-8">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-600" /> Webcam
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Péage
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Feu
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-violet-500" /> Surveillance
        </span>
      </div>

      {webcamsOnly.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-tariki-600" />
            Webcams ({webcamsOnly.length})
          </h2>
          <ul className="grid gap-6 lg:grid-cols-2">
            {webcamsOnly.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-900"
              >
                <WebcamPlayer
                  name={p.name}
                  streamUrl={p.streamUrl}
                  provider={p.provider}
                  description={p.description}
                  live={p.live}
                  category={p.category}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-tariki-600 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {CAT_LABEL.webcam} · {p.zone}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {listOnly.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            {filter === 'peage' && <CircleDollarSign className="h-5 w-5 text-amber-600" />}
            {filter === 'feu' && <TrafficCone className="h-5 w-5 text-red-600" />}
            {(filter === 'surveillance' || filter === 'all') && (
              <Eye className="h-5 w-5 text-violet-600" />
            )}
            Points sur la carte ({listOnly.length})
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {listOnly.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide text-tariki-600">
                  {CAT_LABEL[p.category]}
                </span>
                <p className="font-medium mt-1">{p.name}</p>
                <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                <p className="text-[10px] text-slate-400 mt-2 capitalize">{p.zone}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-8">Aucun point dans cette catégorie.</p>
      )}
    </PublicShell>
  );
}
