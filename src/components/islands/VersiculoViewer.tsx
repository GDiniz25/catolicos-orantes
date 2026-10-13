import { useEffect, useState } from "react";
import { Share2, Copy, Check, Sparkles } from "lucide-react";
import WeekDayPicker from "./WeekDayPicker";
import { getTodayStr, parseDate, getDayOfYear, WEEKDAYS_FULL, MONTHS_LOWER } from "@/lib/dateUtils";

export interface VersiculoView {
  date: string;
  texto: string;
  referencia: string;
  reflexao: string;
}

/** Monta o versículo e a reflexão de uma data (carrega os textos sob demanda) */
async function loadVersiculo(date: string): Promise<VersiculoView> {
  const [{ getVersiculoDoDia }, { default: reflexoes }] = await Promise.all([import("@/data/versiculos"), import("@/data/reflexoes")]);
  const d = parseDate(date);
  const v = getVersiculoDoDia(d);
  return { date, texto: v.texto, referencia: v.referencia, reflexao: reflexoes[getDayOfYear(d) % reflexoes.length] };
}

const longDate = (date: string) => {
  const d = parseDate(date);
  return `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} de ${MONTHS_LOWER[d.getMonth()]} de ${d.getFullYear()}`;
};

export default function VersiculoViewer({ initial }: { initial: VersiculoView }) {
  const [todayStr, setTodayStr] = useState(initial.date);
  const [current, setCurrent] = useState(initial.date);
  const [data, setData] = useState<VersiculoView>(initial);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const real = getTodayStr();
    if (real !== initial.date) {
      setTodayStr(real);
      setCurrent(real);
    }
  }, [initial.date]);

  useEffect(() => {
    if (data.date === current) return;
    let cancel = false;
    loadVersiculo(current).then((v) => !cancel && setData(v));
    return () => {
      cancel = true;
    };
  }, [current, data.date]);

  const fullText = `"${data.texto}" (${data.referencia})\n\n${data.reflexao}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sem clipboard */
    }
  };
  const share = () => {
    const text = `${fullText}\n\nVersículo do Dia · Católicos Orantes\nhttps://catolicosorantes.com.br/versiculo-do-dia`;
    if (navigator.share) navigator.share({ title: "Versículo do Dia", text }).catch(() => undefined);
    else copy();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <WeekDayPicker currentDate={current} todayStr={todayStr} onDateChange={setCurrent} />

      <div className="rounded-md border border-co-warm-terracotta/20 bg-co-warm-cream p-8 text-center md:p-12">
        <p className="mb-6 text-sm font-medium text-co-warm-terracotta">
          <time dateTime={data.date}>{longDate(data.date)}</time>
        </p>
        <blockquote className="font-display text-2xl font-semibold leading-snug text-co-warm-brown md:text-3xl lg:text-4xl">“{data.texto}”</blockquote>
        <p className="mt-6 text-lg font-medium text-co-warm-terracotta">{data.referencia}</p>
        <div className="acoes-2 mx-auto mt-8">
          <button type="button" onClick={copy} className="btn btn-secundario">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado!" : "Copiar"}
          </button>
          <button type="button" onClick={share} className="btn btn-primario">
            <Share2 className="h-4 w-4" /> Compartilhar
          </button>
        </div>
      </div>

      <section className="mt-10 rounded-md border border-co-warm-sand-dark bg-co-warm-sand p-6 md:p-8" aria-labelledby="reflexao-titulo">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-co-warm-terracotta/10">
            <Sparkles className="h-4 w-4 text-co-warm-terracotta" />
          </div>
          <h2 id="reflexao-titulo" className="font-display text-lg font-semibold">
            Reflexão do Dia
          </h2>
        </div>
        <p className="text-base leading-relaxed text-co-warm-brown/80">{data.reflexao}</p>
      </section>
    </div>
  );
}
