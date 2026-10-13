/**
 * PASSO 1 de 2: busca arte sacra em domínio público no Wikimedia Commons para cada artigo
 * e monta uma página de revisão (seo/imagens/revisar.html).
 *
 * Uso:
 *   npm run imagens:buscar                  (todos os artigos publicados)
 *   npm run imagens:buscar -- --sem-imagem  (só os que ainda não têm pintura do Commons)
 *   npm run imagens:buscar -- --limite 20   (teste rápido com poucos artigos)
 *
 * Não altera nada no site nem no banco. Pode rodar quantas vezes quiser (as buscas ficam em cache).
 */
import fs from 'node:fs';
import path from 'node:path';
import { client, fetchAll } from './seo-lib.mjs';
import { buscasPara, buscarCommons, credito, textoAlt, sleep } from './imagens-lib.mjs';

const args = process.argv.slice(2);
const soSemImagem = args.includes('--sem-imagem');
const limite = Number(args[args.indexOf('--limite') + 1]) || Infinity;

const pasta = path.resolve('seo/imagens');
fs.mkdirSync(pasta, { recursive: true });
const cacheArq = path.join(pasta, 'cache-buscas.json');
const cache = fs.existsSync(cacheArq) ? JSON.parse(fs.readFileSync(cacheArq, 'utf8')) : {};

const db = client(false);
let artigos = (await fetchAll(db, 'articles', 'id,slug,title,category,image_url,image_alt,image_credit,published'))
  .filter((a) => a.published && a.slug)
  .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
// --sem-imagem: só os artigos que ainda não têm pintura do Commons (sem crédito gravado)
if (soSemImagem) artigos = artigos.filter((a) => !a.image_credit);
artigos = artigos.slice(0, limite);
console.log(`${artigos.length} artigos para buscar imagem.`);

const usos = new Map(); // arquivo → quantas vezes já foi pré-selecionado
// Rodando só para os que faltam: as pinturas já aplicadas antes contam como usadas
const anterior = path.join(pasta, 'candidatos.json');
if (soSemImagem && fs.existsSync(anterior)) {
  for (const d of JSON.parse(fs.readFileSync(anterior, 'utf8'))) if (d.sugerida) usos.set(d.sugerida, (usos.get(d.sugerida) ?? 0) + 1);
}
const saida = [];
let i = 0;
for (const a of artigos) {
  i++;
  const buscas = buscasPara(a);
  const vistos = new Set();
  const candidatos = [];
  for (const q of buscas) {
    if (!cache[q]) {
      try {
        cache[q] = await buscarCommons(q);
      } catch (e) {
        console.warn(`  falha na busca "${q}": ${e.message}`);
        cache[q] = [];
      }
      await sleep(250);
    }
    for (const c of cache[q]) {
      if (vistos.has(c.arquivo)) continue;
      vistos.add(c.arquivo);
      candidatos.push({ ...c, credito: credito(c), alt: textoAlt(a, c) });
    }
  }
  // pré-seleciona a melhor imagem ainda não usada (evita a mesma pintura em vários artigos);
  // se todas já foram usadas, aceita repetir uma pintura no máximo uma vez
  const naoUsada = candidatos.find((c) => (usos.get(c.arquivo) ?? 0) === 0);
  const poucoUsada = candidatos.find((c) => (usos.get(c.arquivo) ?? 0) < 2);
  const sugerida = naoUsada ?? poucoUsada ?? null;
  const top = [...(sugerida ? [sugerida] : []), ...candidatos.filter((c) => c !== sugerida)].slice(0, 12);
  if (sugerida) usos.set(sugerida.arquivo, (usos.get(sugerida.arquivo) ?? 0) + 1);
  saida.push({
    id: a.id,
    chave: `${a.category}/${a.slug}`,
    titulo: a.title,
    categoria: a.category,
    atual: a.image_url || null,
    buscas,
    candidatos: top,
    sugerida: sugerida?.arquivo ?? null,
  });
  process.stdout.write(`\r${i}/${artigos.length} ${a.slug.slice(0, 50).padEnd(50)}`);
  if (i % 20 === 0) fs.writeFileSync(cacheArq, JSON.stringify(cache));
}
fs.writeFileSync(cacheArq, JSON.stringify(cache));
console.log('');

fs.writeFileSync(path.join(pasta, 'candidatos.json'), JSON.stringify(saida, null, 2));

const semSugestao = saida.filter((s) => !s.sugerida).length;
const html = fs
  .readFileSync(path.resolve('scripts/imagens-revisar.template.html'), 'utf8')
  .replace('/*DADOS*/[]', JSON.stringify(saida).replace(/</g, '\\u003c'));
fs.writeFileSync(path.join(pasta, 'revisar.html'), html);

console.log(`Pronto. ${saida.length - semSugestao} artigos com sugestão e ${semSugestao} sem imagem em domínio público encontrada.`);
console.log(`Abra no navegador: ${path.join(pasta, 'revisar.html')}`);
