/**
 * Fatos de cada dia do calendário litúrgico, calculados a partir da data e da liturgia da CNBB.
 * Alimentam o bloco "Este dia na liturgia" e as perguntas frequentes das páginas diárias:
 * cada data ganha um texto próprio, sem repetir o mesmo parágrafo em todas as páginas.
 */
import { advento, celebracaoDaLiturgia, corDaLiturgia, infoDoDia, MISTERIOS, MISTERIO_DA_SEMANA, type CorLiturgica, type Misterio } from '@/lib/anoLiturgico';
import { grauDaCelebracao, semanaDoSalterio, ROMANO } from '@/lib/salterio';
import { extractLeituras } from '@/lib/liturgy';
import { diaMesSlug, formatDateFull, MONTHS_LOWER, WEEKDAYS_FULL } from '@/lib/dateUtils';
import { getSaintsByDate, type LiturgiaData } from '@/lib/data';
import { getShortName } from '@/lib/saints';

/** O que cada cor significa na Missa (Instrução Geral do Missal Romano) */
export const SENTIDO_DA_COR: Record<CorLiturgica, string> = {
  verde: 'o verde é a cor da esperança e marca o Tempo Comum, quando a Igreja acompanha a vida pública de Jesus',
  roxo: 'o roxo é a cor da penitência e da espera, usada no Advento e na Quaresma',
  branco: 'o branco é a cor da alegria e da glória, usada no Natal, na Páscoa e nas festas do Senhor, de Nossa Senhora e dos santos que não foram mártires',
  vermelho: 'o vermelho lembra o Espírito Santo e o sangue dos mártires, e é usado na Paixão, em Pentecostes e nas festas dos apóstolos e mártires',
};

const NOME_DA_COR: Record<CorLiturgica, string> = { verde: 'verde', roxo: 'roxo', branco: 'branco', vermelho: 'vermelho' };

export interface DiaLiturgico {
  data: string;
  /** "quinta-feira, 30 de outubro de 2026" */
  dataLonga: string;
  /** "30 de outubro de 2026" */
  dataSemSemana: string;
  diaSemana: string;
  celebracao: string | null;
  rotulo: string;
  cor: CorLiturgica;
  corNome: string;
  leituras: string[];
  evangelho: string | null;
  /** Ciclo dos domingos (A, B ou C) */
  anoDominical: 'A' | 'B' | 'C';
  /** Ciclo dos dias de semana (I ou II) */
  anoFerial: 'I' | 'II';
  salterio: string | null;
  misterio: Misterio;
  misterioNome: string;
  santos: { nome: string; href: string }[];
  santoHref: string;
  proximoTempo: { nome: string; dias: number };
}

const parse = (d: string) => new Date(`${d}T12:00:00Z`);

export async function diaLiturgico(data: string, liturgia: LiturgiaData | null): Promise<DiaLiturgico> {
  const info = infoDoDia(data);
  const d = parse(data);
  const y = d.getUTCFullYear();
  // O ano litúrgico começa no 1º domingo do Advento e leva o número do ano civil em que termina
  const anoLit = d >= advento(y) ? y + 1 : y;
  const anoDominical = (['C', 'A', 'B'] as const)[anoLit % 3];
  const anoFerial = anoLit % 2 === 0 ? 'II' : 'I';
  const cor = corDaLiturgia(liturgia) ?? info.tempo.cor;
  const leituras = liturgia ? extractLeituras(liturgia.leituras) : [];
  const evangelho = leituras.slice().reverse().find((l) => /^(Mt|Mc|Lc|Jo)\s*\d/.test(l.trim())) ?? null;
  const sal = semanaDoSalterio(data);
  const dow = d.getUTCDay();
  const misterio = MISTERIO_DA_SEMANA[dow];
  const [, m, dia] = data.split('-').map(Number);
  const santos = (await getSaintsByDate(m, dia)).map((s) => ({ nome: getShortName(s.saint_name), href: `/santos/${s.slug}` }));
  const unicos = santos.filter((s, i) => santos.findIndex((x) => x.nome.toLowerCase() === s.nome.toLowerCase()) === i);
  const dataLonga = formatDateFull(data).replace(/ de ([A-ZÇ])/g, (x) => x.toLowerCase());
  const diaSemana = WEEKDAYS_FULL[dow].toLowerCase();
  return {
    data,
    dataLonga: dataLonga.charAt(0).toLowerCase() + dataLonga.slice(1),
    dataSemSemana: `${dia} de ${MONTHS_LOWER[m - 1]} de ${y}`,
    diaSemana,
    celebracao: celebracaoDaLiturgia(liturgia),
    rotulo: info.rotulo,
    cor,
    corNome: NOME_DA_COR[cor],
    leituras,
    evangelho,
    anoDominical,
    anoFerial,
    // Em festas e solenidades o ofício é próprio: não vale a semana do saltério
    salterio: sal.semana && !grauDaCelebracao(celebracaoDaLiturgia(liturgia)) ? `Semana ${ROMANO[sal.semana]} do saltério` : null,
    misterio,
    misterioNome: MISTERIOS[misterio].nome,
    santos: unicos,
    santoHref: `/santo-do-dia/${diaMesSlug(m, dia)}`,
    proximoTempo: info.proximo,
  };
}

