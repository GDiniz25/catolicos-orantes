import type { APIRoute } from 'astro';
import { getAllArticles } from '@/lib/data';

/** Índice de busca do cabeçalho (gerado no build, só com artigos publicados) */
export const GET: APIRoute = async () => {
  const data = (await getAllArticles()).map((a) => ({
    t: a.title,
    s: a.slug,
    c: a.category,
    e: (a.excerpt || '').slice(0, 140),
  }));
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
