// Busca retrato de cada santo sem imagem: Wikidata (mesma data de festa + nome) → P18 ou categoria do Commons.
// Só aceita domínio público / CC0. Gera santos/cand.json e folhas de contato santos/folha-NN.jpg.
import fs from 'node:fs';
import sharp from 'sharp';
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';
const URL = process.env.SB_URL, KEY = process.env.SB_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function todos(q) {
  const out = [];
  for (let de = 0; ; de += 1000) {
    const r = await fetch(`${URL}/rest/v1/${q}`, { headers: { ...H, Range: `${de}-${de + 999}` } });
    if (!r.ok) throw new Error(q + ' ' + r.status);
    const l = await r.json(); out.push(...l); if (l.length < 1000) break;
  }
  return out;
}
async function json(u, tent = 4) {
  for (let t = 0; t < tent; t++) {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json, application/json' }, signal: AbortSignal.timeout(90000) });
      if (r.ok) return await r.json();
      console.log('HTTP', r.status, u.slice(0, 120));
    } catch (e) { console.log('ERRO', e.message); }
    await espera(4000 * (t + 1));
  }
  throw new Error('falhou ' + u.slice(0, 100));
}

const santos = await todos('saints_calendar?select=id,saint_name,date_month,date_day,image_url,article_slug,article_category');
const arts = await todos('articles?select=slug,category,image_url');
const imgArt = new Map(arts.map((a) => [`${a.category}/${a.slug}`, a.image_url]));
const alvo = santos.filter((s) => !s.image_url && !imgArt.get(`${s.article_category}/${s.article_slug}`));
console.log(alvo.length, 'santos sem imagem');

