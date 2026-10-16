/**
 * Novenas do site e a festa em que cada uma termina.
 * Regra: a novena dura 9 dias e termina na véspera da festa (ex.: Natal, 16 a 24 de dezembro).
 */
export type Festa = { tipo: 'fixa'; mes: number; dia: number } | { tipo: 'pascoa'; dias: number } | { tipo: 'cristoRei' } | { tipo: 'livre' };
export interface NovenaPlano {
  id: string;
  nome: string;
  festaNome: string;
  festa: Festa;
  artigo: string;
}
export const NOVENAS: NovenaPlano[] = [
  { id: 'aparecida', nome: 'Novena a Nossa Senhora Aparecida', festaNome: 'Nossa Senhora Aparecida', festa: { tipo: 'fixa', mes: 10, dia: 12 }, artigo: '/novenas/novena-a-nossa-senhora-aparecida' },
  { id: 'natal', nome: 'Novena de Natal', festaNome: 'Natal do Senhor', festa: { tipo: 'fixa', mes: 12, dia: 25 }, artigo: '/novenas/novena-de-natal-preparacao-nascimento-jesus' },
  { id: 'imaculada', nome: 'Novena ao Imaculado Coração de Maria', festaNome: 'Imaculado Coração de Maria', festa: { tipo: 'pascoa', dias: 69 }, artigo: '/novenas/novena-ao-imaculado-coracao-de-maria' },
  { id: 'sagrado-coracao', nome: 'Novena ao Sagrado Coração de Jesus', festaNome: 'Sagrado Coração de Jesus', festa: { tipo: 'pascoa', dias: 68 }, artigo: '/novenas/novena-ao-sagrado-coracao-de-jesus' },
  { id: 'espirito-santo', nome: 'Novena ao Espírito Santo', festaNome: 'Pentecostes', festa: { tipo: 'pascoa', dias: 49 }, artigo: '/novenas/novena-ao-espirito-santo-completa-com-meditacoes' },
  { id: 'fatima', nome: 'Novena a Nossa Senhora de Fátima', festaNome: 'Nossa Senhora de Fátima', festa: { tipo: 'fixa', mes: 5, dia: 13 }, artigo: '/novenas/novena-a-nossa-senhora-de-fatima' },
  { id: 'lourdes', nome: 'Novena a Nossa Senhora de Lourdes', festaNome: 'Nossa Senhora de Lourdes', festa: { tipo: 'fixa', mes: 2, dia: 11 }, artigo: '/novenas/novena-a-nossa-senhora-de-lourdes-pela-cura' },
  { id: 'sao-jose', nome: 'Novena a São José', festaNome: 'São José', festa: { tipo: 'fixa', mes: 3, dia: 19 }, artigo: '/novenas/novena-a-sao-jose-para-o-trabalho-e-a-familia' },
  { id: 'santa-rita', nome: 'Novena a Santa Rita de Cássia', festaNome: 'Santa Rita de Cássia', festa: { tipo: 'fixa', mes: 5, dia: 22 }, artigo: '/novenas/novena-a-santa-rita-de-cassia' },
  { id: 'santo-antonio', nome: 'Novena a Santo Antônio', festaNome: 'Santo Antônio', festa: { tipo: 'fixa', mes: 6, dia: 13 }, artigo: '/novenas/novena-a-santo-antonio-de-padua' },
  { id: 'sao-bento', nome: 'Novena a São Bento', festaNome: 'São Bento', festa: { tipo: 'fixa', mes: 7, dia: 11 }, artigo: '/novenas/novena-a-sao-bento-contra-o-mal' },
  { id: 'sao-miguel', nome: 'Novena a São Miguel Arcanjo', festaNome: 'São Miguel, São Gabriel e São Rafael', festa: { tipo: 'fixa', mes: 9, dia: 29 }, artigo: '/novenas/novena-a-sao-miguel-arcanjo' },
  { id: 'teresinha', nome: 'Novena a Santa Teresinha', festaNome: 'Santa Teresinha do Menino Jesus', festa: { tipo: 'fixa', mes: 10, dia: 1 }, artigo: '/novenas/novena-a-santa-teresinha-com-reflexoes' },
  { id: 'sao-francisco', nome: 'Novena a São Francisco de Assis', festaNome: 'São Francisco de Assis', festa: { tipo: 'fixa', mes: 10, dia: 4 }, artigo: '/novenas/novena-a-sao-francisco-de-assis' },
  { id: 'sao-judas', nome: 'Novena de São Judas Tadeu', festaNome: 'São Judas Tadeu', festa: { tipo: 'fixa', mes: 10, dia: 28 }, artigo: '/novenas/novena-de-sao-judas-tadeu' },
  { id: 'cristo-rei', nome: 'Novena de Cristo Rei', festaNome: 'Cristo Rei', festa: { tipo: 'cristoRei' }, artigo: '/novenas/novena-de-cristo-rei' },
  { id: 'gracas', nome: 'Novena de Nossa Senhora das Graças', festaNome: 'Nossa Senhora das Graças', festa: { tipo: 'fixa', mes: 11, dia: 27 }, artigo: '/novenas/novena-de-nossa-senhora-das-gracas' },
  { id: 'imaculada-conceicao', nome: 'Novena da Imaculada Conceição', festaNome: 'Imaculada Conceição', festa: { tipo: 'fixa', mes: 12, dia: 8 }, artigo: '/novenas/novena-da-imaculada-conceicao' },
  { id: 'guadalupe', nome: 'Novena de Nossa Senhora de Guadalupe', festaNome: 'Nossa Senhora de Guadalupe', festa: { tipo: 'fixa', mes: 12, dia: 12 }, artigo: '/novenas/novena-de-nossa-senhora-de-guadalupe' },
  { id: 'santa-luzia', nome: 'Novena de Santa Luzia', festaNome: 'Santa Luzia', festa: { tipo: 'fixa', mes: 12, dia: 13 }, artigo: '/novenas/novena-de-santa-luzia' },
  { id: 'desatadora', nome: 'Novena a Nossa Senhora Desatadora dos Nós', festaNome: '', festa: { tipo: 'livre' }, artigo: '/novenas/novena-a-nossa-senhora-desatadora-dos-nos' },
  { id: 'pai-eterno', nome: 'Novena ao Divino Pai Eterno', festaNome: '', festa: { tipo: 'livre' }, artigo: '/novenas/novena-ao-divino-pai-eterno' },
  { id: 'maos', nome: 'Novena das Mãos Ensanguentadas', festaNome: '', festa: { tipo: 'livre' }, artigo: '/novenas/novena-das-maos-ensanguentadas-para-causas-impossiveis' },
  { id: 'sao-rafael', nome: 'Novena a São Rafael Arcanjo', festaNome: 'São Miguel, São Gabriel e São Rafael', festa: { tipo: 'fixa', mes: 9, dia: 29 }, artigo: '/novenas/novena-a-sao-rafael-arcanjo' },
  { id: 'santo-expedito', nome: 'Novena a Santo Expedito', festaNome: 'Santo Expedito', festa: { tipo: 'fixa', mes: 4, dia: 19 }, artigo: '/novenas/novena-a-santo-expedito' },
  { id: 'sao-jorge', nome: 'Novena a São Jorge', festaNome: 'São Jorge', festa: { tipo: 'fixa', mes: 4, dia: 23 }, artigo: '/novenas/novena-a-sao-jorge' },
  { id: 'perpetuo-socorro', nome: 'Novena a Nossa Senhora do Perpétuo Socorro', festaNome: 'Nossa Senhora do Perpétuo Socorro', festa: { tipo: 'fixa', mes: 6, dia: 27 }, artigo: '/novenas/novena-a-nossa-senhora-do-perpetuo-socorro' },
  { id: 'carmo', nome: 'Novena a Nossa Senhora do Carmo', festaNome: 'Nossa Senhora do Carmo', festa: { tipo: 'fixa', mes: 7, dia: 16 }, artigo: '/novenas/novena-a-nossa-senhora-do-carmo' },
  { id: 'dores', nome: 'Novena a Nossa Senhora das Dores', festaNome: 'Nossa Senhora das Dores', festa: { tipo: 'fixa', mes: 9, dia: 15 }, artigo: '/novenas/novena-a-nossa-senhora-das-dores' },
  { id: 'bom-parto', nome: 'Novena a Nossa Senhora do Bom Parto', festaNome: '', festa: { tipo: 'livre' }, artigo: '/novenas/novena-a-nossa-senhora-do-bom-parto' },
  { id: 'geraldo-majela', nome: 'Novena a São Geraldo Majela', festaNome: 'São Geraldo Majela', festa: { tipo: 'fixa', mes: 10, dia: 16 }, artigo: '/novenas/novena-a-sao-geraldo-majela' },
  { id: 'misericordia', nome: 'Novena da Divina Misericórdia', festaNome: 'Domingo da Divina Misericórdia', festa: { tipo: 'pascoa', dias: 7 }, artigo: '/novenas/novena-da-divina-misericordia' },
  { id: 'sagrada-familia', nome: 'Novena à Sagrada Família', festaNome: '', festa: { tipo: 'livre' }, artigo: '/novenas/novena-a-sagrada-familia' },
  { id: 'santa-monica', nome: 'Novena a Santa Mônica', festaNome: 'Santa Mônica', festa: { tipo: 'fixa', mes: 8, dia: 27 }, artigo: '/novenas/novena-a-santa-monica' },
  { id: 'sao-charbel', nome: 'Novena a São Charbel', festaNome: 'São Charbel', festa: { tipo: 'fixa', mes: 7, dia: 24 }, artigo: '/novenas/novena-a-sao-charbel' },
  { id: 'santa-edwiges', nome: 'Novena a Santa Edwiges', festaNome: 'Santa Edwiges', festa: { tipo: 'fixa', mes: 10, dia: 16 }, artigo: '/novenas/novena-a-santa-edwiges' },
  { id: 'cosme-damiao', nome: 'Novena a São Cosme e São Damião', festaNome: 'São Cosme e São Damião', festa: { tipo: 'fixa', mes: 9, dia: 26 }, artigo: '/novenas/novena-a-sao-cosme-e-sao-damiao' },
  { id: 'santa-dulce', nome: 'Novena a Santa Dulce dos Pobres', festaNome: 'Santa Dulce dos Pobres', festa: { tipo: 'fixa', mes: 8, dia: 13 }, artigo: '/novenas/novena-a-santa-dulce-dos-pobres' },
  { id: 'padre-pio', nome: 'Novena a São Padre Pio', festaNome: 'São Pio de Pietrelcina', festa: { tipo: 'fixa', mes: 9, dia: 23 }, artigo: '/novenas/novena-a-sao-padre-pio' },
  { id: 'sao-camilo', nome: 'Novena a São Camilo de Lélis', festaNome: 'São Camilo de Lélis', festa: { tipo: 'fixa', mes: 7, dia: 14 }, artigo: '/novenas/novena-a-sao-camilo-de-lelis' },
  { id: 'auxiliadora', nome: 'Novena a Nossa Senhora Auxiliadora', festaNome: 'Nossa Senhora Auxiliadora', festa: { tipo: 'fixa', mes: 5, dia: 24 }, artigo: '/novenas/novena-a-nossa-senhora-auxiliadora' },
  { id: 'novena-da-graca', nome: 'Novena da Graça (São Francisco Xavier)', festaNome: '', festa: { tipo: 'livre' }, artigo: '/novenas/novena-da-graca-sao-francisco-xavier' },
  { id: 'almas', nome: 'Novena pelas almas do purgatório', festaNome: 'Finados', festa: { tipo: 'fixa', mes: 11, dia: 2 }, artigo: '/novenas/novena-pelas-almas-do-purgatorio' },
  { id: 'rosario', nome: 'Novena a Nossa Senhora do Rosário', festaNome: 'Nossa Senhora do Rosário', festa: { tipo: 'fixa', mes: 10, dia: 7 }, artigo: '/novenas/novena-a-nossa-senhora-do-rosario' },
  { id: 'santa-barbara', nome: 'Novena a Santa Bárbara', festaNome: 'Santa Bárbara', festa: { tipo: 'fixa', mes: 12, dia: 4 }, artigo: '/novenas/novena-a-santa-barbara' },
  { id: 'sao-cristovao', nome: 'Novena a São Cristóvão', festaNome: 'São Cristóvão', festa: { tipo: 'fixa', mes: 7, dia: 25 }, artigo: '/novenas/novena-a-sao-cristovao' },
  { id: 'sao-benedito', nome: 'Novena a São Benedito', festaNome: '', festa: { tipo: 'livre' }, artigo: '/novenas/novena-a-sao-benedito' },
];
