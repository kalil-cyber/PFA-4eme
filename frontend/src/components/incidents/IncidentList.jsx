import { INCIDENT_TYPES, SEVERITY_LABELS } from '../../utils/traffic';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

export default function IncidentList({ incidents = [], onResolve, onDelete, compact }) {
  if (incidents.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-8 text-center">Aucun incident signalé</p>
    );
  }

  return (
    <ul className={compact ? 'space-y-2' : 'space-y-3'}>
      {incidents.map((inc) => {
        const typeInfo = INCIDENT_TYPES[inc.type] || { label: inc.type, color: '#6b7280' };
        return (
          <li
            key={inc.id}
            className={`rounded-xl border p-4 transition-colors ${
              inc.status === 'active'
                ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                : 'border-slate-100 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${typeInfo.color}22` }}
              >
                <AlertTriangle className="h-4 w-4" style={{ color: typeInfo.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{inc.title}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${typeInfo.color}22`, color: typeInfo.color }}
                  >
                    {typeInfo.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {SEVERITY_LABELS[inc.severity] || inc.severity}
                  </span>
                </div>
                {inc.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{inc.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(inc.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              {inc.status === 'active' && (onResolve || onDelete) && (
                <div className="flex gap-1 shrink-0">
                  {onResolve && (
                    <button
                      type="button"
                      onClick={() => onResolve(inc.id)}
                      className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                      title="Résoudre"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(inc.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
