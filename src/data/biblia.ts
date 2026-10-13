/** Livros da Bíblia (cânon católico, abreviações da tradução da CNBB) e número de capítulos */
export const AT: [string, string, number][] = [
  ['Gn', 'Gênesis', 50], ['Ex', 'Êxodo', 40], ['Lv', 'Levítico', 27], ['Nm', 'Números', 36], ['Dt', 'Deuteronômio', 34],
  ['Js', 'Josué', 24], ['Jz', 'Juízes', 21], ['Rt', 'Rute', 4], ['1Sm', '1 Samuel', 31], ['2Sm', '2 Samuel', 24],
  ['1Rs', '1 Reis', 22], ['2Rs', '2 Reis', 25], ['1Cr', '1 Crônicas', 29], ['2Cr', '2 Crônicas', 36], ['Esd', 'Esdras', 10],
  ['Ne', 'Neemias', 13], ['Tb', 'Tobias', 14], ['Jt', 'Judite', 16], ['Est', 'Ester', 10], ['1Mc', '1 Macabeus', 16],
  ['2Mc', '2 Macabeus', 15], ['Jó', 'Jó', 42], ['Sl', 'Salmos', 150], ['Pr', 'Provérbios', 31], ['Ecl', 'Eclesiastes', 12],
  ['Ct', 'Cântico dos Cânticos', 8], ['Sb', 'Sabedoria', 19], ['Eclo', 'Eclesiástico', 51], ['Is', 'Isaías', 66], ['Jr', 'Jeremias', 52],
  ['Lm', 'Lamentações', 5], ['Br', 'Baruc', 6], ['Ez', 'Ezequiel', 48], ['Dn', 'Daniel', 14], ['Os', 'Oseias', 14],
  ['Jl', 'Joel', 4], ['Am', 'Amós', 9], ['Ab', 'Abdias', 1], ['Jn', 'Jonas', 4], ['Mq', 'Miqueias', 7],
  ['Na', 'Naum', 3], ['Hab', 'Habacuc', 3], ['Sf', 'Sofonias', 3], ['Ag', 'Ageu', 2], ['Zc', 'Zacarias', 14], ['Ml', 'Malaquias', 3],
];
export const NT: [string, string, number][] = [
  ['Mt', 'Mateus', 28], ['Mc', 'Marcos', 16], ['Lc', 'Lucas', 24], ['Jo', 'João', 21], ['At', 'Atos dos Apóstolos', 28],
  ['Rm', 'Romanos', 16], ['1Cor', '1 Coríntios', 16], ['2Cor', '2 Coríntios', 13], ['Gl', 'Gálatas', 6], ['Ef', 'Efésios', 6],
  ['Fl', 'Filipenses', 4], ['Cl', 'Colossenses', 4], ['1Ts', '1 Tessalonicenses', 5], ['2Ts', '2 Tessalonicenses', 3], ['1Tm', '1 Timóteo', 6],
  ['2Tm', '2 Timóteo', 4], ['Tt', 'Tito', 3], ['Fm', 'Filêmon', 1], ['Hb', 'Hebreus', 13], ['Tg', 'Tiago', 5],
  ['1Pd', '1 Pedro', 5], ['2Pd', '2 Pedro', 3], ['1Jo', '1 João', 5], ['2Jo', '2 João', 1], ['3Jo', '3 João', 1], ['Jd', 'Judas', 1], ['Ap', 'Apocalipse', 22],
];

type Cap = { livro: string; cap: number };
const capitulos = (livros: [string, string, number][]): Cap[] => livros.flatMap(([, nome, n]) => Array.from({ length: n }, (_, i) => ({ livro: nome, cap: i + 1 })));

/** Agrupa capítulos seguidos do mesmo livro: "Gênesis 1-3" */
function rotulo(caps: Cap[]): string {
  const partes: string[] = [];
  let i = 0;
  while (i < caps.length) {
    let j = i;
    while (j + 1 < caps.length && caps[j + 1].livro === caps[i].livro && caps[j + 1].cap === caps[j].cap + 1) j++;
    partes.push(`${caps[i].livro} ${caps[i].cap}${j > i ? `-${caps[j].cap}` : ''}`);
    i = j + 1;
  }
  return partes.join('; ');
}
/** Divide uma lista de capítulos em N dias, o mais igual possível */
function dividir(caps: Cap[], dias: number): string[] {
  return Array.from({ length: dias }, (_, d) => rotulo(caps.slice(Math.round((d * caps.length) / dias), Math.round(((d + 1) * caps.length) / dias))));
}

export interface Plano { id: string; nome: string; descricao: string; dias: number; leituras: () => string[] }
export const PLANOS: Plano[] = [
  { id: 'evangelhos-30', nome: 'Os quatro Evangelhos em 30 dias', descricao: 'Mateus, Marcos, Lucas e João: cerca de 3 capítulos por dia.', dias: 30, leituras: () => dividir(capitulos(NT.slice(0, 4)), 30) },
  { id: 'nt-90', nome: 'Novo Testamento em 90 dias', descricao: 'Dos Evangelhos ao Apocalipse: cerca de 3 capítulos por dia.', dias: 90, leituras: () => dividir(capitulos(NT), 90) },
  { id: 'salmos-30', nome: 'Salmos em 30 dias', descricao: 'Os 150 salmos, 5 por dia, para rezar com a oração de Israel e da Igreja.', dias: 30, leituras: () => dividir(capitulos(AT.filter((l) => l[0] === 'Sl')), 30) },
  {
    id: 'biblia-365', nome: 'Bíblia completa em 1 ano', descricao: 'Todos os 73 livros: cada dia um trecho do Antigo e um do Novo Testamento.', dias: 365,
    leituras: () => { const a = dividir(capitulos(AT), 365); const n = dividir(capitulos(NT), 365); return a.map((x, i) => `${x} | ${n[i]}`); },
  },
];
