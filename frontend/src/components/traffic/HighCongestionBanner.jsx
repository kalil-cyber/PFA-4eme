import { AlertTriangle } from 'lucide-react';
import { STATUS_COLORS } from '../../utils/traffic';

const THRESHOLD = 65;

export default function HighCongestionBanner({ roads = [] }) {
  const critical = roads.filter((r) => r.congestion_level >= THRESHOLD);

  if (critical.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/40">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-amber-900 dark:text-amber-100">
            Alerte congestion — plage 47–70 % active
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
            {critical.length} segment(s) au-dessus de {THRESHOLD} %
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {critical.map((r) => (
              <li
                key={r.id}
                className="text-xs rounded-full px-2.5 py-1 font-medium"
                style={{
                  backgroundColor: `${STATUS_COLORS[r.status]}22`,
                  color: STATUS_COLORS[r.status],
                }}
              >
                {r.name} — {r.congestion_level}%
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
