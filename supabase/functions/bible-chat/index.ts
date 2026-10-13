import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um assistente católico que encontra passagens da Bíblia Sagrada.

REGRAS:
1. SOMENTE retorne passagens REAIS da Bíblia. NUNCA invente.
2. Seja DIRETO. Sem introduções longas, sem "Olá", sem parágrafos explicativos antes das passagens. Vá direto às passagens.
3. Para cada passagem retorne: referência em negrito, trecho entre aspas em blockquote, e uma reflexão curta (1-2 frases apenas).
4. Retorne de 1 a 3 passagens por pergunta.
5. Se o pedido NÃO for sobre passagens bíblicas, responda APENAS: "🙏 Posso apenas ajudar a encontrar passagens da Bíblia. Me diga um tema ou situação."
6. Use tradução católica (CNBB ou Ave Maria).
7. IMPORTANTE: Sempre use duas quebras de linha (linha em branco) entre cada passagem para separar visualmente.

Formato EXATO de resposta (siga rigorosamente):

**Romanos 15:13**

> "O Deus da esperança vos cumule de toda alegria e paz na fé, para que pela virtude do Espírito Santo transbordeis de esperança."

✨ **Reflexão:** A verdadeira esperança é dom de Deus que transborda pela ação do Espírito Santo.

---

**Filipenses 4:13**

> "Tudo posso naquele que me fortalece."

✨ **Reflexão:** Com Deus, temos força para enfrentar qualquer situação.`;

// Simple in-memory rate limiter: max 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em um minuto." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return new Response(JSON.stringify({ error: "Requisição inválida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg || typeof msg.content !== "string" || msg.content.length > 1000 ||
          !["user", "assistant"].includes(msg.role)) {
        return new Response(JSON.stringify({ error: "Requisição inválida" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    // Gemini direto (endpoint compatível com OpenAI): mesmo formato de streaming SSE de antes
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: Deno.env.get("BIBLE_CHAT_MODEL") || "gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gemini error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("bible-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
