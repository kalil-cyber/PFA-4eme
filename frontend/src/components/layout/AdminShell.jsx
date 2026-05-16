import AdminHeader from './AdminHeader';
import { useTrafficNotifications } from '../../hooks/useTrafficNotifications';

export default function AdminShell({ children }) {
  useTrafficNotifications(true);

  return (
    <>
      <AdminHeader />
      {children}
    </>
  );
}
