import { Brain, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminPath } from '../../config/admin';
import { usePrediction } from '../../hooks/usePrediction';
import { PredictionSummaryChart } from './PredictionChart';

const TREND_ICON = {
  rising: TrendingUp,
  falling: TrendingDown,
  stable: Minus,
};

export default function PredictionAnalytics({ compact }) {
  const { forecast, loading, error } = usePrediction(6);
  const zones = forecast?.zones || [];
  const summary = forecast?.summary;

  if (loading) {
    return <p className="text-sm text-slate-500">Chargement des prédictions IA…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">Prédictions indisponibles : {error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-600" />
          <div>
            <h2 className="font-semibold">Traffic Prediction (IA)</h2>
            <p className="text-xs text-slate-500">
              {forecast?.model_label} • horizon {forecast?.horizon_minutes} min
            </p>
          </div>
        </div>
        {!compact && (
          <Link to={adminPath('predictions')} className="text-sm text-tariki-600 hover:underline font-medium">
            Module complet →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Moy. prévue +30 min</p>
          <p className="text-xl font-bold text-tariki-600">{summary?.avg_predicted_30min}%</p>
        </div>
        <div className="rounded-lg border border-red-200 p-3 dark:border-red-900/50">
          <p className="text-xs text-slate-500">Hausse</p>
          <p className="text-xl font-bold text-red-600">{summary?.rising}</p>
        </div>
        <div className="rounded-lg border border-green-200 p-3 dark:border-green-900/50">
          <p className="text-xs text-slate-500">Baisse</p>
          <p className="text-xl font-bold text-green-600">{summary?.falling}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500">Stable</p>
          <p className="text-xl font-bold">{summary?.stable}</p>
        </div>
      </div>

      {!compact && zones.length > 0 && (
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <PredictionSummaryChart zones={zones} />
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {zones.slice(0, compact ? 4 : 7).map((z) => {
          const Icon = TREND_ICON[z.trend] || Minus;
          const next = z.predictions?.[z.predictions.length - 1];
          return (
            <li
              key={z.segment_id}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
            >
              <span className="truncate font-medium">{z.zone_name}</span>
              <span className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-slate-500">{z.current?.congestion_level}%</span>
                <span>→</span>
                <span className="font-bold">{next?.congestion_level}%</span>
                <Icon className="h-3.5 w-3.5 text-slate-400" />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
