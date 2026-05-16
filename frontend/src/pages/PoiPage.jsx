import PublicShell from '../components/layout/PublicShell';
import DataSourceBanner from '../components/discover/DataSourceBanner';
import { usePois } from '../hooks/useDiscoverData';
import { MapPin, Clock, Loader2 } from 'lucide-react';
import { DEMO_POIS } from '../constants/discoverDemo';

const CATEGORY_COLORS = {
  Monument: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
  Quartier: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200',
  Culture: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200',
  Patrimoine: 'bg-pink-100 text-pink-800 dark:bg-pink-950/50 dark:text-pink-200',
  Panorama: 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-200',
  Shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-950/50 dark:text-pink-200',
  Parc: 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-200',
  Transport: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
};

export default function PoiPage() {
  const { data, loading, error } = usePois();
  const pois = data?.pois?.length ? data.pois : error ? DEMO_POIS : [];

  return (
    <PublicShell title="Points d'intérêt" subtitle="OpenStreetMap — Casablanca">
      {data && <DataSourceBanner sources={['OpenStreetMap']} updatedAt={data.updatedAt} />}
      {error && (
        <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
          API indisponible — liste de secours affichée.
        </p>
      )}

      {loading && pois.length === 0 && (
        <p className="flex items-center gap-2 text-slate-500 py-12 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement des lieux…
        </p>
      )}

      <ul className="space-y-4">
        {pois.map((poi) => (
          <li
            key={poi.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h2 className="text-lg font-bold">{poi.name}</h2>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[poi.category] || CATEGORY_COLORS.Quartier}`}
              >
                {poi.tag}
              </span>
            </div>
            <p className="text-sm text-tariki-600 font-medium mb-2">{poi.category}</p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
              {poi.description}
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {poi.district}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {poi.open}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </PublicShell>
  );
}
