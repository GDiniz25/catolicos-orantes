/**
 * Progresso pessoal das ferramentas (plano de leitura, consagração, novenas, Lectio, testes, artigos lidos).
 *
 * Sem login: tudo fica só neste navegador (localStorage), como antes.
 * Com login: cada chave também é guardada na tabela progresso_usuario do Supabase
 * e juntada com a dos outros aparelhos ao abrir qualquer página do site.
 *
 * O supabase-js só é baixado quando há indício de sessão (quem nunca entrou não paga esse peso).
 * O exame de consciência NÃO passa por aqui: por discrição, ele nunca é salvo.
 */
import { getClient, talvezLogado } from '@/lib/conta';

export { talvezLogado };

/** Chaves que acompanham a conta */
const FIXAS = ['co-lidos-v1', 'co-santo-afinidade-v1', 'co-temperamento-v1', 'co-consagracao-v1', 'co-leitura-biblia-v1'];
const PREFIXOS = ['co-novena-', 'co-lectio-'];
const TS = 'co-sync-ts'; // quando cada chave mudou neste aparelho (ms)
const TABELA = 'progresso_usuario';
export const EVENTO = 'co:progresso'; // disparado depois que dados da nuvem chegam
export const EVENTO_STATUS = 'co:progresso-status';

export const sincronizavel = (k: string) => FIXAS.includes(k) || PREFIXOS.some((p) => k.startsWith(p));

// ─────────── armazenamento local ───────────

function lerTs(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(TS) || '{}');
  } catch {
    return {};
  }
}
function marcarTs(k: string, t = Date.now()) {
  try {
    const ts = lerTs();
    ts[k] = t;
    localStorage.setItem(TS, JSON.stringify(ts));
  } catch {
    /* nada */
  }
}

/** Lê um valor salvo (JSON ou texto simples) */
export function ler<T>(k: string, padrao: T): T {
  try {
    const raw = localStorage.getItem(k);
    if (raw === null) return padrao;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  } catch {
    return padrao;
  }
}

/** Grava no aparelho e, se houver login, envia para a nuvem logo em seguida */
export function gravar(k: string, valor: unknown) {
  try {
    localStorage.setItem(k, typeof valor === 'string' ? valor : JSON.stringify(valor));
  } catch {
    return;
  }
  marcarTs(k);
  agendarEnvio(k);
}

/** Apaga no aparelho e na nuvem (fica uma marca de exclusão para os outros aparelhos) */
export function remover(k: string) {
  try {
    localStorage.removeItem(k);
  } catch {
    /* nada */
  }
  marcarTs(k);
  agendarEnvio(k);
}

// ─────────── conta ───────────

async function usuarioId(): Promise<string | null> {
  if (!talvezLogado()) return null;
  const sb = await getClient();
  const { data } = await sb.auth.getSession();
  return data.session?.user.id ?? null;
}

// ─────────── envio ───────────

const pendentes = new Set<string>();
let timer: ReturnType<typeof setTimeout> | null = null;

function agendarEnvio(k: string) {
  if (!sincronizavel(k) || !talvezLogado()) return;
  pendentes.add(k);
  if (timer) clearTimeout(timer);
  timer = setTimeout(enviarPendentes, 800);
}

async function enviarPendentes() {
  timer = null;
  const chaves = [...pendentes];
  pendentes.clear();
  if (!chaves.length) return;
  try {
    const uid = await usuarioId();
    if (!uid) return;
    const ts = lerTs();
    const linhas = chaves.map((k) => ({
      user_id: uid,
      chave: k,
      valor: ler<unknown>(k, null),
      updated_at: new Date(ts[k] ?? Date.now()).toISOString(),
    }));
    const sb = await getClient();
    await sb.from(TABELA).upsert(linhas);
  } catch {
    chaves.forEach((k) => pendentes.add(k)); // tenta de novo na próxima mudança
  }
}

// Não perde o último clique ao fechar a aba
if (typeof window !== 'undefined') {
  addEventListener('pagehide', () => {
    if (pendentes.size) enviarPendentes();
  });
}

// ─────────── junção (aparelho + nuvem) ───────────

const uniao = (a: unknown, b: unknown) => [...new Set([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])])];

/** Junta dois valores da mesma chave. "maisNovo" é o lado alterado por último. */
function juntar(k: string, local: any, nuvem: any, localMaisNovo: boolean): any {
  const novo = localMaisNovo ? local : nuvem;
  if (local == null || nuvem == null) return novo; // exclusão ou um lado vazio: vale o mais recente
  if (k === 'co-lidos-v1') return uniao(local, nuvem).slice(-2000);
  if (k.startsWith('co-novena-') && Array.isArray(local) && Array.isArray(nuvem)) {
    return Array.from({ length: Math.max(local.length, nuvem.length) }, (_, i) => Boolean(local[i] || nuvem[i]));
  }
  if (k === 'co-leitura-biblia-v1' && local.plano === nuvem.plano && local.inicio === nuvem.inicio) {
    return { ...novo, feitos: uniao(local.feitos, nuvem.feitos) };
  }
  if (k === 'co-consagracao-v1' && local.festa === nuvem.festa) {
    return { ...novo, feitos: uniao(local.feitos, nuvem.feitos).sort((x: any, y: any) => x - y) };
  }
  return novo;
}

