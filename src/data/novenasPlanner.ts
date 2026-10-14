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
];
