/**
 * "Reze a novena": junta numa sequência só o que se reza a cada dia
 * (como rezar, oração inicial, oração do dia, oração final e ladainha).
 *
 * As partes saem do próprio texto do artigo (pelos títulos) e deixam de aparecer
 * soltas ao longo da página: o artigo fica com a explicação, o roteiro fica com a oração.
 * A ladainha vem do artigo da ladainha correspondente, sem precisar trocar de página.
 */

export interface ParteNovena {
  titulo: string;
  html: string;
}
export interface NovenaGuiada {
  /** HTML do artigo sem as partes de oração, com o marcador onde entra o roteiro */
  artigo: string;
  roteiro: ParteNovena | null;
  inicial: ParteNovena | null;
  suplica: ParteNovena | null;
  dias: ParteNovena[];
  final: ParteNovena | null;
  ladainha: (ParteNovena & { href: string }) | null;
}

export const MARCADOR_GUIA = '<div data-guia-novena></div>';

/** Ladainha que acompanha cada novena (só onde existe uma que corresponde de fato) */
const LAURETANA = 'ladainha-de-nossa-senhora-ladainha-lauretana';
export const LADAINHA_DA_NOVENA: Record<string, string> = {
  'novena-a-nossa-senhora-aparecida': 'ladainha-de-nossa-senhora-aparecida',
  'novena-a-nossa-senhora-auxiliadora': LAURETANA,
  'novena-a-nossa-senhora-das-dores': LAURETANA,
  'novena-a-nossa-senhora-de-fatima': LAURETANA,
  'novena-a-nossa-senhora-de-lourdes-pela-cura': LAURETANA,
  'novena-a-nossa-senhora-desatadora-dos-nos': LAURETANA,
  'novena-a-nossa-senhora-do-bom-parto': LAURETANA,
  'novena-a-nossa-senhora-do-carmo': LAURETANA,
  'novena-a-nossa-senhora-do-perpetuo-socorro': LAURETANA,
  'novena-a-nossa-senhora-do-rosario': LAURETANA,
  'novena-ao-imaculado-coracao-de-maria': LAURETANA,
  'novena-da-imaculada-conceicao': LAURETANA,
  'novena-de-nossa-senhora-das-gracas': LAURETANA,
  'novena-de-nossa-senhora-de-guadalupe': LAURETANA,
  'novena-a-sagrada-familia': 'ladainha-da-sagrada-familia',
  'novena-de-santa-luzia': 'ladainha-de-santa-luzia',
  'novena-a-santa-monica': 'ladainha-de-santa-monica',
  'novena-a-santa-rita-de-cassia': 'ladainha-de-santa-rita-de-cassia',
  'novena-a-santa-teresinha-com-reflexoes': 'ladainha-de-santa-teresinha-do-menino-jesus',
  'novena-a-santo-antonio-de-padua': 'ladainha-de-santo-antonio-de-padua',
  'novena-a-santo-expedito': 'ladainha-de-santo-expedito',
  'novena-a-sao-benedito': 'ladainha-da-humildade',
  'novena-a-sao-bento-contra-o-mal': 'ladainha-de-sao-bento',
  'novena-a-sao-francisco-de-assis': 'ladainha-de-sao-francisco-de-assis',
  'novena-a-sao-jorge': 'ladainha-de-sao-jorge',
  'novena-a-sao-jose-para-o-trabalho-e-a-familia': 'ladainha-de-sao-jose',
  'novena-de-sao-judas-tadeu': 'ladainha-de-sao-judas-tadeu',
  'novena-a-sao-miguel-arcanjo': 'ladainha-de-sao-miguel-arcanjo',
  'novena-a-sao-padre-pio': 'ladainha-de-sao-padre-pio',
  'novena-ao-espirito-santo-completa-com-meditacoes': 'ladainha-do-espirito-santo',
  'novena-ao-sagrado-coracao-de-jesus': 'ladainha-do-sagrado-coracao-de-jesus',
  'novena-da-divina-misericordia': 'ladainha-da-divina-misericordia-oracao-significado',
  'novena-das-maos-ensanguentadas-para-causas-impossiveis': 'ladainha-do-preciosissimo-sangue-de-jesus',
};

