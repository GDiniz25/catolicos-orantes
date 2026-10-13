/**
 * Ano litúrgico (calendário romano, com as regras do Brasil para Epifania e Batismo do Senhor).
 * Funções puras: rodam no build e no navegador (a faixa e a roda se atualizam no dia certo).
 */

export type CorLiturgica = 'verde' | 'roxo' | 'branco' | 'vermelho';

export interface Tempo {
  id: 'adv' | 'nat' | 'tc1' | 'qua' | 'tri' | 'pas' | 'tc2';
  nome: string;
  curto: string;
  inicio: string; // AAAA-MM-DD
  fim: string; // AAAA-MM-DD (inclusive)
  cor: CorLiturgica;
  texto: string;
}

export interface InfoDia {
  data: string;
  tempo: Tempo;
  rotulo: string; // ex.: "Tempo Comum, 28ª semana"
  tempos: Tempo[];
  /** posição de hoje na roda, em graus (0 = topo, sentido horário) */
  angulo: number;
  proximo: { nome: string; dias: number };
  anoLiturgico: string; // ex.: "2025/2026"
}

/** Cores para tela: fundo forte, fundo suave e cor do texto sobre o fundo forte */
export const CORES: Record<CorLiturgica, { forte: string; suave: string; texto: string; nome: string }> = {
  verde: { forte: '#3F7A50', suave: '#E6EFE8', texto: '#FFFFFF', nome: 'verde' },
  roxo: { forte: '#6A4A7C', suave: '#EFE8F2', texto: '#FFFFFF', nome: 'roxa' },
  branco: { forte: '#D9BE78', suave: '#F7F0DC', texto: '#2B2626', nome: 'branca' },
  vermelho: { forte: '#A3392A', suave: '#F6E4E0', texto: '#FFFFFF', nome: 'vermelha' },
};

/** Cores no formato do cabeçalho das páginas (tinta legível sobre o fundo suave) */
export const tomLiturgico = (c: CorLiturgica) => ({ tinta: c === 'branco' ? '#7A5820' : CORES[c].forte, fundo: CORES[c].suave });

/** Converte a cor que vem da CNBB ("Verde", "Branco", "Roxo"...) para a nossa chave */
export function corDaCnbb(txt?: string | null): CorLiturgica | null {
  const t = (txt || '').toLowerCase();
  if (t.includes('verde')) return 'verde';
  if (t.includes('roxo') || t.includes('violeta') || t.includes('rosa')) return 'roxo';
  if (t.includes('vermelh')) return 'vermelho';
  if (t.includes('branc') || t.includes('dourad')) return 'branco';
  return null;
}

// ───────── datas em UTC puro (sem fuso), para não errar o dia ─────────
const D = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d));
const add = (dt: Date, n: number) => new Date(dt.getTime() + n * 86400000);
const iso = (dt: Date) => dt.toISOString().slice(0, 10);
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return D(y, m, d);
};
const dow = (dt: Date) => dt.getUTCDay();
const diff = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 86400000);

/** Domingo de Páscoa (algoritmo gregoriano anônimo) */
export function pascoa(y: number): Date {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return D(y, month, day);
}

/** 1º Domingo do Advento do ano civil y */
export function advento(y: number): Date {
  const natalVespera = D(y, 12, 24);
  const quartoDomingo = add(natalVespera, -dow(natalVespera));
  return add(quartoDomingo, -21);
}

/** Batismo do Senhor no Brasil (Epifania no domingo entre 2 e 8 de janeiro) */
function batismo(y: number): { batismo: Date; domingoBase: Date } {
  const jan2 = D(y, 1, 2);
  const epifania = add(jan2, (7 - dow(jan2)) % 7);
  if (epifania.getUTCDate() >= 7) return { batismo: add(epifania, 1), domingoBase: epifania };
  const b = add(epifania, 7);
  return { batismo: b, domingoBase: b };
}

