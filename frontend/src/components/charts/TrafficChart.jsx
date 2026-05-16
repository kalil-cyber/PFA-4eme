import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function SpeedChart({ history = [] }) {
  const { dark } = useTheme();
  const textColor = dark ? '#94a3b8' : '#64748b';

  const labels = history.map((h) =>
    new Date(h.recorded_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Vitesse moyenne (km/h)',
        data: history.map((h) => parseFloat(h.avg_speed_kmh)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: dark ? '#334155' : '#e2e8f0' } },
      y: { ticks: { color: textColor }, grid: { color: dark ? '#334155' : '#e2e8f0' } },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}

export function CongestionBarChart({ stats }) {
  const { dark } = useTheme();
  const textColor = dark ? '#94a3b8' : '#64748b';

  const data = {
    labels: ['Fluide', 'Modéré', 'Congestionné'],
    datasets: [
      {
        label: 'Segments',
        data: [stats?.fluid || 0, stats?.moderate || 0, stats?.congested || 0],
        backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: textColor }, grid: { display: false } },
      y: { ticks: { color: textColor }, grid: { color: dark ? '#334155' : '#e2e8f0' } },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
