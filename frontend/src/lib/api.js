import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  health: () => request('/api/health'),
  getPortalConfig: () => request('/api/auth/portal-config'),
  me: () => request('/api/auth/me'),
  login: (email, password, accessCode) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, accessCode }),
    }),
  register: ({ name, email, password, role, accessCode }) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, accessCode }),
    }),
  getRoads: () => request('/api/traffic/roads'),
  getStats: () => request('/api/traffic/stats'),
  getSimulation: () => request('/api/traffic/simulation'),
  setSimulation: (enabled) =>
    request('/api/traffic/simulation', { method: 'POST', body: JSON.stringify({ enabled }) }),
  getIncidents: (status) =>
    request(`/api/incidents${status ? `?status=${status}` : ''}`),
  createIncident: (data) =>
    request('/api/incidents', { method: 'POST', body: JSON.stringify(data) }),
  updateIncident: (id, data) =>
    request(`/api/incidents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteIncident: (id) => request(`/api/incidents/${id}`, { method: 'DELETE' }),
  optimizeRoute: (origin, destination) =>
    request('/api/routes/optimize', {
      method: 'POST',
      body: JSON.stringify({ origin, destination }),
    }),
  getAlerts: (threshold = 65) => request(`/api/alerts?threshold=${threshold}`),
  getPredictions: (horizon = 6) => request(`/api/predictions?horizon=${horizon}`),
  getPredictionInsights: (horizon = 6) =>
    request(`/api/predictions/insights?horizon=${horizon}`),
  getPredictionZone: (segmentId, horizon = 6) =>
    request(`/api/predictions/zones/${segmentId}?horizon=${horizon}`),
  getPredictionHistory: (segmentId) =>
    request(`/api/predictions/zones/${segmentId}/history`),
  getLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/logs${q ? `?${q}` : ''}`);
  },
  getDatasetMeta: () => request('/api/dataset/meta'),
  getDatasetRoads: (day) => request(`/api/dataset/roads?day=${day}`),
  applyDatasetDay: (day) =>
    request('/api/dataset/apply-day', { method: 'POST', body: JSON.stringify({ day }) }),
  getChatStatus: () => request('/api/chat/status'),
  sendChatMessage: (message, history = []) =>
    request('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
  getDiscoverWebcams: (region = 'casablanca') =>
    request(`/api/discover/webcams?region=${region}`),
  getDiscoverWeather: () => request('/api/discover/weather'),
  getDiscoverPois: () => request('/api/discover/pois'),
  getDiscoverEvents: () => request('/api/discover/events'),
};
