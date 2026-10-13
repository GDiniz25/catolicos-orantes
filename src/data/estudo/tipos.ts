/** Tipos do "Caminho da Fé": nivelamento + trilhas de lições curtas. */

export type Nivel = 1 | 2 | 3;

export type Questao =
  | { tipo: 'escolha'; enunciado: string; opcoes: string[]; correta: number; explica: string }
  | { tipo: 'vf'; enunciado: string; correta: boolean; explica: string }
  /** itens já na ordem correta; o app embaralha */
  | { tipo: 'ordenar'; enunciado: string; itens: string[]; explica: string }
  /** pares [esquerda, direita]; o app embaralha a coluna da direita */
  | { tipo: 'pares'; enunciado: string; pares: [string, string][]; explica: string };

export interface Licao {
  id: string;
  titulo: string;
  nivel: Nivel;
  /** Mini-explicação mostrada antes dos exercícios (2 a 4 frases) */
  ensino: string;
  /** Referência: Catecismo (CIC), Bíblia, Código de Direito Canônico */
  ref: string;
  questoes: Questao[];
  /** Artigos do site para aprofundar */
  leiaMais?: { titulo: string; href: string }[];
}

export interface Trilha {
  id: string;
  titulo: string;
  resumo: string;
  /** nome do ícone lucide */
  icone: 'Sun' | 'Cross' | 'Droplets' | 'Scale' | 'HandHeart' | 'Crown';
  licoes: Licao[];
}

export interface QuestaoNivelamento {
  trilha: string;
  nivel: Nivel;
  enunciado: string;
  opcoes: string[];
  correta: number;
}
