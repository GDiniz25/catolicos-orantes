/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
/**
 * Dispara o build + deploy do site estático (GitHub Actions -> Hostinger).
 * Só administradores (tabela public.admins) podem chamar.
 *
 * Secrets necessários (Supabase > Edge Functions > Secrets):
 *   GITHUB_REPO          ex.: "seu-usuario/catolicos-orantes"
 *   GITHUB_DEPLOY_TOKEN  token "fine-grained" com permissão Contents: Read and write no repositório
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: 'Não autorizado' }, 401);
    // Só administradores (tabela public.admins) podem publicar
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (isAdmin !== true) return json({ error: 'Sem permissão' }, 403);

    const repo = Deno.env.get('GITHUB_REPO');
    const token = Deno.env.get('GITHUB_DEPLOY_TOKEN');
    if (!repo || !token) return json({ error: 'GITHUB_REPO / GITHUB_DEPLOY_TOKEN não configurados' }, 500);

    const { reason } = await req.json().catch(() => ({ reason: 'painel' }));
    const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'catolicos-orantes',
      },
      body: JSON.stringify({ event_type: 'rebuild', client_payload: { reason: String(reason || 'painel'), by: user.email } }),
    });

    if (res.status !== 204) return json({ error: `GitHub respondeu ${res.status}: ${await res.text()}` }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Erro desconhecido' }, 500);
  }
});
