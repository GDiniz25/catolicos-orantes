/**
 * Depois do build: copia para dist/img/ as imagens que as páginas usam do Storage do Supabase
 * e troca os endereços no HTML para o próprio domínio.
 *
 * Por quê: cada imagem servida pelo Supabase depende do banco do projeto. Se o banco fica lento,
 * as imagens somem do site. Servidas pela Hostinger, elas aparecem sempre.
 *
 * - Usa um cache local (.cache/imagens, guardado entre builds pelo GitHub Actions): só baixa o que é novo.
 * - O ?v= da URL vira parte do nome do arquivo, então imagem trocada ganha arquivo novo (sem cache velho).
 * - Se um download falhar, aquela imagem continua com o endereço do Supabase (nada quebra).
 *
 * Uso: node scripts/espelhar-imagens.mjs   (rodar depois de npm run build)
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const CACHE = '.cache/imagens';
const SITE = 'https://catolicosorantes.com.br';
const PREFIXO_RE = /https:\/\/dialdbrhpqrwilsisnkn\.supabase\.co\/storage\/v1\/object\/public\/([a-z0-9_-]+)\/([^"'\s)?,&]+?\.(?:jpe?g|png|webp|gif))(?:\?v=([a-z0-9]+))?(?=["'\s),&])/gi;
const UA = 'CatolicosOrantes/1.0 (contato@catolicosorantes.com.br)';

function arquivos(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) arquivos(p, out);
    else if (/\.(html|xml|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

const destinoDe = (bucket, caminho, v) => {
  const ext = path.extname(caminho);
  const base = caminho.slice(0, -ext.length);
  return `${bucket}/${base}${v ? `-${v}` : ''}${ext}`;
};

const lista = arquivos(DIST);
const usadas = new Map(); // url completa -> destino relativo
for (const f of lista) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(PREFIXO_RE)) usadas.set(m[0], destinoDe(m[1], m[2], m[3]));
}
console.log(`${lista.length} arquivos, ${usadas.size} imagens do Storage referenciadas`);

fs.mkdirSync(CACHE, { recursive: true });
const ok = new Map();
const falhas = [];
const fila = [...usadas.entries()];
let baixadas = 0;
async function trabalhador() {
  for (let item; (item = fila.shift()); ) {
    const [url, rel] = item;
    const cache = path.join(CACHE, rel);
    try {
      if (!fs.existsSync(cache) || fs.statSync(cache).size === 0) {
        let erro;
        for (let t = 0; t < 3; t++) {
          try {
            const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const buf = Buffer.from(await r.arrayBuffer());
            if (!buf.length) throw new Error('vazio');
            fs.mkdirSync(path.dirname(cache), { recursive: true });
            fs.writeFileSync(cache, buf);
            baixadas++;
            erro = null;
            break;
          } catch (e) {
            erro = e;
            await new Promise((s) => setTimeout(s, 1500 * (t + 1)));
          }
        }
        if (erro) throw erro;
      }
      const destino = path.join(DIST, 'img', rel);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.copyFileSync(cache, destino);
      ok.set(url, `/img/${rel}`);
    } catch (e) {
      falhas.push(`${rel}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, trabalhador));
console.log(`${ok.size} imagens servidas pelo site (${baixadas} baixadas agora, o resto do cache); ${falhas.length} falhas`);
falhas.slice(0, 20).forEach((f) => console.log('  - ' + f));

// Troca os endereços: atributos de imagem usam caminho relativo; metadados (og:image, JSON-LD) usam URL absoluta
let trocados = 0;
for (const f of lista) {
  const t = fs.readFileSync(f, 'utf8');
  const novo = t.replace(PREFIXO_RE, (m, _b, _c, _v, off, s) => {
    const local = ok.get(m);
    if (!local) return m;
    trocados++;
    const antes = s.slice(Math.max(0, off - 40), off);
    const absoluta = /content="$|"(url|image|contentUrl|thumbnailUrl)"\s*:\s*"$/.test(antes) || f.endsWith('.xml') || f.endsWith('.json');
    return absoluta ? `${SITE}${local}` : local;
  });
  if (novo !== t) fs.writeFileSync(f, novo);
}
console.log(`${trocados} referências trocadas`);
// Se mais da metade falhou, avisa no log (o site continua funcionando com o Supabase nessas imagens)
if (usadas.size && falhas.length > usadas.size / 2) console.log('::warning::Mais da metade das imagens não pôde ser copiada; elas seguem pelo Supabase.');
