import { Info } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200 flex gap-2 mb-6">
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <p>
        <strong>Démo Tariki</strong> — ces infos sont des exemples pour Casablanca. Quand tu auras
        de vraies données (API météo, webcams, etc.), on les branchera ici.
      </p>
    </div>
  );
}
