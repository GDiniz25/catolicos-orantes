/**
 * Avisa Bing, Yandex e outros buscadores (protocolo IndexNow) sobre as páginas novas ou alteradas.
 * Roda depois do deploy, no GitHub Actions. O Google não usa IndexNow: para ele vale o sitemap.
 */
import { readdirSync, readFileSync } from 'node:fs';

const HOST = 'catolicosorantes.com.br';
const KEY = '660dd63425f2b1d26a0c4917dd78bd1a';
const DIAS = 2;

const limite = Date.now() - DIAS * 86400000;
const urls = new Set([
  `https://${HOST}/`,
  `https://${HOST}/liturgia-diaria`,
  `https://${HOST}/santo-do-dia`,
  `https://${HOST}/versiculo-do-dia`,
]);
for (const f of readdirSync('dist').filter((n) => /^sitemap-.+\.xml$/.test(n))) {
  const xml = readFileSync(`dist/${f}`, 'utf8');
  for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
    if (m[2] && new Date(m[2]).getTime() >= limite) urls.add(m[1]);
  }
}
const urlList = [...urls].slice(0, 10000);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs enviadas, resposta ${res.status}`);
