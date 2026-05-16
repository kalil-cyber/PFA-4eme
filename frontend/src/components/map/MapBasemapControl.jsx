import { Map, Satellite } from 'lucide-react';

const OPTIONS = [
  { id: 'streets', label: 'Plan', icon: Map },
  { id: 'satellite', label: 'Satellite', icon: Satellite },
];

export default function MapBasemapControl({ value, onChange, provider = 'osm' }) {
  return (
    <div
      className="absolute top-3 left-3 z-[1000] flex flex-col gap-1 rounded-lg border border-slate-200/90 bg-white/95 p-1 shadow-lg backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95"
      role="group"
      aria-label="Type de carte"
    >
      {OPTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
            value === id
              ? 'bg-tariki-600 text-white'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          {label}
        </button>
      ))}
      <p className="px-2 pb-1 text-[10px] text-slate-400 leading-tight">
        {provider === 'mapbox' ? 'Mapbox' : 'OSM / Esri'}
      </p>
    </div>
  );
}
