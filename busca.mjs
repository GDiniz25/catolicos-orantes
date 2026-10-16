import fs from 'node:fs';
const qs = JSON.parse(fs.readFileSync('buscas.json','utf8'));
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
const strip = s => (s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
for (const q of qs) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=30&gsrsearch=' + encodeURIComponent(q) + '&prop=imageinfo&iiprop=size|extmetadata';
  const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
  console.log('### ' + q);
  for (const p of Object.values(j.query?.pages || {})) {
    const ii = p.imageinfo?.[0]; if (!ii) continue;
    const lic = ii.extmetadata?.LicenseShortName?.value;
    if (ii.width >= 1000) console.log(`${ii.width}x${ii.height}\t${lic}\t${p.title}\t| ${strip(ii.extmetadata?.ImageDescription?.value).slice(0,140)}`);
  }
  await new Promise(r=>setTimeout(r,400));
}