/** Títulos que fogem do padrão em alguma novena */
const FINAL_EXTRA: Record<string, RegExp> = {
  'novena-ao-divino-pai-eterno': /^consagração ao divino pai eterno/,
};

interface Titulo {
  nivel: number;
  texto: string;
  ini: number; // início do <hN>
  fim: number; // fim da seção: próximo título de qualquer nível
  fimArvore: number; // fim da seção com os subtítulos: próximo título de nível igual ou maior
}

const limpar = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

function titulos(html: string): Titulo[] {
  const out: Titulo[] = [];
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push({ nivel: Number(m[1]), texto: limpar(m[2]), ini: m.index, fim: 0, fimArvore: 0 });
  out.forEach((t, i) => {
    t.fim = out[i + 1]?.ini ?? html.length;
    const prox = out.slice(i + 1).find((o) => o.nivel <= t.nivel);
    t.fimArvore = prox?.ini ?? html.length;
  });
  return out;
}

const ORDINAIS = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto', 'sétimo', 'oitavo', 'nono'];
function numeroDoDia(texto: string): number | null {
  const t = texto.toLowerCase();
  const n = t.match(/^(\d)\s*[ºo°]?\s*dia\b/);
  if (n) return Number(n[1]);
  const o = ORDINAIS.findIndex((p) => t.startsWith(`${p} dia`) || (p === 'sétimo' && t.startsWith('setimo dia')));
  return o >= 0 ? o + 1 : null;
}

/** Corpo da seção sem o título */
const corpo = (html: string, t: Titulo, ate = t.fim) => html.slice(html.indexOf('>', html.indexOf(`</h${t.nivel}`, t.ini)) + 1, ate).trim();
/** Rebaixa os títulos internos para não entrarem no sumário da página */
const rebaixar = (html: string) => html.replace(/<h[23]([^>]*)>([\s\S]*?)<\/h[23]>/gi, '<h4$1>$2</h4>');

export function extrairLadainha(html: string): ParteNovena | null {
  const ts = titulos(html);
  const ehTexto = (t: Titulo) => !t.texto.endsWith('?') && /\btexto\b/i.test(t.texto) && !/oração/i.test(t.texto);
  let alvo = ts.find(ehTexto);
  if (!alvo) {
    // "Ladainha de São Padre Pio de Pietrelcina": o título é o próprio nome e a seção tem as invocações
    alvo = ts.find((t) => /^(a )?ladainha d/i.test(t.texto) && !t.texto.endsWith('?') && /rogai|tende piedade/i.test(html.slice(t.ini, t.fimArvore)));
  }
  if (!alvo) return null;
  let fim = alvo.fimArvore;
  const prox = ts.find((t) => t.ini === fim);
  if (prox && /^ora[çc][ãa]o( final| conclusiva)?$/i.test(prox.texto)) fim = prox.fimArvore;
  const inicio = html.indexOf('>', html.indexOf(`</h${alvo.nivel}`, alvo.ini)) + 1;
  const miolo = html.slice(inicio, fim).trim();
  if (!/rogai|tende piedade|livrai-me|ouvi-nos/i.test(miolo)) return null;
  return { titulo: alvo.texto.replace(/\s*\(texto[^)]*\)?\s*$/i, '').replace(/:\s*texto completo$/i, '').replace(/^texto( completo)?( da| de)?\s*/i, '').trim(), html: rebaixar(miolo) };
}

