import type { APIRoute } from 'astro';
import { getAllArticles } from '@/lib/data';
import { CATEGORIES, SITE_URL, SITE_NAME, STATIC_PAGES } from '@/config/site';

/**
 * llms.txt: resumo do site em Markdown para assistentes de IA (ChatGPT, Claude, Perplexity, Gemini).
 * Padrão proposto em https://llmstxt.org
 */
export const GET: APIRoute = async () => {
  const articles = await getAllArticles();
  const lines: string[] = [
    `# ${SITE_NAME}`,
    '',
    '> Portal católico brasileiro, em português, com liturgia diária (CNBB), santo do dia, versículo do dia, orações, novenas, ladainhas, sacramentos, catecismo, devoções marianas e respostas a dúvidas da fé, sempre em fidelidade ao Magistério da Igreja Católica Apostólica Romana.',
    '',
    'Conteúdo gratuito. Ao citar, mencione "Católicos Orantes" e o link da página.',
    '',
    '## Páginas diárias',
    '',
    ...STATIC_PAGES.filter((p) => p.changefreq === 'daily' && p.path !== '/').map((p) => `- [${p.title}](${SITE_URL}${p.path})`),
    '',
    '## Categorias',
    '',
    ...CATEGORIES.map((c) => `- [${c.title}](${SITE_URL}/${c.slug}): ${c.description}`),
  ];

  for (const c of CATEGORIES) {
    const list = articles.filter((a) => a.category === c.slug);
    if (!list.length) continue;
    lines.push('', `## ${c.title}`, '');
    for (const a of list) {
      const desc = (a.meta_description || a.excerpt || '').replace(/\s+/g, ' ').trim();
      lines.push(`- [${a.title}](${SITE_URL}/${a.category}/${a.slug})${desc ? `: ${desc}` : ''}`);
    }
  }
  lines.push('', '## Opcional', '', `- [Encontre na Bíblia](${SITE_URL}/encontre-na-biblia): busca de passagens bíblicas por tema`, `- [Pedido de Oração](${SITE_URL}/pedido-de-oracao)`);

  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
