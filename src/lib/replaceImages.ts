import { supabase } from './supabase';
import { searchImages } from './unsplash';
import { uploadImageFromUrl } from './storage';

/**
 * Regenerates ALL images for every article in a category,
 * ensuring no image is reused across articles.
 */
export async function regenerateAllImagesInCategory(
  category: string,
  onProgress?: (current: number, total: number, articleTitle: string) => void
): Promise<{ updated: number; errors: string[] }> {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, content, image_url')
    .eq('category', category);

  if (error || !articles || articles.length === 0) {
    return { updated: 0, errors: [error?.message || 'Nenhum artigo encontrado'] };
  }

  const globalUsedUnsplashIds = new Set<string>();
  let updated = 0;
  const errors: string[] = [];

  // Diverse Portuguese search terms to maximize variety
  const searchTermPool = [
    'oração católica',
    'rosário terço maria',
    'igreja católica interior',
    'santa missa altar',
    'bíblia sagrada católica',
    'capela católica velas',
    'cruz crucifixo católico',
    'virgem maria devoção',
    'sacramento eucaristia',
    'catedral católica',
    'mosteiro religioso',
    'vitral igreja católica',
    'anjo católico escultura',
    'santuário católico',
    'procissão religiosa católica',
    'padre rezando missa',
    'santo católico estátua',
    'católico rezando',
    'fé esperança religião',
    'comunhão católica',
  ];

  function getUnsplashId(url: string): string {
    const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  }

  for (let a = 0; a < articles.length; a++) {
    const article = articles[a];
    onProgress?.(a + 1, articles.length, article.title);

    try {
      // Find all images in article content
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
      const contentImages: string[] = [];
      let match;
      const content = article.content || '';
      while ((match = imgRegex.exec(content)) !== null) {
        contentImages.push(match[1]);
      }

      // We need to replace each image with a unique new one
      const totalImagesNeeded = contentImages.length + (article.image_url ? 1 : 0);
      const newImages: string[] = [];

      // Build unique search queries for this article
      const articleQueries = [
        `${article.title}`,
        ...searchTermPool.slice(a * 3 % searchTermPool.length, a * 3 % searchTermPool.length + 4),
        ...searchTermPool.slice((a * 7 + 5) % searchTermPool.length, (a * 7 + 5) % searchTermPool.length + 3),
      ];

      // Search and collect unique images
      for (const query of articleQueries) {
        if (newImages.length >= totalImagesNeeded) break;
        
        const results = await searchImages(query, 8);
        for (const img of results) {
          if (newImages.length >= totalImagesNeeded) break;
          const unsplashId = getUnsplashId(img.url);
          if (globalUsedUnsplashIds.has(unsplashId)) continue;

          // Upload to storage
          const fileName = `${article.slug}/img-new-${newImages.length + 1}-${Date.now()}`;
          const storedUrl = await uploadImageFromUrl(img.url, fileName);
          if (storedUrl) {
            newImages.push(storedUrl);
            globalUsedUnsplashIds.add(unsplashId);
          }
        }
        
        // Rate limit
        await new Promise((r) => setTimeout(r, 1500));
      }

      if (newImages.length === 0) {
        errors.push(`${article.title}: nenhuma imagem nova encontrada`);
        continue;
      }

      // Replace images in content
      let newContent = content;
      for (let i = 0; i < contentImages.length; i++) {
        const replacement = newImages[i % newImages.length];
        newContent = newContent.split(contentImages[i]).join(replacement);
      }

      // Replace cover image
      const newCover = newImages[0] || article.image_url;

      const { error: updateError } = await supabase
        .from('articles')
        .update({ content: newContent, image_url: newCover })
        .eq('id', article.id);

      if (updateError) {
        errors.push(`${article.title}: ${updateError.message}`);
      } else {
        updated++;
      }
    } catch (err) {
      errors.push(`${article.title}: ${err instanceof Error ? err.message : 'Erro'}`);
    }

    // Delay between articles
    if (a < articles.length - 1) {
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  return { updated, errors };
}