const lista = (itens: string[]) => (itens.length <= 1 ? itens.join('') : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`);

/** Tempo litúrgico em frase: "a 30ª semana do Tempo Comum", "o Tempo do Natal", "a Oitava da Páscoa" */
export function tempoEmFrase(rotulo: string) {
  const m = rotulo.match(/^(.+), (\d+ª semana)$/);
  if (m) return `a ${m[2]} d${m[1] === 'Quaresma' ? 'a' : 'o'} ${m[1]}`;
  if (rotulo === 'Quaresma, depois das Cinzas') return 'a Quaresma, depois das Cinzas';
  return `${/^(Oitava|Semana|Quaresma)/.test(rotulo) ? 'a' : 'o'} ${rotulo}`;
}
/** "na 30ª semana do Tempo Comum", "no Tempo do Natal" */
const emTempo = (rotulo: string) => { const t = tempoEmFrase(rotulo); return `n${t}`; };
/** "da 30ª semana do Tempo Comum", "do Tempo do Natal" */
const deTempo = (rotulo: string) => { const t = tempoEmFrase(rotulo); return `d${t}`; };

/** A celebração em frase: "a festa de Santos Simão e Judas, Apóstolos", "o 30º Domingo do Tempo Comum" */
export function celebracaoEmFrase(c: string | null): string | null {
  if (!c || /semana/i.test(c)) return null; // dia de semana comum: a CNBB repete a semana do tempo
  const m = c.match(/^(.+), (Memória|Festa|Solenidade)$/i);
  if (m) return `a ${m[2].toLowerCase()} de ${m[1]}`;
  if (/^\d+º Domingo/.test(c)) return `o ${c}`;
  return null;
}

const artigoTempo = (nome: string) => (nome === 'Quaresma' ? 'a' : 'o');

/** Parágrafo de abertura: responde de uma vez o que a pessoa procura sobre a data */
export function resumoEmTexto(d: DiaLiturgico, foco: 'liturgia' | 'evangelho' | 'horas') {
  const partes: string[] = [];
  const quando = `${d.diaSemana.charAt(0).toUpperCase()}${d.diaSemana.slice(1)}, ${d.dataSemSemana}`;
  const cel = celebracaoEmFrase(d.celebracao);
  if (cel && cel.startsWith('o ')) partes.push(`${quando}: a Igreja celebra ${cel}.`);
  else if (cel) partes.push(`${quando}: a Igreja celebra ${cel}, ${emTempo(d.rotulo)}.`);
  else if (d.celebracao && !/semana/i.test(d.celebracao)) partes.push(`${quando}: a liturgia do dia é ${d.celebracao}, ${emTempo(d.rotulo)}.`);
  else partes.push(`${quando} é um dia ${deTempo(d.rotulo)}.`);
  partes.push(`A cor litúrgica é o ${d.corNome}.`);
  if (foco === 'liturgia' && d.leituras.length) partes.push(`As leituras da Missa são ${lista(d.leituras)}.`);
  if (foco === 'evangelho' && d.evangelho) partes.push(`O Evangelho do dia é ${d.evangelho}.`);
  if (foco === 'horas' && d.salterio) partes.push(`Na Liturgia das Horas, reza-se a ${d.salterio.charAt(0).toLowerCase()}${d.salterio.slice(1)}.`);
  partes.push(`Nas leituras dos domingos, a Igreja está no Ano ${d.anoDominical}; nas dos dias de semana, no Ano ${d.anoFerial}.`);
  if (d.santos.length) partes.push(`${d.santos.length > 1 ? 'Os santos do dia são' : 'O santo do dia é'} ${lista(d.santos.slice(0, 3).map((s) => s.nome))}.`);
  return partes.join(' ');
}

/** Perguntas frequentes com respostas próprias da data */
export function faqDoDia(d: DiaLiturgico, foco: 'liturgia' | 'evangelho' | 'horas') {
  const quando = d.dataSemSemana;
  const faq: { q: string; a: string }[] = [];
  if (foco !== 'evangelho' && d.leituras.length) faq.push({ q: `Quais são as leituras da Missa de ${quando}?`, a: `As leituras de ${d.dataLonga} são ${lista(d.leituras)}, segundo a Liturgia Diária da CNBB.` });
  if (d.evangelho && foco !== 'evangelho') faq.push({ q: `Qual é o Evangelho de ${quando}?`, a: `O Evangelho de ${d.dataLonga} é ${d.evangelho}.` });
  faq.push({ q: `Qual é a cor litúrgica de ${quando}?`, a: `A cor do dia é o ${d.corNome}. Na liturgia, ${SENTIDO_DA_COR[d.cor]}.` });
  faq.push({
    q: `Em que tempo litúrgico estamos em ${quando}?`,
    a: `${d.dataLonga.charAt(0).toUpperCase()}${d.dataLonga.slice(1)} está ${emTempo(d.rotulo)}. Faltam ${d.proximoTempo.dias} dias para ${artigoTempo(d.proximoTempo.nome)} ${d.proximoTempo.nome}.`,
  });
  faq.push({ q: `Qual é o ano litúrgico em ${quando}?`, a: `Para as leituras dos domingos, é o Ano ${d.anoDominical}. Para os dias de semana, é o Ano ${d.anoFerial}. O ano litúrgico começa no primeiro domingo do Advento.` });
  if (foco === 'horas' && d.salterio) faq.push({ q: `Qual é a semana do saltério em ${quando}?`, a: `${d.salterio}. Os salmos de Laudes, Vésperas e Completas seguem essa semana.` });
  if (d.santos.length) faq.push({ q: `Qual é o santo de ${quando.replace(/ de \d{4}$/, '')}?`, a: `A Igreja lembra ${lista(d.santos.slice(0, 4).map((s) => s.nome))}.` });
  faq.push({ q: `Qual terço rezar em ${quando}?`, a: `Na ${d.diaSemana}, rezam-se os ${d.misterioNome}, conforme a distribuição da semana proposta por São João Paulo II.` });
  return faq;
}
