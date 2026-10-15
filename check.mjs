import fs from 'node:fs';
const fixas = JSON.parse(fs.readFileSync('fixas.json','utf8'));
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
for (const [k, f] of Object.entries(fixas)) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=size|extmetadata&titles=' + encodeURIComponent(f);
  try {
    const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
    const p = Object.values(j.query.pages)[0];
    if (p.missing !== undefined || !p.imageinfo) { console.log(`MISSING\t${k}\t${f}`); continue; }
    const ii = p.imageinfo[0]; const m = ii.extmetadata || {};
    console.log(`OK\t${k}\t${ii.width}x${ii.height}\t${(m.LicenseShortName||{}).value}\t${(m.Artist||{}).value?.replace(/<[^>]+>/g,'').slice(0,40)}\t${f}`);
  } catch (e) { console.log(`ERR\t${k}\t${e.message}`); }
  await new Promise(r=>setTimeout(r,300));
}
