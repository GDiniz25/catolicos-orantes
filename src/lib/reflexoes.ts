/**
 * Reflexões do Evangelho (tabela evangelho_reflexao no Supabase). Usado SOMENTE no build.
 * Só as reflexões revisadas aparecem no site. Sem reflexão ou com erro, devolve null e a página segue sem ela.
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/site';
import { cleanArticleHtml } from '@/lib/sanitize';

// Mesmo cliente de leitura de src/lib/data.ts (lá ele não é exportado)
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export interface Reflexao {
  date: string;
  referencia: string | null;
  titulo: string | null;
  /** HTML já sanitizado, pronto para set:html */
  texto_html: string;
  revisado: boolean;
}

const cache = new Map<string, Promise<Reflexao | null>>();

async function buscarReflexao(date: string): Promise<Reflexao | null> {
  try {
    const { data, error } = await db
      .from('evangelho_reflexao')
      .select('date, referencia, titulo, texto_html, revisado')
      .eq('date', date)
      .eq('revisado', true)
      .maybeSingle();
    if (error || !data?.texto_html || data.revisado !== true) return null;
    const html = cleanArticleHtml(String(data.texto_html));
    if (!html.replace(/<[^>]+>/g, '').trim()) return null;
    return {
      date: String(data.date),
      referencia: data.referencia ? String(data.referencia) : null,
      titulo: data.titulo ? String(data.titulo) : null,
      texto_html: html,
      revisado: true,
    };
  } catch {
    return null;
  }
}

/** Reflexão revisada do Evangelho da data (AAAA-MM-DD), com memória durante o build. */
export function getReflexao(date: string): Promise<Reflexao | null> {
  if (!cache.has(date)) cache.set(date, buscarReflexao(date));
  return cache.get(date)!;
}
