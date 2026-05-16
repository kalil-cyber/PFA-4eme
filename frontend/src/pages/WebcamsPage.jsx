import { useState } from 'react';
import PublicShell from '../components/layout/PublicShell';
import DataSourceBanner from '../components/discover/DataSourceBanner';
import WebcamPlayer from '../components/discover/WebcamPlayer';
import { useWebcams } from '../hooks/useDiscoverData';
import { MapPin, Loader2, Map } from 'lucide-react';

export default function WebcamsPage() {
  const { data, loading, error } = useWebcams();
  const [showAll, setShowAll] = useState(false);

  const cameras = data?.cameras ?? [];
  const mapcamPoints = data?.mapcamPoints ?? [];
  const visible = showAll ? cameras : cameras.slice(0, 12);

  return (
    <PublicShell title="Webcams" subtitle="Flux ADM — région Casablanca">
      {data && (
        <DataSourceBanner
          sources={[
            `ADM Autoroutes (${data.admCount} caméras)`,
            data.mapcamCount > 0 ? `MapCam (${data.mapcamCount} points)` : null,
          ].filter(Boolean)}
          updatedAt={data.updatedAt}
        />
      )}

      {loading && (
        <p className="flex items-center gap-2 text-slate-500 py-12 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement des webcams…
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          Impossible de charger les webcams : {error}
        </p>
      )}

      {!loading && !error && cameras.length === 0 && (
        <p className="text-center text-slate-500 py-8">Aucune webcam dans la zone sélectionnée.</p>
      )}

      <ul className="space-y-8">
        {visible.map((cam) => (
          <li
            key={cam.id}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <WebcamPlayer name={cam.name} streamUrl={cam.streamUrl} provider={cam.provider} />
            <div className="p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{cam.name}</h2>
              <p className="text-sm text-tariki-600 font-medium flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {cam.provider}
                <span className="text-slate-400 font-normal">
                  · {cam.latitude?.toFixed(4)}, {cam.longitude?.toFixed(4)}
                </span>
              </p>
              {cam.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{cam.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {cameras.length > 12 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-6 w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {showAll ? 'Afficher moins' : `Voir les ${cameras.length - 12} autres webcams`}
        </button>
      )}

      {mapcamPoints.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Map className="h-5 w-5 text-tariki-600" />
            Points MapCam (radars & contrôles)
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {mapcamPoints.slice(0, 20).map((p) => (
              <li
                key={p.id}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
              >
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-slate-500">{p.type}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PublicShell>
  );
}
