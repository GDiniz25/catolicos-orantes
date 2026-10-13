import type { APIRoute, GetStaticPaths } from 'astro';
import { buildSitemaps, urlset, xmlResponse, type SitemapUrl } from '@/lib/sitemapXml';

export const getStaticPaths: GetStaticPaths = async () => {
  const maps = await buildSitemaps();
  return Object.entries(maps).map(([name, urls]) => ({ params: { name }, props: { urls } }));
};

export const GET: APIRoute = ({ props }) => xmlResponse(urlset((props as { urls: SitemapUrl[] }).urls));
