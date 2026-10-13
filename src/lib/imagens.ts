/**
 * Imagens responsivas das pinturas dos artigos (só no build).
 *
 * As versões menores (arte/<nome>-240.webp, -480.webp, -960.webp) são criadas por
 * `npm run imagens:variantes`. Aqui o build lista o que existe no Storage uma única vez
 * e devolve src/srcset só para as versões que existem: se faltar alguma, a página usa
 * a imagem original, sem quebrar.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/site';

const BUCKET = 'article-images';
const PASTA = 'arte';
const LARGURAS = [240, 480, 640, 960] as const;
const VERSAO = 'q60'; // igual a scripts/imagens-variantes.mjs
const PREFIXO = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${PASTA}/`;

let listagem: Promise<Set<string>> | null = null;

async function listar(): Promise<Set<string>> {
  const nomes = new Set<string>();
  try {
    for (let offset = 0; ; offset += 1000) {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix: PASTA, limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } }),
      });
      if (!res.ok) break;
      const lote = (await res.json()) as { name: string }[];
      lote.forEach((f) => nomes.add(f.name));
      if (lote.length < 1000) break;
    }
  } catch {
    /* sem listagem: usa as imagens originais */
  }
  return nomes;
}

const existentes = () => (listagem ??= listar());

export interface ImagemResponsiva {
  src: string;
  srcset?: string;
}

/**
 * @param url    URL original (image_url do artigo)
 * @param ideal  largura que melhor serve de src padrão (240, 480 ou 960)
 */
export async function imagemResponsiva(url: string, ideal: 240 | 480 | 640 | 960 = 480, incluirOriginal = false, maxima = 960): Promise<ImagemResponsiva> {
  if (!url.startsWith(PREFIXO)) return { src: url };
  const [caminho, query] = url.slice(PREFIXO.length).split('?');
  const base = caminho.replace(/\.(jpe?g|png)$/i, '');
  if (base === caminho) return { src: url };
  const nomes = await existentes();
  const v = query ? `?${query}` : '';
  const disponiveis = LARGURAS.filter((w) => w <= maxima && nomes.has(`${base}-${VERSAO}-${w}.webp`));
  if (!disponiveis.length) return { src: url };
  const padrao = disponiveis.includes(ideal) ? ideal : disponiveis[disponiveis.length - 1];
  return {
    src: `${PREFIXO}${base}-${VERSAO}-${padrao}.webp${v}`,
    // As pinturas originais têm até 1280 px de largura (scripts/imagens-buscar.mjs)
    srcset: [...disponiveis.map((w) => `${PREFIXO}${base}-${VERSAO}-${w}.webp${v} ${w}w`), ...(incluirOriginal ? [`${url} 1280w`] : [])].join(', '),
  };
}
