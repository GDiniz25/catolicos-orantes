/**
 * Reflexões da Bíblia capítulo por capítulo (páginas /biblia/{livro}/{capitulo}).
 * O conteúdo fica em src/data/biblia-reflexoes/*.json (cada arquivo: array de capítulos, de qualquer livro).
 */
import { AT, NT } from '@/data/biblia';

export interface ReflexaoCapitulo {
  livro: string;
  cap: number;
  titulo: string;
  meta: string;
  html: string;
  faq: { q: string; a: string }[];
}

export interface Livro {
  slug: string;
  nome: string;
  abrev: string;
  capitulos: number;
  testamento: 'AT' | 'NT';
}

export const slugLivro = (nome: string) =>
  nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const LIVROS: Livro[] = [
  ...AT.map(([abrev, nome, capitulos]) => ({ slug: slugLivro(nome), nome, abrev, capitulos, testamento: 'AT' as const })),
  ...NT.map(([abrev, nome, capitulos]) => ({ slug: slugLivro(nome), nome, abrev, capitulos, testamento: 'NT' as const })),
];
export const livroPorSlug = new Map(LIVROS.map((l) => [l.slug, l]));
export const livroPorNome = new Map(LIVROS.map((l) => [l.nome, l]));

const arquivos = import.meta.glob<{ default: ReflexaoCapitulo[] }>('/src/data/biblia-reflexoes/*.json', { eager: true });
// Só vão ao ar os arquivos já revisados (lista em biblia-publicados.json); os demais são rascunho
import publicados from '@/data/biblia-publicados.json';
const liberados = new Set(publicados as string[]);
const mapa = new Map<string, ReflexaoCapitulo>();
for (const [caminho, mod] of Object.entries(arquivos)) {
  if (!liberados.has(caminho.split('/').pop()!.replace(/\.json$/, ''))) continue;
  for (const r of mod.default) if (livroPorSlug.has(r.livro)) mapa.set(`${r.livro}/${r.cap}`, r);
}

export const reflexao = (livro: string, cap: number) => mapa.get(`${livro}/${cap}`);
export const todasReflexoes = () => [...mapa.values()].sort((a, b) => ordemLivro(a.livro) - ordemLivro(b.livro) || a.cap - b.cap);
export const capitulosCom = (livro: string) => todasReflexoes().filter((r) => r.livro === livro).map((r) => r.cap);
export const livrosComReflexao = () => LIVROS.filter((l) => mapa.has(`${l.slug}/1`) || todasReflexoes().some((r) => r.livro === l.slug));
const ordemLivro = (slug: string) => LIVROS.findIndex((l) => l.slug === slug);

/** Mapa compacto {livro: [capítulos]} para o Plano de leitura saber quais capítulos já têm reflexão */
export function disponiveis(): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const r of todasReflexoes()) (out[r.livro] ??= []).push(r.cap);
  return out;
}

/** Imagem do livro (arte sacra em public/img/biblia/{slug}.jpg) e crédito, se houver */
export interface ImagemLivro { src: string; alt: string; credito: string; foco?: string }
import imagensLivros from '@/data/biblia-imagens.json';
export const imagemDoLivro = (slug: string): ImagemLivro | null => (imagensLivros as Record<string, ImagemLivro>)[slug] ?? null;
