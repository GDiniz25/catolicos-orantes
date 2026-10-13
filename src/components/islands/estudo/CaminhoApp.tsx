import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Check, ChevronRight, Cross, Crown, Droplets, Flame, HandHeart, Lock, RotateCcw, Scale, Star, Sun, Target, X } from "lucide-react";
import { TRILHAS, NIVELAMENTO, totalLicoes } from "@/data/estudo/curso";
import type { Licao, Questao, Trilha } from "@/data/estudo/tipos";
import Exercicio from "./Exercicio";
import ContaBox, { type Usuario } from "./ContaBox";
import { aoMudarSessao, enviar, sessaoAtual, sincronizar, talvezLogado } from "./conta";
import {
  apagar,
  carregar,
  concluirLicao,
  concluirRevisao,
  corrigirNivelamento,
  dominada,
  estadoInicial,
  liberada,
  plano,
  progressoTrilha,
  proximaLicao,
  questoesDeRevisao,
  registrarEvento,
  rotuloNivel,
  salvar,
  temProgresso,
  type Estado,
} from "./motor";

const ICONES = { Sun, Cross, Droplets, Scale, HandHeart, Crown };

type Tela =
  | { nome: "carregando" }
  | { nome: "boasVindas" }
  | { nome: "nivelamento"; passo: number; respostas: number[] }
  | { nome: "resultadoNivelamento" }
  | { nome: "mapa" }
  | { nome: "ensino"; trilha: Trilha; licao: Licao }
  | { nome: "exercicios"; trilha: Trilha | null; licao: Licao | null; fila: { q: Questao; idx: number; chave?: string }[]; pos: number; erros: number[]; errosChave: string[]; jaRepetidas: number[] }
  | { nome: "fim"; titulo: string; acertos: number; total: number; xp: number; ofensivaSubiu: boolean; licao: Licao | null };

const btnPrimario = "btn btn-primario";
const btnSecundario = "btn btn-secundario";

