/**
 * Publica os artigos novos (seo/novos/lote-*.json) na tabela "articles" do Supabase.
 *
 * Uso:
 *   npm run conteudos:publicar              (simulação: mostra o que faria)
 *   npm run conteudos:publicar -- --write   (publica de verdade)
 *
 * Artigos que já existem (mesma categoria e slug) NÃO são alterados, a não ser com --atualizar.
 * Precisa de SUPABASE_SERVICE_ROLE_KEY no .env.
 */
import fs from 'node:fs';
import path from 'node:path';
import { client, fetchAll } from './seo-lib.mjs';

const args = process.argv.slice(2);
const gravar = args.includes('--write');
const atualizar = args.includes('--atualizar');
const pasta = path.resolve('seo/novos');
const arquivos = fs.readdirSync(pasta).filter((f) => /^lote-.+\.json$/.test(f)).sort();
const novos = arquivos.flatMap((f) => JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8')));
console.log(`${novos.length} artigos em ${arquivos.length} arquivos (${arquivos.join(', ')})`);

const db = client(true);
const existentes = await fetchAll(db, 'articles', 'id,slug,category');
const porChave = new Map(existentes.map((a) => [`${a.category}/${a.slug}`, a.id]));

const inserir = novos.filter((a) => !porChave.has(`${a.category}/${a.slug}`));
const jaExistem = novos.filter((a) => porChave.has(`${a.category}/${a.slug}`));
console.log(`  ${inserir.length} novos para publicar`);
console.log(`  ${jaExistem.length} já existem ${atualizar ? '(serão atualizados)' : '(ficam como estão)'}`);

if (!gravar) {
  inserir.slice(0, 20).forEach((a) => console.log(`  + /${a.category}/${a.slug}`));
  if (inserir.length > 20) console.log(`  ... e mais ${inserir.length - 20}`);
  console.log('\nSIMULAÇÃO: nada foi alterado. Para publicar: npm run conteudos:publicar -- --write');
  process.exit(0);
}

const agora = Date.now();
let ok = 0;
const falhas = [];
for (const [i, a] of inserir.entries()) {
  // espaça a data de criação em 1 minuto para manter a ordem dos lotes em "Artigos recentes"
  const quando = new Date(agora - (inserir.length - i) * 60000).toISOString();
  const { error } = await db.from('articles').insert({
    slug: a.slug, category: a.category, title: a.title, meta_description: a.meta_description,
    excerpt: a.excerpt, content: a.content, image_alt: a.image_alt, published: true, created_at: quando, updated_at: quando,
  });
  if (error) falhas.push(`${a.slug}: ${error.message}`); else ok++;
}
if (atualizar) {
  for (const a of jaExistem) {
    const { error } = await db.from('articles').update({ title: a.title, meta_description: a.meta_description, excerpt: a.excerpt, content: a.content, image_alt: a.image_alt, updated_at: new Date().toISOString() }).eq('id', porChave.get(`${a.category}/${a.slug}`));
    if (error) falhas.push(`${a.slug}: ${error.message}`); else ok++;
  }
}
console.log(`Concluído: ${ok} artigos gravados.`);
if (falhas.length) { console.log('Falhas:'); falhas.forEach((f) => console.log('  - ' + f)); }
console.log('Próximos passos: npm run imagens:buscar -- --sem-imagem, depois npm run imagens:aplicar -- --sugeridas --write, depois npm run build.');
