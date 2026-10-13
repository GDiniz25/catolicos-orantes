import { useEffect, useMemo, useState } from "react";
import { EVENTO, gravar, ler, remover } from "@/lib/progresso";
import { ArrowLeft, RotateCcw, Share2, Check } from "lucide-react";
import { PERGUNTAS, MOTIVO, calcular, type SantoAfinidade } from "@/data/santoAfinidade";

interface Props {
  /** chaves "categoria/slug" que existem no site, com a imagem do artigo (ou null) */
  artigos: Record<string, string | null>;
}

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const diaSlug = (s: SantoAfinidade) => `${s.festa.dia}-de-${semAcento(MESES[s.festa.mes - 1])}`;
const festaTxt = (s: SantoAfinidade) => `${s.festa.dia === 1 ? "1º" : s.festa.dia} de ${MESES[s.festa.mes - 1]}`;
const inicial = (nome: string) => (nome.replace(/^(São|Santa|Santo)\s+/i, "")[0] || "+").toUpperCase();
const KEY = "co-santo-afinidade-v1";

const evento = (nome: string, params: Record<string, unknown> = {}) => {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", nome, params);
  } catch {
    /* sem GA */
  }
};

type Tela = { nome: "inicio" } | { nome: "pergunta"; passo: number; respostas: number[] } | { nome: "resultado"; respostas: number[] };

const btnPrimario = "btn btn-primario";
const btnSecundario = "btn btn-secundario";

