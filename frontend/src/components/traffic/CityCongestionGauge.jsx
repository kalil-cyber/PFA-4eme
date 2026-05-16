import { STATUS_COLORS } from '../../utils/traffic';

const MIN = 47;
const MAX = 70;

export default function CityCongestionGauge({ value = 0 }) {
  const clamped = Math.min(MAX, Math.max(MIN, value || MIN));
  const pct = ((clamped - MIN) / (MAX - MIN)) * 100;
  const color =
    clamped >= 65 ? STATUS_COLORS.congested : clamped >= 55 ? STATUS_COLORS.moderate : STATUS_COLORS.fluid;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500 mb-3">Indice ville (47–70 %)</p>
      <div className="relative h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-30 bg-slate-400"
          style={{ left: '0%', width: '100%' }}
        />
        <div
          className="absolute inset-y-0 rounded-full transition-all duration-700"
          style={{ left: '0%', width: `${pct}%`, backgroundColor: color }}
        />
        <div className="absolute inset-0 flex justify-between px-1 items-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
          <span>47</span>
          <span>70</span>
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums" style={{ color }}>
        {Math.round(clamped)}%
      </p>
      <p className="text-xs text-slate-500 mt-1">Congestion moyenne sur le réseau</p>
    </div>
  );
}
