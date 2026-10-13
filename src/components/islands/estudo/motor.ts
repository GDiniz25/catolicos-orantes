/**
 * Motor do Caminho da Fé: progresso, nivelamento, plano de estudos e ofensiva (dias seguidos).
 * Tudo fica no navegador (localStorage). Nenhum dado pessoal é enviado.
 */
import { TRILHAS, NIVELAMENTO } from '@/data/estudo/curso';
import type { Licao, Questao, Trilha } from '@/data/estudo/tipos';
import { getTodayStr, offsetDate } from '@/lib/dateUtils';

const KEY = 'co-caminho-v1';

export interface Estado {
  v: 1;
  /** acertos por trilha no nivelamento (0 a 3); ausente = não fez */
  nivelamento?: Record<string, number>;
  concluidas: Record<string, { data: string; acertos: number; total: number }>;
  xp: number;
  ofensiva: { atual: number; recorde: number; ultimoDia: string | null };
  /** lições por dia */
  meta: 1 | 2 | 3;
  hoje: { dia: string; licoes: number };
  /** questões erradas para revisar: "licaoId:indice" */
  erros: string[];
}

export const estadoInicial = (): Estado => ({
  v: 1,
  concluidas: {},
  xp: 0,
  ofensiva: { atual: 0, recorde: 0, ultimoDia: null },
  meta: 1,
  hoje: { dia: getTodayStr(), licoes: 0 },
  erros: [],
});

export function carregar(): Estado {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return estadoInicial();
    const e = { ...estadoInicial(), ...JSON.parse(raw) } as Estado;
    return normalizarDia(e);
  } catch {
    return estadoInicial();
  }
}

export function salvar(e: Estado) {
  try {
    localStorage.setItem(KEY, JSON.stringify(e));
  } catch {
    /* modo privado ou armazenamento cheio: segue sem salvar */
  }
}

export function apagar() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nada */
  }
}

/** Zera o contador do dia e quebra a ofensiva se a pessoa ficou um dia sem estudar. */
export function normalizarDia(e: Estado): Estado {
  const hoje = getTodayStr();
  let out = e;
  if (e.hoje.dia !== hoje) out = { ...out, hoje: { dia: hoje, licoes: 0 } };
  const u = out.ofensiva.ultimoDia;
  if (u && u !== hoje && u !== offsetDate(hoje, -1) && out.ofensiva.atual !== 0) {
    out = { ...out, ofensiva: { ...out.ofensiva, atual: 0 } };
  }
  return out;
}

// ─────────────── Nivelamento e plano ───────────────

/** índice da primeira lição recomendada em cada trilha, conforme o nivelamento */
export function inicioRecomendado(acertos: number | undefined): number {
  if (acertos === undefined || acertos <= 1) return 0;
  if (acertos === 2) return 2;
  return 4;
}

export const rotuloNivel = (acertos: number | undefined) =>
  acertos === undefined ? 'Sem nivelamento' : acertos <= 1 ? 'Começando' : acertos === 2 ? 'Intermediário' : 'Avançado';

export function corrigirNivelamento(respostas: number[]): Record<string, number> {
  const out: Record<string, number> = {};
  NIVELAMENTO.forEach((q, i) => {
    out[q.trilha] = (out[q.trilha] ?? 0) + (respostas[i] === q.correta ? 1 : 0);
  });
  return out;
}

/** Lição já "dominada" pelo nivelamento (pode ser feita, mas não é necessária) */
export const dominada = (e: Estado, t: Trilha, idx: number) => idx < inicioRecomendado(e.nivelamento?.[t.id]);

export function liberada(e: Estado, t: Trilha, idx: number): boolean {
  if (idx <= inicioRecomendado(e.nivelamento?.[t.id])) return true;
  const anterior = t.licoes[idx - 1];
  return Boolean(e.concluidas[anterior.id]);
}

/**
 * Plano de estudos: começa pelas trilhas mais fracas e alterna entre elas,
 * para que cada dia traga um assunto diferente.
 */
export function plano(e: Estado): { trilha: Trilha; licao: Licao }[] {
  const ordem = [...TRILHAS].sort((a, b) => (e.nivelamento?.[a.id] ?? 0) - (e.nivelamento?.[b.id] ?? 0));
  const filas = ordem.map((t) =>
    t.licoes
      .map((l, i) => ({ trilha: t, licao: l, i }))
      .filter((x) => !dominada(e, t, x.i) && !e.concluidas[x.licao.id]),
  );
  const out: { trilha: Trilha; licao: Licao }[] = [];
  let resta = true;
  while (resta) {
    resta = false;
    for (const f of filas) {
      const x = f.shift();
      if (x) {
        out.push({ trilha: x.trilha, licao: x.licao });
        resta = true;
      }
    }
  }
  return out;
}

export function proximaLicao(e: Estado) {
  return plano(e).find((p) => liberada(e, p.trilha, p.trilha.licoes.indexOf(p.licao))) ?? null;
}

// ─────────────── Concluir lição ───────────────