export function montarNovena(slug: string, html: string, ladainhas: Map<string, { titulo: string; html: string }>): NovenaGuiada | null {
  const ts = titulos(html);
  // nada da seção de perguntas frequentes entra no roteiro
  const faq = ts.find((t) => t.nivel === 2 && /^perguntas frequentes/i.test(t.texto));
  const validos = ts.filter((t) => !t.texto.endsWith('?') && (!faq || t.ini < faq.ini));

  const achar = (re: RegExp) => validos.find((t) => re.test(t.texto.toLowerCase()));
  const roteiro = achar(/^(roteiro diário da novena|estrutura da novena|passo a passo da novena)$/);
  const inicial = achar(/^ora[çc](ão|ões) (inicial|iniciais|preparat)/);
  const suplica = achar(/^oração da novena/);
  const final = achar(/^ora[çc]ão final/) ?? (FINAL_EXTRA[slug] ? achar(FINAL_EXTRA[slug]) : undefined);

  const dias: Titulo[] = [];
  for (const t of validos) {
    const n = numeroDoDia(t.texto);
    if (n && n === dias.length + 1) dias.push(t);
  }
  // dias escritos como parágrafo: <p><strong>1º Dia: título</strong><br>texto</p>
  const diasP: { titulo: string; html: string; ini: number; fim: number }[] = [];
  if (dias.length !== 9) {
    const reP = /<p[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*(?:<br\s*\/?>)?([\s\S]*?)<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = reP.exec(html))) {
      const titulo = limpar(m[1]).replace(/[:.]\s*$/, '');
      if (faq && m.index > faq.ini) break;
      if (numeroDoDia(titulo) === diasP.length + 1) diasP.push({ titulo, html: `<p>${m[2].trim()}</p>`, ini: m.index, fim: m.index + m[0].length });
    }
  }
  const temDias = dias.length === 9 || diasP.length === 9;
  if (!inicial && !final && !temDias && !suplica) return null;

  // título que só introduz os nove dias ("Meditações diárias", "Novena de X: os 9 dias")
  const remover: { ini: number; fim: number }[] = [];
  if (dias.length === 9) {
    const pai = [...ts].reverse().find((t) => t.nivel < dias[0].nivel && t.ini < dias[0].ini);
    if (pai && pai.fim <= dias[0].ini && limpar(corpo(html, pai)).length < 400) {
      const filhos = ts.filter((t) => t.ini > pai.ini && t.ini < pai.fimArvore);
      const soRoteiro = filhos.every((f) => dias.includes(f) || f === inicial || f === final || f === roteiro);
      if (soRoteiro) remover.push({ ini: pai.ini, fim: pai.fim });
    }
  }

  const parte = (t: Titulo | undefined): ParteNovena | null => (t ? { titulo: t.texto, html: rebaixar(corpo(html, t)) } : null);
  const partes = [roteiro, inicial, suplica, final, ...(dias.length === 9 ? dias : [])].filter(Boolean) as Titulo[];
  for (const t of partes) remover.push({ ini: t.ini, fim: t.fim });
  if (diasP.length === 9) {
    for (const d of diasP) remover.push({ ini: d.ini, fim: d.fim });
    // o título "Meditações diárias" que só tinha os parágrafos dos dias também sai
    const pai = [...ts].reverse().find((t) => t.ini < diasP[0].ini);
    if (pai && pai.fim >= diasP[8].fim && limpar(html.slice(diasP[8].fim, pai.fim)).length === 0 && limpar(corpo(html, pai, diasP[0].ini)).length < 400) {
      remover.push({ ini: pai.ini, fim: diasP[0].ini });
      remover.push({ ini: diasP[8].fim, fim: pai.fim });
    }
  }
  remover.sort((a, b) => a.ini - b.ini);

  let artigo = '';
  let pos = 0;
  remover.forEach((r, i) => {
    artigo += html.slice(pos, r.ini) + (i === 0 ? MARCADOR_GUIA : '');
    pos = Math.max(pos, r.fim);
  });
  artigo += html.slice(pos);

  const lad = LADAINHA_DA_NOVENA[slug];
  const l = lad ? ladainhas.get(lad) : undefined;
  return {
    artigo,
    roteiro: parte(roteiro),
    inicial: parte(inicial),
    suplica: parte(suplica),
    dias: dias.length === 9 ? dias.map((d) => parte(d)!) : diasP.length === 9 ? diasP.map((d) => ({ titulo: d.titulo, html: d.html })) : [],
    final: parte(final),
    ladainha: l ? { ...l, href: `/ladainhas/${lad}` } : null,
  };
}

