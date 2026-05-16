import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Lightbulb,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { api } from '../../lib/api';

const RISK_STYLES = {
  low: 'border-green-300 bg-green-50/95 dark:border-green-800 dark:bg-green-950/50',
  medium: 'border-amber-300 bg-amber-50/95 dark:border-amber-800 dark:bg-amber-950/50',
  high: 'border-red-300 bg-red-50/95 dark:border-red-800 dark:bg-red-950/50',
};

const RISK_BADGE = {
  low: 'text-green-800 dark:text-green-300',
  medium: 'text-amber-900 dark:text-amber-200',
  high: 'text-red-800 dark:text-red-300',
};

function formatSummary(text) {
  return text.split('\n\n').map((block, i) => {
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className={i > 0 ? 'mt-3' : ''}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    );
  });
}

export default function PredictionAnalystPanel({ horizon = 6, compact }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getPredictionInsights(horizon)
      .then((data) => {
        if (!cancelled) setInsights(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [horizon]);

  if (loading) {
    return (
      <div className="rounded-xl border border-violet-200 bg-violet-50/30 p-6 dark:border-violet-900 dark:bg-violet-950/20 animate-pulse">
        <p className="text-base text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          L&apos;analyste Tariki synthétise les tendances…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-base text-red-800 rounded-lg border border-red-300 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
        Analyse indisponible : {error}
      </p>
    );
  }

  if (!insights || insights.empty) {
    return (
      <p className="text-base text-slate-600 dark:text-slate-300">{insights?.executive_summary || 'Aucune analyse.'}</p>
    );
  }

  const riskClass = RISK_STYLES[insights.risk_level] || RISK_STYLES.medium;

  return (
    <div className="space-y-5">
      <div className={`rounded-xl border p-5 ${riskClass}`}>
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 text-white shrink-0">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              Analyse intelligente
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </h2>
            <p className={`text-sm font-medium mt-1 ${RISK_BADGE[insights.risk_level] || 'text-slate-600 dark:text-slate-300'}`}>
              Horizon {insights.horizon_minutes} min · {insights.model_label}
              {insights.health_score != null && (
                <> · Indice fluidité {insights.health_score}/100</>
              )}
            </p>
          </div>
        </div>
        <div className="text-base leading-relaxed text-slate-800 dark:text-slate-100">
          {formatSummary(insights.executive_summary)}
        </div>
      </div>

      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {insights.kpis?.map((k) => (
          <div
            key={k.id}
            className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400 font-medium">{k.label}</p>
            <p className="text-2xl font-bold text-tariki-700 dark:text-tariki-400 mt-0.5">{k.value}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{k.hint}</p>
          </div>
        ))}
      </div>

      {!compact && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="rounded-xl border border-red-100 p-4 dark:border-red-900/50 dark:bg-slate-900/50">
              <h3 className="font-semibold text-base flex items-center gap-2 text-red-800 dark:text-red-300 mb-3">
                <TrendingUp className="h-4 w-4" />
                Points chauds
              </h3>
              <ul className="space-y-2 text-base text-slate-800 dark:text-slate-200">
                {insights.hotspots?.length ? (
                  insights.hotspots.map((h) => (
                    <li key={h.segment_id} className="flex justify-between gap-2">
                      <span className="truncate font-medium">{h.zone_name}</span>
                      <span className="font-mono text-red-700 dark:text-red-400 shrink-0 font-semibold">
                        {h.current}% → {h.predicted}%
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Aucun pic majeur détecté.</li>
                )}
              </ul>
            </section>

            <section className="rounded-xl border border-green-100 p-4 dark:border-green-900/50 dark:bg-slate-900/50">
              <h3 className="font-semibold text-base flex items-center gap-2 text-green-800 dark:text-green-300 mb-3">
                <TrendingDown className="h-4 w-4" />
                Zones en amélioration
              </h3>
              <ul className="space-y-2 text-base text-slate-800 dark:text-slate-200">
                {insights.cooling_zones?.length ? (
                  insights.cooling_zones.map((z) => (
                    <li key={z.zone_name}>{z.narrative}</li>
                  ))
                ) : (
                  <li className="text-slate-500">Pas de décongestion notable prévue.</li>
                )}
              </ul>
            </section>
          </div>

          <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="font-semibold text-base flex items-center gap-2 mb-3 text-slate-900 dark:text-white">
              <Activity className="h-5 w-5 text-violet-600" />
              Lecture par zone
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {insights.zone_insights?.map((z) => (
                <li
                  key={z.segment_id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <p className="font-semibold truncate text-slate-900 dark:text-white">{z.zone_name}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    {z.current}% → {z.predicted}% · {z.insight}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <h3 className="font-semibold text-base flex items-center gap-2 text-amber-950 dark:text-amber-100 mb-2">
          <Lightbulb className="h-5 w-5" />
          Recommandations opérationnelles
        </h3>
        <ul className="space-y-2 text-base text-slate-800 dark:text-slate-100">
          {insights.recommendations?.map((r) => (
            <li key={r} className="flex gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
              <span>{r.replace(/\*\*/g, '')}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
