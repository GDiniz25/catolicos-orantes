import { describe, expect, it } from 'vitest';
import { extractLeituras, tidyLiturgyHtml } from './liturgy';
import { addHeadingIds } from './toc';
import { cleanArticleHtml } from './sanitize';
import { clampText } from './seo';
import { slugifySaintName } from './saints';
import { getTodayStr, offsetDate } from './dateUtils';

describe('liturgia', () => {
  it('extrai a lista de leituras sem DOM', () => {
    const html = '<div>Leituras</div><div>1ª Leitura: At 2,1-11</div><div>Evangelho: Jo 20,19-23 (mais breve)</div>';
    expect(extractLeituras(html)).toEqual(['1ª Leitura: At 2,1-11', 'Evangelho: Jo 20,19-23']);
  });
  it('remove o evangelho "mais breve" duplicado', () => {
    const out = tidyLiturgyHtml('<p>EVANGELHO (mais longo)</p><p>texto</p><p>EVANGELHO (mais breve)</p><p>dup</p>');
    expect(out).toContain('<p>EVANGELHO</p><p>texto');
    expect(out).not.toContain('dup');
  });
});

describe('artigos', () => {
  it('remove H1 inicial, imagens e protege links externos', () => {
    const out = cleanArticleHtml('<h1>Título</h1><p>Oi <a href="https://vatican.va">Vaticano</a> <a href="https://catolicosorantes.com.br/novenas">interno</a></p><img src="x.jpg"><script>alert(1)</script>');
    expect(out).not.toContain('<h1');
    expect(out).not.toContain('<img');
    expect(out).not.toContain('<script');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('href="/novenas"');
  });
  it('cria ids únicos nos H2 para o sumário', () => {
    const { html, toc } = addHeadingIds('<h2>Oração</h2><p>a</p><h2>Oração</h2>');
    expect(toc).toHaveLength(2);
    expect(toc[0].id).toBe('oracao');
    expect(toc[1].id).not.toBe('oracao');
    expect(html).toContain('id="oracao"');
  });
});

describe('utilitários', () => {
  it('corta descrição sem quebrar palavra', () => {
    const t = clampText('palavra '.repeat(40), 60);
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t.endsWith('…')).toBe(true);
  });
  it('data de hoje sempre no formato YYYY-MM-DD e navegação entre dias', () => {
    expect(getTodayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(offsetDate('2026-02-28', 1)).toBe('2026-03-01');
    expect(offsetDate('2026-01-01', -1)).toBe('2025-12-31');
  });
  it('gera slug de santo igual ao site anterior', () => {
    expect(slugifySaintName('São João Paulo II, Papa')).toBe('sao-joao-paulo-ii-papa');
  });
});
