import { SITE_URL, SITE_NAME, LOGO_URL } from '@/config/site';

export const absUrl = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path === '/' ? '' : path}`);

export const publisherRef = { '@id': `${SITE_URL}/#organization` };

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL, width: 600, height: 168 },
  description: 'Portal católico com orações, santos, sacramentos, catecismo e doutrina da Igreja Católica Apostólica Romana.',
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description:
    'Guia completo sobre a fé católica: como rezar o terço, santos, milagres eucarísticos, sacramentos, catecismo e orações do dia a dia.',
  publisher: publisherRef,
  inLanguage: 'pt-BR',
};

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absUrl(c.path),
  })),
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const itemListSchema = (items: { name: string; path: string }[]) => ({
  '@type': 'ItemList',
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: absUrl(it.path),
    name: it.name,
  })),
});

/** Limita texto para meta description sem cortar palavra no meio */
export const clampText = (text: string, max = 158) => {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length).trimEnd()}…`;
};

/** ISO 8601 seguro */
export const isoDate = (d?: string | null) => {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
};
