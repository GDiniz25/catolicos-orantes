import type { APIRoute } from 'astro';
import { buildSitemaps, sitemapIndex, xmlResponse } from '@/lib/sitemapXml';

export const GET: APIRoute = async () => {
  const maps = await buildSitemaps();
  const now = new Date().toISOString();
  return xmlResponse(
    sitemapIndex(
      Object.entries(maps).map(([name, urls]) => ({
        loc: `/sitemap-${name}.xml`,
        lastmod: urls.map((u) => u.lastmod).filter(Boolean).sort().pop() ?? now,
      })),
    ),
  );
};
