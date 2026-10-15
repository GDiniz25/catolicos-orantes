/**
 * Páginas diárias ("de hoje"): utilidades comuns.
 * Evangelho extraído da liturgia da CNBB, datas relativas (amanhã, próximo domingo) e o menu "Hoje".
 */
import { offsetDate, parseDate, formatDateFull, MONTHS_LOWER } from '@/lib/dateUtils';

/** Menu das páginas diárias, na ordem em que aparecem */
export const PAGINAS_HOJE = [
  { id: 'liturgia', href: '/liturgia-diaria', rotulo: 'Liturgia' },
  { id: 'evangelho', href: '/evangelho-do-dia', rotulo: 'Evangelho' },
  { id: 'santo', href: '/santo-do-dia', rotulo: 'Santo do dia' },
  { id: 'terco', href: '/terco-de-hoje', rotulo: 'Terço de hoje' },
  { id: 'laudes', href: '/laudes-de-hoje', rotulo: 'Laudes' },
  { id: 'vesperas', href: '/vesperas-de-hoje', rotulo: 'Vésperas' },
  { id: 'completas', href: '/completas-de-hoje', rotulo: 'Completas' },
  { id: 'versiculo', href: '/versiculo-do-dia', rotulo: 'Versículo' },
] as const;
export type PaginaHoje = (typeof PAGINAS_HOJE)[number]['id'];

export const amanha = (hoje: string) => offsetDate(hoje, 1);

/** Domingo de hoje (se hoje for domingo) ou o próximo domingo */
export const proximoDomingo = (hoje: string) => {
  const dow = parseDate(hoje).getDay();
  return offsetDate(hoje, dow === 0 ? 0 : 7 - dow);
};

/** "15 de outubro de 2026" (minúsculo, sem dia da semana) */
export const dataPorExtenso = (d: string) => {
  const [y, m, dia] = d.split('-').map(Number);
  return `${dia} de ${MONTHS_LOWER[m - 1]} de ${y}`;
};
/** "quinta-feira, 15 de outubro de 2026" */
export const dataComSemana = (d: string) => formatDateFull(d).replace(/^(\S+)/, (s) => s.toLowerCase()).replace(/ de ([A-ZÇ][a-zç]+) de /, (_, m: string) => ` de ${m.toLowerCase()} de `);
/** "15/10" */
export const dataBarra = (d: string) => {
  const [, m, dia] = d.split('-').map(Number);
  return `${String(dia).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
};

/**
 * Trecho do Evangelho no HTML da liturgia da CNBB (já sanitizado e arrumado).
 * Começa na Aclamação ao Evangelho (ou no título EVANGELHO) e vai até o fim do corpo.
 */
export function evangelhoDoCorpo(corpo: string): string | null {
  if (!corpo) return null;
  const marcas = [/Aclama(ç|&ccedil;)(ã|&atilde;)o ao Evangelho/i, /EVANGELHO\s*<\/center>/i, />\s*EVANGELHO\s*</];
  for (const re of marcas) {
    const m = corpo.match(re);
    if (!m || m.index === undefined) continue;
    // começa na tag <font> que abre o título, se estiver logo antes; assim o HTML não fica cortado no meio
    let ini = corpo.lastIndexOf('<font', m.index);
    if (ini === -1 || m.index - ini > 80) ini = corpo.lastIndexOf('<center', m.index);
    if (ini === -1 || m.index - ini > 80) ini = corpo[m.index] === '>' ? m.index + 1 : m.index;
    const trecho = corpo.slice(ini);
    if (trecho.replace(/<[^>]+>/g, '').trim().length > 80) return trecho;
  }
  return null;
}

/** Referência do Evangelho na lista de leituras (a última que começa com Mt, Mc, Lc ou Jo) */
export function referenciaDoEvangelho(leituras: string[]): string | null {
  const ev = [...leituras].reverse().find((l) => /^(Mt|Mc|Lc|Jo)\s*\d/.test(l.trim()));
  return ev ? ev.trim() : null;
}

/** Nome do evangelista a partir da referência */
export function evangelista(ref: string | null): string | null {
  if (!ref) return null;
  const s = ref.trim().slice(0, 2);
  return ({ Mt: 'Mateus', Mc: 'Marcos', Lc: 'Lucas', Jo: 'João' } as Record<string, string>)[s] ?? null;
}
