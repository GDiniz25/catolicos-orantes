/**
 * Aplica retratos escolhidos a dedo (seo/imagens/santos.json) aos santos do calendário.
 * Formato: { "<id do santo em saints_calendar>": "File:Nome do arquivo no Wikimedia Commons.jpg" }
 * Confere se a obra é de domínio público, envia para article-images/arte/santo--<id>.jpg
 * e grava image_url e image_credit em saints_calendar.
 *
 * Uso:
 *   npm run santos:imagens              (simulação)
 *   npm run santos:imagens -- --write   (aplica de verdade)
 */
import fs from 'node:fs';
import { client } from './seo-lib.mjs';
import { sleep, credito, infoCommons, enviarPintura } from './imagens-lib.mjs';

const gravar = process.argv.includes('--write');
const arq = 'seo/imagens/santos.json';
const escolhas = JSON.parse(fs.readFileSync(arq, 'utf8'));
const db = client(true);
const ids = Object.keys(escolhas);
console.log(`${ids.length} santos em ${arq}${gravar ? '' : ' (SIMULAÇÃO: nada será alterado)'}`);
let ok = 0;
const falhas = [];
for (const id of ids) {
  try {
    const { data: santo, error } = await db.from('saints_calendar').select('id,name').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!santo) throw new Error('santo não existe');
    const info = await infoCommons(escolhas[id]);
    console.log(`  ${santo.name}: ${info.arquivo}`);
    if (!gravar) { ok++; continue; }
    const url = await enviarPintura(db, info, `santo--${id}`);
    const { error: e2 } = await db.from('saints_calendar').update({ image_url: url, image_credit: credito(info) }).eq('id', id);
    if (e2) throw new Error(e2.message);
    ok++;
    await sleep(400);
  } catch (err) {
    falhas.push(`${id}: ${err.message}`);
  }
}
console.log(`\n${ok} de ${ids.length} ${gravar ? 'aplicados' : 'conferidos'}.`);
if (falhas.length) { console.log('Falhas:'); falhas.forEach((f) => console.log('  - ' + f)); }
