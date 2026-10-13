/**
 * Aplica pinturas escolhidas a dedo (seo/imagens/fixas.json) a artigos específicos.
 * Formato: { "categoria/slug": "File:Nome do arquivo no Wikimedia Commons.jpg" }
 * Confere se a obra é de domínio público, baixa, envia ao Storage (bucket article-images)
 * e grava image_url, image_alt (mantém o texto alternativo do artigo, se houver) e image_credit.
 *
 * Uso:
 *   npm run imagens:fixar              (simulação)
 *   npm run imagens:fixar -- --write   (aplica de verdade)
 */
import fs from 'node:fs';
import { client } from './seo-lib.mjs';
import { UA, sleep, credito, textoAlt } from './imagens-lib.mjs';

const gravar = process.argv.includes('--write');
const arq = 'seo/imagens/fixas.json';
const fixas = JSON.parse(fs.readFileSync(arq, 'utf8'));
const db = client(true);
const BUCKET = 'article-images';
const limpa = (h) => (h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

async function infoCommons(titulo) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', titles: titulo, prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600',
    iiextmetadatafilter: 'LicenseShortName|License|Artist|ObjectName|DateTimeOriginal',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': UA } });
  const p = (await res.json())?.query?.pages?.[0];
  const ii = p?.imageinfo?.[0];
  if (!ii) throw new Error('arquivo não encontrado no Commons');
  const md = ii.extmetadata || {};
  const lic = `${md.LicenseShortName?.value || ''} ${md.License?.value || ''}`;
  if (!/public domain|^\s*pd\b|\bpd-|cc0|cc-zero/i.test(lic)) throw new Error(`licença não é domínio público (${md.LicenseShortName?.value || 'desconhecida'})`);
  return {
    arquivo: p.title.replace(/^File:/, ''),
    url: ii.thumburl || ii.url,
    artista: limpa(md.Artist?.value).slice(0, 120),
    obra: limpa(md.ObjectName?.value).slice(0, 160),
    data: limpa(md.DateTimeOriginal?.value).slice(0, 40),
  };
}

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
    const info = await infoCommons(fixas[chave]);
    console.log(`  ${chave}: ${info.arquivo}`);
    if (!gravar) { ok++; continue; }
    const res = await fetch(info.url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`download ${res.status}`);
    const tipo = res.headers.get('content-type') || 'image/jpeg';
    const ext = tipo.includes('png') ? 'png' : 'jpg';
    const caminho = `arte/${category}--${slug}.${ext}`;
    const buf = Buffer.from(await res.arrayBuffer());
    const up = await db.storage.from(BUCKET).upload(caminho, buf, { contentType: tipo, upsert: true, cacheControl: '31536000' });
    if (up.error) throw new Error(`upload: ${up.error.message}`);
    const url = `${db.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl}?v=${Date.now().toString(36)}`;
    const alt = artigo.image_alt || textoAlt(artigo, info);
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
