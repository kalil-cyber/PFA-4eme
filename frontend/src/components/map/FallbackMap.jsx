import { STATUS_COLORS } from '../../utils/traffic';

export default function FallbackMap({ roads = [], incidents = [], height = '400px' }) {
  return (
    <div
      style={{ height }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col min-h-0 flex-1">
        <p className="text-sm font-medium text-slate-300">
          Casablanca — carte simulée en direct
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Ajoutez VITE_MAPBOX_TOKEN pour la carte Mapbox
        </p>

        <div className="mt-4 space-y-2 overflow-y-auto flex-1 pr-1">
          {roads.map((road) => {
            const color = STATUS_COLORS[road.status];
            const level = road.congestion_level ?? 0;
            return (
              <div key={road.id} className="rounded-lg bg-slate-800/90 px-3 py-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-white truncate">{road.name}</span>
                  <span className="font-bold tabular-nums" style={{ color }}>
                    {level}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${level}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {incidents.filter((i) => i.status === 'active').length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700 shrink-0">
            <p className="text-xs font-semibold text-slate-400 mb-1">INCIDENTS</p>
            {incidents
              .filter((i) => i.status === 'active')
              .slice(0, 3)
              .map((inc) => (
                <p key={inc.id} className="text-xs text-red-400 truncate">
                  ● {inc.title}
                </p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
