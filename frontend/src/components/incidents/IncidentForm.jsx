import { useState } from 'react';

const TYPES = [
  { value: 'accident', label: 'Accident' },
  { value: 'jam', label: 'Embouteillage' },
  { value: 'road_closed', label: 'Route fermée' },
];

export default function IncidentForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    type: 'accident',
    title: '',
    description: '',
    latitude: 48.8566,
    longitude: 2.3522,
    severity: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Type</span>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Gravité</span>
          <select
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyen</option>
            <option value="high">Élevé</option>
            <option value="critical">Critique</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Titre</span>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          placeholder="Description courte de l'incident"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Description</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Latitude</span>
          <input
            type="number"
            step="0.0001"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Longitude</span>
          <input
            type="number"
            step="0.0001"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-tariki-600 py-2.5 text-sm font-semibold text-white hover:bg-tariki-700 disabled:opacity-50"
      >
        {loading ? 'Enregistrement...' : 'Signaler l\'incident'}
      </button>
    </form>
  );
}