/** Os 7 tempos do ano litúrgico que começa no Advento do ano civil y */
export function temposDoAno(y: number): Tempo[] {
  const a = advento(y);
  const { batismo: b } = batismo(y + 1);
  const p = pascoa(y + 1);
  const cinzas = add(p, -46);
  const pentecostes = add(p, 49);
  const proxAdvento = advento(y + 1);
  return [
    { id: 'adv', nome: 'Advento', curto: 'Advento', inicio: iso(a), fim: iso(D(y, 12, 24)), cor: 'roxo', texto: 'Quatro semanas de preparação para o Natal e de espera da vinda gloriosa de Cristo.' },
    { id: 'nat', nome: 'Tempo do Natal', curto: 'Natal', inicio: iso(D(y, 12, 25)), fim: iso(b), cor: 'branco', texto: 'Do Natal do Senhor até a festa do Batismo do Senhor.' },
    { id: 'tc1', nome: 'Tempo Comum', curto: 'Comum I', inicio: iso(add(b, 1)), fim: iso(add(cinzas, -1)), cor: 'verde', texto: 'Primeira parte do Tempo Comum: a Igreja medita a vida pública de Jesus.' },
    { id: 'qua', nome: 'Quaresma', curto: 'Quaresma', inicio: iso(cinzas), fim: iso(add(p, -4)), cor: 'roxo', texto: 'Da Quarta-feira de Cinzas até a Quinta-feira Santa: tempo de oração, jejum e esmola.' },
    { id: 'tri', nome: 'Tríduo Pascal', curto: 'Tríduo', inicio: iso(add(p, -3)), fim: iso(add(p, -1)), cor: 'vermelho', texto: 'Ceia do Senhor, Paixão e Vigília Pascal: o centro de todo o ano litúrgico.' },
    { id: 'pas', nome: 'Tempo Pascal', curto: 'Páscoa', inicio: iso(p), fim: iso(pentecostes), cor: 'branco', texto: 'Cinquenta dias de alegria pela Ressurreição, até Pentecostes.' },
    { id: 'tc2', nome: 'Tempo Comum', curto: 'Comum II', inicio: iso(add(pentecostes, 1)), fim: iso(add(proxAdvento, -1)), cor: 'verde', texto: 'Segunda parte do Tempo Comum: os ensinamentos de Jesus, até a solenidade de Cristo Rei.' },
  ];
}

export function infoDoDia(data: string): InfoDia {
  const hoje = parse(data);
  const y = hoje.getUTCFullYear();
  const anoInicio = hoje >= advento(y) ? y : y - 1;
  const tempos = temposDoAno(anoInicio);
  const inicioAno = parse(tempos[0].inicio);
  const fimAno = parse(tempos[6].fim);
  const total = diff(fimAno, inicioAno) + 1;
  const tempo = tempos.find((t) => data >= t.inicio && data <= t.fim) ?? tempos[6];
  const i = tempos.indexOf(tempo);
  const proxTempo = i < 6 ? tempos[i + 1] : { nome: 'Advento', inicio: iso(add(fimAno, 1)) };

  const domingoAntes = add(hoje, -dow(hoje));
  let rotulo = tempo.nome;
  if (tempo.id === 'adv') {
    rotulo = `Advento, ${Math.floor(diff(hoje, parse(tempo.inicio)) / 7) + 1}ª semana`;
  } else if (tempo.id === 'tc1') {
    const { domingoBase } = batismo(anoInicio + 1);
    rotulo = `Tempo Comum, ${Math.floor(diff(hoje, domingoBase) / 7) + 1}ª semana`;
  } else if (tempo.id === 'tc2') {
    const cristoRei = add(advento(anoInicio + 1), -7);
    rotulo = `Tempo Comum, ${34 - diff(cristoRei, domingoAntes) / 7}ª semana`;
  } else if (tempo.id === 'qua') {
    const p = pascoa(anoInicio + 1);
    const ramos = add(p, -7);
    const primeiroDomingo = add(parse(tempo.inicio), 4);
    if (hoje >= ramos) rotulo = 'Semana Santa';
    else if (hoje < primeiroDomingo) rotulo = 'Quaresma, depois das Cinzas';
    else rotulo = `Quaresma, ${Math.floor(diff(hoje, primeiroDomingo) / 7) + 1}ª semana`;
  } else if (tempo.id === 'pas') {
    const sem = Math.floor(diff(hoje, parse(tempo.inicio)) / 7) + 1;
    rotulo = data === tempo.fim ? 'Pentecostes' : sem === 1 ? 'Oitava da Páscoa' : `Tempo Pascal, ${sem}ª semana`;
  }

  return {
    data,
    tempo,
    rotulo,
    tempos,
    angulo: ((diff(hoje, inicioAno) + 0.5) / total) * 360,
    proximo: { nome: proxTempo.nome, dias: diff(parse(proxTempo.inicio), hoje) },
    anoLiturgico: `${anoInicio}/${anoInicio + 1}`,
  };
}

