import PublicShell from '../components/layout/PublicShell';
import DataSourceBanner from '../components/discover/DataSourceBanner';
import { useEvents } from '../hooks/useDiscoverData';
import { Calendar, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { DEMO_EVENTS } from '../constants/discoverDemo';

const TYPE_COLORS = {
  Alerte: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200',
  Culture: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200',
  Sport: 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-200',
  Salon: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
  Musique: 'bg-pink-100 text-pink-800 dark:bg-pink-950/50 dark:text-pink-200',
  Travaux: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
};

export default function EventsPage() {
  const { data, loading, error } = useEvents();
  const events = data?.events?.length ? data.events : error ? DEMO_EVENTS : [];

  return (
    <PublicShell title="Événements & alertes" subtitle="ADM Trafic — temps réel">
      {data && <DataSourceBanner sources={['ADM Trafic']} updatedAt={data.updatedAt} />}
      {error && (
        <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
          API indisponible — données de secours.
        </p>
      )}

      {loading && events.length === 0 && (
        <p className="flex items-center gap-2 text-slate-500 py-12 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement des alertes…
        </p>
      )}

      <ul className="space-y-4">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h2 className="text-lg font-bold">{ev.title}</h2>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[ev.type] || TYPE_COLORS.Alerte}`}
              >
                {ev.type}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <Calendar className="h-4 w-4 text-tariki-600 shrink-0" />
              {ev.date}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-3">
              <MapPin className="h-4 w-4 text-tariki-600 shrink-0" />
              {ev.place}
            </p>
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-sm flex gap-2 dark:bg-amber-950/30 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-900 dark:text-amber-200">{ev.impact}</p>
            </div>
          </li>
        ))}
      </ul>
    </PublicShell>
  );
}
