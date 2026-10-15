/**
 * Publica as reflexões do Evangelho do dia (seo/reflexoes/*.json) na tabela evangelho_reflexao.
 * Cada arquivo: [{ date: "2026-10-16", referencia, titulo, texto_html }]. Só entram textos já revisados.
 * Uso: npm run reflexoes:publicar -- --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { client } from './seo-lib.mjs';

const gravar = process.argv.includes('--write');
const pasta = path.resolve('seo/reflexoes');
const itens = fs.existsSync(pasta)
  ? fs.readdirSync(pasta).filter((f) => f.endsWith('.json')).sort().flatMap((f) => JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8')))
  : [];
console.log(`${itens.length} reflexões encontradas`);
if (!gravar) process.exit(0);
const db = client(true);
let ok = 0;
for (const r of itens) {
  if (!r.date || !r.referencia || !r.titulo || !r.texto_html) { console.log(`  pulada (incompleta): ${r.date}`); continue; }
  const { error } = await db.from('evangelho_reflexao').upsert({ date: r.date, referencia: r.referencia, titulo: r.titulo, texto_html: r.texto_html, revisado: true, updated_at: new Date().toISOString() }, { onConflict: 'date' });
  if (error) console.log(`  falha ${r.date}: ${error.message}`); else ok++;
}
console.log(`Concluído: ${ok} reflexões gravadas.`);
