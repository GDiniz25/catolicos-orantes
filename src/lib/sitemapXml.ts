import { imagemDoLivro, livrosComReflexao, todasReflexoes } from '@/lib/bibliaReflexoes';
import { SITE_URL, CATEGORIES, STATIC_PAGES } from '@/config/site';
import { getAllArticles, getSaintsWithSlug, getSaintsByDate, getLiturgiaJanela } from '@/lib/data';
import { saintIndexavel } from '@/lib/saints';
import { getTodayStr, dataSlug, diaMesSlug, todosOsDias, offsetDate } from '@/lib/dateUtils';
import { evangelhoDoCorpo } from '@/lib/hoje';
import { sanitizeLiturgyServer } from '@/lib/sanitize';
import { tidyLiturgyHtml } from '@/lib/liturgy';
import { ANOS_DATAS } from '@/lib/datasLiturgicas';
import nomesSantos from '@/data/conteudo/nomes.json';
import padroeirosLista from '@/data/conteudo/padroeiros.json';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  image?: string | null;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const day = (d?: string | null) => {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
};

export function urlset(urls: SitemapUrl[]): string {
  const body = urls
    .map((u) => {
      const parts = [`<loc>${esc(SITE_URL + (u.loc === '/' ? '' : u.loc))}</loc>`];
      if (u.lastmod) parts.push(`<lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) parts.push(`<changefreq>${u.changefreq}</changefreq>`);
      if (u.priority !== undefined) parts.push(`<priority>${u.priority.toFixed(1)}</priority>`);
      if (u.image) parts.push(`<image:image><image:loc>${esc(u.image)}</image:loc></image:image>`);
      return `<url>${parts.join('')}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`;
}

export function sitemapIndex(entries: { loc: string; lastmod?: string }[]): string {
  const body = entries
    .map((e) => `<sitemap><loc>${esc(SITE_URL + e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</sitemap>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}

/** Todos os sitemaps "filhos" e suas URLs (mesmos nomes de arquivo do site antigo) */
export async function buildSitemaps(): Promise<Record<string, SitemapUrl[]>> {
  const today = `${getTodayStr()}T03:00:00.000Z`;
  const articles = await getAllArticles();
  const out: Record<string, SitemapUrl[]> = {};

  const latestByCat: Record<string, string | undefined> = {};
  for (const a of articles) {
    const lm = day(a.updated_at) ?? day(a.created_at);
    if (lm && (!latestByCat[a.category] || lm > latestByCat[a.category]!)) latestByCat[a.category] = lm;
  }

  out.pages = [
    ...STATIC_PAGES.map((p) => ({
      loc: p.path,
      changefreq: p.changefreq,
      priority: p.priority,
      lastmod: p.changefreq === 'daily' ? today : undefined,
    })),
    ...CATEGORIES.map((c) => ({ loc: `/${c.slug}`, changefreq: 'weekly', priority: 0.8, lastmod: latestByCat[c.slug] })),
  ];

  out.ferramentas = [
    ...ANOS_DATAS.map((a) => ({ loc: `/datas-liturgicas/${a}`, changefreq: 'yearly', priority: 0.6 })),
    ...nomesSantos.map((n) => ({ loc: `/nomes-de-santos/${n.slug}`, changefreq: 'yearly', priority: 0.5 })),
    ...padroeirosLista.map((p) => ({ loc: `/padroeiros/${p.slug}`, changefreq: 'yearly', priority: 0.6 })),
    ...['casados', 'jovens', 'criancas', 'primeira-confissao'].map((p) => ({ loc: `/exame-de-consciencia/${p}`, changefreq: 'yearly', priority: 0.6 })),
  ];

  const biblia = todasReflexoes();
  if (biblia.length) {
    out.biblia = [
      { loc: '/biblia', changefreq: 'weekly', priority: 0.7 },
      ...livrosComReflexao().map((l) => ({ loc: `/biblia/${l.slug}`, changefreq: 'monthly', priority: 0.6 })),
      ...biblia.map((r) => ({ loc: `/biblia/${r.livro}/${r.cap}`, changefreq: 'yearly', priority: 0.6, image: imagemDoLivro(r.livro) ? `${SITE_URL}${imagemDoLivro(r.livro)!.src}` : null })),
    ];
  }

  for (const c of CATEGORIES) {
    const list = articles.filter((a) => a.category === c.slug);
    if (!list.length) continue;
    out[c.slug] = list.map((a) => ({
      loc: `/${a.category}/${a.slug}`,
      lastmod: day(a.updated_at) ?? day(a.created_at),
      changefreq: 'weekly',
      priority: 0.7,
      image: a.image_url || null,
    }));
  }

  const saints = (await getSaintsWithSlug()).filter(saintIndexavel);
  if (saints.length) {
    out.santos = saints.map((s) => ({
      loc: `/santos/${s.slug}`,
      lastmod: day(s.scraped_at) ?? day(s.created_at),
      changefreq: 'monthly',
      priority: 0.6,
    }));
  }
  // Liturgia por data (janela em volta de hoje)
  // Só a semana em volta de hoje (7 dias antes, 3 depois): as outras datas continuam no ar,
  // mas fora do sitemap, para o Google gastar o rastreamento com os artigos
  const hojeJ = getTodayStr();
  const janela = (await getLiturgiaJanela()).filter((j) => j.date >= offsetDate(hojeJ, -7) && j.date <= offsetDate(hojeJ, 3));
  if (janela.length) {
    // lastmod = o próprio dia (passado) ou hoje (futuro): o Google prioriza o que é do dia
    const hojeDia = getTodayStr();
    const mod = (d: string) => (d < hojeDia ? `${d}T03:00:00.000Z` : today);
    out.liturgia = janela.map((j) => ({ loc: `/liturgia-diaria/${dataSlug(j.date)}`, lastmod: mod(j.date), changefreq: 'daily', priority: j.date === hojeDia ? 0.9 : 0.6 }));
    out.evangelho = janela
      .filter((j) => evangelhoDoCorpo(tidyLiturgyHtml(sanitizeLiturgyServer(j.liturgia.body))))
      .map((j) => ({ loc: `/evangelho-do-dia/${dataSlug(j.date)}`, lastmod: mod(j.date), changefreq: 'daily', priority: j.date === hojeDia ? 0.9 : 0.6 }));
    out['liturgia-das-horas-do-dia'] = janela.map((j) => ({ loc: `/liturgia-das-horas-do-dia/${dataSlug(j.date)}`, lastmod: mod(j.date), changefreq: 'daily', priority: 0.5 }));
  }

  // Santo do dia: 366 páginas fixas (só datas com santos cadastrados)
  const dias: SitemapUrl[] = [];
  for (const d of todosOsDias()) {
    if ((await getSaintsByDate(d.month, d.day)).length) {
      dias.push({ loc: `/santo-do-dia/${diaMesSlug(d.month, d.day)}`, changefreq: 'yearly', priority: 0.7 });
    }
  }
  if (dias.length) out['santo-do-dia'] = dias;
  return out;
}

export const xmlResponse = (xml: string) =>
  new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
