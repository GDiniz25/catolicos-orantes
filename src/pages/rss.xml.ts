import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getAllArticles } from '@/lib/data';
import { SITE_NAME, SITE_DESCRIPTION, categoryLabel } from '@/config/site';

export const GET: APIRoute = async (context) => {
  const articles = (await getAllArticles()).slice(0, 50);
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site!,
    trailingSlash: false,
    items: articles.map((a) => ({
      title: a.title,
      link: `/${a.category}/${a.slug}`,
      pubDate: new Date(a.created_at || a.updated_at || Date.now()),
      description: a.meta_description || a.excerpt || '',
      categories: [categoryLabel(a.category)],
    })),
    customData: '<language>pt-br</language>',
  });
};
