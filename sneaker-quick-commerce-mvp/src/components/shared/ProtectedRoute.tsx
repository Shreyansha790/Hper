import { Navigate } from 'react-router-dom';
import type { Role } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { roleRoutes } from '@/services/auth/authService';

export function ProtectedRoute({ role, children }: { role: Role; children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  // Don't redirect while Supabase auth is still initializing (prevents flash to /auth on load)
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#E8FF47]/30 border-t-[#E8FF47] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return <Navigate to="/auth" replace />;
  if (user.role !== role && role !== 'storekeeper') return <Navigate to={roleRoutes[user.role]} replace />;
  // Allow admin to access storekeeper routes too
  if (role === 'storekeeper' && user.role !== 'storekeeper' && user.role !== 'admin') {
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <>{children}</>;
}
