import fs from 'node:fs';
import sharp from 'sharp';
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function json(u) { for (let t = 0; t < 4; t++) { try { const r = await fetch(u, { headers: { 'User-Agent': UA } }); if (r.ok) return await r.json(); } catch {} await espera(3000); } return {}; }
const Q = JSON.parse(fs.readFileSync('cf-q.json', 'utf8'));
const proib = new Set(JSON.parse(fs.readFileSync('santos/usados.json', 'utf8')));
const PD = /public domain|^\s*pd\b|\bpd-|\bpdm\b|cc0|cc-zero/i;
const out = {};
for (const [k, qs] of Object.entries(Q)) {
  const tit = [];
  for (const q of qs) { const j = await json('https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=10&srsearch=' + encodeURIComponent(q + ' filetype:bitmap')); for (const s of j.query?.search || []) if (!tit.includes(s.title)) tit.push(s.title); await espera(300); }
  const j = await json('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=400&iiextmetadatafilter=LicenseShortName|License&titles=' + encodeURIComponent(tit.slice(0, 30).join('|')));
  const ops = [];
  for (const p of Object.values(j.query?.pages || {})) { const ii = p.imageinfo?.[0]; if (!ii) continue; const md = ii.extmetadata || {}; const lic = `${md.LicenseShortName?.value || ''} ${md.License?.value || ''}`;
    if (!PD.test(lic) || proib.has(p.title) || Math.min(ii.width, ii.height) < 800 || /svg|pdf|djvu/.test(ii.mime)) continue; ops.push({ arquivo: p.title, thumb: ii.thumburl, w: ii.width, h: ii.height }); }
  out[k] = ops.slice(0, 8);
}
fs.mkdirSync('cf', { recursive: true });
fs.writeFileSync('cf/cand.json', JSON.stringify(out, null, 1));
const T = 220, LAB = 220, K = 8; const ks = Object.keys(out);
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
for (let f = 0; f * 7 < ks.length; f++) {
  const bloco = ks.slice(f * 7, f * 7 + 7); const comp = [];
  for (const [li, k] of bloco.entries()) {
    const y = li * (T + 26);
    comp.push({ input: Buffer.from(`<svg width="${LAB}" height="${T + 26}"><rect width="${LAB}" height="${T + 26}" fill="#111"/><text x="6" y="22" font-size="15" font-family="sans-serif" fill="#ff0">${esc(k.split('/')[1].slice(0, 28))}</text></svg>`), top: y, left: 0 });
    for (const [i, o] of out[k].entries()) { let img; try { const b = Buffer.from(await (await fetch(o.thumb, { headers: { 'User-Agent': UA } })).arrayBuffer()); img = await sharp(b).resize(T, T, { fit: 'contain', background: '#333' }).toBuffer(); } catch { img = await sharp({ create: { width: T, height: T, channels: 3, background: '#c00' } }).png().toBuffer(); }
      comp.push({ input: img, top: y, left: LAB + i * (T + 4) }); comp.push({ input: Buffer.from(`<svg width="${T}" height="24"><rect width="${T}" height="24" fill="#000"/><text x="4" y="17" font-size="12" font-family="sans-serif" fill="#fff">${i} ${esc(o.arquivo.slice(5, 32))}</text></svg>`), top: y + T, left: LAB + i * (T + 4) }); await espera(120); }
  }
  await sharp({ create: { width: LAB + K * (T + 4), height: bloco.length * (T + 26), channels: 3, background: '#222' } }).composite(comp).jpeg({ quality: 72 }).toFile(`cf/folha-${f}.jpg`);
}
