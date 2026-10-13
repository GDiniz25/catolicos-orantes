/**
 * Sanitização de HTML no build (Node), sem depender de DOM.
 */
import sanitizeHtml from 'sanitize-html';
import { stripArticleMedia } from '@/lib/articleMedia';

const ARTICLE_TAGS = [
  'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
  'blockquote', 'cite', 'q', 'ul', 'ol', 'li', 'a', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'div', 'span', 'section', 'aside', 'figure', 'figcaption', 'img', 'code', 'pre', 'abbr', 'dl', 'dt', 'dd',
];

/** HTML do artigo pronto para exibir: sem mídia inline, sem H1 duplicado, links externos seguros. */
export function cleanArticleHtml(raw: string): string {
  // Remove o H1 inicial (o título já aparece no topo da página)
  const withoutTitle = (raw || '').replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
  const withoutMedia = stripArticleMedia(withoutTitle);
  return sanitizeHtml(withoutMedia, {
    allowedTags: ARTICLE_TAGS,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      '*': ['class', 'id'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      h1: 'h2',
      a: (tagName, attribs) => {
        const href = attribs.href || '';
        const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?catolicosorantes\.com\.br/i.test(href);
        if (external) {
          return { tagName, attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' } };
        }
        // Links internos absolutos viram relativos
        const internal = href.replace(/^https?:\/\/(www\.)?catolicosorantes\.com\.br/i, '') || '/';
        const { target: _t, rel: _r, ...rest } = attribs;
        return { tagName, attribs: { ...rest, href: /^https?:/i.test(href) ? internal : href } };
      },
    },
  });
}

/** Liturgia (HTML vindo da CNBB) */
export function sanitizeLiturgyServer(html: string): string {
  return sanitizeHtml(html || '', {
    allowedTags: ['p', 'br', 'b', 'strong', 'i', 'em', 'div', 'span', 'font', 'center', 'blockquote'],
    allowedAttributes: { '*': ['style', 'class', 'align', 'color'] },
    // Sem allowedStyles: os estilos inline da CNBB passam intactos (o CSS depende deles)
  });
}

/** Texto puro (para descrições, contagem de palavras etc.) */
export const htmlToText = (html: string) =>
  sanitizeHtml(html || '', { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();

/**
 * Tabelas dos artigos no celular: cada linha vira um cartão e cada célula ganha o nome
 * da coluna (data-label), para nada sair da largura da tela. No computador a tabela fica igual.
 */
export function tabelasResponsivas(html: string): string {
  const texto = (s: string) =>
    s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (inteira, atributos: string, corpo: string) => {
    // Cabeçalhos: do <thead> ou, se não houver, da primeira linha com <th>
    const cab = corpo.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/i)?.[1] ?? corpo.match(/<tr\b[^>]*>((?:(?!<\/tr>)[\s\S])*?<th\b[\s\S]*?)<\/tr>/i)?.[1];
    if (!cab) return inteira;
    const nomes = [...cab.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => texto(m[1]));
    if (nomes.length < 2) return inteira;
    const novoCorpo = corpo.replace(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi, (linha, atr: string, celulas: string) => {
      if (!/<td\b/i.test(celulas)) return linha;
      let i = 0;
      const comRotulo = celulas.replace(/<td\b([^>]*)>/gi, (td, a: string) => {
        const nome = nomes[i++];
        return nome && !/data-label=/i.test(a) ? `<td${a} data-label="${attr(nome)}">` : td;
      });
      return `<tr${atr}>${comRotulo}</tr>`;
    });
    return `<table${atributos} data-cartoes>${novoCorpo}</table>`;
  });
}
