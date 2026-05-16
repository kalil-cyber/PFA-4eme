import { ArrowRight, Radio } from 'lucide-react';

export default function LiveTrafficFeed({ lastUpdate }) {
  const segment = lastUpdate?.segment;

  if (!segment) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
        <Radio className="h-4 w-4 inline mr-2 animate-pulse text-green-500" />
        En attente des mises à jour (simulation 47–70 %)…
      </div>
    );
  }

  const delta = segment.congestion_level - (segment.previousLevel ?? segment.congestion_level);
  const deltaLabel = delta > 0 ? `+${delta}` : String(delta);

  return (
    <div className="rounded-xl border border-tariki-200 bg-tariki-50/80 p-4 dark:border-tariki-800 dark:bg-tariki-950/40 animate-in fade-in duration-300">
      <p className="text-xs font-semibold uppercase text-tariki-600 dark:text-tariki-400 mb-2">
        Dernière mise à jour • {new Date(lastUpdate.timestamp || Date.now()).toLocaleTimeString('fr-FR')}
      </p>
      <p className="font-semibold text-sm">{segment.segmentName || segment.segmentId}</p>
      <p className="mt-1 flex items-center gap-2 text-lg font-bold tabular-nums">
        <span className="text-slate-500">{segment.previousLevel}%</span>
        <ArrowRight className="h-4 w-4 text-tariki-500" />
        <span style={{ color: segment.status === 'congested' ? '#ef4444' : segment.status === 'moderate' ? '#eab308' : '#22c55e' }}>
          {segment.congestion_level}%
        </span>
        <span className={`text-sm font-medium ${delta > 0 ? 'text-red-500' : 'text-green-500'}`}>
          ({deltaLabel}%)
        </span>
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {segment.speed_kmh} km/h • {segment.status}
      </p>
    </div>
  );
}
