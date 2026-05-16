import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import { AUTH_PATH } from './config/auth';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import IncidentsPage from './pages/IncidentsPage';
import LogsPage from './pages/LogsPage';
import DriverPage from './pages/DriverPage';
import HomePage from './pages/HomePage';
import PublicMapPage from './pages/PublicMapPage';
import HelpPage from './pages/HelpPage';
import WeatherPage from './pages/WeatherPage';
import PoiPage from './pages/PoiPage';
import WebcamsPage from './pages/WebcamsPage';
import EventsPage from './pages/EventsPage';
import PredictionPage from './pages/PredictionPage';
import { ADMIN_BASE, LOGIN_PATH } from './config/admin';

function routePath(urlPath) {
  return urlPath.replace(/^\//, '');
}

const adminRoute = routePath(ADMIN_BASE);
const loginRoute = routePath(LOGIN_PATH);
const hideLegacyPaths = ADMIN_BASE !== '/admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/driver" element={<DriverPage />} />
      <Route path="/carte" element={<PublicMapPage />} />
      <Route path="/circulation" element={<PublicMapPage />} />
      <Route path="/aide" element={<HelpPage />} />
      <Route path="/meteo" element={<WeatherPage />} />
      <Route path="/interet" element={<PoiPage />} />
      <Route path="/webcams" element={<WebcamsPage />} />
      <Route path="/evenements" element={<EventsPage />} />

      <Route path="/connexion" element={<AuthPage />} />
      <Route path={loginRoute} element={<LoginPage />} />
      <Route path={adminRoute} element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="predictions" element={<PredictionPage />} />
      </Route>

      {hideLegacyPaths && (
        <>
          <Route path="admin/*" element={<Navigate to="/" replace />} />
          <Route path="login" element={<Navigate to="/" replace />} />
        </>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}