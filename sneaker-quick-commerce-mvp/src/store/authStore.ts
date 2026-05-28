import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { mockUsers } from '@/lib/mock';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,

      initialize: () => {
        if (!isSupabaseConfigured) return () => {};

        const {
          data: { subscription },
        } = (supabase as any).auth.onAuthStateChange(async (_event: any, session: any) => {
          if (!session) {
            set({ user: null, isAuthenticated: false, isLoading: false, authError: null });
            return;
          }

          const pendingRole = (localStorage.getItem('kicksfly_oauth_role') as Role | null) ?? 'customer';

          try {
            const { data: publicUser } = await (supabase as any)
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const resolvedPublicUser = publicUser ?? (await upsertPublicUser(session.user, pendingRole));
            set({ user: mapSupabaseUser(session.user, resolvedPublicUser), isAuthenticated: true, isLoading: false, authError: null });
          } catch (_error) {
            set({
              user: mapSupabaseUser(session.user, { role: pendingRole }),
              isAuthenticated: true,
              isLoading: false,
              authError: null,
            });
          } finally {
            localStorage.removeItem('kicksfly_oauth_role');
          }
        });

        return () => subscription?.unsubscribe?.();
      },

      loginWithGoogle: async (role = 'customer') => {
        if (!isSupabaseConfigured) return false;

        set({ isLoading: true, authError: null });
        localStorage.setItem('kicksfly_oauth_role', role);

        const { error } = await (supabase as any).auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });

        if (error) {
          set({ isLoading: false, authError: error.message });
          return false;
        }

        return true;
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
        } catch (_error) {
          // Non-blocking: session auth succeeded even if profile sync fails.
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
          } catch (_error) {
            // Non-blocking: account exists even if profile row write is blocked.
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

      logout: async () => {
        if (isSupabaseConfigured) {
          const { error } = await (supabase as any).auth.signOut({ scope: 'global' });

          if (error) {
            await (supabase as any).auth.signOut();
          }
        }

        localStorage.removeItem('kicksfly_oauth_role');
        set({ user: null, isAuthenticated: false, isLoading: false, authError: null });
      },

      clearAuthError: () => set({ authError: null }),
      setUser: (user) => set({ user, isAuthenticated: true, authError: null }),
    }),
    { name: 'kicksfly-auth' }
  )
);
