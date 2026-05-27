export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL ?? '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
};

type QueryResponse<T = unknown> = Promise<{ data: T; error: null }>;

const resolved = <T>(data: T): QueryResponse<T> => Promise.resolve({ data, error: null });

const queryBuilder = {
  select: () => ({
    order: () => resolved([] as unknown[]),
  }),
  update: () => ({
    eq: () => resolved(null),
  }),
};

export const supabase = {
  from: () => queryBuilder,
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
