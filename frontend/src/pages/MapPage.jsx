import TrafficMapWorkspace from '../components/traffic/TrafficMapWorkspace';
import { useTrafficData } from '../hooks/useTrafficData';

export default function MapPage() {
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
    <div className="p-6 lg:p-8 flex flex-col min-h-0">
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
            Visualisation temps réel — congestion simulée entre <strong>47 %</strong> et{' '}
            <strong>70 %</strong>
          </>
        }
      />
    </div>
  );
}
