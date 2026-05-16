import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { clearSession, getToken, isAdminSession } from '../../lib/auth';
import { AUTH_PATH } from '../../config/auth';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const token = getToken();
      if (!isAdminSession(token)) {
        clearSession();
        if (!cancelled) setStatus('denied');
        return;
      }

      try {
        const { user } = await api.me();
        if (user?.role !== 'admin') {
          clearSession();
          if (!cancelled) setStatus('denied');
          return;
        }
        if (!cancelled) setStatus('ok');
      } catch {
        clearSession();
        if (!cancelled) setStatus('denied');
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-tariki-600" />
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to={AUTH_PATH} replace />;
  }

  return children;
}
