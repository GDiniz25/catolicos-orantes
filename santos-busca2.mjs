// 2ª rodada: Commons por "retrata" (P180 = item do Wikidata) e por busca de texto.
// Aceita domínio público, CC0 e CC BY / CC BY-SA (com crédito). Gera santos2/cand.json e folhas.
import fs from 'node:fs';
import sharp from 'sharp';
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function json(u, tent = 4) {
  for (let t = 0; t < tent; t++) {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) });
      if (r.ok) return await r.json();
      console.log('HTTP', r.status);
    } catch (e) { console.log('ERRO', e.message); }
    await espera(3000 * (t + 1));
  }
  return {};
}
const lista = JSON.parse(fs.readFileSync('santos/resto2.json', 'utf8'));
const proibidos = new Set(JSON.parse(fs.readFileSync('santos/usados.json', 'utf8')));
const PD = /public domain|^\s*pd\b|\bpd-|\bpdm\b|cc0|cc-zero/i;
const CC = /cc[ -]by(-sa)?[ -]\d/i;
async function busca(q, n = 12) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=' + n + '&srsearch=' + encodeURIComponent(q + ' filetype:bitmap');
  const j = await json(u);
  return (j.query?.search || []).map((s) => s.title);
}
async function infos(titulos) {
  const out = [];
  for (let i = 0; i < titulos.length; i += 40) {
    const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=400&iiextmetadatafilter=LicenseShortName|License|Artist&titles=' + encodeURIComponent(titulos.slice(i, i + 40).join('|'));
    const j = await json(u);
    const porT = {};
    for (const p of Object.values(j.query?.pages || {})) porT[p.title] = p;
    for (const t of titulos.slice(i, i + 40)) {
      const p = porT[t]; const ii = p?.imageinfo?.[0]; if (!ii) continue;
      const md = ii.extmetadata || {};
      const lic = `${md.LicenseShortName?.value || ''} ${md.License?.value || ''}`;
      out.push({ arquivo: p.title, w: ii.width, h: ii.height, mime: ii.mime, thumb: ii.thumburl, lic: strip(md.LicenseShortName?.value), pd: PD.test(lic), cc: CC.test(lic), autor: strip(md.Artist?.value).slice(0, 60) });
    }
  }
  return out;
}
const cand = [];
for (const s of lista) {
  const consultas = [];
  if (s.item) consultas.push(`haswbstatement:P180=${s.item}`);
  consultas.push(...(s.q || []));
  const titulos = [];
  for (const q of consultas) { for (const t of await busca(q)) if (!titulos.includes(t)) titulos.push(t); await espera(250); }
  const inf = (await infos(titulos.slice(0, 30))).filter((f) => (f.pd || f.cc) && f.thumb && Math.min(f.w, f.h) >= 450 && !/svg|pdf|djvu/.test(f.mime) && !proibidos.has(f.arquivo));
  inf.sort((a, b) => (b.pd - a.pd));
  cand.push({ ...s, opcoes: inf.slice(0, 6) });
  console.log(inf.length ? 'OK ' : '-- ', s.nome);
}
fs.mkdirSync('santos2', { recursive: true });
fs.writeFileSync('santos2/cand.json', JSON.stringify(cand, null, 1));
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function wrap(t, n) { const ws = t.split(' '); const l = ['']; for (const w of ws) { if ((l[l.length - 1] + ' ' + w).trim().length > n) l.push(w); else l[l.length - 1] = (l[l.length - 1] + ' ' + w).trim(); } return l; }
const T = 200, LAB = 230, K = 6;
const com = cand.map((c, i) => ({ ...c, n: i })).filter((c) => c.opcoes.length);
const POR = 10;
for (let f = 0; f * POR < com.length; f++) {
  const bloco = com.slice(f * POR, f * POR + POR);
  const comp = [];
  for (const [li, c] of bloco.entries()) {
    const y = li * (T + 30);
    comp.push({ input: Buffer.from(`<svg width="${LAB}" height="${T + 30}"><rect width="${LAB}" height="${T + 30}" fill="#111"/><text x="6" y="22" font-size="18" font-family="sans-serif" fill="#ff0">#${c.n}</text>${wrap(c.nome, 24).slice(0, 6).map((l, k) => `<text x="6" y="${46 + k * 19}" font-size="15" font-family="sans-serif" fill="#fff">${esc(l)}</text>`).join('')}<text x="6" y="${T + 20}" font-size="13" font-family="sans-serif" fill="#8cf">${esc(c.data)}</text></svg>`), top: y, left: 0 });
    for (const [k, o] of c.opcoes.entries()) {
      let buf;
      try { const r = await fetch(o.thumb, { headers: { 'User-Agent': UA } }); buf = Buffer.from(await r.arrayBuffer()); } catch {}
      let img;
      try { img = await sharp(buf).resize(T, T, { fit: 'contain', background: '#333' }).toBuffer(); } catch { img = await sharp({ create: { width: T, height: T, channels: 3, background: '#c00' } }).png().toBuffer(); }
      comp.push({ input: img, top: y, left: LAB + k * (T + 6) });
      comp.push({ input: Buffer.from(`<svg width="${T}" height="26"><rect width="${T}" height="26" fill="#000"/><text x="4" y="18" font-size="12" font-family="sans-serif" fill="${o.pd ? '#fff' : '#f90'}">${k} ${esc(o.arquivo.replace(/^File:/, '').slice(0, 26))}</text></svg>`), top: y + T, left: LAB + k * (T + 6) });
      await espera(120);
    }
  }
  await sharp({ create: { width: LAB + K * (T + 6), height: bloco.length * (T + 30), channels: 3, background: '#222' } }).composite(comp).jpeg({ quality: 70 }).toFile(`santos2/folha-${String(f).padStart(2, '0')}.jpg`);
}
console.log('com opções:', com.length, 'de', cand.length);
