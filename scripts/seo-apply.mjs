/**
 * Grava no Supabase os artigos revisados que estão em seo/revisado/*.json
 * (arrays com slug + campos a atualizar: title, meta_description, excerpt, content, image_alt).
 *
 * Uso: npm run seo:apply            -> só simula e mostra o que mudaria
 *      npm run seo:apply -- --write -> grava de verdade (faz backup antes em seo/backup/)
 *
 * Precisa de SUPABASE_SERVICE_ROLE_KEY no .env (chave secreta: nunca envie para o GitHub).
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { client, fetchAll, words, today } from './seo-lib.mjs';

const write = process.argv.includes('--write');
const FIELDS = ['title', 'meta_description', 'excerpt', 'content', 'image_alt'];

const files = readdirSync('seo/revisado').filter((f) => f.endsWith('.json'));
if (!files.length) {
  console.error('Nenhum arquivo em seo/revisado/');
  process.exit(1);
}
const revised = files.flatMap((f) => JSON.parse(readFileSync(`seo/revisado/${f}`, 'utf8')));
console.log(`${revised.length} artigos revisados em ${files.length} arquivo(s)`);

const db = client(write);
const current = await fetchAll(db, 'articles', 'id,slug,category,' + FIELDS.join(','));
const bySlug = new Map(current.map((a) => [a.slug, a]));

if (write) {
  mkdirSync('seo/backup', { recursive: true });
  const bk = `seo/backup/artigos-antes-${today()}-${Date.now()}.json`;
  writeFileSync(bk, JSON.stringify(current, null, 1));
  console.log(`Backup salvo em ${bk}`);
}

let changed = 0;
let missing = 0;
for (const r of revised) {
  const cur = bySlug.get(r.slug);
  if (!cur) {
    missing++;
    console.log(`  ? ${r.slug}: não existe no banco (pulado)`);
    continue;
  }
  const patch = {};
  for (const f of FIELDS) if (r[f] !== undefined && r[f] !== cur[f]) patch[f] = r[f];
  if (!Object.keys(patch).length) continue;
  changed++;
  console.log(`  ${write ? '✓' : '~'} ${r.slug}: ${Object.keys(patch).join(', ')}${patch.content ? ` (${words(cur.content)} -> ${words(patch.content)} palavras)` : ''}`);
  if (write) {
    const { error } = await db.from('articles').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', cur.id);
    if (error) console.error(`    ERRO: ${error.message}`);
  }
}
console.log(`\n${changed} artigo(s) ${write ? 'atualizados' : 'seriam atualizados'}, ${missing} não encontrado(s).`);
if (!write) console.log('Para gravar de verdade: npm run seo:apply -- --write');
else console.log('Agora clique em "Publicar alterações no site" no /admin (ou espere o build diário).');
