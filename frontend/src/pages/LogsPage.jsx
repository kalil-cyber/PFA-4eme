import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const LEVEL_STYLES = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  warn: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  debug: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getLogs({ limit: 100, ...(level && { level }) });
        setLogs(data);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [level]);

  return (
    <div className="p-6 lg:p-8">
      <p className="text-slate-500 text-sm mb-4 -mt-2">
        Rafraîchissement auto 5 s • {logs.length} entrée(s)
      </p>
      <div className="mb-6 flex justify-end">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
        >
          <option value="">Tous les niveaux</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <p className="p-8 text-slate-500">Chargement...</p>
        ) : logs.length === 0 ? (
          <p className="p-8 text-slate-500 text-center">Aucun log disponible</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Heure</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Niveau</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                          LEVEL_STYLES[log.level] || LEVEL_STYLES.info
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{log.source}</td>
                    <td className="px-4 py-3">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
