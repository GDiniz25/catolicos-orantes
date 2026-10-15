/**
 * Aplica pinturas escolhidas a dedo (seo/imagens/fixas.json) a artigos específicos.
 * Formato: { "categoria/slug": "File:Nome do arquivo no Wikimedia Commons.jpg" }
 *      ou   { "categoria/slug": { "arquivo": "File:...", "alt": "texto alternativo" } } (fotos reais, com alt próprio)
 * Aceita domínio público e CC BY / CC BY-SA (com autor e licença no crédito).
 * Confere se a obra é de domínio público, baixa, envia ao Storage (bucket article-images)
 * e grava image_url, image_alt (mantém o texto alternativo do artigo, se houver) e image_credit.
 *
 * Uso:
 *   npm run imagens:fixar              (simulação)
 *   npm run imagens:fixar -- --write   (aplica de verdade)
 */
import fs from 'node:fs';
import { client } from './seo-lib.mjs';
import { UA, sleep, credito, textoAlt, infoCommons, enviarPintura } from './imagens-lib.mjs';

const gravar = process.argv.includes('--write');
const arq = 'seo/imagens/fixas.json';
const fixas = JSON.parse(fs.readFileSync(arq, 'utf8'));
const db = client(true);
const chaves = Object.keys(fixas);
console.log(`${chaves.length} artigos em ${arq}${gravar ? '' : ' (SIMULAÇÃO: nada será alterado)'}`);
let ok = 0;
const falhas = [];
for (const chave of chaves) {
  const [category, slug] = chave.split('/');
  try {
    const { data: artigo, error } = await db.from('articles').select('id,title,category,image_alt').eq('category', category).eq('slug', slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!artigo) throw new Error('artigo não existe (publique antes com npm run conteudos:publicar -- --write)');
    const item = typeof fixas[chave] === 'string' ? { arquivo: fixas[chave] } : fixas[chave];
    const info = await infoCommons(item.arquivo);
    console.log(`  ${chave}: ${info.arquivo}`);
    if (!gravar) { ok++; continue; }
    const url = await enviarPintura(db, info, `${category}--${slug}`);
    const alt = item.alt || (process.argv.includes('--alt') ? '' : artigo.image_alt) || textoAlt(artigo, info);
    const { error: e2 } = await db.from('articles').update({ image_url: url, image_alt: alt, image_credit: credito(info), updated_at: new Date().toISOString() }).eq('id', artigo.id);
    if (e2) throw new Error(e2.message);
    ok++;
    await sleep(400);
  } catch (err) {
    falhas.push(`${chave}: ${err.message}`);
  }
}
console.log(`\n${ok} de ${chaves.length} ${gravar ? 'aplicados' : 'conferidos'}.`);
if (falhas.length) { console.log('Falhas:'); falhas.forEach((f) => console.log('  - ' + f)); }
if (!gravar) console.log('Para aplicar de verdade: npm run imagens:fixar -- --write');
else console.log('Depois rode: npm run imagens:variantes (versões leves das imagens) e faça o push para publicar.');
