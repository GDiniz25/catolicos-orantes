/**
 * Gera versões menores (WebP) das pinturas dos artigos e envia para o Storage.
 *
 * Para cada arquivo arte/<nome>.jpg do bucket article-images cria:
 *   arte/<nome>-q60-240.webp  (miniaturas de lista)
 *   arte/<nome>-q60-480.webp  (cartões no celular)
 *   arte/<nome>-q60-640.webp  (cartões em telas de alta densidade)
 *   arte/<nome>-q60-960.webp  (capa do artigo)
 * O site usa essas versões automaticamente (src/lib/imagens.ts) quando elas existem.
 * O plano gratuito do Supabase não redimensiona imagens sozinho, por isso o script.
 *
 * Uso:
 *   npm run imagens:variantes            (simulação: mostra quantas faltam)
 *   npm run imagens:variantes -- --write (gera e envia)
 *   npm run imagens:variantes -- --write --refazer   (refaz todas)
 */
import sharp from 'sharp';
import { client } from './seo-lib.mjs';

const BUCKET = 'article-images';
const PASTA = 'arte';
const LARGURAS = [240, 480, 640, 960];
const QUALIDADE = 60; // pinturas cheias de detalhe: 60 mantém a qualidade visual com arquivos bem menores
// Faz parte do nome do arquivo: mudar a qualidade gera arquivos novos (sem cache antigo no navegador)
const VERSAO = 'q60';
const args = process.argv.slice(2);
const gravar = args.includes('--write');
const refazer = args.includes('--refazer');

const db = client(gravar);

async function listarTudo() {
  const nomes = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await db.storage.from(BUCKET).list(PASTA, { limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw new Error(error.message);
    nomes.push(...data.map((f) => f.name));
    if (data.length < 1000) break;
  }
  return nomes;
}

const todos = await listarTudo();
const existentes = new Set(todos);
const originais = todos.filter((n) => /\.(jpe?g|png)$/i.test(n));
const pendentes = originais.filter((n) => {
  const base = n.replace(/\.(jpe?g|png)$/i, '');
  return refazer || LARGURAS.some((w) => !existentes.has(`${base}-${VERSAO}-${w}.webp`));
});

console.log(`${originais.length} pinturas no Storage, ${pendentes.length} sem todas as versões menores.`);
if (!gravar) {
  console.log('Simulação. Para gerar: npm run imagens:variantes -- --write');
  process.exit(0);
}

let ok = 0;
const falhas = [];
let antes = 0;
let depois = 0;
for (const [i, nome] of pendentes.entries()) {
  const base = nome.replace(/\.(jpe?g|png)$/i, '');
  try {
    const { data, error } = await db.storage.from(BUCKET).download(`${PASTA}/${nome}`);
    if (error) throw new Error(error.message);
    const buf = Buffer.from(await data.arrayBuffer());
    antes += buf.length;
    for (const w of LARGURAS) {
      const out = await sharp(buf).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALIDADE, effort: 6, smartSubsample: true }).toBuffer();
      if (w === 480) depois += out.length;
      const up = await db.storage.from(BUCKET).upload(`${PASTA}/${base}-${VERSAO}-${w}.webp`, out, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000',
      });
      if (up.error) throw new Error(`upload ${w}: ${up.error.message}`);
    }
    ok++;
  } catch (e) {
    falhas.push(`${nome}: ${e.message}`);
  }
  process.stdout.write(`\r${i + 1}/${pendentes.length} (${falhas.length} falhas)`);
}
console.log(`\nPronto: ${ok} pinturas com versões menores.`);
if (ok) console.log(`Tamanho médio: original ${Math.round(antes / ok / 1024)} KB, versão de 480 px ${Math.round(depois / ok / 1024)} KB.`);
if (falhas.length) falhas.forEach((f) => console.log('  - ' + f));
console.log('Agora gere o site de novo (npm run build) para as páginas usarem as versões menores.');