const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const porData = new Map(); // "m-d" → [{item, nomes, img, cat}]
for (let m = 0; m < 12; m++) {
  const q = `SELECT ?item ?dia ?img ?cat (GROUP_CONCAT(DISTINCT ?nome; separator="|") AS ?nomes) WHERE {
    ?item wdt:P841 ?d . ?d rdfs:label ?dia . FILTER(LANG(?dia)="en" && STRSTARTS(?dia, "${MESES[m]} "))
    OPTIONAL { ?item wdt:P18 ?img } OPTIONAL { ?item wdt:P373 ?cat }
    { ?item rdfs:label ?nome } UNION { ?item skos:altLabel ?nome }
    FILTER(LANG(?nome) IN ("pt","en","it","es","la","fr","de","pt-br"))
  } GROUP BY ?item ?dia ?img ?cat`;
  const j = await json('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q));
  for (const b of j.results.bindings) {
    const dia = Number(b.dia.value.split(' ')[1]);
    if (!dia) continue;
    const k = `${m + 1}-${dia}`;
    const lista = porData.get(k) || [];
    const id = b.item.value.split('/').pop();
    let it = lista.find((x) => x.item === id);
    if (!it) { it = { item: id, nomes: new Set(), imgs: new Set(), cat: null }; lista.push(it); }
    b.nomes.value.split('|').forEach((n) => it.nomes.add(n));
    if (b.img) it.imgs.add(decodeURIComponent(b.img.value.split('/').pop()).replace(/_/g, ' '));
    if (b.cat) it.cat = b.cat.value;
    porData.set(k, lista);
  }
  console.log('mês', m + 1, 'ok');
  await espera(1500);
}

const N = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/ph/g, 'f').replace(/th/g, 't').replace(/y/g, 'i').replace(/k/g, 'c').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const PARAR = new Set(['de', 'da', 'do', 'dos', 'das', 'e', 'ou', 'o', 'a', 'na', 'no', 'em', 'companheiros', 'martires', 'martir', 'santo', 'santa', 'sao', 'san', 'sant', 'beato', 'beata', 's', 'ss', 'b', 'bb', 'sr']);
const ROMANOS = new Set(['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii']);
function nucleo(nome) {
  let t = nome.split(',')[0].split(' - ')[0].split('(')[0];
  t = t.replace(/^\s*(SS?\.|BB?\.|S\.|São|Santa|Santo|Sant'|San|Beato|Beata|Santos|Santas)\s+/i, '');
  return N(t).split(' ').filter((w) => w && !PARAR.has(w));
}
function casa(tok, palavras) {
  if (ROMANOS.has(tok)) return palavras.includes(tok);
  const raiz = tok.slice(0, Math.max(3, Math.min(5, tok.length - 2)));
  return palavras.some((w) => !ROMANOS.has(w) && w.startsWith(raiz) && Math.abs(w.length - tok.length) <= 4);
}
function pontua(toks, it) {
  let melhor = 0;
  for (const n of it.nomes) {
    const ws = N(n).split(' ');
    const primeiros = toks.slice(0, toks.length > 2 ? 2 : toks.length);
    const ok = primeiros.filter((t) => casa(t, ws)).length;
    const sc = ok === primeiros.length ? ok + toks.filter((t) => casa(t, ws)).length / 10 : 0;
    melhor = Math.max(melhor, sc);
  }
  return melhor;
}

const PD = /public domain|^\s*pd\b|\bpd-|\bpdm\b|cc0|cc-zero/i;
async function infos(titulos) {
  const out = {};
  for (let i = 0; i < titulos.length; i += 40) {
    const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=400&iiextmetadatafilter=LicenseShortName|License|Artist|DateTimeOriginal|ObjectName&titles=' + encodeURIComponent(titulos.slice(i, i + 40).map((t) => 'File:' + t.replace(/^File:/, '')).join('|'));
    const j = await json(u);
    for (const p of Object.values(j.query?.pages || {})) {
      const ii = p.imageinfo?.[0]; if (!ii) continue;
      const md = ii.extmetadata || {};
      out[p.title.replace(/^File:/, '')] = { arquivo: p.title, w: ii.width, h: ii.height, mime: ii.mime, thumb: ii.thumburl,
        lic: strip(md.LicenseShortName?.value), pd: PD.test(`${md.LicenseShortName?.value || ''} ${md.License?.value || ''}`),
        autor: strip(md.Artist?.value).slice(0, 80), data: strip(md.DateTimeOriginal?.value).slice(0, 40) };
    }
    await espera(300);
  }
  return out;
}
async function daCategoria(cat) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtype=file&cmlimit=60&cmtitle=' + encodeURIComponent('Category:' + cat);
  const j = await json(u);
  return (j.query?.categorymembers || []).map((m) => m.title.replace(/^File:/, '')).filter((t) => /\.(jpe?g|png|tiff?)$/i.test(t));
}

const cand = [];
const usados = new Set();
for (const s of alvo) {
  const toks = nucleo(s.saint_name);
  const lista = porData.get(`${s.date_month}-${s.date_day}`) || [];
  const achados = toks.length ? lista.map((it) => ({ it, sc: pontua(toks, it) })).filter((x) => x.sc > 0).sort((a, b) => b.sc - a.sc) : [];
  const reg = { id: s.id, nome: s.saint_name, data: `${s.date_day}/${s.date_month}`, toks, itens: achados.slice(0, 3).map((x) => ({ item: x.it.item, nome: [...x.it.nomes].slice(0, 4).join(' / '), sc: x.sc })), opcoes: [] };
  for (const { it } of achados.slice(0, 2)) {
    let titulos = [...it.imgs];
    if (it.cat) { try { titulos.push(...(await daCategoria(it.cat))); } catch {} }
    titulos = [...new Set(titulos)].slice(0, 40);
    if (!titulos.length) continue;
    const inf = await infos(titulos);
    for (const t of titulos) {
      const f = inf[t.replace(/^File:/, '')] || inf[t];
      if (!f || !f.pd || !f.thumb || Math.min(f.w, f.h) < 500 || /svg|pdf|djvu/.test(f.mime)) continue;
      reg.opcoes.push({ ...f, item: it.item, p18: it.imgs.has(t) });
      if (reg.opcoes.length >= 4) break;
    }
    if (reg.opcoes.length) break;
  }
  cand.push(reg);
  console.log(reg.opcoes.length ? 'OK ' : '-- ', s.saint_name, reg.itens[0]?.nome || '');
}
fs.mkdirSync('santos', { recursive: true });
fs.writeFileSync('santos/cand.json', JSON.stringify(cand, null, 1));

// folhas: cada santo numa linha com até 4 opções
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = 230, LAB = 250;
const com = cand.map((c, i) => ({ ...c, n: i })).filter((c) => c.opcoes.length);
const POR = 10;
for (let f = 0; f * POR < com.length; f++) {
  const bloco = com.slice(f * POR, f * POR + POR);
  const comp = [];
  for (const [li, c] of bloco.entries()) {
    const y = li * (T + 30);
    comp.push({ input: Buffer.from(`<svg width="${LAB}" height="${T + 30}"><rect width="${LAB}" height="${T + 30}" fill="#111"/><text x="6" y="22" font-size="18" font-family="sans-serif" fill="#ff0">#${c.n}</text>${wrap(c.nome, 26).slice(0, 5).map((l, k) => `<text x="6" y="${46 + k * 20}" font-size="15" font-family="sans-serif" fill="#fff">${esc(l)}</text>`).join('')}<text x="6" y="${T + 20}" font-size="13" font-family="sans-serif" fill="#8cf">${esc(c.data + ' ' + (c.itens[0]?.nome || '').slice(0, 24))}</text></svg>`), top: y, left: 0 });
    for (const [k, o] of c.opcoes.entries()) {
      let buf;
      try { const r = await fetch(o.thumb, { headers: { 'User-Agent': UA } }); buf = Buffer.from(await r.arrayBuffer()); } catch {}
      let img;
      try { img = await sharp(buf).resize(T, T, { fit: 'contain', background: '#333' }).toBuffer(); } catch { img = await sharp({ create: { width: T, height: T, channels: 3, background: '#c00' } }).png().toBuffer(); }
      comp.push({ input: img, top: y, left: LAB + k * (T + 6) });
      comp.push({ input: Buffer.from(`<svg width="${T}" height="26"><rect width="${T}" height="26" fill="#000"/><text x="4" y="18" font-size="13" font-family="sans-serif" fill="${o.p18 ? '#0f0' : '#fff'}">${k}${o.p18 ? '*' : ''} ${esc(o.arquivo.replace(/^File:/, '').slice(0, 26))}</text></svg>`), top: y + T, left: LAB + k * (T + 6) });
      await espera(150);
    }
  }
  const out = await sharp({ create: { width: LAB + 4 * (T + 6), height: bloco.length * (T + 30), channels: 3, background: '#222' } }).composite(comp).jpeg({ quality: 70 }).toFile(`santos/folha-${String(f).padStart(2, '0')}.jpg`);
}
function wrap(t, n) { const ws = t.split(' '); const l = ['']; for (const w of ws) { if ((l[l.length - 1] + ' ' + w).trim().length > n) l.push(w); else l[l.length - 1] = (l[l.length - 1] + ' ' + w).trim(); } return l; }
console.log('com opções:', com.length, 'de', cand.length);
