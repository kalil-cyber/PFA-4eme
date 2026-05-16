import PublicShell from '../components/layout/PublicShell';
import DataSourceBanner from '../components/discover/DataSourceBanner';
import { useWeather } from '../hooks/useDiscoverData';
import { Droplets, Wind, Sun, CloudRain, Cloud, Loader2 } from 'lucide-react';
import { DEMO_WEATHER } from '../constants/discoverDemo';

function ForecastIcon({ type }) {
  if (type === 'sun') return <Sun className="h-8 w-8 text-amber-500" />;
  if (type === 'rain') return <CloudRain className="h-8 w-8 text-blue-500" />;
  if (type === 'cloud') return <Cloud className="h-8 w-8 text-slate-400" />;
  return <Sun className="h-8 w-8 text-amber-400" />;
}

export default function WeatherPage() {
  const { data, loading, error } = useWeather();
  const w = data || (error ? DEMO_WEATHER : null);

  return (
    <PublicShell title="Météo" subtitle={w?.city || 'Casablanca'}>
      {data && <DataSourceBanner sources={['Open-Meteo']} updatedAt={data.updatedAt} />}
      {error && (
        <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
          API indisponible — affichage de secours.
        </p>
      )}

      {loading && !w && (
        <p className="flex items-center gap-2 text-slate-500 py-12 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement météo…
        </p>
      )}

      {w && (
        <>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-100 to-blue-50 p-6 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800 mb-6">
            <p className="text-sm text-slate-500 mb-1">Maintenant</p>
            <div className="flex items-end gap-4">
              <p className="text-6xl font-bold text-slate-900 dark:text-white tabular-nums">
                {w.current.tempC}°
              </p>
              <div className="pb-2">
                <p className="font-semibold">{w.current.condition}</p>
                <p className="text-sm text-slate-500">Ressenti {w.current.feelsLikeC}°C</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6 text-center text-sm">
              <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-3">
                <Droplets className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                <p className="font-semibold">{w.current.humidity}%</p>
                <p className="text-xs text-slate-500">Humidité</p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-3">
                <Wind className="h-5 w-5 mx-auto text-teal-500 mb-1" />
                <p className="font-semibold">{w.current.windKmh} km/h</p>
                <p className="text-xs text-slate-500">Vent {w.current.windDir}</p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 p-3">
                <Sun className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                <p className="font-semibold">UV {w.current.uv}</p>
                <p className="text-xs text-slate-500">Index</p>
              </div>
            </div>
          </div>

          <h2 className="font-semibold mb-3">Prévisions (5 jours)</h2>
          <ul className="space-y-2 mb-6">
            {w.forecast.map((day) => (
              <li
                key={day.day}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="font-medium w-24 sm:w-28">{day.day}</span>
                <ForecastIcon type={day.icon} />
                <span className="text-sm text-slate-500 w-16 text-center">{day.precip}% pluie</span>
                <span className="font-semibold tabular-nums">
                  {day.high}° / {day.low}°
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/30">
            <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Conseil conduite</p>
            <p className="text-amber-800 dark:text-amber-300">{w.drivingTip}</p>
          </div>
        </>
      )}
    </PublicShell>
  );
}
