import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function extractSaintData(html: string) {
  const saints: { name: string; description: string; imageUrl: string | null; readMoreUrl: string | null }[] = [];

  // Match each saint section
  const sectionRegex =
    /<section class="section section--evidence section--isStatic">([\s\S]*?)<\/section>/g;
  let match;

  while ((match = sectionRegex.exec(html)) !== null) {
    const block = match[1];

    // Extract name from h2
    const nameMatch = block.match(/<h2>\s*([\s\S]*?)\s*<\/h2>/);
    const name = nameMatch
      ? nameMatch[1].replace(/<[^>]+>/g, "").trim()
      : null;

    // Extract description from <p>
    const descMatch = block.match(/<p>([\s\S]*?)<\/p>/);
    const description = descMatch
      ? descMatch[1]
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim()
      : null;

    // Extract image
    const imgMatch = block.match(/<img[^>]+src="([^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : null;

    // Extract read more link
    const linkMatch = block.match(
      /<a class="saintReadMore"[^>]+href="([^"]+)"/
    );
    const readMoreUrl = linkMatch ? linkMatch[1] : null;

    if (name) {
      saints.push({
        name,
        description: description || "",
        imageUrl,
        readMoreUrl,
      });
    }
  }

  return saints;
}

async function scrapeFullContent(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const html = await res.text();

    // Extract article content
    const contentMatch = html.match(
      /<div class="section__content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/
    );
    if (!contentMatch) return null;

    // Clean HTML to readable text
    return contentMatch[1]
      .replace(/<img[^>]*>/g, "")
      .replace(/<a[^>]*>([\s\S]*?)<\/a>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return null;
  }
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
    const { month, day, scrapeAll } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: { month: number; day: number; saints: number }[] = [];

    // Determine which dates to scrape
    let dates: { m: number; d: number }[] = [];

    if (scrapeAll) {
      // Scrape all 366 days
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      for (let m = 1; m <= 12; m++) {
        for (let d = 1; d <= daysInMonth[m - 1]; d++) {
          dates.push({ m, d });
        }
      }
    } else if (month && day) {
      dates = [{ m: month, d: day }];
    } else if (month) {
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      for (let d = 1; d <= daysInMonth[month - 1]; d++) {
        dates.push({ m: month, d });
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Provide month/day or scrapeAll" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const { m, d } of dates) {
      const url = `https://www.vaticannews.va/pt/santo-do-dia/${pad(m)}/${pad(d)}.html`;
      console.log(`Scraping: ${url}`);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.log(`Failed to fetch ${url}: ${res.status}`);
          continue;
        }

        const html = await res.text();
        const saints = extractSaintData(html);

        for (const saint of saints) {
          // Try to get full content from the read more link
          let fullContent: string | null = null;
          if (saint.readMoreUrl) {
            const fullUrl = saint.readMoreUrl.startsWith("http")
              ? saint.readMoreUrl
              : `https://www.vaticannews.va${saint.readMoreUrl}`;
            fullContent = await scrapeFullContent(fullUrl);
          }

          // Upsert into saints_calendar
          const { error } = await supabase
            .from("saints_calendar")
            .upsert(
              {
                date_month: m,
                date_day: d,
                saint_name: saint.name,
                description: saint.description,
                image_url: saint.imageUrl,
                vatican_url: saint.readMoreUrl
                  ? saint.readMoreUrl.startsWith("http")
                    ? saint.readMoreUrl
                    : `https://www.vaticannews.va${saint.readMoreUrl}`
                  : url,
                full_content: fullContent,
                scraped_at: new Date().toISOString(),
              },
              { onConflict: "date_month,date_day,saint_name" }
            );

          if (error) {
            console.error(`Error upserting saint ${saint.name}:`, error);
          }
        }

        results.push({ month: m, day: d, saints: saints.length });
      } catch (err) {
        console.error(`Error scraping ${url}:`, err);
      }

      // Small delay to be respectful
      if (dates.length > 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
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
