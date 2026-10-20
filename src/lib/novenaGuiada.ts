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
  const temDias = dias.length === 9;
  if (!inicial && !final && !temDias && !suplica) return null;

  // título que só introduz os nove dias ("Meditações diárias", "Novena de X: os 9 dias")
  const remover: { ini: number; fim: number }[] = [];
  if (temDias) {
    const pai = [...ts].reverse().find((t) => t.nivel < dias[0].nivel && t.ini < dias[0].ini);
    if (pai && pai.fim <= dias[0].ini && limpar(corpo(html, pai)).length < 400) {
      const filhos = ts.filter((t) => t.ini > pai.ini && t.ini < pai.fimArvore);
      const soRoteiro = filhos.every((f) => dias.includes(f) || f === inicial || f === final || f === roteiro);
      if (soRoteiro) remover.push({ ini: pai.ini, fim: pai.fim });
    }
  }

  const parte = (t: Titulo | undefined): ParteNovena | null => (t ? { titulo: t.texto, html: rebaixar(corpo(html, t)) } : null);
  const partes = [roteiro, inicial, suplica, final, ...(temDias ? dias : [])].filter(Boolean) as Titulo[];
  for (const t of partes) remover.push({ ini: t.ini, fim: t.fim });
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
    dias: temDias ? dias.map((d) => parte(d)!) : [],
    final: parte(final),
    ladainha: l ? { ...l, href: `/ladainhas/${lad}` } : null,
  };
}
