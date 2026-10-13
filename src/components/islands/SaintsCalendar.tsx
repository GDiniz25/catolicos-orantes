import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { slugifySaintName, type SaintEntry } from "@/lib/saints";
import { selectRows } from "@/lib/publicApi";
import { getTodayStr, MONTHS, WEEKDAYS_SHORT } from "@/lib/dateUtils";

type Saint = Pick<SaintEntry, "id" | "date_month" | "date_day" | "saint_name" | "description" | "article_slug" | "article_category" | "vatican_url"> & {
  hasContent: boolean;
  /** slug gerado no build (quando disponível) */
  slug?: string;
};

interface Props {
  /** Data (YYYY-MM-DD, Brasília) em que a página foi gerada */
  buildDate: string;
  initialMonthSaints: Saint[];
  /** "categoria/slug" dos artigos publicados (evita link para artigo inexistente) */
  articleKeys: string[];
}

// Sem full_content: a história completa pesa centenas de KB por mês e o calendário só mostra o resumo
const SELECT = "id,date_month,date_day,saint_name,description,article_slug,article_category,vatican_url";

const toSaint = (s: SaintEntry): Saint => ({
  id: s.id,
  date_month: s.date_month,
  date_day: s.date_day,
  saint_name: s.saint_name,
  description: s.description,
  article_slug: s.article_slug,
  article_category: s.article_category,
  vatican_url: s.vatican_url,
  hasContent: Boolean(s.full_content?.trim() || s.description?.trim()),
});

const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();
const firstWeekday = (month: number, year: number) => new Date(year, month - 1, 1).getDay();

