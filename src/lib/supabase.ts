import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/site';

// Cliente completo (com autenticação). Usado no painel /admin e no build.
// As páginas públicas NÃO carregam este pacote: usam src/lib/publicApi.ts.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
});
