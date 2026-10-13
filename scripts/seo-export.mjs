/**
 * Exporta TODOS os artigos do Supabase para seo/export/artigos-AAAA-MM-DD.json
 * Uso: npm run seo:export
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { client, fetchAll, words, stripTags, today } from './seo-lib.mjs';

const db = client(false);
const articles = await fetchAll(db, 'articles', '*');
const saints = await fetchAll(db, 'saints_calendar', 'id,date_month,date_day,saint_name,description,article_slug,article_category,vatican_url,full_content', 'date_month');

mkdirSync('seo/export', { recursive: true });
const file = `seo/export/artigos-${today()}.json`;
writeFileSync(file, JSON.stringify(articles, null, 1));
writeFileSync(`seo/export/santos-${today()}.json`, JSON.stringify(saints, null, 1));

const csv = [
  ['slug', 'categoria', 'publicado', 'palavras', 'titulo', 'tamanho_titulo', 'tamanho_meta', 'criado_em', 'atualizado_em'].join(';'),
  ...articles.map((a) =>
    [a.slug, a.category, a.published ? 'sim' : 'nao', words(a.content), `"${(a.title || '').replace(/"/g, '""')}"`, (a.title || '').length, (a.meta_description || '').length, (a.created_at || '').slice(0, 10), (a.updated_at || '').slice(0, 10)].join(';'),
  ),
].join('\n');
writeFileSync(`seo/export/resumo-${today()}.csv`, '﻿' + csv);

const pub = articles.filter((a) => a.published).length;
console.log(`\n${articles.length} artigos exportados (${pub} publicados, ${articles.length - pub} rascunhos/agendados)`);
console.log(`${saints.length} santos exportados`);
console.log(`Arquivos em seo/export/. Palavras no total: ${articles.reduce((n, a) => n + words(a.content), 0)}`);
console.log(`Menor artigo publicado: ${Math.min(...articles.filter((a) => a.published).map((a) => words(a.content)))} palavras\n`);
void stripTags;
