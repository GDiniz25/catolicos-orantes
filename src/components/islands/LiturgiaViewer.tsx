import { useEffect, useState } from "react";
import { Share2, Minus, Plus, ArrowUp } from "lucide-react";
import WeekDayPicker from "./WeekDayPicker";
import { getTodayStr, formatDateFull } from "@/lib/dateUtils";
import { extractLeituras, tidyLiturgyHtml } from "@/lib/liturgy";
import { selectRows } from "@/lib/publicApi";

export interface LiturgiaView {
  date: string;
  title: string;
  /** HTML já sanitizado e tratado */
  bodyHtml: string;
  leituras: string[];
}

interface RawLiturgia {
  date: string;
  title: string;
  color: string;
  details: string;
  body: string;
  leituras: string;
}

interface Props {
  buildDate: string;
  initial: LiturgiaView | null;
}

async function toView(raw: RawLiturgia, date: string): Promise<LiturgiaView> {
  const { default: DOMPurify } = await import("dompurify");
  const sanitized = DOMPurify.sanitize(raw.body || "", {
    ALLOWED_TAGS: ["p", "br", "b", "strong", "i", "em", "div", "span", "font", "center", "blockquote"],
    ALLOWED_ATTR: ["style", "class", "align", "color"],
  });
  return { date, title: raw.title, bodyHtml: tidyLiturgyHtml(sanitized), leituras: extractLeituras(raw.leituras) };
}

async function loadLiturgia(date: string): Promise<LiturgiaView> {
  try {
    const rows = await selectRows<RawLiturgia>("daily_liturgy_cache", `select=*&date=eq.${date}&limit=1`);
    if (rows[0]?.body) return toView(rows[0], date);
  } catch {
    /* tenta a API */
  }
  const res = await fetch(`https://api-liturgia.edicoescnbb.com.br/contents/in/date/${date}`, {
    headers: { Accept: "application/json, text/plain, */*" },
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const content = (await res.json()).content as RawLiturgia;
  // O cache só é gravado pelo build (o navegador não tem permissão de escrita)
  return toView(content, date);
}

export default function LiturgiaViewer({ buildDate, initial }: Props) {
  const [todayStr, setTodayStr] = useState(buildDate);
  const [currentDate, setCurrentDate] = useState(buildDate);
  const [liturgia, setLiturgia] = useState<LiturgiaView | null>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("liturgia-font-size"));
      if (saved >= 12 && saved <= 24) setFontSize(saved);
    } catch {
      /* sem storage */
    }
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Página gerada em outro dia? Atualiza para hoje.
    const real = getTodayStr();
    if (real !== buildDate) {
      setTodayStr(real);
      setCurrentDate(real);
    }
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (liturgia?.date === currentDate) return;
    fetchDate(currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  async function fetchDate(date: string) {
    setLoading(true);
    setError("");
    try {
      setLiturgia(await loadLiturgia(date));
    } catch {
      setLiturgia(null);
      setError("Não foi possível carregar a liturgia. Tente novamente.");
    }
    setLoading(false);
  }

  const changeFont = (delta: number) =>
    setFontSize((prev) => {
      const next = Math.min(24, Math.max(12, prev + delta));
      try {
        localStorage.setItem("liturgia-font-size", String(next));
      } catch {
        /* sem storage */
      }
      return next;
    });

  const formattedDate = formatDateFull(currentDate);

  return (
    <div className="mx-auto max-w-3xl">
      <WeekDayPicker currentDate={currentDate} todayStr={todayStr} onDateChange={setCurrentDate} />

      {loading ? (
        <div className="animate-pulse space-y-4" aria-busy="true">
          <div className="mx-auto h-8 w-2/3 rounded bg-co-warm-sand-dark/50" />
          <div className="mx-auto h-4 w-1/2 rounded bg-co-warm-sand-dark/50" />
          <div className="h-64 rounded-md bg-co-warm-sand-dark/50" />
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-co-warm-brown/80">{error}</p>
          <button type="button" onClick={() => fetchDate(currentDate)} className="btn btn-primario">
            Tentar novamente
          </button>
        </div>
      ) : liturgia ? (
        <div className="space-y-6">
          <div className="rounded-md border border-co-warm-sand-dark bg-co-warm-sand p-5 md:p-6">
            <p className="mb-1 text-sm text-co-warm-brown/75">
              <time dateTime={currentDate}>{formattedDate}</time>
            </p>
            <h2 className="mb-4 font-display text-xl font-bold text-co-warm-brown md:text-2xl">{liturgia.title}</h2>
            {liturgia.leituras.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-co-warm-brown/75">Leituras:</p>
                <ul className="space-y-0.5">
                  {liturgia.leituras.map((l) => (
                    <li key={l} className="text-sm text-co-warm-brown/80">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-md border border-co-warm-sand-dark bg-co-warm-sand p-5 md:p-8">
            <div className="liturgia-content prose max-w-none" style={{ fontSize: `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: liturgia.bodyHtml }} />
          </div>

          <p className="text-center text-xs italic text-co-warm-brown/75">Conferência Nacional dos Bispos do Brasil. © Todos os direitos reservados.</p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                const text = encodeURIComponent(`📖 Liturgia Diária: ${formattedDate}\n${liturgia.title}\n\nLeia as leituras de hoje:\nhttps://catolicosorantes.com.br/liturgia-diaria`);
                window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
              }}
              className="inline-flex h-9 items-center rounded-md border border-co-warm-terracotta/20 px-3 text-sm text-co-warm-terracotta hover:bg-co-warm-terracotta/5"
            >
              <Share2 className="mr-2 h-4 w-4" /> Compartilhar leituras
            </button>
          </div>

          {showTop && (
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Voltar ao topo" className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-co-warm-sand-dark bg-co-warm-sand/80 text-co-warm-brown/80 shadow-lg backdrop-blur-xl">
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
          <div className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 rounded-full border border-co-warm-sand-dark bg-co-warm-sand/80 px-3 py-2 shadow-lg backdrop-blur-xl">
            <button type="button" onClick={() => changeFont(-2)} aria-label="Diminuir fonte" className="flex h-8 w-8 items-center justify-center rounded-full text-co-warm-brown/80 hover:bg-co-warm-sand-dark">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 text-center text-xs font-medium text-co-warm-brown/75">{fontSize}</span>
            <button type="button" onClick={() => changeFont(2)} aria-label="Aumentar fonte" className="flex h-8 w-8 items-center justify-center rounded-full text-co-warm-brown/80 hover:bg-co-warm-sand-dark">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
