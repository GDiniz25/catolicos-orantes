export interface SaintEntry {
  id: string;
  date_month: number;
  date_day: number;
  saint_name: string;
  description: string | null;
  image_url: string | null;
  article_slug: string | null;
  article_category: string | null;
  full_content: string | null;
  vatican_url: string | null;
  scraped_at: string | null;
  created_at?: string | null;
}

export function slugifySaintName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Só o nome do santo (antes da primeira vírgula) */
export const getShortName = (fullName: string) => fullName.split(',')[0].trim();

/** Página de santo tem algum conteúdo? Páginas vazias recebem noindex e saem do sitemap. */
export const saintHasContent = (s: Pick<SaintEntry, 'description' | 'full_content'>) =>
  Boolean(s.full_content?.trim() || s.description?.trim());

/**
 * Página do santo com texto suficiente para ir ao Google.
 * Só a descrição curta (um parágrafo) é conteúdo fino: a página continua no ar, mas fica com noindex
 * e fora do sitemap até ganhar a história completa (full_content).
 */
export const saintIndexavel = (s: Pick<SaintEntry, 'full_content'>) =>
  saintBodyMarkdownWords(s.full_content) >= 150;
const saintBodyMarkdownWords = (md: string | null) =>
  (md || '').replace(/^#{1,6}\s*Oração[\s\S]*$/im, '').replace(/[#*_>\[\]()`-]/g, ' ').split(/\s+/).filter(Boolean).length;

/** Remove a seção de oração do markdown (mesmo comportamento do site anterior) */
export const saintBodyMarkdown = (md: string | null) => {
  const corpo = (md || '').replace(/^#{1,6}\s*Oração[\s\S]*$/im, '').trim();
  // Sem h2 antes do primeiro h3: sobe os h3 de nível (a página não pula de h1 para h3)
  return /^##\s/m.test(corpo) ? corpo : corpo.replace(/^###\s/gm, '## ');
};
