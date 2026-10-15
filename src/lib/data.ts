/**
 * Camada de dados usada SOMENTE no build (Node).
 * Busca tudo no Supabase uma única vez e guarda em memória,
 * para que centenas de páginas sejam geradas sem repetir consultas.
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, CATEGORY_SLUGS } from '@/config/site';
import type { Article } from '@/types/content';
import { slugifySaintName, type SaintEntry } from '@/lib/saints';

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Só o build grava o cache da liturgia, com a chave de serviço do .env
 * (nunca vai para o navegador: não tem prefixo PUBLIC_ nem VITE_).
 * Sem a chave, o build continua funcionando: só não guarda o cache.
 */
const chaveServico = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
const dbEscrita = chaveServico
  ? createClient(SUPABASE_URL, chaveServico, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

const PAGE = 1000;

async function fetchAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build(from, from + PAGE - 1);
    if (error) throw new Error(`[supabase] ${JSON.stringify(error)}`);
    if (!data || data.length === 0) break;
    out.push(...data);
    if (data.length < PAGE) break;
  }
  return out;
}

let articlesPromise: Promise<Article[]> | null = null;

/** Todos os artigos publicados, do mais novo para o mais antigo. */
export function getAllArticles(): Promise<Article[]> {
  if (!articlesPromise) {
    articlesPromise = fetchAll<Article>((from, to) =>
      db
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(from, to),
    ).then((rows) => {
      // Apenas categorias conhecidas geram página (evita URLs órfãs)
      const valid = rows.filter((a) => a.slug && CATEGORY_SLUGS.includes(a.category));
      // Slug duplicado: mantém o mais recente
      const seen = new Set<string>();
      return valid.filter((a) => {
        const key = `${a.category}/${a.slug}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
  }
  return articlesPromise;
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  return (await getAllArticles()).filter((a) => a.category === category);
}

let articleKeys: Set<string> | null = null;

/** O artigo existe (publicado) e terá página gerada? */
export async function articleExists(category?: string | null, slug?: string | null): Promise<boolean> {
  if (!category || !slug) return false;
  if (!articleKeys) articleKeys = new Set((await getAllArticles()).map((a) => `${a.category}/${a.slug}`));
  return articleKeys.has(`${category}/${slug}`);
}

let saintsPromise: Promise<SaintEntry[]> | null = null;

export function getAllSaints(): Promise<SaintEntry[]> {
  if (!saintsPromise) {
    saintsPromise = fetchAll<SaintEntry>((from, to) =>
      db
        .from('saints_calendar')
        .select('*')
        .order('date_month')
        .order('date_day')
        .order('saint_name')
        .range(from, to),
    );
  }
  return saintsPromise;
}

/**
 * Todos os santos com slug único. O primeiro registro de cada nome mantém a URL
 * de sempre (/santos/nome); nomes repetidos em outra data ganham "-dia-mes".
 */
export async function getSaintsWithSlug(): Promise<(SaintEntry & { slug: string })[]> {
  const all = await getAllSaints();
  const seen = new Set<string>();
  const out: (SaintEntry & { slug: string })[] = [];
  for (const s of all) {
    const base = slugifySaintName(s.saint_name);
    if (!base) continue;
    let slug = base;
    if (seen.has(slug)) slug = `${base}-${s.date_day}-${s.date_month}`;
    if (seen.has(slug)) continue; // registro realmente duplicado (mesmo nome, mesma data)
    seen.add(slug);
    out.push({ ...s, slug });
  }
  return out;
}

export async function getSaintsByDate(month: number, day: number) {
  return (await getSaintsWithSlug()).filter((s) => s.date_month === month && s.date_day === day);
}

export async function getSaintsByMonth(month: number) {
  return (await getSaintsWithSlug()).filter((s) => s.date_month === month);
}

// ---------------- Liturgia diária ----------------

export interface LiturgiaData {
  date: string;
  title: string;
  color: string;
  details: string;
  body: string;
  leituras: string;
}

const liturgiaCache = new Map<string, Promise<LiturgiaData | null>>();

/** Busca a liturgia do dia (com memória durante o build). */
export function getLiturgia(date: string): Promise<LiturgiaData | null> {
  if (!liturgiaCache.has(date)) liturgiaCache.set(date, buscarLiturgia(date));
  return liturgiaCache.get(date)!;
}

/** Primeiro no cache do Supabase, depois na API da CNBB. */
async function buscarLiturgia(date: string): Promise<LiturgiaData | null> {
  try {
    const { data } = await db.from('daily_liturgy_cache').select('*').eq('date', date).maybeSingle();
    if (data?.body) {
      return { date: data.date, title: data.title, color: data.color, details: data.details, body: data.body, leituras: data.leituras || '' };
    }
  } catch {
    /* segue para a API */
  }
  try {
    const res = await fetch(`https://api-liturgia.edicoescnbb.com.br/contents/in/date/${date}`, {
      // A API passou a responder só a pedidos vindos de sites autorizados (o navegador manda o Origin sozinho;
      // no build, em Node, mandamos o do próprio site). Sem isso, a liturgia some do HTML e o Google vê a página vazia.
      headers: { Accept: 'application/json, text/plain, */*', Origin: 'https://catolicosorantes.com.br', Referer: 'https://catolicosorantes.com.br/liturgia-diaria' },
    });
    if (!res.ok) {
      console.warn(`[liturgia] ${date}: API respondeu ${res.status}`);
      return null;
    }
    const json = await res.json();
    const content = json?.content as LiturgiaData | undefined;
    if (!content?.body) return null;
    try {
      if (dbEscrita) await dbEscrita.from('daily_liturgy_cache').upsert(
        {
          date,
          title: content.title,
          color: content.color,
          details: content.details,
          body: content.body,
          leituras: content.leituras || '',
          fetched_at: new Date().toISOString(),
        },
        { onConflict: 'date' },
      );
    } catch {
      /* cache é opcional */
    }
    return { ...content, date };
  } catch {
    return null;
  }
}

// ---------- Liturgia por data (janela de dias em volta de hoje) ----------

import { getTodayStr as _hoje, offsetDate as _offset } from '@/lib/dateUtils';

let janelaPromise: Promise<{ date: string; liturgia: LiturgiaData }[]> | null = null;

/**
 * Páginas de liturgia por data.
 * Para trás: todos os dias desde o lançamento do site novo (até 120 dias), para as páginas que o Google
 * já indexou continuarem existindo. Para a frente: 10 dias, para o Google encontrar a página do dia
 * antes de o dia chegar. Dias que a API não devolver ficam de fora.
 */
const INICIO_LITURGIA = '2026-10-01';
export function getLiturgiaJanela(depois = 10, maxAntes = 120) {
  if (!janelaPromise) {
    janelaPromise = (async () => {
      const hoje = _hoje();
      const desdeInicio = Math.round((Date.parse(`${hoje}T12:00:00Z`) - Date.parse(`${INICIO_LITURGIA}T12:00:00Z`)) / 86400000);
      const antes = Math.max(7, Math.min(maxAntes, desdeInicio));
      const primeiro = _offset(hoje, -antes);
      const ultimo = _offset(hoje, depois);
      // Uma consulta só para o que já está no cache (o resto vem da API da CNBB)
      try {
        const { data } = await db.from('daily_liturgy_cache').select('*').gte('date', primeiro).lte('date', ultimo);
        for (const row of data ?? []) {
          if (row?.body && !liturgiaCache.has(row.date)) {
            liturgiaCache.set(row.date, Promise.resolve({ date: row.date, title: row.title, color: row.color, details: row.details, body: row.body, leituras: row.leituras || '' }));
          }
        }
      } catch {
        /* segue dia a dia */
      }
      const out: { date: string; liturgia: LiturgiaData }[] = [];
      for (let i = -antes; i <= depois; i++) {
        const date = _offset(hoje, i);
        const liturgia = await getLiturgia(date);
        if (liturgia) out.push({ date, liturgia });
      }
      return out;
    })();
  }
  return janelaPromise;
}
