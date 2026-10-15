/**
 * Ponto de foco das imagens (artigos e santos), para o site cortar com object-cover
 * sem perder o que importa: se o rosto está no alto da pintura, o corte sobe junto.
 *
 * Usa o smartcrop (pele, bordas e saturação) para achar o melhor recorte 16:9 e 1:1
 * e grava em image_focus o object-position equivalente ("x% y%").
 * Só calcula as URLs que ainda não estão na tabela (a URL muda de ?v= quando a imagem é trocada).
 *
 * Uso:
 *   node --env-file=.env scripts/imagens-foco.mjs            (simulação: calcula 5 e mostra)
 *   node --env-file=.env scripts/imagens-foco.mjs --write    (grava tudo)
 * Precisa do pacote smartcrop-sharp (o workflow instala na hora com npm install --no-save).
 */
import sharp from 'sharp';
import smartcrop from 'smartcrop-sharp';
import { client, fetchAll } from './seo-lib.mjs';

const gravar = process.argv.includes('--write');
const db = client(true);
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';

const artigos = await fetchAll(db, 'articles', 'image_url', 'id');
const santos = await fetchAll(db, 'saints_calendar', 'image_url', 'id');
const urls = [...new Set([...artigos, ...santos].map((r) => r.image_url).filter(Boolean))];
const feitos = new Set((await fetchAll(db, 'image_focus', 'url', 'url')).map((r) => r.url));
const pendentes = urls.filter((u) => !feitos.has(u));
console.log(`${urls.length} imagens, ${pendentes.length} sem foco${gravar ? '' : ' (SIMULAÇÃO: calcula 5 e não grava)'}`);

const pct = (v) => `${Math.round(Math.min(1, Math.max(0, v)) * 100)}%`;

async function foco(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  // Reduz antes de analisar: mais rápido e o resultado é o mesmo
  const buf = await sharp(Buffer.from(await res.arrayBuffer())).rotate().resize({ width: 640, height: 640, fit: 'inside' }).jpeg().toBuffer();
  const { width: W, height: H } = await sharp(buf).metadata();
  const r169 = (await smartcrop.crop(buf, { width: 160, height: 90 })).topCrop;
  const r11 = (await smartcrop.crop(buf, { width: 100, height: 100 })).topCrop;
  // object-position: p = deslocamento / sobra. Para o eixo que sobra em cada formato.
  const px = W > r11.width + 1 ? r11.x / (W - r11.width) : W > r169.width + 1 ? r169.x / (W - r169.width) : 0.5;
  const py = H > r169.height + 1 ? r169.y / (H - r169.height) : H > r11.height + 1 ? r11.y / (H - r11.height) : 0.5;
  return { foco: `${pct(px)} ${pct(py)}`, largura: W, altura: H };
}

const lista = gravar ? pendentes : pendentes.slice(0, 5);
let ok = 0;
const falhas = [];
const fila = [...lista];
async function trabalhador() {
  for (let url; (url = fila.shift()); ) {
    try {
      const f = await foco(url);
      if (gravar) {
        const { error } = await db.from('image_focus').upsert({ url, ...f });
        if (error) throw new Error(error.message);
      } else console.log(`  ${f.foco}  ${url.split('/').pop()}`);
      ok++;
    } catch (e) {
      falhas.push(`${url.split('/').pop()}: ${e.message}`);
    }
  }
}
await Promise.all([1, 2, 3, 4].map(trabalhador));
console.log(`\n${ok} de ${lista.length} ${gravar ? 'gravados' : 'calculados'}.`);
if (falhas.length) { console.log(`Falhas (${falhas.length}):`); falhas.slice(0, 30).forEach((f) => console.log('  - ' + f)); }