const status = (s: 'sincronizando' | 'ok' | 'erro') => dispatchEvent(new CustomEvent(EVENTO_STATUS, { detail: s }));

let rodando: Promise<void> | null = null;

/** Busca tudo da nuvem, junta com o aparelho e devolve a diferença para a nuvem. */
export function sincronizarTudo(): Promise<void> {
  return (rodando ??= (async () => {
    const uid = await usuarioId();
    if (!uid) return;
    status('sincronizando');
    try {
      const sb = await getClient();
      const { data, error } = await sb.from(TABELA).select('chave,valor,updated_at').eq('user_id', uid);
      if (error) throw error;
      const ts = lerTs();
      const nuvem = new Map((data ?? []).map((r) => [r.chave as string, r]));
      const locais = Object.keys(localStorage).filter(sincronizavel);
      const enviar: string[] = [];
      let mudouLocal = false;

      for (const k of new Set([...locais, ...nuvem.keys()])) {
        const r = nuvem.get(k);
        const valorLocal = ler<unknown>(k, null);
        if (!r) {
          if (valorLocal != null) {
            if (!ts[k]) marcarTs(k);
            enviar.push(k);
          }
          continue;
        }
        const tNuvem = Date.parse(r.updated_at);
        const tLocal = ts[k] ?? (valorLocal == null ? 0 : 1); // valor antigo sem data: perde para a nuvem
        const final = juntar(k, valorLocal, r.valor, tLocal > tNuvem);
        const sLocal = JSON.stringify(valorLocal);
        const sFinal = JSON.stringify(final);
        if (sFinal !== sLocal) {
          try {
            if (final == null) localStorage.removeItem(k);
            else localStorage.setItem(k, typeof final === 'string' ? final : sFinal);
          } catch {
            /* nada */
          }
          marcarTs(k, Math.max(tLocal, tNuvem));
          mudouLocal = true;
        }
        if (sFinal !== JSON.stringify(r.valor)) {
          marcarTs(k, Date.now());
          enviar.push(k);
        }
      }
      // Caminho da Fé: tem tabela própria e é juntado na página /aprender.
      // Aqui só traz o da conta quando este aparelho ainda não tem nenhum (resumo da home).
      try {
        if (!localStorage.getItem('co-caminho-v1')) {
          const c = await sb.from('caminho_progresso').select('estado').eq('user_id', uid).maybeSingle();
          if (c.data?.estado) {
            localStorage.setItem('co-caminho-v1', JSON.stringify(c.data.estado));
            mudouLocal = true;
          }
        }
      } catch {
        /* segue */
      }
      if (enviar.length) {
        enviar.forEach((k) => pendentes.add(k));
        await enviarPendentes();
      }
      if (mudouLocal) dispatchEvent(new CustomEvent(EVENTO));
      status('ok');
    } catch {
      status('erro');
    } finally {
      rodando = null;
    }
  })());
}

/**
 * Apaga o progresso da conta e deste aparelho.
 * Na nuvem fica uma marca de exclusão por chave, para os outros aparelhos também apagarem ao sincronizar.
 */
export async function apagarTudo(): Promise<boolean> {
  const uid = await usuarioId();
  if (!uid) return false;
  const sb = await getClient();
  const { data, error } = await sb.from(TABELA).select('chave').eq('user_id', uid);
  if (error) return false;
  let locais: string[] = [];
  try {
    locais = Object.keys(localStorage).filter(sincronizavel);
  } catch {
    /* nada */
  }
  const agora = new Date().toISOString();
  const chaves = [...new Set([...(data ?? []).map((r) => r.chave as string), ...locais])];
  if (chaves.length) {
    const r = await sb.from(TABELA).upsert(chaves.map((chave) => ({ user_id: uid, chave, valor: null, updated_at: agora })));
    if (r.error) return false;
  }
  const c = await sb.from('caminho_progresso').delete().eq('user_id', uid);
  try {
    [...locais, 'co-caminho-v1', TS].forEach((k) => localStorage.removeItem(k));
  } catch {
    /* nada */
  }
  dispatchEvent(new CustomEvent(EVENTO));
  return !c.error;
}

/** Chamado uma vez por página (BaseLayout) */
export function iniciarSincronizacao() {
  if (!talvezLogado()) return;
  sincronizarTudo();
  // Voltou para a aba depois de usar outro aparelho
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') sincronizarTudo();
  });
  getClient().then((sb) =>
    sb.auth.onAuthStateChange((e) => {
      if (e === 'SIGNED_IN') sincronizarTudo();
    }),
  );
}
