/**
 * Login compartilhado entre catolicosorantes.com.br e app.catolicosorantes.com.br.
 *
 * O Supabase guarda a sessão no localStorage, que é separado por endereço: entrar no portal
 * não valia no app. Aqui a sessão fica num cookie do domínio .catolicosorantes.com.br,
 * lido pelos dois. Um só login, uma só sessão (sem dois clientes renovando tokens em paralelo).
 *
 * O cookie é dividido em partes porque o navegador limita cada cookie a uns 4 KB.
 * ESTE ARQUIVO É IGUAL NOS DOIS PROJETOS (portal e app): altere nos dois.
 */
const DOMINIO_RAIZ = 'catolicosorantes.com.br';
const TAM_PARTE = 3000;
const MAX_PARTES = 6;
const UM_ANO = 60 * 60 * 24 * 365;

function noDominio(): boolean {
  return typeof location !== 'undefined' && (location.hostname === DOMINIO_RAIZ || location.hostname.endsWith(`.${DOMINIO_RAIZ}`));
}

function atributos(maxAge: number): string {
  const dominio = noDominio() ? `; Domain=.${DOMINIO_RAIZ}` : '';
  const seguro = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  return `; Path=/; Max-Age=${maxAge}; SameSite=Lax${dominio}${seguro}`;
}

function lerCookies(): Map<string, string> {
  const mapa = new Map<string, string>();
  if (typeof document === 'undefined') return mapa;
  for (const par of document.cookie.split('; ')) {
    const i = par.indexOf('=');
    if (i > 0) mapa.set(par.slice(0, i), par.slice(i + 1));
  }
  return mapa;
}

function lerCookie(chave: string): string | null {
  const c = lerCookies();
  const partes: string[] = [];
  for (let i = 0; i < MAX_PARTES; i++) {
    const p = c.get(`${chave}.${i}`);
    if (p === undefined) break;
    partes.push(p);
  }
  if (!partes.length) return null;
  try {
    return decodeURIComponent(partes.join(''));
  } catch {
    return null;
  }
}

function gravarCookie(chave: string, valor: string) {
  const codificado = encodeURIComponent(valor);
  const partes: string[] = [];
  for (let i = 0; i < codificado.length; i += TAM_PARTE) partes.push(codificado.slice(i, i + TAM_PARTE));
  if (partes.length > MAX_PARTES) return false;
  partes.forEach((p, i) => { document.cookie = `${chave}.${i}=${p}${atributos(UM_ANO)}`; });
  for (let i = partes.length; i < MAX_PARTES; i++) document.cookie = `${chave}.${i}=${atributos(0)}`;
  return true;
}

function apagarCookie(chave: string) {
  for (let i = 0; i < MAX_PARTES; i++) document.cookie = `${chave}.${i}=${atributos(0)}`;
}

function local(): Storage | null {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; }
}

/** Armazenamento para o supabase-js (opção auth.storage) */
export const armazenamentoCompartilhado = {
  getItem(chave: string): string | null {
    const doCookie = lerCookie(chave);
    if (doCookie !== null) return doCookie;
    // Sessão antiga (de antes do login compartilhado) passa para o cookie
    const antigo = local()?.getItem(chave) ?? null;
    if (antigo !== null && gravarCookie(chave, antigo)) local()?.removeItem(chave);
    return antigo;
  },
  setItem(chave: string, valor: string) {
    if (!gravarCookie(chave, valor)) local()?.setItem(chave, valor); // grande demais: fica só neste endereço
    else local()?.removeItem(chave);
  },
  removeItem(chave: string) {
    apagarCookie(chave);
    local()?.removeItem(chave);
  },
};

/** Há sessão salva (cookie compartilhado ou a antiga do localStorage)? Não baixa o supabase-js. */
export function temSessaoSalva(projectRef: string): boolean {
  const chave = `sb-${projectRef}-auth-token`;
  if (lerCookies().has(`${chave}.0`)) return true;
  return Boolean(local()?.getItem(chave));
}