export function concluirLicao(e: Estado, licao: Licao, acertos: number, total: number, errosIdx: number[]): { estado: Estado; xpGanho: number; ofensivaSubiu: boolean } {
  const hoje = getTodayStr();
  const base = normalizarDia(e);
  const perfeita = errosIdx.length === 0;
  const primeiraVez = !base.concluidas[licao.id];
  const xpGanho = (primeiraVez ? 10 : 5) + (perfeita ? 5 : 0);

  let ofensiva = base.ofensiva;
  let ofensivaSubiu = false;
  if (ofensiva.ultimoDia !== hoje) {
    const atual = ofensiva.ultimoDia === offsetDate(hoje, -1) ? ofensiva.atual + 1 : 1;
    ofensiva = { atual, recorde: Math.max(ofensiva.recorde, atual), ultimoDia: hoje };
    ofensivaSubiu = true;
  }

  const novosErros = errosIdx.map((i) => `${licao.id}:${i}`);
  const acertadas = licao.questoes.map((_, i) => `${licao.id}:${i}`).filter((k) => !novosErros.includes(k));
  const erros = [...base.erros.filter((k) => !acertadas.includes(k)), ...novosErros.filter((k) => !base.erros.includes(k))].slice(-60);

  const estado: Estado = {
    ...base,
    xp: base.xp + xpGanho,
    concluidas: { ...base.concluidas, [licao.id]: { data: hoje, acertos, total } },
    ofensiva,
    hoje: { dia: hoje, licoes: base.hoje.licoes + 1 },
    erros,
  };
  return { estado, xpGanho, ofensivaSubiu };
}

/** Conclui uma sessão de revisão: remove das pendências o que foi acertado */
export function concluirRevisao(e: Estado, chaves: string[], erradas: string[]): { estado: Estado; xpGanho: number; ofensivaSubiu: boolean } {
  const hoje = getTodayStr();
  const base = normalizarDia(e);
  let ofensiva = base.ofensiva;
  let ofensivaSubiu = false;
  if (ofensiva.ultimoDia !== hoje) {
    const atual = ofensiva.ultimoDia === offsetDate(hoje, -1) ? ofensiva.atual + 1 : 1;
    ofensiva = { atual, recorde: Math.max(ofensiva.recorde, atual), ultimoDia: hoje };
    ofensivaSubiu = true;
  }
  const xpGanho = 5;
  const acertadas = chaves.filter((k) => !erradas.includes(k));
  return {
    estado: { ...base, xp: base.xp + xpGanho, ofensiva, erros: base.erros.filter((k) => !acertadas.includes(k)) },
    xpGanho,
    ofensivaSubiu,
  };
}

export function questoesDeRevisao(e: Estado, max = 8): { chave: string; questao: Questao }[] {
  const out: { chave: string; questao: Questao }[] = [];
  for (const chave of [...e.erros].reverse()) {
    const [id, i] = chave.split(':');
    for (const t of TRILHAS) {
      const l = t.licoes.find((x) => x.id === id);
      const q = l?.questoes[Number(i)];
      if (q) out.push({ chave, questao: q });
    }
    if (out.length >= max) break;
  }
  return out;
}

export function progressoTrilha(e: Estado, t: Trilha) {
  const feitas = t.licoes.filter((l, i) => e.concluidas[l.id] || dominada(e, t, i)).length;
  return { feitas, total: t.licoes.length };
}

// ─────────────── utilidades ───────────────

export function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function registrarEvento(nome: string, params: Record<string, unknown> = {}) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', nome, params);
  } catch {
    /* sem GA */
  }
}

/**
 * Junta dois progressos (aparelho + nuvem) sem perder nada:
 * lições concluídas somadas, maior pontuação, maior sequência, nivelamento mais recente disponível.
 */
export function mesclar(a: Estado, b: Estado): Estado {
  const concluidas = { ...b.concluidas };
  for (const [id, v] of Object.entries(a.concluidas)) {
    const o = concluidas[id];
    if (!o || v.data > o.data || (v.data === o.data && v.acertos > o.acertos)) concluidas[id] = v;
  }
  const ultA = a.ofensiva.ultimoDia ?? '';
  const ultB = b.ofensiva.ultimoDia ?? '';
  const ofensiva =
    ultA === ultB
      ? { atual: Math.max(a.ofensiva.atual, b.ofensiva.atual), recorde: Math.max(a.ofensiva.recorde, b.ofensiva.recorde), ultimoDia: a.ofensiva.ultimoDia }
      : (() => {
          const [novo, velho] = ultA > ultB ? [a.ofensiva, b.ofensiva] : [b.ofensiva, a.ofensiva];
          // estudou ontem num aparelho e hoje em outro: a sequência continua
          const continua = velho.ultimoDia && novo.ultimoDia && offsetDate(novo.ultimoDia, -1) === velho.ultimoDia;
          const atual = continua ? Math.max(novo.atual, velho.atual + 1) : novo.atual;
          return { atual, recorde: Math.max(a.ofensiva.recorde, b.ofensiva.recorde, atual), ultimoDia: novo.ultimoDia };
        })();
  const hoje =
    a.hoje.dia === b.hoje.dia ? { dia: a.hoje.dia, licoes: Math.max(a.hoje.licoes, b.hoje.licoes) } : a.hoje.dia > b.hoje.dia ? a.hoje : b.hoje;
  return normalizarDia({
    v: 1,
    nivelamento: a.nivelamento ?? b.nivelamento,
    concluidas,
    xp: Math.max(a.xp, b.xp),
    ofensiva,
    meta: a.meta || b.meta,
    hoje,
    erros: [...new Set([...b.erros, ...a.erros])].slice(-60),
  });
}

/** O estado tem algum progresso que valha salvar/mesclar? */
export const temProgresso = (e: Estado) => Boolean(e.nivelamento) || Object.keys(e.concluidas).length > 0 || e.xp > 0;
