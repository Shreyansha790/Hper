import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { mockUsers } from '@/lib/mock';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, role) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const found = mockUsers.find(
          (u) => u.email === email || (role && u.role === role)
        );

        if (found) {
          set({ user: found, isAuthenticated: true, isLoading: false });
          return true;
        }

        // Default to customer if not found
        const defaultUser: User = {
          id: `user-${Date.now()}`,
          name: 'Demo User',
          email,
          phone: '+91 99999 99999',
          role: 'customer',
          createdAt: new Date().toISOString(),
        };
        set({ user: defaultUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    { name: 'kicksfly-auth' }
  )
);
