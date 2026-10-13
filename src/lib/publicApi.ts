/**
 * Acesso leve ao Supabase (REST) para as páginas públicas.
 * Evita carregar o pacote supabase-js inteiro no navegador do visitante.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/site';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function insertRow(table: string, row: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
}

export async function upsertRow(table: string, row: Record<string, unknown>, onConflict: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  });
}

/** GET simples no PostgREST. `query` no formato "select=*&date=eq.2026-01-01" */
export async function selectRows<T>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export const functionsUrl = (name: string) => `${SUPABASE_URL}/functions/v1/${name}`;
export const anonAuthHeader = `Bearer ${SUPABASE_ANON_KEY}`;
