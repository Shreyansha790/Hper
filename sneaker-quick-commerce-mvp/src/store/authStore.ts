import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { mockUsers } from '@/lib/mock';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { safeLocalStorage, isBrowser } from '@/lib/utils/browser';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // true once the first onAuthStateChange fires
  authError: string | null;
  initialize: () => () => void;
  loginWithGoogle: (role?: Role) => Promise<boolean>;
  loginWithPassword: (email: string, password: string) => Promise<boolean>;
  signUpWithPassword: (email: string, password: string, fullName: string, role?: Role) => Promise<boolean>;
  login: (email: string, role?: Role) => Promise<boolean>; // demo fallback
  logout: () => Promise<void>;
  clearAuthError: () => void;
  setUser: (user: User) => void;
}

const mapSupabaseUser = (authUser: any, publicUser?: any): User => ({
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

const upsertPublicUser = async (authUser: any, role: Role = 'customer') => {
  const baseUser = {
    id: authUser.id,
    email: authUser.email,
    full_name:
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'User',
    role,
  };

  const { data, error } = await (supabase as any)
    .from('users')
    .upsert(baseUser)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Stable singleton — initialize is called once and never changes reference
let _unsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: !isSupabaseConfigured, // if no Supabase, we're immediately "initialized"
      authError: null,

      initialize: () => {
        // Prevent double-subscribing (e.g. StrictMode double-mount)
        if (_unsubscribe) return _unsubscribe;
        if (!isSupabaseConfigured) {
          set({ isInitialized: true });
          _unsubscribe = () => {};
          return _unsubscribe;
        }

        const {
          data: { subscription },
        } = (supabase as any).auth.onAuthStateChange(async (_event: any, session: any) => {
          if (!session) {
            // Clear all auth state on sign-out — this is the ground truth
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
              authError: null,
            });
            return;
          }

          const pendingRole = (safeLocalStorage.getItem('kicksfly_oauth_role') as Role | null) ?? 'customer';

          try {
            const { data: publicUser } = await (supabase as any)
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const resolvedPublicUser = publicUser ?? (await upsertPublicUser(session.user, pendingRole));
            set({
              user: mapSupabaseUser(session.user, resolvedPublicUser),
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
              authError: null,
            });
          } catch {
            set({
              user: mapSupabaseUser(session.user, { role: pendingRole }),
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
              authError: null,
            });
          } finally {
            safeLocalStorage.removeItem('kicksfly_oauth_role');
          }
        });

        _unsubscribe = () => {
          subscription?.unsubscribe?.();
          _unsubscribe = null;
        };
        return _unsubscribe;
      },

      loginWithGoogle: async (role = 'customer') => {
        if (!isSupabaseConfigured) return false;

        set({ isLoading: true, authError: null });
        // Use safeLocalStorage (works in Safari private mode)
        safeLocalStorage.setItem('kicksfly_oauth_role', role);

        const redirectTo = isBrowser ? window.location.origin : undefined;
        const { error } = await (supabase as any).auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });

        if (error) {
          set({ isLoading: false, authError: error.message });
          safeLocalStorage.removeItem('kicksfly_oauth_role');
          return false;
        }

        return true; // Browser will redirect — isLoading stays true during redirect
      },

      loginWithPassword: async (email, password) => {
        if (!isSupabaseConfigured) return false;
        set({ isLoading: true, authError: null });

        const { data, error } = await (supabase as any).auth.signInWithPassword({ email, password });
        if (error) {
          set({ isLoading: false, authError: error.message });
          return false;
        }

        try {
          await upsertPublicUser(data.user, 'customer');
        } catch {
          // Non-blocking
        }

        set({ isLoading: false, authError: null });
        return true;
      },

      signUpWithPassword: async (email, password, fullName, role = 'customer') => {
        if (!isSupabaseConfigured) return false;
        set({ isLoading: true, authError: null });

        const { data, error } = await (supabase as any).auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

        if (error) {
          set({ isLoading: false, authError: error.message });
          return false;
        }

        if (data.user) {
          try {
            await upsertPublicUser(data.user, role);
          } catch {
            // Non-blocking
          }
        }

        set({ isLoading: false, authError: null });
        return true;
      },

      login: async (email, role) => {
        set({ isLoading: true, authError: null });
        await new Promise((resolve) => setTimeout(resolve, 600));

        const found = mockUsers.find((u) => u.email === email || (role && u.role === role));
        if (found) {
          set({ user: found, isAuthenticated: true, isLoading: false, isInitialized: true });
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
        set({ user: defaultUser, isAuthenticated: true, isLoading: false, isInitialized: true });
        return true;
      },

      logout: async () => {
        // Clear local state FIRST so UI updates immediately in all browsers
        set({ user: null, isAuthenticated: false, isLoading: false, authError: null });
        safeLocalStorage.removeItem('kicksfly_oauth_role');

        if (isSupabaseConfigured) {
          try {
            // Use local scope (not global) for broader compatibility
            await (supabase as any).auth.signOut({ scope: 'local' });
          } catch {
            // Sign-out API failure is non-fatal — local state is already cleared
          }
        }

        // Also clear the persisted zustand store so stale user doesn't re-appear on reload
        if (isBrowser) {
          try {
            localStorage.removeItem('kicksfly-auth');
          } catch {
            // Safari private mode — already handled by safeLocalStorage
          }
        }
      },

      clearAuthError: () => set({ authError: null }),
      setUser: (user) => set({ user, isAuthenticated: true, authError: null }),
    }),
    {
      name: 'kicksfly-auth',
      // Only persist non-sensitive fields — session truth comes from Supabase
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
