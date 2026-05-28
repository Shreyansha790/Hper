import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { mockUsers } from '@/lib/mock';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => () => void;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, role?: Role) => Promise<boolean>; // kept for demo fallback
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

// Map a Supabase auth user + optional public.users row to our app User type
const mapSupabaseUser = (
  authUser: any,
  publicUser?: any
): User => ({
  id: authUser.id,
  name:
    publicUser?.full_name ||
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    authUser.email?.split('@')[0] ||
    'User',
  email: authUser.email ?? '',
  phone: authUser.phone ?? publicUser?.phone ?? '',
  role: (publicUser?.role as Role) ?? 'customer',
  assignedStoreId: publicUser?.assigned_store_id ?? undefined,
  avatar: authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? '',
  createdAt: authUser.created_at ?? new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Call this once in App.tsx on mount.
      // Returns an unsubscribe function to clean up the listener.
      initialize: () => {
        if (!isSupabaseConfigured) {
          // No Supabase — nothing to initialize, demo mode only
          return () => {};
        }

        const {
          data: { subscription },
        } = (supabase as any).auth.onAuthStateChange(async (_event: any, session: any) => {
          if (!session) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }

          // Fetch the user's public profile (role, store assignment, etc.)
          const { data: publicUser } = await (supabase as any)
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const appUser = mapSupabaseUser(session.user, publicUser);
          set({ user: appUser, isAuthenticated: true, isLoading: false });
        });

        return () => subscription?.unsubscribe?.();
      },

      // Real Google OAuth sign-in via Supabase
      loginWithGoogle: async () => {
        if (!isSupabaseConfigured) {
          console.warn('[auth] Supabase not configured — cannot use Google sign-in');
          return;
        }
        set({ isLoading: true });
        const { error } = await (supabase as any).auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          console.error('[auth] Google sign-in error:', error.message);
          set({ isLoading: false });
        }
        // On success the browser redirects — no further action needed here
      },

      // Demo fallback login (for development / storekeeper / admin demo)
      login: async (email, role) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 600));

        const found = mockUsers.find(
          (u) => u.email === email || (role && u.role === role)
        );

        if (found) {
          set({ user: found, isAuthenticated: true, isLoading: false });
          return true;
        }

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

      // Sign out from both Supabase and local state
      logout: async () => {
        if (isSupabaseConfigured) {
          await (supabase as any).auth.signOut();
        }
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    { name: 'kicksfly-auth' }
  )
);