export default function CaminhoApp() {
  const [estado, setEstado] = useState<Estado>(estadoInicial());
  const [tela, setTela] = useState<Tela>({ nome: "carregando" });
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [sincronizando, setSincronizando] = useState(false);
  const usuarioRef = useRef<Usuario | null>(null);
  const envioRef = useRef<ReturnType<typeof setTimeout>>();

  // Ao entrar (ou voltar do link do e-mail): junta o progresso do aparelho com o da nuvem
  const conectar = async (u: Usuario | null) => {
    usuarioRef.current = u;
    setUsuario(u);
    if (!u) return;
    setSincronizando(true);
    try {
      const final = await sincronizar(u.id, carregar());
      setEstado(final);
      salvar(final);
      setTela((t) => (t.nome === "carregando" || t.nome === "boasVindas" ? (final.nivelamento ? { nome: "mapa" } : { nome: "boasVindas" }) : t));
    } catch {
      /* sem rede: segue com o progresso local */
    }
    setSincronizando(false);
  };

  useEffect(() => {
    const e = carregar();
    setEstado(e);
    setTela(e.nivelamento ? { nome: "mapa" } : { nome: "boasVindas" });
    let parar: (() => void) | undefined;
    if (talvezLogado()) {
      sessaoAtual()
        .then((s) => conectar(s ? { id: s.user.id, email: s.user.email ?? "" } : null))
        .then(() => aoMudarSessao((s) => {
          const novo = s ? { id: s.user.id, email: s.user.email ?? "" } : null;
          if (novo?.id !== usuarioRef.current?.id) conectar(novo);
        }))
        .then((fn) => (parar = fn))
        .catch(() => undefined);
    }
    return () => parar?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const atualizar = (e: Estado) => {
    setEstado(e);
    salvar(e);
    const u = usuarioRef.current;
    if (u) {
      clearTimeout(envioRef.current);
      envioRef.current = setTimeout(() => enviar(u.id, e).catch(() => undefined), 800);
    }
  };

  const contaBox = (variante: "inicio" | "mapa" | "fim") => (
    <ContaBox
      usuario={usuario}
      sincronizando={sincronizando}
      variante={variante}
      onEntrou={(u) => conectar(u)}
      onSaiu={() => conectar(null)}
    />
  );

  const irPara = (t: Tela) => {
    setTela(t);
    if (typeof window !== "undefined") document.getElementById("caminho-app")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const abrirLicao = (trilha: Trilha, licao: Licao) => irPara({ nome: "ensino", trilha, licao });

  const comecarExercicios = (trilha: Trilha, licao: Licao) =>
    irPara({ nome: "exercicios", trilha, licao, fila: licao.questoes.map((q, idx) => ({ q, idx })), pos: 0, erros: [], errosChave: [], jaRepetidas: [] });

  const comecarRevisao = () => {
    const qs = questoesDeRevisao(estado);
    if (!qs.length) return;
    irPara({ nome: "exercicios", trilha: null, licao: null, fila: qs.map((x, idx) => ({ q: x.questao, idx, chave: x.chave })), pos: 0, erros: [], errosChave: [], jaRepetidas: [] });
  };

  // ───────── telas ─────────

  if (tela.nome === "carregando") {
    return <div className="h-64" aria-busy="true" />;
  }

  if (tela.nome === "boasVindas") {
    return (
      <div className="mx-auto max-w-xl py-4">
        <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">Vamos descobrir por onde você começa</h2>
        <p className="mt-4 text-lg leading-relaxed text-co-warm-brown/80">
          São {NIVELAMENTO.length} perguntas rápidas sobre seis temas da fé. Não vale nota: serve só para montar um plano do seu tamanho. Se não souber, escolha "Não sei".
        </p>
        <ul className="mt-6 space-y-2 text-[15px] text-co-warm-brown/80">
          <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-co-warm-gold" /> Cerca de 3 minutos</li>
          <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-co-warm-gold" /> Lições de 3 a 5 minutos, com a fonte do Catecismo</li>
          <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-co-warm-gold" /> Comece sem cadastro. Se quiser, entre com seu e-mail para salvar o progresso em qualquer aparelho</li>
        </ul>
        <div className="acoes mt-8">
          <button type="button" className={btnPrimario} onClick={() => { registrarEvento("caminho_nivelamento_inicio"); irPara({ nome: "nivelamento", passo: 0, respostas: [] }); }}>
            Fazer o nivelamento
          </button>
          <button
            type="button"
            className={btnSecundario}
            onClick={() => {
              const nivel: Record<string, number> = {};
              TRILHAS.forEach((t) => (nivel[t.id] = 0));
              atualizar({ ...estado, nivelamento: nivel });
              irPara({ nome: "mapa" });
            }}
          >
            Começar do zero
          </button>
        </div>
        <div className="mt-10">{contaBox("inicio")}</div>
      </div>
    );
  }

  if (tela.nome === "nivelamento") {
    const q = NIVELAMENTO[tela.passo];
    const total = NIVELAMENTO.length;
    const responder = (i: number) => {
      const respostas = [...tela.respostas, i];
      if (tela.passo + 1 < total) {
        setTela({ nome: "nivelamento", passo: tela.passo + 1, respostas });
      } else {
        const nivel = corrigirNivelamento(respostas);
        atualizar({ ...estado, nivelamento: nivel });
        registrarEvento("caminho_nivelamento_fim", { acertos: Object.values(nivel).reduce((a, b) => a + b, 0) });
        irPara({ nome: "resultadoNivelamento" });
      }
    };
    return (
      <div className="mx-auto max-w-xl">
        <BarraProgresso valor={tela.passo} total={total} onSair={() => irPara({ nome: "boasVindas" })} />
        <p className="mb-1 text-sm font-medium text-co-warm-brown/75">
          Pergunta {tela.passo + 1} de {total} · {TRILHAS.find((t) => t.id === q.trilha)?.titulo}
        </p>
        <h2 className="mb-6 font-display text-2xl font-semibold leading-snug">{q.enunciado}</h2>
        <div className="space-y-3">
          {q.opcoes.map((o, i) => (
            <button key={o} type="button" onClick={() => responder(i)} className="w-full rounded-md border-2 border-co-warm-sand-dark bg-white px-4 py-3.5 text-left text-[16px] hover:border-co-warm-brown/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-co-warm-terracotta">
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (tela.nome === "resultadoNivelamento") {
    const p = plano(estado);
    const dias = Math.ceil(p.length / estado.meta);
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">Seu plano está pronto</h2>
        <p className="mt-3 text-lg text-co-warm-brown/80">
          Começamos pelos temas em que você tem mais a descobrir. O que você já domina fica disponível para revisar quando quiser.
        </p>
        <ul className="mt-8 divide-y divide-co-warm-sand-dark border-y border-co-warm-sand-dark">
          {[...TRILHAS]
            .sort((a, b) => (estado.nivelamento?.[a.id] ?? 0) - (estado.nivelamento?.[b.id] ?? 0))
            .map((t) => {
              const Icone = ICONES[t.icone];
              const n = estado.nivelamento?.[t.id] ?? 0;
              return (
                <li key={t.id} className="flex items-center gap-4 py-3.5">
                  <Icone className="h-5 w-5 shrink-0 text-co-warm-gold" aria-hidden="true" />
                  <span className="flex-1 font-medium">{t.titulo}</span>
                  <span className="text-sm text-co-warm-brown/80">{rotuloNivel(n)}</span>
                  <span className="flex gap-1" aria-label={`${n} de 3 acertos`}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} className={`h-2 w-5 rounded-full ${i < n ? "bg-co-warm-terracotta" : "bg-co-warm-sand-dark"}`} />
                    ))}
                  </span>
                </li>
              );
            })}
        </ul>

        <h3 className="mt-10 font-display text-xl font-semibold">Quanto você quer estudar por dia?</h3>
        <div className="mt-4 grid grid-cols-3 gap-3" role="radiogroup">
          {([1, 2, 3] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={estado.meta === m}
              onClick={() => atualizar({ ...estado, meta: m })}
              className={`rounded-md border-2 px-3 py-4 text-center ${estado.meta === m ? "border-co-warm-brown bg-co-warm-cream" : "border-co-warm-sand-dark bg-white hover:border-co-warm-brown/40"}`}
            >
              <span className="block text-lg font-semibold">{m === 1 ? "Leve" : m === 2 ? "Constante" : "Intenso"}</span>
              <span className="block text-sm text-co-warm-brown/80">{m} {m === 1 ? "lição" : "lições"} · ~{m * 4} min</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-[15px] text-co-warm-brown/75">
          {p.length} lições no seu plano. No ritmo escolhido, cerca de <strong>{dias} dias</strong>.
        </p>
        <button type="button" className={`${btnPrimario} mt-8 w-full sm:w-auto`} onClick={() => irPara({ nome: "mapa" })}>
          Ver meu caminho <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  if (tela.nome === "ensino") {
    const { trilha, licao } = tela;
    return (
      <div className="mx-auto max-w-xl">
        <BarraProgresso valor={0} total={licao.questoes.length + 1} onSair={() => irPara({ nome: "mapa" })} />
        <p className="text-sm font-medium text-co-warm-brown/75">{trilha.titulo}</p>
        <h2 className="mt-1 font-display text-3xl font-semibold leading-tight">{licao.titulo}</h2>
        <div className="mt-6 border-l-4 border-co-warm-gold pl-5">
          <p className="font-display text-xl leading-relaxed">{licao.ensino}</p>
          <p className="mt-3 text-sm text-co-warm-brown/75">Fonte: {licao.ref}</p>
        </div>
        <button type="button" className={`${btnPrimario} mt-10 w-full`} onClick={() => comecarExercicios(trilha, licao)}>
          Praticar ({licao.questoes.length} exercícios)
        </button>
      </div>
    );
  }

  if (tela.nome === "exercicios") {
    const atual = tela.fila[tela.pos];
    const avancar = (acertou: boolean) => {
      let fila = tela.fila;
      let erros = tela.erros;
      let errosChave = tela.errosChave;
      let jaRepetidas = tela.jaRepetidas;
      if (!acertou) {
        if (!erros.includes(atual.idx)) erros = [...erros, atual.idx];
        if (atual.chave && !errosChave.includes(atual.chave)) errosChave = [...errosChave, atual.chave];
        // Como no Duolingo: a questão errada volta no fim, uma vez
        if (!jaRepetidas.includes(atual.idx)) {
          fila = [...fila, atual];
          jaRepetidas = [...jaRepetidas, atual.idx];
        }
      }
      const pos = tela.pos + 1;
      if (pos < fila.length) {
        setTela({ ...tela, fila, pos, erros, errosChave, jaRepetidas });
        return;
      }
      const total = tela.licao ? tela.licao.questoes.length : new Set(tela.fila.map((f) => f.idx)).size;
      const acertos = total - erros.length;
      if (tela.licao && tela.trilha) {
        const r = concluirLicao(estado, tela.licao, acertos, total, erros);
        atualizar(r.estado);
        registrarEvento("caminho_licao_concluida", { licao: tela.licao.id, acertos, total });
        irPara({ nome: "fim", titulo: tela.licao.titulo, acertos, total, xp: r.xpGanho, ofensivaSubiu: r.ofensivaSubiu, licao: tela.licao });
      } else {
        const chaves = tela.fila.map((f) => f.chave!).filter(Boolean);
        const r = concluirRevisao(estado, [...new Set(chaves)], errosChave);
        atualizar(r.estado);
        registrarEvento("caminho_revisao_concluida", { acertos, total });
        irPara({ nome: "fim", titulo: "Revisão", acertos, total, xp: r.xpGanho, ofensivaSubiu: r.ofensivaSubiu, licao: null });
      }
    };
    return (
      <div className="mx-auto max-w-xl">
        <BarraProgresso valor={tela.pos + 1} total={tela.fila.length + 1} onSair={() => irPara({ nome: "mapa" })} />
        <Exercicio key={`${tela.pos}-${atual.idx}`} questao={atual.q} onNext={avancar} />
      </div>
    );
  }

  if (tela.nome === "fim") {
    const prox = proximaLicao(estado);
    const metaOk = estado.hoje.licoes >= estado.meta;
    return (
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium text-co-warm-brown/75">{tela.titulo}</p>
        <h2 className="mt-2 font-display text-4xl font-semibold">{tela.acertos === tela.total ? "Perfeito!" : "Lição concluída"}</h2>
        <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-3">
          <Indicador icone={<Star className="h-5 w-5" />} valor={`+${tela.xp}`} rotulo="pontos" />
          <Indicador icone={<Check className="h-5 w-5" />} valor={`${tela.acertos}/${tela.total}`} rotulo="acertos" />
          <Indicador icone={<Flame className="h-5 w-5" />} valor={String(estado.ofensiva.atual)} rotulo={estado.ofensiva.atual === 1 ? "dia seguido" : "dias seguidos"} destaque={tela.ofensivaSubiu} />
        </div>
        {metaOk && <p className="mt-6 text-[15px] text-co-warm-brown/80">Meta de hoje cumprida. Volte amanhã para manter a sequência.</p>}

        {!usuario && temProgresso(estado) && <div className="mx-auto mt-8 max-w-sm text-left">{contaBox("fim")}</div>}

        {tela.licao?.leiaMais?.length ? (
          <div className="mx-auto mt-8 max-w-sm text-left">
            <p className="mb-2 text-sm font-semibold text-co-warm-brown/80">Para aprofundar</p>
            <ul className="divide-y divide-co-warm-sand-dark border-y border-co-warm-sand-dark">
              {tela.licao.leiaMais.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="flex items-center gap-2 py-3 text-[15px] text-co-warm-brown underline-offset-4 hover:text-co-warm-terracotta hover:underline">
                    <BookOpen className="h-4 w-4 shrink-0 text-co-warm-gold" /> {l.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="acoes mx-auto mt-10">
          {prox && !metaOk && (
            <button type="button" className={btnPrimario} onClick={() => abrirLicao(prox.trilha, prox.licao)}>
              Próxima lição <ChevronRight className="h-5 w-5" />
            </button>
          )}
          <button type="button" className={prox && !metaOk ? btnSecundario : btnPrimario} onClick={() => irPara({ nome: "mapa" })}>
            Voltar ao caminho
          </button>
        </div>
      </div>
    );
  }

  // ───────── mapa ─────────
  return (
    <Mapa
      estado={estado}
      conta={contaBox("mapa")}
      onAbrir={abrirLicao}
      onRevisar={comecarRevisao}
      onRefazer={() => {
        apagar();
        const zero = estadoInicial();
        setEstado(zero);
        if (usuarioRef.current) enviar(usuarioRef.current.id, zero).catch(() => undefined);
        irPara({ nome: "boasVindas" });
      }}
    />
  );
}

// ─────────────── componentes auxiliares ───────────────

function BarraProgresso({ valor, total, onSair }: { valor: number; total: number; onSair: () => void }) {
  const pct = Math.round((valor / total) * 100);
  return (
    <div className="mb-8 flex items-center gap-3">
      <button type="button" onClick={onSair} aria-label="Sair da lição" className="rounded p-1 text-co-warm-brown/75 hover:text-co-warm-brown">
        <X className="h-6 w-6" />
      </button>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-co-warm-sand-dark" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-co-warm-terracotta transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Indicador({ icone, valor, rotulo, destaque = false }: { icone: React.ReactNode; valor: string; rotulo: string; destaque?: boolean }) {
  return (
    <div className={`rounded-md border-2 px-2 py-3 ${destaque ? "border-co-warm-gold bg-co-warm-cream" : "border-co-warm-sand-dark"}`}>
      <div className="flex justify-center text-co-warm-gold">{icone}</div>
      <p className="mt-1 text-xl font-semibold">{valor}</p>
      <p className="text-xs text-co-warm-brown/75">{rotulo}</p>
    </div>
  );
}

function Mapa({ estado, conta, onAbrir, onRevisar, onRefazer }: { estado: Estado; conta: React.ReactNode; onAbrir: (t: Trilha, l: Licao) => void; onRevisar: () => void; onRefazer: () => void }) {
  const prox = useMemo(() => proximaLicao(estado), [estado]);
  const concluidas = Object.keys(estado.concluidas).length;
  const metaPct = Math.min(100, Math.round((estado.hoje.licoes / estado.meta) * 100));
  const [confirmar, setConfirmar] = useState(false);

  return (
    <div>
      {/* Painel do dia */}
      <section className="grid gap-4 border-b border-co-warm-sand-dark pb-8 md:grid-cols-[1fr_auto] md:items-end" aria-label="Seu progresso">
        <div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            <span className="inline-flex items-center gap-1.5"><Flame className="h-5 w-5 text-co-warm-gold" /> <strong>{estado.ofensiva.atual}</strong> {estado.ofensiva.atual === 1 ? "dia seguido" : "dias seguidos"}</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-5 w-5 text-co-warm-gold" /> <strong>{estado.xp}</strong> pontos</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-5 w-5 text-co-warm-gold" /> <strong>{concluidas}</strong> de {totalLicoes} lições</span>
          </div>
          <div className="mt-4 max-w-md">
            <div className="mb-1 flex items-center justify-between text-sm text-co-warm-brown/80">
              <span className="inline-flex items-center gap-1.5"><Target className="h-4 w-4" /> Meta de hoje</span>
              <span>{Math.min(estado.hoje.licoes, estado.meta)}/{estado.meta}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-co-warm-sand-dark">
              <div className="h-full rounded-full bg-co-warm-gold" style={{ width: `${metaPct}%` }} />
            </div>
          </div>
        </div>
        <div className="grid gap-3">
          {prox ? (
            <button type="button" className={btnPrimario} onClick={() => onAbrir(prox.trilha, prox.licao)}>
              {concluidas ? "Continuar" : "Começar"}: {prox.licao.titulo} <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <p className="font-medium">Você concluiu o plano. Revise ou refaça as lições quando quiser.</p>
          )}
          {estado.erros.length > 0 && (
            <button type="button" className={btnSecundario} onClick={onRevisar}>
              <RotateCcw className="h-4 w-4" /> Revisar erros ({Math.min(estado.erros.length, 8)})
            </button>
          )}
        </div>
      </section>

      <div className="mt-6">{conta}</div>

      {/* Trilhas */}
      <div className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2">
        {TRILHAS.map((t) => {
          const Icone = ICONES[t.icone];
          const p = progressoTrilha(estado, t);
          return (
            <section key={t.id} aria-labelledby={`trilha-${t.id}`}>
              <div className="flex items-start gap-3">
                <Icone className="mt-1 h-6 w-6 shrink-0 text-co-warm-gold" aria-hidden="true" />
                <div className="flex-1">
                  <h2 id={`trilha-${t.id}`} className="font-display text-xl font-semibold">{t.titulo}</h2>
                  <p className="text-sm text-co-warm-brown/80">{t.resumo}</p>
                </div>
                <span className="text-sm text-co-warm-brown/75">{p.feitas}/{p.total}</span>
              </div>
              <ol className="relative mt-4 ml-3 border-l-2 border-co-warm-sand-dark pl-6">
                {t.licoes.map((l, i) => {
                  const feita = Boolean(estado.concluidas[l.id]);
                  const dom = dominada(estado, t, i);
                  const lib = liberada(estado, t, i);
                  const ehProx = prox?.licao.id === l.id;
                  return (
                    <li key={l.id} className="relative pb-3 last:pb-0">
                      <span
                        className={`absolute -left-[2.15rem] top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 ${feita ? "border-co-warm-terracotta bg-co-warm-terracotta text-white" : dom ? "border-co-warm-gold bg-co-warm-cream text-co-warm-gold" : ehProx ? "border-co-warm-terracotta bg-white" : "border-co-warm-sand-dark bg-co-warm-sand"}`}
                        aria-hidden="true"
                      >
                        {feita ? <Check className="h-3.5 w-3.5" /> : dom ? <Star className="h-3 w-3" /> : !lib ? <Lock className="h-3 w-3 text-co-warm-brown/40" /> : null}
                      </span>
                      <button
                        type="button"
                        disabled={!lib}
                        onClick={() => onAbrir(t, l)}
                        className={`group flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left ${ehProx ? "bg-co-warm-cream" : ""} ${lib ? "hover:bg-co-warm-cream" : "cursor-not-allowed opacity-55"}`}
                      >
                        <span>
                          <span className="block font-medium">{l.titulo}</span>
                          <span className="block text-xs text-co-warm-brown/75">
                            {feita ? `Concluída · ${estado.concluidas[l.id].acertos}/${estado.concluidas[l.id].total}` : dom ? "Você já domina · revisar" : !lib ? "Conclua a anterior" : ehProx ? "Próxima do seu plano" : "Disponível"}
                          </span>
                        </span>
                        {lib && <ChevronRight className="h-4 w-4 shrink-0 text-co-warm-brown/40 group-hover:text-co-warm-terracotta" />}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      <div className="mt-14 border-t border-co-warm-sand-dark pt-6 text-sm text-co-warm-brown/75">
        <p>Recorde de dias seguidos: {estado.ofensiva.recorde}.</p>
        {!confirmar ? (
          <button type="button" className="mt-2 underline underline-offset-4 hover:text-co-warm-terracotta" onClick={() => setConfirmar(true)}>
            Refazer o nivelamento e recomeçar
          </button>
        ) : (
          <p className="mt-2">
            Isso apaga todo o progresso.{" "}
            <button type="button" className="font-semibold text-co-warm-terracotta underline underline-offset-4" onClick={onRefazer}>Apagar e recomeçar</button>{" "}
            <button type="button" className="ml-2 underline underline-offset-4" onClick={() => setConfirmar(false)}>Cancelar</button>
          </p>
        )}
      </div>
    </div>
  );
}
