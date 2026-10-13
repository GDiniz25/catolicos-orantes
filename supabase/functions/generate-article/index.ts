/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UNSPLASH_API = 'https://api.unsplash.com';

interface UnsplashImage {
  url: string;
  alt: string;
  credit: string;
  creditUrl: string;
}

async function searchUnsplashImages(query: string, accessKey: string, count = 3): Promise<UnsplashImage[]> {
  try {
    const response = await fetch(
      `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.results ?? []).map((photo: any) => ({
      url: `${photo.urls.regular}&w=800&q=80`,
      alt: photo.alt_description || photo.description || query,
      credit: photo.user.name,
      creditUrl: photo.user.links.html,
    }));
  } catch {
    return [];
  }
}

function getImageId(url: string): string {
  const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
  return match ? match[1] : url;
}

async function getImagesForArticle(topic: string, category: string, accessKey: string): Promise<UnsplashImage[]> {
  const queries = [
    `${topic} católico`,
    `${category} igreja católica`,
    'oração católica igreja',
  ];

  const allImages: UnsplashImage[] = [];
  const usedIds = new Set<string>();

  for (const query of queries) {
    if (allImages.length >= 3) break;
    const images = await searchUnsplashImages(query, accessKey, 5);
    for (const img of images) {
      const imgId = getImageId(img.url);
      if (usedIds.has(imgId)) continue;
      usedIds.add(imgId);
      allImages.push(img);
      if (allImages.length >= 3) break;
    }
  }

  if (allImages.length < 3) {
    const fallback = await searchUnsplashImages('rosário terço católico oração', accessKey, 6);
    for (const img of fallback) {
      const imgId = getImageId(img.url);
      if (!usedIds.has(imgId)) {
        usedIds.add(imgId);
        allImages.push(img);
      }
      if (allImages.length >= 3) break;
    }
  }

  return allImages.slice(0, 3);
}

function buildImageInstructions(images: UnsplashImage[]): string {
  return images
    .map((img, i) =>
      `Imagem ${i + 1}:\n  URL: ${img.url}\n  Crédito: Foto de ${img.credit} no Unsplash\n  IMPORTANTE: NÃO use "${img.alt}" como alt text. Crie um alt text ORIGINAL em português do Brasil, descritivo e contextual ao artigo.`
    )
    .join('\n\n');
}

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Background processing function
async function processArticleJob(
  jobId: string,
  userId: string,
  params: {
    category: string;
    topic: string;
    allTopics?: any[];
    existingArticles?: any[];
    internalLinksContext?: string;
  }
) {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
  // Use service role to update job (bypasses RLS)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    // Update to processing
    await supabaseAdmin
      .from('article_generation_jobs')
      .update({ status: 'processing', progress: 10, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;
    const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY')!;

    const { category, topic, allTopics, existingArticles, internalLinksContext: providedLinksCtx } = params;

    // 1. Fetch images
    await supabaseAdmin
      .from('article_generation_jobs')
      .update({ progress: 20, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    const images = await getImagesForArticle(topic, category, UNSPLASH_ACCESS_KEY);
    const imageInstructions = buildImageInstructions(images);

    // 2. Build internal links context
    let internalLinksContext = providedLinksCtx || '';

    if (!internalLinksContext && existingArticles?.length > 0) {
      const grouped: Record<string, { title: string; slug: string; category: string }[]> = {};
      for (const art of existingArticles) {
        if (!grouped[art.category]) grouped[art.category] = [];
        grouped[art.category].push(art);
      }
      internalLinksContext = Object.entries(grouped)
        .map(([cat, articles]) => {
          const links = articles.map((a: any) => `- "${a.title}" → /${a.category}/${a.slug}`);
          return `Categoria (/${cat}):\n${links.join('\n')}`;
        })
        .join('\n\n');
    }

    if (allTopics?.length > 0) {
      const topicLinks = allTopics
        .map((cat: any) => {
          const links = cat.topics.map((t: string) => {
            const slug = generateSlug(t);
            return `- "${t}" → /${cat.categorySlug}/${slug}`;
          });
          return `Categoria "${cat.category}" (/${cat.categorySlug}):\n${links.join('\n')}`;
        })
        .join('\n\n');

      if (internalLinksContext) {
        internalLinksContext += '\n\nTemas planejados (podem ainda não existir):\n' + topicLinks;
      } else {
        internalLinksContext = topicLinks;
      }
    }

    await supabaseAdmin
      .from('article_generation_jobs')
      .update({ progress: 40, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    // 3. Build prompt
    const prompt = `Você é um escritor católico especializado, teólogo e expert em SEO para o site "Católicos Orantes" (catolicosorantes.com.br).

REGRA ABSOLUTA E INVIOLÁVEL:
NÃO INVENTE ABSOLUTAMENTE NADA. Todo o conteúdo DEVE ser 100% real, verificável e baseado EXCLUSIVAMENTE na doutrina oficial da Igreja Católica Apostólica Romana. Isso inclui:
- Citações bíblicas: use SOMENTE versículos reais e existentes da Bíblia
- Santos: cite SOMENTE santos reais canonizados ou beatificados pela Igreja Católica
- Documentos: cite SOMENTE encíclicas, constituições e documentos reais do Magistério
- Datas e eventos históricos: use SOMENTE datas e fatos historicamente verificáveis
- Aparições marianas: cite SOMENTE aparições reconhecidas oficialmente pela Igreja
- Milagres: cite SOMENTE milagres reconhecidos e documentados pela Igreja
- Catecismo: baseie-se SOMENTE no Catecismo da Igreja Católica (CIC) oficial
- Orações: reproduza SOMENTE orações oficiais e aprovadas pela Igreja
Se não tiver certeza absoluta de um dado, NÃO o inclua.
- NUNCA invente números de parágrafos do Catecismo, números de cânones ou trechos literais de documentos. Se não tiver certeza do número exato, cite apenas o documento pelo nome, sem número.
- Não atribua frases a santos ou papas se não tiver certeza de que são autênticas.
- Siga fielmente o Magistério: não apresente opiniões teológicas pessoais, dissidentes ou não aprovadas como doutrina da Igreja.
- Em temas de moral e sacramentos, deixe clara a doutrina oficial e oriente a buscar um sacerdote para casos particulares.
- Responda à pergunta principal do leitor já no primeiro parágrafo, de forma direta (bom para SEO e para o leitor).

Escreva um artigo completo sobre o seguinte tema, na categoria "${category}":

Tema: ${topic}

REGRAS DE CONTEÚDO:
- Português do Brasil
- Aproximadamente 2.000 palavras (mínimo 1.800, máximo 2.200)
- Fundamentação bíblica real (cite versículos reais entre parênteses, ex: Mt 28,19)
- Cite documentos reais da Igreja e encíclicas reais quando aplicável
- Linguagem acessível, acolhedora e respeitosa
- Estruture com subtítulos claros (h2 e h3) — pelo menos 5 subtítulos
- Inclua listas (ul/ol) para escaneabilidade
- Use <strong> para termos importantes (com moderação)
- Inclua uma seção de "Oração" quando fizer sentido para o tema

REGRAS DE SEO:
- Título: palavra-chave principal, menos de 60 caracteres
- Slug: curto, descritivo, com palavra-chave
- Meta description: 120-155 caracteres, persuasiva, com palavra-chave
- Palavra-chave principal no primeiro parágrafo
- Variações da palavra-chave nos subtítulos h2/h3

REGRAS DE IMAGENS:
Eu já busquei imagens REAIS do Unsplash para você. Insira-as ao longo do artigo entre seções para quebrar o texto.
Use EXATAMENTE estas URLs (NÃO invente URLs de imagens):

${imageInstructions}

IMPORTANTE SOBRE ALT TEXT DAS IMAGENS:
- Escreva o atributo alt SEMPRE em Português do Brasil
- O alt deve descrever a imagem de forma contextual ao artigo
- NÃO use o alt text original em inglês do Unsplash
- Cada alt deve ter entre 5 e 15 palavras, ser descritivo e incluir palavras-chave do artigo

Para cada imagem, use este formato HTML:
<figure>
  <img src="URL_EXATA_FORNECIDA" alt="descrição contextual em português" loading="lazy" />
  <figcaption>Crédito fornecido</figcaption>
</figure>

REGRAS DE LINKS INTERNOS:
- Inclua de 3 a 5 links internos usando <a href="/categoria/slug">texto âncora descritivo</a>
- Distribua naturalmente ao longo do texto
- Use textos âncora relevantes e descritivos
- Artigos disponíveis:

${internalLinksContext}

FORMATO DE RESPOSTA — Retorne EXATAMENTE neste JSON (sem markdown, sem blocos de código, sem \`\`\`):
{
  "title": "título SEO otimizado (máx 60 chars)",
  "slug": "slug-otimizado-seo",
  "excerpt": "resumo curto para listagens (1-2 frases)",
  "meta_description": "meta description SEO entre 120-155 caracteres com palavra-chave",
  "image_alt": "texto alt em português, descritivo e contextual ao artigo (5-15 palavras)",
  "content": "conteúdo HTML completo com as imagens reais fornecidas, links internos e formatação rica"
}`;

    // 4. Call Gemini
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 12288 },
      }),
    });

    await supabaseAdmin
      .from('article_generation_jobs')
      .update({ progress: 70, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      throw new Error(`Gemini API error (${geminiRes.status}): ${errorText}`);
    }

    const geminiData = await geminiRes.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Resposta vazia da API do Gemini');
    }

    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error('Falha ao processar resposta da IA');
    }

    await supabaseAdmin
      .from('article_generation_jobs')
      .update({ progress: 90, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    const result = {
      title: parsed.title,
      slug: parsed.slug || generateSlug(parsed.title),
      excerpt: parsed.excerpt,
      meta_description: parsed.meta_description,
      image_alt: parsed.image_alt,
      content: parsed.content,
      unsplashImages: images,
    };

    // Mark as completed
    await supabaseAdmin
      .from('article_generation_jobs')
      .update({
        status: 'completed',
        progress: 100,
        result,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);

  } catch (error) {
    console.error('processArticleJob error:', error);
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    await supabaseAdmin
      .from('article_generation_jobs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Erro desconhecido',
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      console.error('Auth error:', claimsError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = claimsData.claims.sub;

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY');

    if (!GEMINI_API_KEY || !UNSPLASH_ACCESS_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { category, topic } = body;

    if (!category || !topic) {
      return new Response(JSON.stringify({ error: 'Missing category or topic' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('article_generation_jobs')
      .insert({
        owner_id: userId,
        category,
        topic,
        status: 'pending',
        progress: 0,
      })
      .select('id')
      .single();

    if (jobError || !job) {
      return new Response(JSON.stringify({ error: 'Failed to create job: ' + (jobError?.message || 'unknown') }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Start background processing
    EdgeRuntime.waitUntil(
      processArticleJob(job.id, userId, {
        category,
        topic,
        allTopics: body.allTopics,
        existingArticles: body.existingArticles,
        internalLinksContext: body.internalLinksContext,
      })
    );

    // Return immediately with job ID
    return new Response(JSON.stringify({ job_id: job.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('generate-article error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
