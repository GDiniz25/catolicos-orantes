import fs from 'node:fs';
import sharp from 'sharp';
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
const strip = s => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const cfg = JSON.parse(fs.readFileSync('biblia-img.json', 'utf8'));
fs.mkdirSync('biblia-img', { recursive: true });
const meta = {};
let falhas = 0;
for (const [slug, item] of Object.entries(cfg)) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1600&titles=' + encodeURIComponent(item.arquivo);
  try {
    const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
    const p = Object.values(j.query.pages)[0];
    const ii = p.imageinfo?.[0];
    if (!ii?.thumburl) throw new Error('sem thumburl');
    const r = await fetch(ii.thumburl, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    const out = await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    fs.writeFileSync(`biblia-img/${slug}.jpg`, out);
    const info = await sharp(out).metadata();
    const m = ii.extmetadata || {};
    meta[slug] = { arquivo: p.title, original: `${ii.width}x${ii.height}`, saida: `${info.width}x${info.height}`, bytes: out.length,
      licenca: strip(m.LicenseShortName?.value), autor: strip(m.Artist?.value).slice(0, 80), data: strip(m.DateTimeOriginal?.value).slice(0, 80),
      titulo: strip(m.ObjectName?.value).slice(0, 120), credito: strip(m.Credit?.value).slice(0, 160) };
    console.log('OK', slug, meta[slug].saida, out.length);
  } catch (e) { falhas++; console.log('ERRO', slug, e.message); }
  await new Promise(r => setTimeout(r, 500));
}
fs.writeFileSync('biblia-img/meta.json', JSON.stringify(meta, null, 1));
if (falhas) process.exitCode = 1;
