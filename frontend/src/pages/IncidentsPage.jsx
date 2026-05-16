import { useState } from 'react';
import { api } from '../lib/api';
import IncidentList from '../components/incidents/IncidentList';
import IncidentForm from '../components/incidents/IncidentForm';
import { useTrafficData } from '../hooks/useTrafficData';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function IncidentsPage() {
  const { incidents, setIncidents } = useTrafficData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('active');
  const [formKey, setFormKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = incidents.filter((i) => (filter === 'all' ? true : i.status === filter));

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      const created = await api.createIncident(data);
      setIncidents((prev) => [created, ...prev]);
      setFormKey((k) => k + 1);
      toast(`Incident « ${created.title} » créé`, 'success', 'Signalement');
    } catch (err) {
      toast(err.message, 'error', 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      const updated = await api.updateIncident(id, { status: 'resolved' });
      setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast('Incident marqué comme résolu', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteIncident(deleteTarget);
      setIncidents((prev) => prev.filter((i) => i.id !== deleteTarget));
      toast('Incident supprimé', 'info');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const targetIncident = incidents.find((i) => i.id === deleteTarget);

  return (
    <div className="p-6 lg:p-8">
      <p className="text-slate-500 text-sm mb-6 -mt-2">
        Notifications temps réel activées sur création / résolution
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700"
        >
          <option value="active">Actifs</option>
          <option value="resolved">Résolus</option>
          <option value="all">Tous</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold mb-4">Liste ({filtered.length})</h2>
          <IncidentList
            incidents={filtered}
            onResolve={handleResolve}
            onDelete={(id) => setDeleteTarget(id)}
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold mb-4">Nouvel incident</h2>
          <IncidentForm
            key={formKey}
            onSubmit={handleCreate}
            onCancel={() => setFormKey((k) => k + 1)}
            loading={loading}
          />
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer l'incident ?"
        message={
          targetIncident
            ? `Voulez-vous supprimer « ${targetIncident.title} » ? Cette action est irréversible.`
            : 'Confirmer la suppression ?'
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