export default function SaintsCalendar({ buildDate, initialMonthSaints, articleKeys }: Props) {
  const published = useMemo(() => new Set(articleKeys), [articleKeys]);
  const [todayStr, setTodayStr] = useState(buildDate);
  const [y, m, d] = todayStr.split("-").map(Number);
  const [viewMonth, setViewMonth] = useState(m);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [cache, setCache] = useState<Record<number, Saint[]>>({ [m]: initialMonthSaints });
  const [loading, setLoading] = useState(false);

  // Se a página em cache for de outro dia, atualiza para o dia real do visitante
  useEffect(() => {
    const real = getTodayStr();
    if (real !== buildDate) {
      setTodayStr(real);
      setViewMonth(Number(real.split("-")[1]));
    }
  }, [buildDate]);

  useEffect(() => {
    if (cache[viewMonth]) return;
    let cancel = false;
    setLoading(true);
    selectRows<SaintEntry>("saints_calendar", `select=${SELECT}&date_month=eq.${viewMonth}&order=date_day.asc,saint_name.asc`)
      .then((rows) => !cancel && setCache((c) => ({ ...c, [viewMonth]: rows.map(toSaint) })))
      .catch(() => !cancel && setCache((c) => ({ ...c, [viewMonth]: [] })))
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, [viewMonth, cache]);

  const monthSaints = cache[viewMonth] ?? [];
  const byDay = useMemo(() => {
    const acc: Record<number, Saint[]> = {};
    monthSaints.forEach((s) => (acc[s.date_day] = acc[s.date_day] || []).push(s));
    return acc;
  }, [monthSaints]);

  const isCurrentMonth = viewMonth === m;
  const activeDay = selectedDay ?? (isCurrentMonth ? d : null);
  const saintsForDay = activeDay ? byDay[activeDay] || [] : [];
  const safeIndex = Math.min(index, Math.max(0, saintsForDay.length - 1));
  const saint = saintsForDay[safeIndex] || null;
  const multiple = saintsForDay.length > 1;
  const total = daysInMonth(viewMonth, y);
  const first = firstWeekday(viewMonth, y);

  const dateLabel = selectedDay ? `${selectedDay} de ${MONTHS[viewMonth - 1]}` : `Hoje, ${d} de ${MONTHS[m - 1]}`;

  const selectDay = (day: number) => {
    setSelectedDay((cur) => (cur === day ? null : day));
    setIndex(0);
  };
  const changeMonth = (delta: number) => {
    setViewMonth((cur) => ((cur - 1 + delta + 12) % 12) + 1);
    setSelectedDay(null);
    setIndex(0);
  };

  const center = selectedDay ?? (isCurrentMonth ? d : 1);
  const weekDays = useMemo(() => {
    const end = Math.min(total, Math.max(1, center - 3) + 6);
    const start = Math.max(1, end - 6);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [center, total]);

  const dayButtonClass = (day: number, compact: boolean) => {
    const isToday = isCurrentMonth && day === d;
    const isSelected = selectedDay === day;
    const has = !!byDay[day];
    const base = compact
      ? "flex min-w-0 flex-1 flex-col items-center rounded-xl px-1.5 py-2 transition-all"
      : "relative flex h-11 w-full items-center justify-center rounded-lg text-base transition-all";
    if (isSelected) return `${base} bg-co-warm-terracotta font-semibold text-co-warm-sand shadow-md`;
    if (isToday) return `${base} bg-co-warm-terracotta/15 font-semibold text-co-warm-terracotta`;
    if (has) return `${base} font-medium text-co-warm-brown hover:bg-co-warm-sand-dark`;
    return `${base} text-co-warm-brown/40 hover:bg-co-warm-sand-dark/50`;
  };

  return (
    <div>
      {/* Seletor horizontal (mobile) */}
      <div className="mx-auto mb-6 max-w-5xl lg:hidden">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => selectDay(Math.max(1, center - 7))} aria-label="Semana anterior" className="flex h-10 w-10 shrink-0 items-center justify-center text-co-warm-brown/75 hover:text-co-warm-terracotta">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 justify-center gap-0.5">
            {weekDays.map((day) => (
              <button key={day} type="button" onClick={() => selectDay(day)} className={dayButtonClass(day, true)} aria-pressed={selectedDay === day}>
                <span className="text-[10px] font-medium uppercase">{WEEKDAYS_SHORT[new Date(y, viewMonth - 1, day).getDay()]}</span>
                <span className="text-lg font-bold leading-tight">{day}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => selectDay(Math.min(total, center + 7))} aria-label="Próxima semana" className="flex h-10 w-10 shrink-0 items-center justify-center text-co-warm-brown/75 hover:text-co-warm-terracotta">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-center text-xs text-co-warm-brown/75">
          {MONTHS[viewMonth - 1]} {y}
        </p>
        {selectedDay && (
          <div className="mt-2 flex justify-center">
            <button type="button" onClick={() => { setSelectedDay(null); setViewMonth(m); setIndex(0); }} className="text-xs font-medium text-co-warm-terracotta hover:underline">
              Voltar para hoje
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Destaque do santo */}
        <div className="relative flex flex-col justify-center rounded-md border border-co-warm-sand-dark bg-co-warm-cream p-8 md:p-10">
          {saint ? (
            <div key={saint.id}>
              <h3 className="mb-3 font-display text-lg font-bold leading-tight md:text-xl">{saint.saint_name}</h3>
              <p className="mb-3 text-sm font-medium text-co-warm-terracotta">{dateLabel}</p>
              {saint.description && <p className="line-clamp-4 text-sm leading-relaxed text-co-warm-brown/80">{saint.description}</p>}
              <div className="acoes mt-6">
                {saint.hasContent && (
                  <a href={`/santos/${saint.slug || slugifySaintName(saint.saint_name)}`} className="btn btn-primario btn-sm">
                    Saiba mais
                  </a>
                )}
                {saint.article_slug && saint.article_category && published.has(`${saint.article_category}/${saint.article_slug}`) && (
                  <a href={`/${saint.article_category}/${saint.article_slug}`} className="btn btn-secundario btn-sm">
                    Ler artigo
                  </a>
                )}
                {saint.vatican_url && (
                  <a href={saint.vatican_url} target="_blank" rel="noopener noreferrer" className="mt-1 text-[11px] text-co-warm-brown/75 transition-colors hover:text-co-warm-brown/80">
                    Fonte: Vatican News ↗
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-co-warm-brown/75">
              <CalendarIcon className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm">
                {loading ? "Carregando..." : selectedDay ? `Nenhum santo registrado para ${selectedDay} de ${MONTHS[viewMonth - 1]}` : "Selecione um dia no calendário"}
              </p>
            </div>
          )}

          {multiple && (
            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {saintsForDay.map((s, i) => (
                  <button key={s.id} type="button" onClick={() => setIndex(i)} aria-label={`Ver ${s.saint_name}`} className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-4 bg-co-warm-terracotta" : "w-1.5 bg-co-warm-terracotta/25"}`} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Santo anterior" onClick={() => setIndex((i) => (i === 0 ? saintsForDay.length - 1 : i - 1))} className="flex h-7 w-7 items-center justify-center rounded-full bg-co-warm-terracotta/10 hover:bg-co-warm-terracotta/20">
                  <ChevronLeft className="h-4 w-4 text-co-warm-terracotta" />
                </button>
                <span className="text-xs font-medium text-co-warm-brown/75">
                  {safeIndex + 1}/{saintsForDay.length}
                </span>
                <button type="button" aria-label="Próximo santo" onClick={() => setIndex((i) => (i === saintsForDay.length - 1 ? 0 : i + 1))} className="flex h-7 w-7 items-center justify-center rounded-full bg-co-warm-terracotta/10 hover:bg-co-warm-terracotta/20">
                  <ChevronRight className="h-4 w-4 text-co-warm-terracotta" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini calendário (desktop) */}
        <div className="hidden flex-col justify-center rounded-md border border-co-warm-sand-dark bg-co-warm-sand p-6 lg:flex lg:p-8">
          <div className="mb-5 flex items-center justify-between">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior" className="rounded-lg p-1.5 transition-colors hover:bg-co-warm-sand-dark">
              <ChevronLeft className="h-5 w-5 text-co-warm-brown/75" />
            </button>
            <span className="font-display text-lg font-semibold">
              {MONTHS[viewMonth - 1]} {y}
            </span>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês" className="rounded-lg p-1.5 transition-colors hover:bg-co-warm-sand-dark">
              <ChevronRight className="h-5 w-5 text-co-warm-brown/75" />
            </button>
          </div>
          <div className="mb-3 grid grid-cols-7 text-center text-xs font-medium text-co-warm-brown/75">
            {WEEKDAYS_SHORT.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: first }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: total }).map((_, i) => {
              const day = i + 1;
              return (
                <button key={day} type="button" onClick={() => selectDay(day)} className={dayButtonClass(day, false)} aria-pressed={selectedDay === day}>
                  {day}
                  {byDay[day] && selectedDay !== day && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-co-warm-terracotta" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export { toSaint };
export type { Saint };
