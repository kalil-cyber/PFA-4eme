import { Link } from 'react-router-dom';
import { Home, LayoutDashboard } from 'lucide-react';
import { adminPath } from '../../config/admin';
import { isAdminSession } from '../../lib/auth';

const btnBase =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors';

/** Accès dashboard — visible uniquement sur /connexion sauf showAlways */
export function DashboardNavLink({ className = '', variant = 'solid', showAlways = false }) {
  if (!showAlways && !isAdminSession()) return null;

  const styles =
    variant === 'light'
      ? `${btnBase} border border-white/45 bg-white/15 text-white shadow-md hover:bg-white/25 ${className}`
      : `${btnBase} border border-tariki-500/40 bg-tariki-600 text-white shadow-sm hover:bg-tariki-700 ${className}`;

  return (
    <Link to={adminPath()} className={styles}>
      <LayoutDashboard className="h-4 w-4 shrink-0" />
      Dashboard
    </Link>
  );
}

/** Accès accueil public depuis l’admin */
export function HomeNavLink({ className = '', variant = 'outline' }) {
  const styles =
    variant === 'solid'
      ? `${btnBase} border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 ${className}`
      : `${btnBase} border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`;

  return (
    <Link to="/" className={styles}>
      <Home className="h-4 w-4 shrink-0" />
      Accueil
    </Link>
  );
}
