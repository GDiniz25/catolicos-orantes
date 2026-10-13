import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEMINI_MODEL = "gemini-2.5-flash";

async function generateContentWithAI(
  saintName: string,
  description: string,
  vaticanContent: string | null,
  dateDay: number,
  dateMonth: number
): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

  const monthNames = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];

  const dateStr = `${dateDay} de ${monthNames[dateMonth - 1]}`;

  const prompt = `Você é um escritor católico especializado em hagiografia (vida dos santos).
Com base nas informações abaixo, escreva um artigo ORIGINAL, completo e envolvente sobre este santo.

**IMPORTANTE**: NÃO copie o texto de referência. Reescreva tudo com suas próprias palavras, adicionando contexto histórico, reflexões espirituais e aplicações para a vida cristã atual.

**Nome do Santo**: ${saintName}
**Data litúrgica**: ${dateStr}
**Descrição breve (fonte principal — use APENAS os fatos aqui mencionados)**: ${description}
${vaticanContent ? `**Texto de referência do Vaticano (NÃO COPIAR, apenas usar como base complementar)**: ${vaticanContent}` : ""}

**Estrutura do artigo**:
1. **Introdução** — Quem foi este santo e por que é celebrado nesta data
2. **Vida e História** — Contexto histórico, nascimento, formação, principais eventos da vida
3. **Espiritualidade e Virtudes** — As virtudes que o destacaram, sua relação com Deus, carisma espiritual
4. **Legado e Influência** — Impacto na Igreja, na sociedade, ordens religiosas fundadas, milagres
5. **Reflexão para hoje** — O que podemos aprender com este santo para nossa vida cristã
6. **Oração** — Uma oração ao santo (pode ser tradicional ou inspirada)

**Regras CRÍTICAS de fidelidade histórica**:
- Escreva em português brasileiro
- Tom devocional mas acessível, sem ser excessivamente acadêmico
- Use formatação Markdown (## para títulos de seção, **negrito** para destaques)
- O artigo deve ter entre 800 e 1500 palavras
- **NUNCA invente datas, nomes de pessoas, lugares ou milagres específicos não mencionados nas fontes acima**
- Se não houver informação suficiente sobre um evento, fale sobre o contexto histórico geral da época ou das virtudes demonstradas, sem fabricar detalhes
- Datas e fatos históricos devem ser retirados SOMENTE das fontes fornecidas
- NÃO inclua título H1 (o título já aparece na página)`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: "Você escreve conteúdo católico original com precisão histórica, clareza pastoral e bom SEO." }],
      },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini API error:", err);
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    console.error("Unexpected Gemini response:", JSON.stringify(data));
    throw new Error("No content generated");
  }

  return text.trim();
}

// ---- Segurança: só administradores (tabela public.admins) podem chamar esta função ----
async function exigirAdmin(req: Request, cors: Record<string, string>): Promise<Response | null> {
  const auth = req.headers.get("Authorization") || "";
  const negar = (status: number, msg: string) =>
    new Response(JSON.stringify({ error: msg }), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (!auth.startsWith("Bearer ")) return negar(401, "Unauthorized");
  const { createClient: cc } = await import("https://esm.sh/@supabase/supabase-js@2");
  const sb = cc(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data, error } = await sb.rpc("is_admin");
  if (error || data !== true) return negar(403, "Forbidden");
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const bloqueio = await exigirAdmin(req, corsHeaders);
  if (bloqueio) return bloqueio;

  try {
    const { saintId, month, day, regenerateAll, onlyEmpty, maxBatchSize } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build query to find saints that need content generation
    let query = supabase.from("saints_calendar").select("*");

    if (saintId) {
      query = query.eq("id", saintId);
    } else if (month && day) {
      query = query.eq("date_month", month).eq("date_day", day);
    } else if (month) {
      query = query.eq("date_month", month);
    } else if (!regenerateAll) {
      return new Response(
        JSON.stringify({ error: "Provide saintId, month/day, or regenerateAll" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If onlyEmpty, only generate for saints without full_content
    if (onlyEmpty) {
      query = query.is("full_content", null);
    }

    // Limit batch size to avoid timeout (default: 1 para evitar timeout de 60s)
    const batchLimit = Math.min(maxBatchSize || 1, 3);
    query = query.limit(batchLimit);

    const { data: saints, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    if (!saints || saints.length === 0) {
      return new Response(
        JSON.stringify({ success: true, generated: 0, message: "Nenhum santo encontrado para gerar conteúdo" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating content for ${saints.length} saints (batch limit: ${batchLimit})...`);

    let generated = 0;
    let errors = 0;
    const generatedSaints: { name: string; date: string; success: boolean }[] = [];

    for (const saint of saints) {
      const dateStr = `${String(saint.date_day).padStart(2, "0")}/${String(saint.date_month).padStart(2, "0")}`;
      try {
        console.log(`Generating content for: ${saint.saint_name}`);

        const content = await generateContentWithAI(
          saint.saint_name,
          saint.description || "",
          saint.full_content,
          saint.date_day,
          saint.date_month
        );

        const { error: updateError } = await supabase
          .from("saints_calendar")
          .update({ full_content: content })
          .eq("id", saint.id);

        if (updateError) {
          console.error(`Error updating ${saint.saint_name}:`, updateError);
          errors++;
          generatedSaints.push({ name: saint.saint_name, date: dateStr, success: false });
        } else {
          generated++;
          generatedSaints.push({ name: saint.saint_name, date: dateStr, success: true });
        }

        // Delay between API calls to respect rate limits
        if (saints.length > 1) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (err) {
        console.error(`Error generating for ${saint.saint_name}:`, err);
        errors++;
        generatedSaints.push({ name: saint.saint_name, date: dateStr, success: false });
      }
    }

    return new Response(
      JSON.stringify({ success: true, generated, errors, total: saints.length, generatedSaints }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
