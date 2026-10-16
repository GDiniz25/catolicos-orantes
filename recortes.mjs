// Gera folhas de contato com o corte 16:9 de cada imagem do site, usando o foco gravado em image_focus.
import fs from 'node:fs';
import sharp from 'sharp';
const URL = process.env.SB_URL, KEY = process.env.SB_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
async function todos(q) {
  const out = [];
  for (let de = 0; ; de += 1000) {
    const r = await fetch(`${URL}/rest/v1/${q}`, { headers: { ...H, Range: `${de}-${de + 999}` } });
    if (!r.ok) throw new Error(q + ' ' + r.status);
    const l = await r.json(); out.push(...l); if (l.length < 1000) break;
  }
  return out;
}
const focos = await todos('image_focus?select=url,foco,metodo,largura,altura&order=url');
const arts = await todos('articles?select=slug,category,image_url&published=eq.true');
const usos = new Map();
for (const a of arts) if (a.image_url) usos.set(a.image_url, [...(usos.get(a.image_url) || []), `${a.category}/${a.slug}`]);
const lista = focos.map((f, i) => ({ i, ...f, usos: usos.get(f.url) || [] }));
fs.mkdirSync('recortes', { recursive: true });
fs.writeFileSync('recortes/indice.json', JSON.stringify(lista, null, 0));
const W = 320, Hh = 180;
const cel = new Array(lista.length);
const fila = [...lista];
async function trab() {
  for (let it; (it = fila.shift()); ) {
    let buf;
    for (let t = 0; t < 3 && !buf; t++) {
      try { const r = await fetch(it.url, { signal: AbortSignal.timeout(30000) }); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch {}
      if (!buf) await new Promise((s) => setTimeout(s, 2000));
    }
    await new Promise((s) => setTimeout(s, 100));
    let img;
    try {
      const m = await sharp(buf).metadata();
      const [fx, fy] = (it.foco || '50% 25%').split(' ').map((v) => parseFloat(v) / 100);
      const esc = Math.max(W / m.width, Hh / m.height);
      const w = Math.round(m.width * esc), h = Math.round(m.height * esc);
      const left = Math.round((w - W) * fx), top = Math.round((h - Hh) * fy);
      img = await sharp(buf).resize(w, h).extract({ left: Math.max(0, Math.min(left, w - W)), top: Math.max(0, Math.min(top, h - Hh)), width: W, height: Hh }).toBuffer();
    } catch (e) {
      img = await sharp({ create: { width: W, height: Hh, channels: 3, background: '#c00' } }).png().toBuffer();
    }
    const rot = Buffer.from(`<svg width="${W}" height="22"><rect width="${W}" height="22" fill="#000"/><text x="4" y="16" font-size="15" font-family="sans-serif" fill="#ff0">${it.i} ${it.metodo || ''}</text></svg>`);
    cel[it.i] = await sharp({ create: { width: W, height: Hh + 22, channels: 3, background: '#fff' } }).composite([{ input: img, top: 0, left: 0 }, { input: rot, top: Hh, left: 0 }]).jpeg({ quality: 72 }).toBuffer();
  }
}
await Promise.all([trab(), trab(), trab()]);
const COL = 5, LIN = 6, POR = COL * LIN;
for (let p = 0; p * POR < cel.length; p++) {
  const comps = [];
  for (let k = 0; k < POR && p * POR + k < cel.length; k++) comps.push({ input: cel[p * POR + k], left: (k % COL) * (W + 6), top: Math.floor(k / COL) * (Hh + 28) });
  await sharp({ create: { width: COL * (W + 6), height: LIN * (Hh + 28), channels: 3, background: '#888' } }).composite(comps).jpeg({ quality: 70 }).toFile(`recortes/folha-${String(p).padStart(2, '0')}.jpg`);
}
console.log(lista.length, 'imagens');