// ───────── Orações que a novena manda rezar sem escrever o texto ─────────

export const SINAL_DA_CRUZ = 'Pelo sinal da Santa Cruz, livrai-nos, Deus, nosso Senhor, dos nossos inimigos. Em nome do Pai e do Filho e do Espírito Santo. Amém.';
export const SINAL_FINAL = 'Em nome do Pai e do Filho e do Espírito Santo. Amém.';
const PAI_NOSSO = 'Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.';
const AVE_MARIA = 'Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém.';
const GLORIA = 'Glória ao Pai e ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.';

const NUMEROS: Record<string, number> = { um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10 };
const quantos = (s?: string) => (s ? NUMEROS[s.toLowerCase()] ?? (Number(s) || 1) : 1);
const NUM = '(um|uma|dois|duas|três|tres|quatro|cinco|seis|sete|oito|nove|dez|\\d+)';
const RE_PAI = new RegExp(`\\b${NUM}\\s+pai[- ]nossos?\\b`, 'i');
const RE_AVE = new RegExp(`\\b${NUM}\\s+ave[- ]marias?\\b`, 'i');
const RE_GLORIA = new RegExp(`\\b${NUM}\\s+glória\\b`, 'i');

export interface OracoesBasicas { pai: number; ave: number; gloria: number }

/** Lê "um Pai-Nosso, três Ave-Marias e um Glória" de um trecho de texto */
export function lerOracoesBasicas(texto: string): OracoesBasicas | null {
  const p = texto.match(RE_PAI);
  const a = texto.match(RE_AVE);
  const g = texto.match(RE_GLORIA);
  if (!p && !a) return null;
  return { pai: p ? quantos(p[1]) : 0, ave: a ? quantos(a[1]) : 0, gloria: g ? quantos(g[1]) : /glória/i.test(texto) ? 1 : 0 };
}

const vezes = (n: number) => (n > 1 ? ` (reze ${n} vezes)` : '');
/** Bloco com o texto completo das orações pedidas */
export function blocoOracoesBasicas(o: OracoesBasicas): string {
  const item = (nome: string, texto: string, n: number) => (n ? `<div class="ob-item"><p class="ob-nome">${nome}${vezes(n)}</p><blockquote><p>${texto}</p></blockquote></div>` : '');
  return `<div class="oracoes-basicas">${item('Pai-Nosso', PAI_NOSSO, o.pai)}${item('Ave-Maria', AVE_MARIA, o.ave)}${item('Glória', GLORIA, o.gloria)}</div>`;
}

/** Depois de cada instrução curta ("Reze um Pai-Nosso, uma Ave-Maria e um Glória"), coloca o texto das orações */
export function comOracoesBasicas(html: string): { html: string; achou: boolean } {
  let achou = false;
  const saida = html.replace(/<(p|li)([^>]*)>([\s\S]*?)<\/\1>/gi, (m, tag: string, _attrs, dentro) => {
    const texto = limpar(dentro);
    if (texto.length > 260 || /santificado seja|cheia de graça/i.test(texto)) return m;
    // "Pai-Nosso, Ave-Maria e Glória." sozinho num parágrafo também é instrução (um de cada)
    const lista = texto.length < 60 && /pai[- ]nosso/i.test(texto) && /ave[- ]maria/i.test(texto) ? { pai: 1, ave: 1, gloria: /glória/i.test(texto) ? 1 : 0 } : null;
    const o = lerOracoesBasicas(texto) ?? lista;
    if (!o) return m;
    achou = true;
    // dentro de uma lista o bloco fica no próprio item, para o HTML continuar válido
    return tag.toLowerCase() === 'li' ? m.replace(/<\/li>$/i, `${blocoOracoesBasicas(o)}</li>`) : m + blocoOracoesBasicas(o);
  });
  return { html: saida, achou };
}
