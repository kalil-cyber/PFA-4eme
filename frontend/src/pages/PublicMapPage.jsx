import PublicShell from '../components/layout/PublicShell';
import TrafficMapWorkspace from '../components/traffic/TrafficMapWorkspace';
import { useTrafficData } from '../hooks/useTrafficData';

export default function PublicMapPage() {
  const {
    roads,
    incidents,
    loading,
    lastUpdate,
    highlightId,
    avgCongestion,
    refresh,
  } = useTrafficData();

  return (
    <PublicShell
      wide
      title="Carte du trafic"
      subtitle="Dataset Casablanca — Waze"
    >
      <TrafficMapWorkspace
        roads={roads}
        incidents={incidents}
        loading={loading}
        lastUpdate={lastUpdate}
        highlightId={highlightId}
        avgCongestion={avgCongestion}
        onDatasetApplied={refresh}
        mapHeight="100%"
        intro={
          <>
            Carte réelle de Casablanca (plan ou satellite) — segments trafic dataset Waze, congestion{' '}
            <strong>47–70 %</strong>. Utilisez les boutons en haut à gauche de la carte pour changer le fond.
          </>
        }
      />
    </PublicShell>
  );
}
