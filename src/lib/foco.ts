/**
 * Ponto de foco de cada imagem (tabela image_focus, calculada por scripts/imagens-foco.mjs).
 * Devolve o valor de object-position para cortar com object-cover sem perder o rosto ou o objeto.
 * Sem foco calculado, usa o padrão: centro na horizontal e um pouco acima do meio (rostos ficam no alto).
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/site';

export const FOCO_PADRAO = '50% 25%';
let mapa: Promise<Map<string, string>> | null = null;

async function carregar(): Promise<Map<string, string>> {
  const m = new Map<string, string>();
  try {
    for (let de = 0; ; de += 1000) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/image_focus?select=url,foco&order=url`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Range: `${de}-${de + 999}` },
      });
      if (!res.ok) break;
      const lote = (await res.json()) as { url: string; foco: string }[];
      lote.forEach((r) => m.set(r.url, r.foco));
      if (lote.length < 1000) break;
    }
  } catch {
    /* sem tabela: todas usam o padrão */
  }
  return m;
}

export async function focoDe(url: string | null | undefined): Promise<string> {
  if (!url) return FOCO_PADRAO;
  return (await (mapa ??= carregar())).get(url) ?? FOCO_PADRAO;
}
