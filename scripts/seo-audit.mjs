/**
 * Auditoria de SEO/GEO dos artigos exportados.
 * Uso: npm run seo:audit            (usa o export mais recente)
 *      npm run seo:audit -- arquivo.json
 * Gera seo/relatorio-AAAA-MM-DD.md e seo/relatorio-AAAA-MM-DD.csv
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { CATEGORIES, STATIC, stripTags, words, today } from './seo-lib.mjs';

const arg = process.argv[2];
const latest = () => {
  const files = readdirSync('seo/export').filter((f) => f.startsWith('artigos-') && f.endsWith('.json')).sort();
  if (!files.length) {
    console.error('Nenhum export encontrado. Rode antes: npm run seo:export');
    process.exit(1);
  }
  return `seo/export/${files[files.length - 1]}`;
};
const file = arg || latest();
const articles = JSON.parse(readFileSync(file, 'utf8'));
const published = articles.filter((a) => a.published !== false);
const keys = new Set(published.map((a) => `/${a.category}/${a.slug}`));
const validPaths = new Set([...STATIC, ...CATEGORIES.map((c) => `/${c}`), ...keys]);

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const STOP = new Set('a o as os de da do das dos e em no na nos nas um uma para por com como que se sua seu suas seus ao aos o que e ou é sao sao'.split(' '));
const keywordOf = (title) => norm(title).replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)).slice(0, 3);

const rows = [];
const titles = new Map();
for (const a of published) {
  const c = a.content || '';
  const text = stripTags(c);
  const w = words(c);
  const h2 = [...c.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1]));
  const h3 = (c.match(/<h3/gi) || []).length;
  const links = [...c.matchAll(/href="([^"]+)"/gi)].map((m) => m[1]);
  const internal = links.filter((l) => l.startsWith('/') || l.includes('catolicosorantes.com.br'));
  const broken = internal.map((l) => l.replace(/^https?:\/\/(www\.)?catolicosorantes\.com\.br/, '').replace(/\/$/, '')).filter((l) => !validPaths.has(l));
  const external = links.filter((l) => /^https?:/.test(l) && !l.includes('catolicosorantes.com.br'));
  const firstP = stripTags((c.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [, ''])[1]);
  const kw = keywordOf(a.title);
  const kwInFirst = kw.length ? kw.filter((k) => norm(firstP).includes(k)).length / kw.length : 1;
  const kwInH2 = kw.length ? kw.some((k) => h2.some((h) => norm(h).includes(k))) : true;
  const issues = [];
  const t = a.title || '';
  const m = a.meta_description || '';
  const e = a.excerpt || '';
  if (!t) issues.push('sem título');
  if (t.length > 60) issues.push(`título longo (${t.length})`);
  if (t.length && t.length < 25) issues.push(`título curto (${t.length})`);
  if (!m) issues.push('sem meta description');
  else if (m.length < 110 || m.length > 158) issues.push(`meta fora de 110-158 (${m.length})`);
  if (!e) issues.push('sem excerpt');
  else if (e.length > 180) issues.push(`excerpt longo (${e.length})`);
  if (e && m && norm(e) === norm(m)) issues.push('excerpt igual à meta');
  if (w < 400) issues.push(`conteúdo curto (${w} palavras)`);
  if (/<h1/i.test(c)) issues.push('h1 dentro do conteúdo');
  if (h2.length < 3) issues.push(`poucos h2 (${h2.length})`);
  if (!h2.some((h) => h.trim().endsWith('?'))) issues.push('nenhum h2 em forma de pergunta');
  if (!/perguntas frequentes/i.test(c)) issues.push('sem seção Perguntas frequentes');
  if (!/<h2[^>]*>\s*fontes/i.test(c) && external.length === 0) issues.push('sem fontes/links externos');
  if (internal.length === 0) issues.push('sem links internos');
  if (broken.length) issues.push(`links internos quebrados: ${broken.join(', ')}`);
  if (kwInFirst < 0.5) issues.push('termo do título não aparece no 1º parágrafo');
  if (!kwInH2) issues.push('termo do título não aparece em nenhum h2');
  if (firstP.length < 120) issues.push('1º parágrafo curto (resposta direta fraca)');
  if (/—|–/.test(text)) issues.push('travessões no texto');
  if (/<img/i.test(c)) issues.push('imagem inline no conteúdo');
  if (/inteligência artificial/i.test(text)) issues.push('menciona "inteligência artificial"');
  if (!a.image_url) issues.push('sem imagem de capa');
  else if (!a.image_alt) issues.push('capa sem alt');
  if (!CATEGORIES.includes(a.category)) issues.push(`categoria desconhecida: ${a.category}`);
  const dup = titles.get(norm(t));
  if (dup) issues.push(`título duplicado com ${dup}`);
  titles.set(norm(t), a.slug);
  const score = Math.max(0, 100 - issues.length * 8);
  rows.push({ slug: a.slug, category: a.category, title: t, words: w, h2: h2.length, h3, internal: internal.length, external: external.length, score, issues });
}

rows.sort((x, y) => x.score - y.score);
const date = today();
const byCat = {};
for (const r of rows) (byCat[r.category] = byCat[r.category] || []).push(r);
const issueCount = {};
for (const r of rows) for (const i of r.issues) {
  const k = i.replace(/\s*\(.*\)$/, '').replace(/:.*$/, '');
  issueCount[k] = (issueCount[k] || 0) + 1;
}

const md = [];
md.push(`# Auditoria de SEO/GEO: ${rows.length} artigos publicados (${date})`, '');
md.push(`Fonte: \`${file}\``, '');
md.push(`Nota média: **${Math.round(rows.reduce((n, r) => n + r.score, 0) / (rows.length || 1))}/100**. Artigos com nota abaixo de 60: **${rows.filter((r) => r.score < 60).length}**.`, '');
md.push('## Problemas mais frequentes', '', '| Problema | Artigos |', '|---|---|');
for (const [k, n] of Object.entries(issueCount).sort((a, b) => b[1] - a[1])) md.push(`| ${k} | ${n} |`);
md.push('', '## Por categoria', '', '| Categoria | Artigos | Nota média | Palavras (média) |', '|---|---|---|---|');
for (const [c, list] of Object.entries(byCat)) md.push(`| ${c} | ${list.length} | ${Math.round(list.reduce((n, r) => n + r.score, 0) / list.length)} | ${Math.round(list.reduce((n, r) => n + r.words, 0) / list.length)} |`);
md.push('', '## Artigos (pior nota primeiro)', '');
for (const r of rows) {
  md.push(`### ${r.title || r.slug}`, `\`/${r.category}/${r.slug}\` · ${r.words} palavras · ${r.h2} h2 · ${r.internal} links internos · ${r.external} externos · nota ${r.score}`, '');
  if (r.issues.length) for (const i of r.issues) md.push(`- ${i}`);
  else md.push('- sem problemas detectados');
  md.push('');
}
writeFileSync(`seo/relatorio-${date}.md`, md.join('\n'));
const csv = ['slug;categoria;nota;palavras;h2;links_internos;links_externos;problemas', ...rows.map((r) => [r.slug, r.category, r.score, r.words, r.h2, r.internal, r.external, `"${r.issues.join(' | ').replace(/"/g, '""')}"`].join(';'))].join('\n');
writeFileSync(`seo/relatorio-${date}.csv`, '﻿' + csv);
console.log(`\nRelatório: seo/relatorio-${date}.md e .csv`);
console.log(`Artigos: ${rows.length} · nota média ${Math.round(rows.reduce((n, r) => n + r.score, 0) / (rows.length || 1))} · abaixo de 60: ${rows.filter((r) => r.score < 60).length}\n`);
for (const [k, n] of Object.entries(issueCount).sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`${String(n).padStart(4)}  ${k}`);
