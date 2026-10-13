/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Dispara o workflow "deploy" no GitHub (repository_dispatch). */
async function triggerSiteDeploy(reason: string): Promise<string> {
  const repo = Deno.env.get('GITHUB_REPO'); // ex.: "usuario/catolicos-orantes"
  const token = Deno.env.get('GITHUB_DEPLOY_TOKEN');
  if (!repo || !token) return 'não configurado';
  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'catolicos-orantes',
    },
    body: JSON.stringify({ event_type: 'rebuild', client_payload: { reason } }),
  });
  return res.status === 204 ? 'iniciado' : `erro ${res.status}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find unpublished articles whose scheduled date has arrived
    const now = new Date().toISOString();

    const { data: articles, error: fetchError } = await supabaseAdmin
      .from('articles')
      .select('id, title, scheduled_publish_at')
      .eq('published', false)
      .not('scheduled_publish_at', 'is', null)
      .lte('scheduled_publish_at', now)
      .order('scheduled_publish_at', { ascending: true })
      .limit(5); // publish up to 5 per run (safety)

    if (fetchError) {
      console.error('Error fetching scheduled articles:', fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!articles || articles.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhum artigo agendado para publicar', published: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const publishedIds: string[] = [];

    for (const article of articles) {
      const { error: updateError } = await supabaseAdmin
        .from('articles')
        .update({ published: true, scheduled_publish_at: null })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error publishing article ${article.id}:`, updateError);
      } else {
        publishedIds.push(article.id);
        console.log(`Published: "${article.title}"`);
      }
    }

    // Site estático: dispara novo build/deploy para os artigos aparecerem
    let deploy = 'não configurado';
    if (publishedIds.length > 0) {
      deploy = await triggerSiteDeploy(`publish-scheduled: ${publishedIds.length} artigo(s)`);
    }

    return new Response(JSON.stringify({
      message: `${publishedIds.length} artigo(s) publicado(s)`,
      deploy,
      published: publishedIds.length,
      ids: publishedIds,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('publish-scheduled error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