export default function SantoQuiz({ artigos }: Props) {
  const [tela, setTela] = useState<Tela>({ nome: "inicio" });
  const [copiado, setCopiado] = useState(false);

  // Volta ao último resultado, se houver
  useEffect(() => {
    const carregar = () => {
      const r = ler<unknown>(KEY, null);
      if (Array.isArray(r) && r.length === PERGUNTAS.length) setTela((t) => (t.nome === "inicio" ? { nome: "resultado", respostas: r as number[] } : t));
    };
    carregar();
    addEventListener(EVENTO, carregar);
    return () => removeEventListener(EVENTO, carregar);
  }, []);

  const responder = (passo: number, respostas: number[], i: number) => {
    const novas = [...respostas.slice(0, passo), i];
    if (passo + 1 < PERGUNTAS.length) {
      setTela({ nome: "pergunta", passo: passo + 1, respostas: novas });
    } else {
      gravar(KEY, novas);
      const top = calcular(novas)[0];
      evento("santo_afinidade_resultado", { santo: top.santo.id });
      setTela({ nome: "resultado", respostas: novas });
    }
    document.getElementById("teste-santo")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  if (tela.nome === "inicio") {
    return (
      <div className="rounded-2xl border border-co-warm-sand-dark bg-white p-6 md:p-10">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">{PERGUNTAS.length} perguntas, cerca de 3 minutos</h2>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-co-warm-brown/85">
          Responda pensando no seu momento de hoje. No fim, você conhece 3 santos cuja vida combina com a sua, com a história de cada um e onde rezar a eles.
        </p>
        <button type="button" className={`${btnPrimario} mt-6`} onClick={() => { evento("santo_afinidade_inicio"); setTela({ nome: "pergunta", passo: 0, respostas: [] }); }}>
          Começar o teste
        </button>
      </div>
    );
  }

  if (tela.nome === "pergunta") {
    const p = PERGUNTAS[tela.passo];
    const progresso = Math.round((tela.passo / PERGUNTAS.length) * 100);
    return (
      <div className="rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:p-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Voltar para a pergunta anterior"
            disabled={tela.passo === 0}
            onClick={() => setTela({ nome: "pergunta", passo: tela.passo - 1, respostas: tela.respostas })}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-co-warm-brown/80 hover:bg-co-warm-cream disabled:opacity-30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-co-warm-cream" role="progressbar" aria-valuemin={0} aria-valuemax={PERGUNTAS.length} aria-valuenow={tela.passo + 1} aria-label="Progresso do teste">
            <div className="h-full rounded-full bg-co-warm-terracotta transition-[width] duration-300" style={{ width: `${Math.max(4, progresso)}%` }} />
          </div>
          <span className="w-12 text-right text-sm text-co-warm-brown/75">{tela.passo + 1}/{PERGUNTAS.length}</span>
        </div>
        <h2 className="mt-7 font-display text-2xl font-semibold leading-snug md:text-[1.9rem]" aria-live="polite">{p.texto}</h2>
        <div className="gs gs-sm2 mt-6 gap-3">
          {p.opcoes.map((o, i) => {
            const marcada = tela.respostas[tela.passo] === i;
            return (
              <button
                key={o.texto}
                type="button"
                onClick={() => responder(tela.passo, tela.respostas, i)}
                className={`min-h-[3.5rem] rounded-lg border-2 px-4 py-3 text-left text-[16px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-co-warm-terracotta ${
                  marcada ? "border-co-warm-brown bg-co-warm-cream" : "border-co-warm-sand-dark bg-white hover:border-co-warm-brown/40 hover:bg-co-warm-cream/60"
                }`}
              >
                {o.texto}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return <Resultado respostas={tela.respostas} artigos={artigos} copiado={copiado} setCopiado={setCopiado} refazer={() => {
    remover(KEY);
    setTela({ nome: "pergunta", passo: 0, respostas: [] });
  }} />;
}

function Resultado({ respostas, artigos, copiado, setCopiado, refazer }: { respostas: number[]; artigos: Record<string, string | null>; copiado: boolean; setCopiado: (v: boolean) => void; refazer: () => void }) {
  const lista = useMemo(() => calcular(respostas).slice(0, 3), [respostas]);
  const [principal, ...outros] = lista;
  const s = principal.santo;
  const img = s.artigo ? artigos[s.artigo] : null;
  const temArtigo = s.artigo && s.artigo in artigos;
  const temOracao = s.oracao && s.oracao.chave in artigos;

  const compartilhar = async () => {
    const texto = `Fiz o teste "Descubra seu santo" e meu santo de afinidade é ${s.nome}. Faça o seu:`;
    const url = "https://catolicosorantes.com.br/descubra-seu-santo";
    evento("santo_afinidade_compartilhar", { santo: s.id });
    try {
      if (navigator.share) {
        await navigator.share({ title: "Descubra seu santo", text: texto, url });
        return;
      }
      await navigator.clipboard.writeText(`${texto} ${url}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* cancelado */
    }
  };

  return (
    <div className="space-y-6">
      <article className="overflow-hidden rounded-2xl border border-co-warm-sand-dark bg-white">
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="relative flex min-h-[220px] items-center justify-center bg-[#F7F0DC]">
            {img ? (
              <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_25%]" loading="lazy" decoding="async" />
            ) : (
              <span className="flex h-32 w-32 items-center justify-center rounded-full border-[3px] border-[#D9BE78] bg-white/60 font-display text-6xl font-semibold text-[#7A5820]" aria-hidden="true">{inicial(s.nome)}</span>
            )}
          </div>
          <div className="p-6 md:p-9">
            <p className="text-sm font-semibold text-[#7A5820]">Seu santo de afinidade</p>
            <h2 className="mt-1 font-display text-3xl font-semibold leading-tight md:text-4xl">{s.nome}</h2>
            <p className="mt-1 text-[15px] text-co-warm-brown/80">Festa em {festaTxt(s)}</p>
            <p className="mt-4 text-[17px] leading-relaxed text-co-warm-brown/90">{s.resumo}</p>
            {principal.motivos.length > 0 && (
              <p className="mt-4 rounded-lg bg-co-warm-cream px-4 py-3 text-[15px] leading-relaxed">
                <strong>Por que combina:</strong> {principal.motivos.map((m) => MOTIVO[m]).join(" e ")}.
              </p>
            )}
            <div className="acoes mt-6">
              {temArtigo && <a href={`/${s.artigo}`} className={btnPrimario}>Ler a história completa</a>}
              {temOracao && <a href={`/${s.oracao!.chave}`} className={btnSecundario}>{s.oracao!.titulo}</a>}
              <a href={`/santo-do-dia/${diaSlug(s)}`} className={btnSecundario}>Ver no calendário</a>
            </div>
          </div>
        </div>
      </article>

      {outros.length > 0 && (
        <section aria-labelledby="outros-santos">
          <h3 id="outros-santos" className="mb-3 font-display text-xl font-semibold">Também combinam com você</h3>
          <ul className="gs gs-sm2 gap-4">
            {outros.map(({ santo: o, motivos }) => {
              const href = o.artigo && o.artigo in artigos ? `/${o.artigo}` : `/santo-do-dia/${diaSlug(o)}`;
              return (
                <li key={o.id}>
                  <a href={href} className="group flex h-full gap-4 rounded-xl border border-co-warm-sand-dark bg-white p-4 transition-colors hover:border-co-warm-brown/35 md:p-5">
                    {o.artigo && artigos[o.artigo] ? (
                      <img src={artigos[o.artigo]!} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-full border-2 border-[#D9BE78] object-cover object-[center_20%]" />
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#D9BE78] bg-[#F7F0DC] font-display text-2xl font-semibold text-[#7A5820]" aria-hidden="true">{inicial(o.nome)}</span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-semibold leading-snug group-hover:text-co-warm-terracotta">{o.nome}</span>
                      <span className="mt-0.5 block text-[13px] text-co-warm-brown/75">Festa em {festaTxt(o)}</span>
                      {(() => {
                        const m = motivos.find((x) => x !== principal.motivos[0]) ?? motivos[0];
                        return m ? <span className="mt-2 block text-[15px] leading-snug text-co-warm-brown/80">Porque {MOTIVO[m]}.</span> : null;
                      })()}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="acoes">
        <button type="button" className={btnPrimario} onClick={compartilhar}>
          {copiado ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          {copiado ? "Link copiado" : "Compartilhar resultado"}
        </button>
        <button type="button" className={btnSecundario} onClick={refazer}>
          <RotateCcw className="h-5 w-5" /> Refazer o teste
        </button>
      </div>
    </div>
  );
}
