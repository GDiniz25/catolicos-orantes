import { describe, expect, it } from 'vitest';
import batch from '@/data/artigosProntosLote2.json';

describe('25 ready-written articles', () => {
  it('includes exactly 25 unique full articles', () => {
    expect(batch).toHaveLength(25);
    expect(new Set(batch.map((article) => article.slug)).size).toBe(25);
    for (const article of batch) {
      expect(article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length).toBeGreaterThan(350);
      expect(article.content.match(/<h2>/g)?.length ?? 0).toBeGreaterThanOrEqual(5);
    }
  });

  it('has concise SEO metadata, official references and no inline images', () => {
    for (const article of batch) {
      expect(article.title.length).toBeLessThanOrEqual(60);
      expect(article.meta_description.length).toBeGreaterThanOrEqual(120);
      expect(article.meta_description.length).toBeLessThanOrEqual(155);
      expect(article.content).toContain('https://www.vatican.va/');
      expect(article.content).not.toMatch(/<img|<figure|inteligência artificial/i);
    }
  });
});