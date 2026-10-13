/**
 * Datas das principais celebrações de um ano civil, calculadas a partir da Páscoa.
 * Regras do Brasil: Epifania no domingo entre 2 e 8 de janeiro; Ascensão no domingo
 * (7º da Páscoa); Corpus Christi na quinta-feira.
 */
import { pascoa, advento } from '@/lib/anoLiturgico';

export interface DataLiturgica {
  id: string;
  nome: string;
  data: string; // AAAA-MM-DD
  movel: boolean;
  nota?: string;
  link?: string;
}

const D = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d));
const add = (dt: Date, n: number) => new Date(dt.getTime() + n * 86400000);
const iso = (dt: Date) => dt.toISOString().slice(0, 10);

export const ANOS_DATAS = Array.from({ length: 21 }, (_, i) => 2020 + i); // 2020 a 2040

export function datasDoAno(y: number): DataLiturgica[] {
  const p = pascoa(y);
  const jan2 = D(y, 1, 2);
  const epifania = add(jan2, (7 - jan2.getUTCDay()) % 7);
  const batismo = epifania.getUTCDate() >= 7 ? add(epifania, 1) : add(epifania, 7);
  const adv = advento(y);
  const lista: DataLiturgica[] = [
    { id: 'maria-mae-de-deus', nome: 'Santa Maria, Mãe de Deus', data: iso(D(y, 1, 1)), movel: false, nota: 'Solenidade e Dia Mundial da Paz.' },
    { id: 'epifania', nome: 'Epifania do Senhor', data: iso(epifania), movel: true, nota: 'No Brasil, celebrada no domingo entre 2 e 8 de janeiro.' },
    { id: 'batismo', nome: 'Batismo do Senhor', data: iso(batismo), movel: true, nota: 'Encerra o Tempo do Natal.' },
    { id: 'carnaval', nome: 'Terça-feira de Carnaval', data: iso(add(p, -47)), movel: true, nota: 'Não é celebração litúrgica: é a véspera da Quarta-feira de Cinzas.' },
    { id: 'cinzas', nome: 'Quarta-feira de Cinzas', data: iso(add(p, -46)), movel: true, nota: 'Início da Quaresma. Dia de jejum e abstinência.', link: '/duvidas-da-fe/imposicao-das-cinzas-significado' },
    { id: 'sao-jose', nome: 'São José, esposo da Virgem Maria', data: iso(D(y, 3, 19)), movel: false },
    { id: 'anunciacao', nome: 'Anunciação do Senhor', data: iso(D(y, 3, 25)), movel: false, nota: 'Quando cai na Semana Santa ou na Oitava da Páscoa, é transferida.' },
    { id: 'ramos', nome: 'Domingo de Ramos', data: iso(add(p, -7)), movel: true, nota: 'Início da Semana Santa.' },
    { id: 'quinta-santa', nome: 'Quinta-feira Santa', data: iso(add(p, -3)), movel: true, nota: 'À tarde, Missa da Ceia do Senhor: começa o Tríduo Pascal.' },
    { id: 'sexta-santa', nome: 'Sexta-feira Santa da Paixão', data: iso(add(p, -2)), movel: true, nota: 'Dia de jejum e abstinência.' },
    { id: 'sabado-santo', nome: 'Sábado Santo e Vigília Pascal', data: iso(add(p, -1)), movel: true },
    { id: 'pascoa', nome: 'Domingo de Páscoa', data: iso(p), movel: true, nota: 'A maior celebração do ano.' },
    { id: 'misericordia', nome: 'Domingo da Divina Misericórdia', data: iso(add(p, 7)), movel: true, nota: '2º Domingo da Páscoa.' },
    { id: 'ascensao', nome: 'Ascensão do Senhor', data: iso(add(p, 42)), movel: true, nota: 'No Brasil, celebrada no 7º Domingo da Páscoa.' },
    { id: 'pentecostes', nome: 'Pentecostes', data: iso(add(p, 49)), movel: true, nota: 'Encerra o Tempo Pascal.' },
    { id: 'trindade', nome: 'Santíssima Trindade', data: iso(add(p, 56)), movel: true },
    { id: 'corpus-christi', nome: 'Corpus Christi (Santíssimo Corpo e Sangue de Cristo)', data: iso(add(p, 60)), movel: true, nota: 'Quinta-feira após a Santíssima Trindade.' },
    { id: 'sagrado-coracao', nome: 'Sagrado Coração de Jesus', data: iso(add(p, 68)), movel: true },
    { id: 'imaculado-coracao', nome: 'Imaculado Coração de Maria', data: iso(add(p, 69)), movel: true },
    { id: 'pedro-paulo', nome: 'São Pedro e São Paulo', data: iso(D(y, 6, 29)), movel: false },
    { id: 'assuncao', nome: 'Assunção de Nossa Senhora', data: iso(D(y, 8, 15)), movel: false },
    { id: 'aparecida', nome: 'Nossa Senhora da Conceição Aparecida', data: iso(D(y, 10, 12)), movel: false, nota: 'Padroeira do Brasil. Feriado nacional.' },
    { id: 'todos-os-santos', nome: 'Todos os Santos', data: iso(D(y, 11, 1)), movel: false },
    { id: 'finados', nome: 'Comemoração de todos os fiéis defuntos (Finados)', data: iso(D(y, 11, 2)), movel: false, link: '/duvidas-da-fe/indulgencia-pelos-falecidos-em-finados' },
    { id: 'cristo-rei', nome: 'Nosso Senhor Jesus Cristo, Rei do Universo', data: iso(add(adv, -7)), movel: true, nota: 'Último domingo do ano litúrgico.' },
    { id: 'advento', nome: '1º Domingo do Advento', data: iso(adv), movel: true, nota: 'Começa um novo ano litúrgico.' },
    { id: 'imaculada', nome: 'Imaculada Conceição', data: iso(D(y, 12, 8)), movel: false },
    { id: 'natal', nome: 'Natal do Senhor', data: iso(D(y, 12, 25)), movel: false },
  ];
  return lista.sort((a, b) => a.data.localeCompare(b.data));
}

/** Ano A, B ou C dos domingos e ano par ou ímpar dos dias de semana, do ano litúrgico que começa no Advento do ano y */
export function ciclos(y: number): { domingos: 'A' | 'B' | 'C'; semana: 'I' | 'II'; fim: number } {
  const fim = y + 1;
  const r = fim % 3;
  return { domingos: r === 1 ? 'A' : r === 2 ? 'B' : 'C', semana: fim % 2 === 0 ? 'II' : 'I', fim };
}

const SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const dataPorExtenso = (s: string, comSemana = true) => {
  const [y, m, d] = s.split('-').map(Number);
  const dia = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${comSemana ? SEMANA[dia] + ', ' : ''}${d === 1 ? '1º' : d} de ${MESES[m - 1]}`;
};
