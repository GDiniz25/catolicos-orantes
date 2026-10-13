import { describe, expect, it } from 'vitest';
import { stripArticleMedia } from './articleMedia';

describe('cover-only article text', () => {
  it('removes figures, standalone images and the previous generated-image credit', () => {
    const html = '<p>Texto <a href="/sacramentos">link</a></p><figure><img src="photo.jpg"><figcaption>Foto</figcaption></figure><img src="other.jpg"><p><small>Imagem ilustrativa gerada por inteligência artificial; não retrata uma celebração ou paróquia real.</small></p>';
    expect(stripArticleMedia(html)).toBe('<p>Texto <a href="/sacramentos">link</a></p>');
  });
  it('preserves ordinary editorial text and is idempotent', () => {
    const html = '<h2>O Batismo</h2><p>Doutrina da Igreja.</p>';
    expect(stripArticleMedia(stripArticleMedia(html))).toBe(html);
  });
});