import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import TarikiLogo from '../brand/TarikiLogo';
export default function PublicShell({
  title,
  subtitle,
  children,
  showFooterLink = false,
  wide = false,
}) {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-300 bg-white shadow-sm px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div
          className={`${wide ? 'max-w-7xl' : 'max-w-4xl'} mx-auto flex items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/" className="flex items-center gap-2 shrink-0" title="Accueil Tariki">
              <TarikiLogo variant="full" size="md" />
            </Link>
            {(title || subtitle) && (
              <div className="min-w-0 border-l border-slate-200 pl-3 dark:border-slate-700">
                {title && <h1 className="font-bold text-base truncate">{title}</h1>}
                {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggle}
              aria-label="Changer le thème"
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      <main
        className={`${wide ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-4 py-6 lg:px-8`}
      >
        {children}
        {showFooterLink && (
          <p className="text-center pt-8">
            <Link to="/" className="text-sm font-medium text-tariki-600 hover:underline">
              Accueil Tariki
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
