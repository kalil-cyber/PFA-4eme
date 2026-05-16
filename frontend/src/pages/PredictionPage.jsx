import { useEffect, useState } from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import PredictionAnalystPanel from '../components/prediction/PredictionAnalystPanel';
import PredictionMap from '../components/prediction/PredictionMap';
import { ZoneForecastChart } from '../components/prediction/PredictionChart';
import { PredictionSummaryChart } from '../components/prediction/PredictionChart';
import { usePrediction } from '../hooks/usePrediction';
import { api } from '../lib/api';
import { STATUS_COLORS } from '../utils/traffic';

export default function PredictionPage() {
  const { forecast, loading, error, refresh } = usePrediction(6);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);

  const zones = forecast?.zones || [];
  const selected = zones.find((z) => z.segment_id === selectedId) || zones[0];

  useEffect(() => {
    if (zones.length && !selectedId) {
      setSelectedId(zones[0].segment_id);
    }
  }, [zones, selectedId]);

  useEffect(() => {
    if (!selected?.segment_id) return;
    api
      .getPredictionHistory(selected.segment_id)
      .then((res) => setHistory(res.history || []))
      .catch(() => setHistory([]));
  }, [selected?.segment_id]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Prédiction & analyse trafic</h1>
            <p className="text-slate-500 text-sm">
              Modèle statistique + synthèse analyste pour faciliter la décision à Casablanca
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm rounded-lg bg-red-50 px-4 py-3 dark:bg-red-950/30">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-slate-500">Calcul des prévisions par zone…</p>
      ) : (
        <>
          <PredictionAnalystPanel horizon={6} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-3">
              <p className="text-sm text-slate-500">
                Carte Leaflet — traits pointillés = routes, cercles = prédiction +30 min
              </p>
              <PredictionMap
                zones={zones}
                height="520px"
                selectedId={selected?.segment_id}
                onSelectZone={setSelectedId}
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="font-semibold mb-3">Zone sélectionnée</h2>
                {selected ? (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-lg">{selected.zone_name}</p>
                    <p>
                      Actuel :{' '}
                      <strong style={{ color: STATUS_COLORS[selected.current?.status] }}>
                        {selected.current?.congestion_level}%
                      </strong>
                    </p>
                    <p>
                      Prévu :{' '}
                      <strong>
                        {selected.predictions?.[selected.predictions.length - 1]?.congestion_level}%
                      </strong>
                    </p>
                    <p className="text-slate-500">Tendance : {selected.trend}</p>
                    <p className="text-slate-500">Confiance (R²) : {selected.r2}</p>
                    <ul className="mt-3 space-y-1">
                      {selected.predictions?.map((p) => (
                        <li key={p.step} className="flex justify-between text-xs">
                          <span>+{p.step * 5} min</span>
                          <span className="font-mono">{p.congestion_level}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-slate-500">Aucune zone</p>
                )}
              </div>

              <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-xs dark:border-violet-900 dark:bg-violet-950/30">
                <p className="font-semibold text-violet-800 dark:text-violet-300">Source données</p>
                <p className="mt-1 text-violet-700 dark:text-violet-400">
                  Séries générées localement (patterns horaires type{' '}
                  <a
                    href="https://github.com/oumaimaelatiki/pfa-traffic-prediction"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    pfa-traffic-prediction
                  </a>
                  ). Aucun CSV externe requis.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold mb-3">Série temporelle zone</h2>
              <ZoneForecastChart zone={selected} history={history} />
            </div>
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold mb-3">Comparatif toutes zones</h2>
              <PredictionSummaryChart zones={zones} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
