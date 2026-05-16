import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const RETURN_TO_TARIKI_LABEL = 'Accueil Tariki';

/** Lien simple vers l’accueil (sans bouton « Retour ») */
export function AccueilNavLink({ className = '' }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-tariki-600 hover:underline ${className}`}
    >
      <Home className="h-4 w-4" />
      Accueil
    </Link>
  );
}
