import { supabase } from '@/lib/supabase';
import { sections } from '@/data/sections';

const SITE_URL = 'https://catolicosorantes.com.br';

export async function generateSitemap(): Promise<string> {
  // Fetch all published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, category, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  const now = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
  </url>
`;

  // Category pages
  for (const section of sections) {
    xml += `  <url>
    <loc>${SITE_URL}${section.href}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_URL}${section.href}" />
  </url>
`;
  }

  // Individual article pages
  if (articles) {
    for (const article of articles) {
      const lastmod = article.updated_at
        ? new Date(article.updated_at).toISOString().split('T')[0]
        : now;
      xml += `  <url>
    <loc>${SITE_URL}/${article.category}/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_URL}/${article.category}/${article.slug}" />
  </url>
`;
    }
  }

  xml += `</urlset>`;
  return xml;
}

export function downloadSitemap(xml: string) {
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * O "ping" de sitemap do Google foi desativado em 2023 e o do Bing não é mais aceito.
 * O sitemap agora é gerado no build e lido automaticamente pelos buscadores
 * (está no robots.txt e no Search Console). Mantido só por compatibilidade.
 */
export async function pingSitemapToSearchEngines(): Promise<void> {
  return;
}
