import fs from 'node:fs';
const qs = JSON.parse(fs.readFileSync('buscas.json','utf8'));
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
const strip = s => (s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const API = 'https://commons.wikimedia.org/w/api.php?action=query&format=json';
for (const q of qs) {
  let u;
  console.log('### ' + q);
  if (q.startsWith('cat:')) {
    const c = 'Category:' + q.slice(4);
    try {
      const s = await (await fetch(API + '&list=categorymembers&cmtype=subcat&cmlimit=50&cmtitle=' + encodeURIComponent(c), { headers: { 'User-Agent': UA } })).json();
      const subs = (s.query?.categorymembers || []).map(m => m.title.replace('Category:', ''));
      if (subs.length) console.log('SUBCATS: ' + subs.join(' | '));
    } catch (e) {}
    u = API + '&generator=categorymembers&gcmtype=file&gcmlimit=60&gcmtitle=' + encodeURIComponent(c) + '&prop=imageinfo&iiprop=size|extmetadata';
  } else {
    u = API + '&generator=search&gsrnamespace=6&gsrlimit=30&gsrsearch=' + encodeURIComponent(q) + '&prop=imageinfo&iiprop=size|extmetadata';
  }
  const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
  for (const p of Object.values(j.query?.pages || {})) {
    const ii = p.imageinfo?.[0]; if (!ii) continue;
    const lic = ii.extmetadata?.LicenseShortName?.value;
    if (ii.width >= 1000) console.log(`${ii.width}x${ii.height}\t${lic}\t${p.title}\t| ${strip(ii.extmetadata?.ImageDescription?.value).slice(0,140)}`);
  }
  await new Promise(r=>setTimeout(r,400));
}
