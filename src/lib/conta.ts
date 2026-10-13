/**
 * Conta do site (Caminho da Fé e ferramentas com progresso): login por link no e-mail (e Google, se ativado)
 * O progresso fica em src/lib/progresso.ts (ferramentas) e em estudo/conta.ts (Caminho da Fé).
 *
 * O pacote supabase-js só é baixado quando necessário (quem nunca entrou não paga esse peso).
 */
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/config/site';

let clientPromise: Promise<SupabaseClient> | null = null;

export function getClient(): Promise<SupabaseClient> {
  if (!clientPromise) clientPromise = import('@/lib/supabase').then((m) => m.supabase);
  return clientPromise;
}

const projectRef = SUPABASE_URL.replace(/^https?:\/\//, '').split('.')[0];

/** Há indício de sessão salva ou de retorno do link de login? (evita baixar o supabase-js à toa) */
export function talvezLogado(): boolean {
  try {
    if (/access_token=|refresh_token=|[?&]code=|error_description=/.test(window.location.hash + window.location.search)) return true;
    return Boolean(localStorage.getItem(`sb-${projectRef}-auth-token`));
  } catch {
    return false;
  }
}

export const googleAtivo = import.meta.env.PUBLIC_LOGIN_GOOGLE === 'true';

/** Volta para a página onde a pessoa pediu o login (precisa estar nas Redirect URLs do Supabase) */
const redirectTo = (destino = '/aprender') => `${window.location.origin}${destino}`;

export async function entrarComEmail(email: string, destino?: string): Promise<string | null> {
  const sb = await getClient();
  const { error } = await sb.auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: redirectTo(destino), shouldCreateUser: true },
  });
  if (!error) return null;
  if (/rate|limit|seconds/i.test(error.message)) return 'Muitas tentativas. Espere um minuto e tente de novo.';
  return 'Não foi possível enviar o link. Confira o e-mail e tente de novo.';
}

export async function entrarComGoogle(destino?: string) {
  const sb = await getClient();
  await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo(destino) } });
}

export async function sair() {
  const sb = await getClient();
  await sb.auth.signOut();
}

export async function sessaoAtual(): Promise<Session | null> {
  const sb = await getClient();
  const { data } = await sb.auth.getSession();
  // Limpa os tokens da barra de endereço depois do login
  if (data.session && /access_token=|[?&]code=/.test(window.location.hash + window.location.search)) {
    history.replaceState(null, '', window.location.pathname);
  }
  return data.session;
}

export async function aoMudarSessao(cb: (s: Session | null) => void) {
  const sb = await getClient();
  const { data } = sb.auth.onAuthStateChange((_e, s) => cb(s));
  return () => data.subscription.unsubscribe();
}

