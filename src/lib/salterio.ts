/**
 * Saltério da Liturgia das Horas (ciclo de 4 semanas) para Laudes, Vésperas e Completas.
 * Numeração como no livro brasileiro: grega, com a hebraica entre parênteses. Ex.: Sl 62(63),2-9.
 * Os cânticos do Antigo Testamento com versificação diferente entre edições (Tobias, Judite, Eclesiástico)
 * aparecem só com o capítulo.
 */
import { infoDoDia } from '@/lib/anoLiturgico';

const amanha = (data: string) => {
  const d = new Date(`${data}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

export type Semana = 1 | 2 | 3 | 4;
export const ROMANO = ['', 'I', 'II', 'III', 'IV'] as const;

/** Salmo pela numeração hebraica (como nas Bíblias de estudo) para o formato do breviário: Sl 62(63),2-9 */
function sl(h: number, versos = '', letra = ''): string {
  const segunda = versos.startsWith('10') || versos.startsWith('12');
  let g: string;
  let heb = `${h}${letra}`;
  if (h <= 8 || h >= 148) g = String(h);
  else if (h === 116) { g = segunda ? '115' : '114'; heb = `116${segunda ? 'B' : 'A'}`; }
  else if (h === 147) { g = segunda ? '147' : '146'; heb = `147${segunda ? 'B' : 'A'}`; }
  else g = `${h - 1}${letra}`;
  const num = g === heb ? g : `${g}(${heb})`;
  return `Sl ${num}${versos ? `,${versos}` : ''}`;
}
const partes = (h: number, versos = '') => `${sl(h, versos)} (em partes)`;

// Cânticos do Novo Testamento das Vésperas (iguais nas quatro semanas)
const NT = {
  dom1: 'Cântico Fl 2,6-11',
  dom2: 'Cântico Ap 19,1-7 (na Quaresma, 1Pd 2,21-24)',
  seg: 'Cântico Ef 1,3-10',
  ter: 'Cântico Ap 4,11; 5,9.10.12',
  qua: 'Cântico Cl 1,12-20',
  qui: 'Cântico Ap 11,17-18; 12,10b-12a',
  sex: 'Cântico Ap 15,3-4',
};

/** Laudes: [salmo da manhã, cântico do AT, salmo de louvor], de domingo (0) a sábado (6) */
const LAUDES: Record<Semana, string[][]> = {
  1: [
    [sl(63, '2-9'), 'Cântico Dn 3,57-88.56', sl(149)],
    [sl(5, '2-10.12-13'), 'Cântico 1Cr 29,10-13', sl(29)],
    [sl(24), 'Cântico de Tobias (Tb 13)', sl(33)],
    [sl(36), 'Cântico de Judite (Jt 16)', sl(47)],
    [sl(57), 'Cântico Jr 31,10-14', sl(48)],
    [sl(51), 'Cântico Is 45,15-25', sl(100)],
    [sl(119, '145-152'), 'Cântico Ex 15,1-4a.8-13.17-18', sl(117)],
  ],
  2: [
    [sl(118), 'Cântico Dn 3,52-57', sl(150)],
    [sl(42), 'Cântico do Eclesiástico (Eclo 36)', sl(19, '', 'A')],
    [sl(43), 'Cântico Is 38,10-14.17-20', sl(65)],
    [sl(77), 'Cântico 1Sm 2,1-10', sl(97)],
    [sl(80), 'Cântico Is 12,1-6', sl(81)],
    [sl(51), 'Cântico Hab 3,2-4.13a.15-19', sl(147, '12-20')],
    [sl(92), 'Cântico Dt 32,1-12', sl(8)],
  ],
  3: [
    [sl(93), 'Cântico Dn 3,57-88.56', sl(148)],
    [sl(84), 'Cântico Is 2,2-5', sl(96)],
    [sl(85), 'Cântico Is 26,1-4.7-9.12', sl(67)],
    [sl(86), 'Cântico Is 33,13-16', sl(98)],
    [sl(87), 'Cântico Is 40,10-17', sl(99)],
    [sl(51), 'Cântico Jr 14,17-21', sl(100)],
    [sl(119, '145-152'), 'Cântico Sb 9,1-6.9-11', sl(117)],
  ],
  4: [
    [sl(118), 'Cântico Dn 3,52-57', sl(150)],
    [sl(90), 'Cântico Is 42,10-16', sl(135, '1-12')],
    [sl(101), 'Cântico Dn 3,26.27.29.34-41', sl(144, '1-10')],
    [sl(108), 'Cântico Is 61,10-62,5', sl(146)],
    [sl(143, '1-11'), 'Cântico Is 66,10-14a', sl(147, '1-11')],
    [sl(51), 'Cântico de Tobias (Tb 13)', sl(147, '12-20')],
    [sl(92), 'Cântico Ez 36,24-28', sl(8)],
  ],
};

/** Vésperas: índice 0 = II Vésperas do domingo; 6 = I Vésperas do domingo seguinte (sábado à tarde) */
const VESPERAS: Record<Semana, string[][]> = {
  1: [
    [sl(110, '1-5.7'), sl(114), NT.dom2],
    [sl(11), sl(15), NT.seg],
    [sl(20), sl(21, '2-8.14'), NT.ter],
    [partes(27), NT.qua],
    [sl(30), sl(32), NT.qui],
    [sl(41), sl(46), NT.sex],
    [sl(119, '105-112'), sl(16), NT.dom1], // I Vésperas do domingo da II semana
  ],
  2: [
    [sl(110, '1-5.7'), sl(115), NT.dom2],
    [partes(45), NT.seg],
    [partes(49), NT.ter],
    [sl(62), sl(67), NT.qua],
    [partes(72), NT.qui],
    [sl(116, '1-9'), sl(121), NT.sex],
    [sl(113), sl(116, '10-19'), NT.dom1], // I Vésperas do domingo da III semana
  ],
  3: [
    [sl(110, '1-5.7'), sl(111), NT.dom2],
    [sl(123), sl(124), NT.seg],
    [sl(125), sl(131), NT.ter],
    [sl(126), sl(127), NT.qua],
    [partes(132), NT.qui],
    [partes(135), NT.sex],
    [sl(122), sl(130), NT.dom1], // I Vésperas do domingo da IV semana
  ],
  4: [
    [sl(110, '1-5.7'), sl(112), NT.dom2],
    [partes(136), NT.seg],
    [sl(137, '1-6'), sl(138), NT.ter],
    [partes(139), NT.qua],
    [partes(144), NT.qui],
    [partes(145), NT.sex],
    [sl(141, '1-9'), sl(142), NT.dom1], // I Vésperas do domingo da I semana
  ],
};

/** Completas: ciclo semanal fixo. Sábado = depois das I Vésperas do domingo; domingo = depois das II Vésperas */
export const COMPLETAS: string[][] = [
  [sl(91)],
  [sl(86)],
  [sl(143, '1-11')],
  ['Sl 30(31),2-6', sl(130)],
  [sl(16)],
  [sl(88)],
  [sl(4), sl(134)],
];
export const NUNC_DIMITTIS = 'Cântico de Simeão, Lc 2,29-32';
export const BENEDICTUS = 'Cântico de Zacarias (Benedictus), Lc 1,68-79';
export const MAGNIFICAT = 'Cântico de Maria (Magnificat), Lc 1,46-55';

export interface OficioDoDia {
  data: string;
  diaSemana: number;
  /** Semana do saltério (null quando o ofício é próprio ou a semana depende do breviário) */
  semana: Semana | null;
  rotulo: string;
  laudes: string[] | null;
  laudesNota?: string;
  vesperas: string[] | null;
  vesperasNome: string;
  vesperasNota?: string;
  completas: string[];
  completasNota?: string;
  grau: 'solenidade' | 'festa' | null;
}

const dowDe = (data: string) => new Date(`${data}T12:00:00Z`).getUTCDay();
const numSemana = (rotulo: string) => Number(rotulo.match(/(\d+)ª semana/)?.[1] ?? 0);
const ciclo = (n: number) => (((n - 1) % 4) + 1) as Semana;

/** Semana do saltério a partir do tempo litúrgico calculado para o dia. */
export function semanaDoSalterio(data: string): { semana: Semana | null; rotulo: string; especial?: 'oitava-natal' | 'natal' | 'oitava-pascoa' | 'triduo' | 'pentecostes' } {
  const info = infoDoDia(data);
  const { rotulo, tempo } = info;
  if (tempo.id === 'tri') return { semana: null, rotulo: 'Tríduo Pascal', especial: 'triduo' };
  if (tempo.id === 'nat') {
    const [, m, d] = data.split('-').map(Number);
    const oitava = (m === 12 && d >= 25) || (m === 1 && d === 1);
    return { semana: null, rotulo: oitava ? 'Oitava do Natal' : 'Tempo do Natal', especial: oitava ? 'oitava-natal' : 'natal' };
  }
  if (rotulo === 'Oitava da Páscoa') return { semana: null, rotulo, especial: 'oitava-pascoa' };
  if (rotulo === 'Pentecostes') return { semana: null, rotulo, especial: 'pentecostes' };
  if (rotulo === 'Quaresma, depois das Cinzas') return { semana: 4, rotulo };
  if (rotulo === 'Semana Santa') return { semana: 2, rotulo };
  const n = numSemana(rotulo);
  return n ? { semana: ciclo(n), rotulo } : { semana: null, rotulo };
}

/**
 * Ofício do dia (Laudes, Vésperas, Completas).
 * grau: "solenidade" ou "festa" segundo a CNBB (opcional). Nas solenidades e festas, as Laudes usam
 * os salmos do domingo da I semana e as Vésperas são próprias ou do Comum.
 */
export function oficioDoDia(data: string, grau: 'solenidade' | 'festa' | null = null): OficioDoDia {
  const d = dowDe(data);
  const { semana, rotulo, especial } = semanaDoSalterio(data);
  const out: OficioDoDia = {
    data, diaSemana: d, semana, rotulo, grau,
    laudes: null, vesperas: null, vesperasNome: d === 6 ? 'I Vésperas do domingo' : d === 0 ? 'II Vésperas do domingo' : 'Vésperas',
    completas: COMPLETAS[d],
  };
  const domingoI = LAUDES[1][0];

  if (especial === 'triduo' && d === 4) {
    out.laudes = LAUDES[2][4];
    out.vesperasNota = 'Quem participa da Missa da Ceia do Senhor, na noite de Quinta-feira Santa, não reza as Vésperas.';
    out.completas = COMPLETAS[0];
    out.completasNota = 'No Tríduo, as Completas são as do domingo.';
    return out;
  }
  if (especial === 'triduo') {
    out.laudesNota = 'No Tríduo Pascal o ofício é próprio: os salmos estão no Próprio do Tempo do breviário.';
    out.vesperasNota = out.laudesNota;
    out.completas = COMPLETAS[0];
    out.completasNota = 'No Tríduo, as Completas são as do domingo.';
    return out;
  }
  if (especial === 'oitava-natal' || especial === 'oitava-pascoa' || especial === 'pentecostes' || grau) {
    out.laudes = domingoI;
    out.laudesNota = grau || especial === 'pentecostes'
      ? 'Solenidades e festas usam nas Laudes os salmos e o cântico do domingo da I semana; antífonas, hino, leitura e oração são próprios.'
      : 'Nas oitavas do Natal e da Páscoa, as Laudes usam os salmos e o cântico do domingo da I semana, com antífonas próprias.';
    out.vesperasNota = 'As Vésperas de hoje são próprias da celebração (no breviário, no Próprio do Tempo, no Próprio dos Santos ou no Comum).';
    if (grau === 'solenidade' || especial !== undefined) {
      out.completas = COMPLETAS[d === 6 ? 6 : 0];
      out.completasNota = 'Em solenidades e oitavas, as Completas são as do domingo.';
    }
    return out;
  }
  if (!semana) {
    out.laudesNota = 'Neste período a semana do saltério depende do calendário do ano: confira a indicação no breviário.';
    out.vesperasNota = out.laudesNota;
    return out;
  }
  out.laudes = LAUDES[semana][d];
  if (d === 6) {
    // I Vésperas do domingo: semana do saltério do domingo seguinte
    const prox = semanaDoSalterio(amanha(data)).semana;
    const semDomingo = prox ?? (((semana % 4) + 1) as Semana);
    const idx = (semDomingo === 1 ? 4 : semDomingo - 1) as Semana;
    out.vesperas = VESPERAS[idx][6];
  } else {
    out.vesperas = VESPERAS[semana][d];
  }
  const quaresma = infoDoDia(data).tempo.id === 'qua';
  if (out.vesperas) out.vesperas = out.vesperas.map((v) => (v === NT.dom2 ? (quaresma ? 'Cântico 1Pd 2,21-24' : 'Cântico Ap 19,1-7') : v));
  return out;
}

/** "solenidade" | "festa" | null a partir do texto da celebração da CNBB ("..., Solenidade") */
export function grauDaCelebracao(celebracao?: string | null): 'solenidade' | 'festa' | null {
  if (!celebracao) return null;
  if (/,\s*Solenidade$/i.test(celebracao)) return 'solenidade';
  if (/,\s*Festa$/i.test(celebracao)) return 'festa';
  return null;
}
