/**
 * Cor de cada seção: usada no cabeçalho da categoria, nos blocos da home e na capa
 * dos artigos que ainda não têm imagem. Todas as cores "tinta" passam 4,5:1 sobre o "fundo".
 */
export interface Visual {
  tinta: string;
  fundo: string;
}

const RUBRO = { tinta: '#8F3E26', fundo: '#F6E7E1' };
const OURO = { tinta: '#7A5820', fundo: '#F5ECD8' };
const VINHO = { tinta: '#82303A', fundo: '#F4E3E5' };
const ROXO = { tinta: '#5A3F6B', fundo: '#EEE7F2' };
const NOITE = { tinta: '#2E4A66', fundo: '#E4ECF3' };
const MARIANO = { tinta: '#2C5679', fundo: '#E2EBF4' };
const VERDE = { tinta: '#36613F', fundo: '#E4EEE6' };
const GRAFITE = { tinta: '#463F3F', fundo: '#EFEBE6' };

export const CATEGORY_VISUAL: Record<string, Visual> = {
  'como-rezar-o-terco': RUBRO,
  'oracoes-do-dia-a-dia': RUBRO,
  'santos-e-oracoes': OURO,
  sacramentos: OURO,
  'milagres-eucaristicos': VINHO,
  ladainhas: VINHO,
  catecismo: ROXO,
  'exame-de-consciencia': ROXO,
  'liturgia-das-horas': NOITE,
  'duvidas-da-fe': NOITE,
  'devocoes-marianas': MARIANO,
  novenas: VERDE,
  'calendario-liturgico': VERDE,
  'documentos-da-igreja': GRAFITE,
  'vida-espiritual': ROXO,
  'primeiros-passos': OURO,
};

export const visualDe = (slug: string): Visual => CATEGORY_VISUAL[slug] ?? GRAFITE;
