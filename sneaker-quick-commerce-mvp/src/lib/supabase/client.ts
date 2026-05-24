export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL ?? '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
};

// TODO: Replace with createClient(supabaseConfig.url, supabaseConfig.anonKey)
// once @supabase/supabase-js is added in the backend integration phase.
export const supabase = {
  isConfigured: Boolean(supabaseConfig.url && supabaseConfig.anonKey),
};
