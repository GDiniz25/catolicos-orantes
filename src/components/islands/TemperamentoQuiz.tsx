import { useEffect, useMemo, useState } from "react";
import { EVENTO, gravar, ler, remover } from "@/lib/progresso";
import dados from "@/data/conteudo/temperamento.json";

type T = "colerico" | "sanguineo" | "melancolico" | "fleumatico";
const ORDEM: T[] = ["colerico", "sanguineo", "melancolico", "fleumatico"];
const COR: Record<T, string> = { colerico: "#8F3E26", sanguineo: "#7A5820", melancolico: "#2C5679", fleumatico: "#36613F" };
const ESCALA = ["Nada a ver comigo", "Um pouco", "Bastante", "Muito"];
const KEY = "co-temperamento-v1";
const POR_TELA = 8;
const btnPrimario = "btn btn-primario";
const btnSec = "btn btn-secundario";

const evento = (nome: string, p: Record<string, unknown> = {}) => {
  try { (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", nome, p); } catch { /* sem GA */ }
};

export default function TemperamentoQuiz() {
  const afirm = dados.afirmacoes as { texto: string; temperamento: T }[];
  const [resp, setResp] = useState<(number | null)[]>(() => afirm.map(() => null));
  const [tela, setTela] = useState<"inicio" | number | "resultado">("inicio");

  useEffect(() => {
    // Volta ao último resultado (deste aparelho ou da conta, se a pessoa entrou)
    const carregar = () => {
      const r = ler<unknown>(KEY, null);
      if (Array.isArray(r) && r.length === afirm.length && r.every((x) => typeof x === "number")) {
        setTela((t) => { if (t === "inicio") { setResp(r); return "resultado"; } return t; });
      }
    };
    carregar();
    addEventListener(EVENTO, carregar);
    return () => removeEventListener(EVENTO, carregar);
  }, []);

  const telas = Math.ceil(afirm.length / POR_TELA);
  const placar = useMemo(() => {
    const p: Record<T, number> = { colerico: 0, sanguineo: 0, melancolico: 0, fleumatico: 0 };
    const max: Record<T, number> = { colerico: 0, sanguineo: 0, melancolico: 0, fleumatico: 0 };
    afirm.forEach((a, i) => { p[a.temperamento] += resp[i] ?? 0; max[a.temperamento] += 3; });
    return ORDEM.map((t) => ({ t, pct: Math.round((p[t] / max[t]) * 100) })).sort((a, b) => b.pct - a.pct);
  }, [resp]);

  const topo = () => document.getElementById("teste-temperamento")?.scrollIntoView({ block: "start", behavior: "smooth" });

  if (tela === "inicio") {
    return (
      <div className="rounded-2xl border border-co-warm-sand-dark bg-white p-6 md:p-10">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">{afirm.length} afirmações, cerca de 4 minutos</h2>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-co-warm-brown/85">Responda pensando em como você costuma agir, não em como gostaria de ser. No fim, você vê seu temperamento principal, o secundário e conselhos espirituais para cada um.</p>
        <button type="button" className={`${btnPrimario} mt-6`} onClick={() => { evento("temperamento_inicio"); setTela(0); }}>Começar o teste</button>
      </div>
    );
  }

  if (typeof tela === "number") {
    const ini = tela * POR_TELA;
    const bloco = afirm.slice(ini, ini + POR_TELA);
    const completo = bloco.every((_, j) => resp[ini + j] !== null);
    return (
      <div className="rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-co-warm-cream" role="progressbar" aria-valuemin={0} aria-valuemax={telas} aria-valuenow={tela + 1} aria-label="Progresso do teste">
            <div className="h-full rounded-full bg-co-warm-terracotta transition-[width] duration-300" style={{ width: `${((tela + 1) / telas) * 100}%` }} />
          </div>
          <span className="text-sm text-co-warm-brown/75">Parte {tela + 1} de {telas}</span>
        </div>
        <ol className="mt-6 space-y-6">
          {bloco.map((a, j) => {
            const i = ini + j;
            return (
              <li key={i}>
                <fieldset>
                  <legend className="text-[17px] font-semibold leading-snug">{a.texto}</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {ESCALA.map((rot, v) => (
                      <button key={v} type="button" aria-pressed={resp[i] === v}
                        onClick={() => setResp((r) => r.map((x, k) => (k === i ? v : x)))}
                        className={`min-h-[2.75rem] rounded-lg border-2 px-3 py-2 text-[14px] transition-colors ${resp[i] === v ? "border-co-warm-brown bg-co-warm-cream font-semibold" : "border-co-warm-sand-dark bg-white hover:border-co-warm-brown/40"}`}>
                        {rot}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </li>
            );
          })}
        </ol>
        <div className="acoes mt-8">
          {tela > 0 && <button type="button" className={btnSec} onClick={() => { setTela(tela - 1); topo(); }}>Voltar</button>}
          <button type="button" className={btnPrimario} disabled={!completo} onClick={() => {
            if (tela + 1 < telas) { setTela(tela + 1); topo(); return; }
            gravar(KEY, resp);
            evento("temperamento_resultado", { principal: placar[0].t });
            setTela("resultado"); topo();
          }}>{tela + 1 < telas ? "Continuar" : "Ver meu resultado"}</button>
          {!completo && <span className="self-center text-sm text-co-warm-brown/75">Responda todas para continuar.</span>}
        </div>
      </div>
    );
  }

  const [p1, p2] = placar;
  const r = (dados.resultados as Record<T, { nome: string; resumo: string; forcas: string[]; desafios: string[]; virtude_chave: string; conselhos: string[]; oracao: string; artigo: string }>)[p1.t];
  const r2 = (dados.resultados as Record<T, { nome: string; artigo: string }>)[p2.t];
  return (
    <div className="space-y-6">
      <article className="overflow-hidden rounded-2xl border border-co-warm-sand-dark bg-white">
        <div className="h-2" style={{ background: COR[p1.t] }} />
        <div className="p-6 md:p-9">
          <p className="text-sm font-semibold" style={{ color: COR[p1.t] }}>Seu temperamento predominante</p>
          <h2 className="mt-1 font-display text-3xl font-semibold md:text-4xl">{r.nome}{p2.pct >= p1.pct - 12 ? `, com traços de ${r2.nome.toLowerCase()}` : ""}</h2>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-co-warm-brown/90">{r.resumo}</p>
          <ul className="mt-6 space-y-3" aria-label="Pontuação por temperamento">
            {placar.map(({ t, pct }) => (
              <li key={t}>
                <div className="flex justify-between text-[15px]"><span className="font-semibold">{(dados.resultados as Record<T, { nome: string }>)[t].nome}</span><span>{pct}%</span></div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-co-warm-cream"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: COR[t] }} /></div>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div><h3 className="font-display text-xl font-semibold">Suas forças</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">{r.forcas.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h3 className="font-display text-xl font-semibold">Seus desafios</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-[15px]">{r.desafios.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <p className="mt-6 rounded-lg bg-co-warm-cream px-4 py-3 text-[16px]"><strong>Virtude para cultivar:</strong> {r.virtude_chave}</p>
          <h3 className="mt-6 font-display text-xl font-semibold">Conselhos para a vida espiritual</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed">{r.conselhos.map((x) => <li key={x}>{x}</li>)}</ol>
          <blockquote className="mt-6 rounded-lg border-l-4 border-[#D9BE78] bg-[#F7F0DC] px-4 py-3 font-display text-[17px] italic">{r.oracao}</blockquote>
          <div className="acoes mt-6">
            <a href={r.artigo} className={btnPrimario}>Ler sobre o temperamento {r.nome.toLowerCase()}</a>
            <a href={r2.artigo} className={btnSec}>E sobre o {r2.nome.toLowerCase()}</a>
          </div>
        </div>
      </article>
      <div className="acoes">
        <button type="button" className={btnSec} onClick={() => { remover(KEY); setResp(afirm.map(() => null)); setTela(0); topo(); }}>Refazer o teste</button>
        <a href="/descubra-seu-santo" className={btnSec}>Descubra também seu santo</a>
      </div>
    </div>
  );
}
