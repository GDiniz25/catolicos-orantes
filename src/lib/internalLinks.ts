export interface LinkableArticle {
  slug: string;
  title: string;
  category: string;
  excerpt?: string | null;
}

const STOP = new Set(
  'a o as os de da do das dos e em no na nos nas um uma para por com como que se sua seu suas seus ao aos the passo completa completo guia oração oracao rezar é o que'.split(' ')
);

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ');

const tokens = (s: string) => new Set(norm(s).split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));

/** Rank other articles by topic similarity (title weighs more than excerpt). */
export function findRelated(current: LinkableArticle, all: LinkableArticle[], limit = 6) {
  const cur = tokens(`${current.title} ${current.title} ${current.excerpt || ''}`);
  return all
    .filter((a) => a.slug !== current.slug)
    .map((a) => {
      const t = tokens(a.title);
      const e = tokens(a.excerpt || '');
      let score = 0;
      t.forEach((w) => cur.has(w) && (score += 3));
      e.forEach((w) => cur.has(w) && (score += 1));
      if (a.category === current.category) score += 2;
      return { a, score };
    })
    .filter((x) => x.score > 2)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** Insert "Leia também" link boxes before the 2nd and 4th section headings. */
export function injectInlineLinks(html: string, related: LinkableArticle[]) {
  if (related.length === 0) return html;
  const picks = related.slice(0, 2);
  let h2 = 0;
  let used = 0;
  return html.replace(/<h2[\s>]/gi, (m) => {
    h2++;
    if ((h2 === 2 || h2 === 4) && used < picks.length) {
      const a = picks[used++];
      return `<p class="leia-tambem"><strong>Leia também:</strong> <a href="/${a.category}/${a.slug}">${esc(a.title)}</a></p>${m}`;
    }
    return m;
  });
}
