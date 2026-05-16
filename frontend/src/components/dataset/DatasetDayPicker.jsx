import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { api } from '../../lib/api';

const DAY_LABELS = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export default function DatasetDayPicker({ onApplied }) {
  const [days, setDays] = useState([]);
  const [selected, setSelected] = useState('monday');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .getDatasetMeta()
      .then((meta) => setDays(meta.days?.filter((d) => d.available) || []))
      .catch(() => {});
  }, []);

  const apply = async (day) => {
    setSelected(day);
    setLoading(true);
    setMessage('');
    try {
      const result = await api.applyDatasetDay(day);
      setMessage(`${DAY_LABELS[day]} — ${result.segments} segments chargés`);
      onApplied?.(day);
    } catch (err) {
      setMessage(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-4 w-4 text-tariki-600" />
        <h3 className="text-sm font-semibold">Dataset Casablanca</h3>
      </div>
      <p className="text-xs text-slate-500 mb-3">Congestion par jour de la semaine</p>
      {message && <p className="text-xs text-tariki-500 mb-2 font-medium">{message}</p>}
      <div className="flex flex-wrap gap-2">
        {(days.length ? days : Object.keys(DAY_LABELS).map((day) => ({ day }))).map(({ day }) => (
          <button
            key={day}
            type="button"
            disabled={loading}
            onClick={() => apply(day)}
            className={`text-xs rounded-lg px-3 py-1.5 border transition-colors ${
              selected === day
                ? 'bg-tariki-600 text-white border-tariki-600'
                : 'border-slate-200 hover:border-tariki-400 dark:border-slate-700'
            }`}
          >
            {DAY_LABELS[day] || day}
          </button>
        ))}
      </div>
    </div>
  );
}
