import { Info } from 'lucide-react';

export default function DataSourceBanner({ sources, updatedAt }) {
  if (!sources?.length) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 flex gap-2 mb-6">
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <p>
        <strong>Source</strong> — {sources.join(' • ')}
        {updatedAt && (
          <span className="block text-xs mt-1 opacity-80">
            Mis à jour : {new Date(updatedAt).toLocaleString('fr-FR')}
          </span>
        )}
      </p>
    </div>
  );
}
