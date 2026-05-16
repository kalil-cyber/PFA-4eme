import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Clock, MapPin, Moon, Sun, AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import TrafficMap from '../components/map/TrafficMap';
import CongestionBar from '../components/traffic/CongestionBar';
import { api } from '../lib/api';
import { useTrafficData } from '../hooks/useTrafficData';
import { useTheme } from '../context/ThemeContext';
import { STATUS_COLORS } from '../utils/traffic';
import { useChat } from '../context/ChatContext';
import TarikiLogo from '../components/brand/TarikiLogo';
import { useToast } from '../context/ToastContext';
import { DRIVER_PRESETS } from '../constants/city';

const PRESETS = [
  {
    id: 'gare-marina',
    label: 'Gare → Marina',
    origin: { ...DRIVER_PRESETS[0], label: DRIVER_PRESETS[0].label },
    destination: { ...DRIVER_PRESETS[1], label: DRIVER_PRESETS[1].label },
  },
  {
    id: 'anfa-maarif',
    label: 'Anfa → Maarif',
    origin: { ...DRIVER_PRESETS[2], label: DRIVER_PRESETS[2].label },
    destination: { ...DRIVER_PRESETS[3], label: DRIVER_PRESETS[3].label },
  },
  {
    id: 'maarif-gare',
    label: 'Maarif → Gare',
    origin: { ...DRIVER_PRESETS[3], label: DRIVER_PRESETS[3].label },
    destination: { ...DRIVER_PRESETS[0], label: DRIVER_PRESETS[0].label },
  },
];

export default function DriverPage() {
  const { roads, incidents, lastUpdate } = useTrafficData();
  const { dark, toggle } = useTheme();
  const { openChat } = useChat();
  const { toast } = useToast();
  const [origin, setOrigin] = useState(PRESETS[0].origin);
  const [destination, setDestination] = useState(PRESETS[0].destination);
  const [activePresetId, setActivePresetId] = useState(PRESETS[0].id);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const samePoint =
    origin.lat === destination.lat && origin.lng === destination.lng;
  const canCalculate = !loading && !samePoint;

  const applyPreset = (preset) => {
    setActivePresetId(preset.id);
    setOrigin(preset.origin);
    setDestination(preset.destination);
    setRoute(null);
  };

  const resetSearch = () => {
    applyPreset(PRESETS[0]);
  };

  const searchRoute = async () => {
    if (samePoint) {
      toast('Choisissez un départ et une arrivée différents.', 'warning');
      return;
    }
    setLoading(true);
    setRoute(null);
    try {
      const result = await api.optimizeRoute(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng }
      );
      setRoute(result);
      toast(
        `Itinéraire trouvé — ${result.duration_minutes} min, ${result.distance_km} km`,
        'success',
        'Calcul terminé'
      );
    } catch (err) {
      toast(err.message, 'error', 'Calcul impossible');
    } finally {
      setLoading(false);
    }
  };

  const routeCongestion =
    route?.segments?.length > 0
      ? Math.round(
          route.segments.reduce((s, seg) => s + (seg.congestion_level || 50), 0) /
            route.segments.length
        )
      : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" title="Accueil Tariki">
              <TarikiLogo size="md" />
            </Link>
            <div>
              <h1 className="font-bold">Trouver mon chemin</h1>
              <p className="text-xs text-slate-500">Où tu pars → où tu vas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={toggle} className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 p-2.5">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button type="button" onClick={openChat} className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm">
              Assistant
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchRoute();
            }}
            className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-[15px]">
              <Navigation className="h-5 w-5 text-tariki-600" />
              Recherche d'itinéraire
            </h2>

            <p className="text-xs text-slate-500 mb-2">Trajets rapides</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`text-xs rounded-lg border px-2.5 py-1.5 transition-colors ${
                    activePresetId === p.id
                      ? 'bg-tariki-600 text-white border-tariki-600'
                      : 'border-slate-200 hover:bg-tariki-50 hover:border-tariki-300 dark:border-slate-700 dark:hover:bg-tariki-950/30'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <label className="block mb-3">
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-green-600" /> Départ
              </span>
              <input
                value={origin.label}
                onChange={(e) => {
                  setActivePresetId(null);
                  setOrigin({ ...origin, label: e.target.value });
                  setRoute(null);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-tariki-500 focus:border-tariki-500 mt-1"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-red-500" /> Arrivée
              </span>
              <input
                value={destination.label}
                onChange={(e) => {
                  setActivePresetId(null);
                  setDestination({ ...destination, label: e.target.value });
                  setRoute(null);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-tariki-500 focus:border-tariki-500 mt-1"
              />
            </label>

            {samePoint && (
              <p className="text-xs text-slate-500 mb-3">
                Le départ et l'arrivée doivent être différents.
              </p>
            )}

            <button
              type="submit"
              disabled={!canCalculate}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-tariki-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-tariki-600/25 hover:bg-tariki-700 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Calcul en cours…
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5" />
                  Calculer l'itinéraire
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetSearch}
              disabled={loading}
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 mt-3 w-full py-2 disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </button>
          </form>

          {route && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-green-800 dark:text-green-300">Itinéraire trouvé</h3>
                <button
                  type="button"
                  onClick={() => setRoute(null)}
                  className="text-xs font-medium text-green-700 hover:underline dark:text-green-400 shrink-0"
                >
                  Fermer
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <strong>{route.duration_minutes} min</strong> estimées
                </p>
                <p>Distance : {route.distance_km} km</p>
                {routeCongestion != null && (
                  <p className="flex items-center gap-2">
                    <span
                      className="font-bold tabular-nums"
                      style={{
                        color:
                          routeCongestion >= 65
                            ? STATUS_COLORS.congested
                            : STATUS_COLORS.moderate,
                      }}
                    >
                      Congestion moyenne sur trajet : {routeCongestion}%
                    </span>
                  </p>
                )}
                <p className="text-slate-500">{route.traffic_summary}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {route.segments?.map((s) => (
                  <li key={s.id}>
                    <CongestionBar
                      road={{
                        id: s.id,
                        name: s.name,
                        status: s.status,
                        speed_kmh: s.speed_kmh,
                        congestion_level: s.congestion_level,
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lastUpdate?.segment && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/30 flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p>
                Trafic live : {lastUpdate.segment.segmentName}{' '}
                {lastUpdate.segment.previousLevel}% → {lastUpdate.segment.congestion_level}%
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden min-h-[500px] p-0">
          <TrafficMap roads={roads} incidents={incidents} height="500px" />
        </div>
      </main>
    </div>
  );
}
