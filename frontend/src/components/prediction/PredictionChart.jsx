import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../utils/traffic';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Tooltip,
  Filler
);

export function ZoneForecastChart({ zone, history = [] }) {
  const { dark } = useTheme();
  const textColor = dark ? '#94a3b8' : '#64748b';

  if (!zone) {
    return <p className="text-sm text-slate-500 py-8 text-center">Sélectionnez une zone</p>;
  }

  const histLabels = history.slice(-12).map((h) =>
    new Date(h.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );
  const histData = history.slice(-12).map((h) => h.congestion_level);

  const predLabels =
    zone.predictions?.map((p) =>
      new Date(p.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    ) || [];
  const predData = zone.predictions?.map((p) => p.congestion_level) || [];

  const labels = [...histLabels, ...predLabels];
  const historyPadded = [...histData, ...Array(predData.length).fill(null)];
  const predictionPadded = [...Array(histData.length).fill(null), ...predData];

  const data = {
    labels,
    datasets: [
      {
        label: 'Historique (simulé)',
        data: historyPadded,
        borderColor: '#3b82f6',
        tension: 0.35,
      },
      {
        label: 'Prédiction IA',
        data: predictionPadded,
        borderColor: STATUS_COLORS.congested,
        borderDash: [6, 4],
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor } },
      title: {
        display: true,
        text: `${zone.zone_name} — historique & prévision`,
        color: textColor,
      },
    },
    scales: {
      y: {
        min: 40,
        max: 75,
        ticks: { color: textColor },
        grid: { color: dark ? '#334155' : '#e2e8f0' },
      },
      x: { ticks: { color: textColor }, grid: { display: false } },
    },
  };

  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  );
}

export function PredictionSummaryChart({ zones = [] }) {
  const { dark } = useTheme();
  const textColor = dark ? '#94a3b8' : '#64748b';

  const labels = zones.map((z) => z.zone_name?.split(' ').slice(0, 2).join(' ') || z.segment_id);
  const current = zones.map((z) => z.current?.congestion_level ?? 0);
  const predicted = zones.map(
    (z) => z.predictions?.[z.predictions.length - 1]?.congestion_level ?? 0
  );

  const data = {
    labels,
    datasets: [
      { label: 'Actuel', data: current, backgroundColor: '#3b82f6', borderRadius: 4 },
      { label: 'Prévu (+30 min)', data: predicted, backgroundColor: '#f59e0b', borderRadius: 4 },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor } } },
    scales: {
      y: { min: 40, max: 75, ticks: { color: textColor }, grid: { color: dark ? '#334155' : '#e2e8f0' } },
      x: { ticks: { color: textColor, maxRotation: 45 }, grid: { display: false } },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
