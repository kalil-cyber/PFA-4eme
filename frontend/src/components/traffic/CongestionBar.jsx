import { STATUS_COLORS } from '../../utils/traffic';

export default function CongestionBar({ road, highlight }) {
  const level = road.congestion_level ?? 0;
  const color = STATUS_COLORS[road.status] || STATUS_COLORS.fluid;

  return (
    <div
      className={`rounded-lg border p-3 transition-all duration-500 ${
        highlight
          ? 'border-tariki-500 ring-2 ring-tariki-500/40 bg-tariki-50 dark:bg-tariki-950/30'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-medium truncate">{road.name}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {level}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${level}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        {road.speed_kmh} km/h • {road.status}
      </p>
    </div>
  );
}
