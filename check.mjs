import fs from 'node:fs';
const fixas = JSON.parse(fs.readFileSync('fixas.json','utf8'));
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
const strip = s => (s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
fs.mkdirSync('thumbs',{recursive:true});
for (const [k, f] of Object.entries(fixas)) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo|categories&cllimit=30&iiprop=size|extmetadata|url&iiurlwidth=' + (k.startsWith('fr/big_') ? 1100 : 500) + '&titles=' + encodeURIComponent(f);
  try {
    const j = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
    const p = Object.values(j.query.pages)[0];
    if (p.missing !== undefined || !p.imageinfo) { console.log(`MISSING\t${k}\t${f}`); continue; }
    const ii = p.imageinfo[0]; const m = ii.extmetadata || {};
    let line = `OK\t${k}\t${ii.width}x${ii.height}\t${(m.LicenseShortName||{}).value}\t${strip((m.Artist||{}).value).slice(0,40)}\t${f}`;
    if (k.startsWith('fr/')) {
      line += `\n   DESC: ${strip((m.ImageDescription||{}).value).slice(0,400)}\n   CATS: ${(p.categories||[]).map(c=>c.title.replace('Category:','')).join(' | ').slice(0,500)}\n   LICURL: ${strip((m.LicenseUrl||{}).value)} USAGE: ${strip((m.UsageTerms||{}).value)}`;
      if (ii.thumburl) { try { const b = Buffer.from(await (await fetch(ii.thumburl,{headers:{'User-Agent':UA}})).arrayBuffer()); fs.writeFileSync('thumbs/'+k.replace(/[^a-z0-9]+/gi,'_')+'.jpg', b); } catch(e){} }
    }
    console.log(line);
  } catch (e) { console.log(`ERR\t${k}\t${e.message}`); }
  await new Promise(r=>setTimeout(r,300));
}
