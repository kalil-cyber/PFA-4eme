import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import AdminShell from '../components/layout/AdminShell';
import AdminGuard from '../components/auth/AdminGuard';
import { clearSession } from '../lib/auth';
import { AUTH_PATH } from '../config/auth';

export default function AdminLayout() {
  const handleLogout = () => {
    clearSession();
    window.location.href = AUTH_PATH;
  };

  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
          <AdminShell>
            <Outlet />
          </AdminShell>
        </main>
      </div>
    </AdminGuard>
  );
}
