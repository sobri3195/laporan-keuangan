import { Navigate, Outlet } from 'react-router-dom';
import { Role } from '../types/domain';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
