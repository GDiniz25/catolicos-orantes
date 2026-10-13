/**
 * PASSO 2 de 2: aplica as escolhas feitas em seo/imagens/revisar.html.
 * Baixa cada pintura do Wikimedia Commons, envia para o Storage do Supabase (bucket article-images)
 * e grava image_url, image_alt e image_credit no artigo.
 *
 * Uso:
 *   npm run imagens:aplicar                      (simulação: mostra o que faria, não muda nada)
 *   npm run imagens:aplicar -- --write           (aplica de verdade, com backup antes)
 *   npm run imagens:aplicar -- arquivo.json      (usa outro arquivo de escolhas)
 *   npm run imagens:aplicar -- --sugeridas --write  (pula a revisão e aplica as sugestões do passo 1)
 *
 * Precisa de SUPABASE_SERVICE_ROLE_KEY no .env e da coluna image_credit
 * (rode antes supabase/migrations/20261012120000_credito_imagem.sql no SQL Editor).
 */
import fs from 'node:fs';
import path from 'node:path';
import { client } from './seo-lib.mjs';
import { UA, sleep, credito, textoAlt } from './imagens-lib.mjs';

const args = process.argv.slice(2);
const gravar = args.includes('--write');
const sugeridas = args.includes('--sugeridas');
const arq = args.find((a) => a.endsWith('.json')) || 'seo/imagens/escolhas.json';
let escolhas;
if (sugeridas) {
  // Sem revisão manual: usa a pintura que o passo 1 já marcou para cada artigo
  const cand = 'seo/imagens/candidatos.json';
  if (!fs.existsSync(cand)) {
    console.error('Rode antes: npm run imagens:buscar');
    process.exit(1);
  }
  escolhas = {};
  for (const d of JSON.parse(fs.readFileSync(cand, 'utf8'))) {
    const c = d.candidatos.find((x) => x.arquivo === d.sugerida);
    if (c) escolhas[d.id] = { acao: 'trocar', chave: d.chave, titulo: d.titulo, url: c.url, arquivo: c.arquivo, pagina: c.pagina, credito: c.credito, alt: c.alt };
  }
} else {
  if (!fs.existsSync(arq)) {
    console.error(`Não achei ${arq}. Baixe o escolhas.json na página de revisão e mova para a pasta seo/imagens (ou use --sugeridas).`);
    process.exit(1);
  }
  escolhas = JSON.parse(fs.readFileSync(arq, 'utf8'));
}
const ids = Object.keys(escolhas);
const BUCKET = 'article-images';
const db = client(true);

/** Resolve um link colado (https://commons.wikimedia.org/wiki/File:...) e confere a licença */
async function resolverManual(link) {
  const titulo = decodeURIComponent(link.split('/wiki/')[1] || '').replace(/_/g, ' ');
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', titles: titulo, prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1280',
    iiextmetadatafilter: 'LicenseShortName|License|Artist|ObjectName|DateTimeOriginal',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': UA } });
  const p = (await res.json())?.query?.pages?.[0];
  const ii = p?.imageinfo?.[0];
  if (!ii) throw new Error('arquivo não encontrado no Commons');
  const md = ii.extmetadata || {};
  const lic = `${md.LicenseShortName?.value || ''} ${md.License?.value || ''}`;
  if (!/public domain|^\s*pd\b|\bpd-|cc0|cc-zero/i.test(lic)) throw new Error(`licença não é domínio público (${md.LicenseShortName?.value || 'desconhecida'})`);
  const limpa = (h) => (h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    arquivo: p.title.replace(/^File:/, ''),
    url: ii.thumburl || ii.url,
    artista: limpa(md.Artist?.value).slice(0, 120),
    obra: limpa(md.ObjectName?.value).slice(0, 160),
    data: limpa(md.DateTimeOriginal?.value).slice(0, 40),
  };
}

console.log(`${ids.length} mudanças em ${sugeridas ? 'candidatos.json (sugestões automáticas)' : arq}${gravar ? '' : ' (SIMULAÇÃO: nada será alterado)'}`);
const resumo = { trocar: 0, manual: 0, remover: 0 };
for (const id of ids) resumo[escolhas[id].acao] = (resumo[escolhas[id].acao] ?? 0) + 1;
console.log(`  ${resumo.trocar} pinturas sugeridas, ${resumo.manual} links colados, ${resumo.remover} ficam sem imagem`);

if (!gravar) {
  for (const id of ids.slice(0, 15)) {
    const e = escolhas[id];
    console.log(`  - ${e.chave}: ${e.acao === 'remover' ? 'remover imagem' : e.arquivo || e.link}`);
  }
  if (ids.length > 15) console.log(`  ... e mais ${ids.length - 15}`);
  console.log('\nPara aplicar de verdade: npm run imagens:aplicar -- --write');
  process.exit(0);
}

// Backup do estado atual
const atuais = [];
let errLer = null;
for (let k = 0; k < ids.length && !errLer; k += 80) {
  const { data, error } = await db.from('articles').select('id,slug,category,image_url,image_alt,image_credit').in('id', ids.slice(k, k + 80));
  if (error) errLer = error;
  else atuais.push(...data);
}
if (errLer) {
  if (/image_credit/.test(errLer.message)) {
    console.error('Falta a coluna image_credit. Rode o arquivo supabase/migrations/20261012120000_credito_imagem.sql no SQL Editor do Supabase e tente de novo.');
  } else console.error(errLer.message);
  process.exit(1);
}
fs.mkdirSync('seo/backup', { recursive: true });
const backup = `seo/backup/imagens-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
fs.writeFileSync(backup, JSON.stringify(atuais, null, 2));
console.log(`Backup salvo em ${backup}`);

let ok = 0;
const falhas = [];
for (const [n, id] of ids.entries()) {
  const e = escolhas[id];
  const artigo = { title: e.titulo, category: e.chave.split('/')[0] };
  try {
    if (e.acao === 'remover') {
      const { error } = await db.from('articles').update({ image_url: null, image_alt: null, image_credit: null }).eq('id', id);
      if (error) throw new Error(error.message);
    } else {
      let info = e;
      if (e.acao === 'manual') {
        const r = await resolverManual(e.link);
        info = { ...r, credito: credito(r), alt: textoAlt(artigo, r) };
      }
      const res = await fetch(info.url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      const tipo = res.headers.get('content-type') || 'image/jpeg';
      const ext = tipo.includes('png') ? 'png' : 'jpg';
      const caminho = `arte/${e.chave.replace('/', '--')}.${ext}`;
      const buf = Buffer.from(await res.arrayBuffer());
      const up = await db.storage.from(BUCKET).upload(caminho, buf, { contentType: tipo, upsert: true, cacheControl: '31536000' });
      if (up.error) throw new Error(`upload: ${up.error.message}`);
      const url = `${db.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl}?v=${Date.now().toString(36)}`;
      const { error } = await db.from('articles').update({ image_url: url, image_alt: info.alt, image_credit: info.credito }).eq('id', id);
      if (error) throw new Error(error.message);
      await sleep(400);
    }
    ok++;
  } catch (err) {
    falhas.push(`${e.chave}: ${err.message}`);
  }
  process.stdout.write(`\r${n + 1}/${ids.length} aplicados (${falhas.length} falhas)`);
}
console.log(`\nConcluído: ${ok} artigos atualizados.`);
if (falhas.length) {
  console.log('Falhas (os demais foram aplicados normalmente):');
  falhas.forEach((f) => console.log('  - ' + f));
}
console.log('Agora crie as versões leves (npm run imagens:variantes -- --write) e gere o site de novo (npm run build).');