/** Ângulos de início e fim de cada tempo na roda */
export function segmentos(tempos: Tempo[]): { tempo: Tempo; de: number; ate: number }[] {
  const inicio = parse(tempos[0].inicio);
  const total = diff(parse(tempos[6].fim), inicio) + 1;
  return tempos.map((t) => ({
    tempo: t,
    de: (diff(parse(t.inicio), inicio) / total) * 360,
    ate: ((diff(parse(t.fim), inicio) + 1) / total) * 360,
  }));
}

/** Datas curtas: "30 nov" */
const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const dataCurta = (s: string) => {
  const [, m, d] = s.split('-').map(Number);
  return `${d === 1 ? '1º' : d} ${MESES_CURTOS[m - 1]}`;
};

// ───────── Terço do dia ─────────
export const MISTERIOS = {
  gozosos: { nome: 'Mistérios Gozosos', itens: ['A Anunciação do Anjo a Maria', 'A Visitação de Maria a Isabel', 'O Nascimento de Jesus em Belém', 'A Apresentação de Jesus no Templo', 'A perda e o encontro de Jesus no Templo'] },
  dolorosos: { nome: 'Mistérios Dolorosos', itens: ['A Agonia de Jesus no Horto', 'A Flagelação de Jesus', 'A Coroação de espinhos', 'Jesus carrega a Cruz até o Calvário', 'A Crucifixão e morte de Jesus'] },
  gloriosos: { nome: 'Mistérios Gloriosos', itens: ['A Ressurreição de Jesus', 'A Ascensão de Jesus ao Céu', 'A vinda do Espírito Santo', 'A Assunção de Maria ao Céu', 'A Coroação de Maria no Céu'] },
  luminosos: { nome: 'Mistérios Luminosos', itens: ['O Batismo de Jesus no Jordão', 'As Bodas de Caná', 'O anúncio do Reino de Deus', 'A Transfiguração de Jesus', 'A instituição da Eucaristia'] },
} as const;
export type Misterio = keyof typeof MISTERIOS;
/** Domingo a sábado, como recomenda a Rosarium Virginis Mariae (n. 38) */
export const MISTERIO_DA_SEMANA: Misterio[] = ['gloriosos', 'gozosos', 'dolorosos', 'gloriosos', 'luminosos', 'dolorosos', 'gozosos'];

/** Data de hoje em Brasília, no navegador */
export const hojeBrasilia = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

/**
 * Cor do dia como a CNBB mostra na estola do topo da liturgia (ex.: estolas/verde.png).
 * O campo "color" da API às vezes traz a cor de uma memória facultativa (ex.: vermelho de um mártir
 * num dia de semana verde); a estola é a cor oficial do dia. Sem estola, vale o campo "color".
 */
export function corDaLiturgia(l?: { color?: string | null; details?: string | null } | null): CorLiturgica | null {
  const estola = (l?.details || '').match(/estolas\/([a-z]+)\.png/i)?.[1];
  return corDaCnbb(estola) ?? corDaCnbb(l?.color);
}

/** Nome da celebração do dia a partir do cabeçalho da CNBB (ex.: "Bem-aventurada Virgem Maria do Rosário, Memória"). */
export function celebracaoDaLiturgia(l?: { details?: string | null } | null): string | null {
  const partes = (l?.details || '')
    .replace(/<[^>]+>/g, '|')
    .replace(/&nbsp;/g, ' ')
    .split('|')
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  // partes[0] é a data; partes[1] é a celebração ou a semana do tempo
  const nome = partes[1];
  if (!nome || /^Leituras/i.test(nome)) return null;
  const grau = partes[2]?.match(/^,\s*(Memória|Festa|Solenidade)/i)?.[1];
  return grau ? `${nome}, ${grau}` : nome;
}
