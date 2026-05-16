import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Route,
  FileText,
  Brain,
  MessageCircle,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../context/ChatContext';
import TarikiLogo from '../brand/TarikiLogo';
import { adminPath } from '../../config/admin';

const links = [
  { to: adminPath(), icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: adminPath('map'), icon: Map, label: 'Carte' },
  { to: adminPath('incidents'), icon: AlertTriangle, label: 'Incidents' },
  { to: adminPath('logs'), icon: FileText, label: 'Logs système' },
  { to: adminPath('predictions'), icon: Brain, label: 'Prédiction IA' },
  { to: '/driver', icon: Route, label: 'Conducteur' },
];

export default function Sidebar({ onLogout }) {
  const { dark, toggle } = useTheme();
  const { openChat } = useChat();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-6 dark:border-slate-800">
        <TarikiLogo variant="full" size="md" />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-tariki-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4 space-y-2 dark:border-slate-800">
        <button
          type="button"
          onClick={openChat}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-tariki-600 bg-tariki-50 hover:bg-tariki-100 dark:bg-tariki-950/40 dark:hover:bg-tariki-950/60"
        >
          <MessageCircle className="h-5 w-5" />
          Assistant IA (chat)
        </button>
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {dark ? 'Mode clair' : 'Mode sombre'}
        </button>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        )}
      </div>
    </aside>
  );
}
