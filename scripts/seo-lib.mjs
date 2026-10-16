import { createClient } from '@supabase/supabase-js';

export const CATEGORIES = [
  'como-rezar-o-terco', 'santos-e-oracoes', 'milagres-eucaristicos', 'catecismo', 'liturgia-das-horas', 'novenas',
  'sacramentos', 'devocoes-marianas', 'calendario-liturgico', 'exame-de-consciencia', 'oracoes-do-dia-a-dia',
  'documentos-da-igreja', 'ladainhas', 'duvidas-da-fe', 'vida-espiritual', 'primeiros-passos', 'casamento',
];
export const STATIC = ['/', '/liturgia-diaria', '/santo-do-dia', '/versiculo-do-dia', '/encontre-na-biblia', '/pedido-de-oracao', '/sugestoes'];

export function env(name, fallback) {
  const v = process.env[name] || fallback;
  if (!v) {
    console.error(`Falta a variável ${name} no .env`);
    process.exit(1);
  }
  return v;
}

export function client(serviceRole = false) {
  const url = env('VITE_SUPABASE_URL', 'https://dialdbrhpqrwilsisnkn.supabase.co');
  const key = serviceRole ? env('SUPABASE_SERVICE_ROLE_KEY') : env('VITE_SUPABASE_PUBLISHABLE_KEY');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function fetchAll(db, table, select, order = 'created_at') {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(select).order(order, { ascending: false }).range(from, from + 999);
    if (error) throw new Error(JSON.stringify(error));
    if (!data?.length) break;
    out.push(...data);
    if (data.length < 1000) break;
  }
  return out;
}

export const stripTags = (h) =>
  (h || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

export const words = (h) => stripTags(h).split(' ').filter(Boolean).length;
export const today = () => new Date().toISOString().slice(0, 10);
