import { Navigate } from 'react-router-dom';
import type { Role } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { roleRoutes } from '@/services/auth/authService';

export function ProtectedRoute({ role, children }: { role: Role; children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) return <Navigate to="/auth" replace />;
  if (user.role !== role) return <Navigate to={roleRoutes[user.role]} replace />;

  return <>{children}</>;
}
