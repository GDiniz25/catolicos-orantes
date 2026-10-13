/**
 * Extrai do HTML do artigo (já sanitizado) dados para o JSON-LD:
 * perguntas frequentes e fontes citadas.
 */
const strip = (h: string) =>
  h
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/**
 * FAQ: dentro da seção "Perguntas frequentes" (h2), cada h3 é a pergunta e os <p>
 * seguintes são a resposta. Fora dela, h2 terminando em "?" + primeiro parágrafo também contam.
 */
export function extractFaq(html: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const seen = new Set<string>();
  const push = (q: string, a: string) => {
    q = strip(q);
    a = strip(a);
    if (q.length < 8 || a.length < 30 || seen.has(q)) return;
    seen.add(q);
    out.push({ q, a: a.slice(0, 600) });
  };

  const faqSection = html.match(/<h2[^>]*>\s*perguntas frequentes[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i);
  if (faqSection) {
    const re = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(faqSection[1]))) push(m[1], m[2]);
  }
  const re2 = /<h2[^>]*>([^<]*\?)\s*<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m2: RegExpExecArray | null;
  while ((m2 = re2.exec(html))) push(m2[1], m2[2]);
  return out.slice(0, 10);
}

/** Fontes: links externos na seção "Fontes" (ou, na falta dela, todos os links externos). */
export function extractSources(html: string): { href: string; label: string }[] {
  const section = html.match(/<h2[^>]*>\s*fontes[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i);
  const scope = section ? section[1] : html;
  const out: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  const re = /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(scope))) {
    const href = m[1];
    if (href.includes('catolicosorantes.com.br') || seen.has(href)) continue;
    seen.add(href);
    out.push({ href, label: strip(m[2]) });
  }
  return out.slice(0, 12);
}
