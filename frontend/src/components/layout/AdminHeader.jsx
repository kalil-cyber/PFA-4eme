import { useLocation } from 'react-router-dom';
import { Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { safeJsonParse } from '../../utils/storage';
import { ADMIN_BASE } from '../../config/admin';

const SEGMENT_TITLES = {
  '': 'Dashboard',
  map: 'Carte interactive',
  incidents: 'Incidents',
  logs: 'Logs système',
  predictions: 'Traffic Prediction',
};

function normalizePath(pathname) {
  if (!pathname) return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

function titleForPath(pathname) {
  const base = normalizePath(ADMIN_BASE);
  if (normalizePath(pathname) === base) return SEGMENT_TITLES[''];
  const prefix = `${base}/`;
  if (pathname.startsWith(prefix)) {
    return SEGMENT_TITLES[pathname.slice(prefix.length).split('/')[0]] || 'Tariki';
  }
  return 'Tariki';
}

export default function AdminHeader() {
  const { pathname } = useLocation();
  const { connected, lastUpdate } = useSocket();
  const user = safeJsonParse(localStorage.getItem('tariki_user'), {}) || {};
  const progress = 78;
  const title = titleForPath(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <p className="text-xs text-slate-500 truncate">
            {user.name || 'Admin'} • Mise à jour{' '}
            {lastUpdate?.timestamp
              ? new Date(lastUpdate.timestamp).toLocaleTimeString('fr-FR')
              : '—'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block w-36">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Avancement</span>
              <span className="font-semibold text-tariki-600">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-tariki-500 to-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              connected
                ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
            }`}
          >
            {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {connected ? 'Temps réel' : 'Hors ligne'}
          </span>
        </div>
      </div>
    </header>
  );
}
