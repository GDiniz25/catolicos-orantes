/**
 * Tratamento do HTML da liturgia (CNBB). Funciona no build e no navegador,
 * porque usa apenas strings (sem DOM).
 */

const decodeEntities = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** Lista de leituras (ex.: "1ª Leitura: At 2,1-11") a partir do campo "leituras" */
export function extractLeituras(html: string): string[] {
  if (!html) return [];
  const items: string[] = [];
  const re = /<div[^>]*>([\s\S]*?)<\/div>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    let text = decodeEntities(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (!text || text.length <= 3 || text.toLowerCase().startsWith('leitura')) continue;
    text = text.replace(/\s*\(mais\s+(breve|longo)\)/gi, '');
    if (!items.includes(text)) items.push(text);
  }
  return items;
}

/** Ajustes de texto aplicados DEPOIS da sanitização (mesmas regras do site anterior) */
export function tidyLiturgyHtml(sanitized: string): string {
  let cleaned = sanitized.replace(/<img[^>]*>/gi, '');
  cleaned = cleaned.replace(/<font[^>]*>\s*Ou:\s*<\/font>[\s\S]*?EVANGELHO\s*\(mais\s+breve\)[\s\S]*/i, '');
  cleaned = cleaned.replace(/(?:<[^>]*>)*\s*EVANGELHO\s*\(mais\s+breve\)[\s\S]*/i, '');
  cleaned = cleaned.replace(/EVANGELHO\s*\(mais\s+longo\)/gi, 'EVANGELHO');
  cleaned = cleaned.replace(/\s*\*\s*(?=<br|<\/div|<font|\s*$)/gi, ' ');
  cleaned = cleaned.replace(/>\s*\*\s*</g, '> <');
  cleaned = cleaned.replace(/\s*\*\s*$/gm, '');
  return cleaned;
}

/** Texto curto para meta description a partir do corpo da liturgia */
export function liturgySnippet(html: string, max = 155): string {
  const text = decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
