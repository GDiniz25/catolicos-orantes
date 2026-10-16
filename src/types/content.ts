export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  meta_description?: string;
  content: string;
  category: string;
  image_url?: string;
  image_alt?: string;
  /** crédito da obra (pintor, título, licença), quando a imagem vem do Wikimedia Commons */
  image_credit?: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type CategorySlug =
  | 'como-rezar-o-terco'
  | 'santos-e-oracoes'
  | 'milagres-eucaristicos'
  | 'catecismo'
  | 'liturgia-das-horas'
  | 'novenas'
  | 'sacramentos'
  | 'devocoes-marianas'
  | 'calendario-liturgico'
  | 'exame-de-consciencia'
  | 'oracoes-do-dia-a-dia'
  | 'documentos-da-igreja'
  | 'ladainhas'
  | 'duvidas-da-fe'
  | 'vida-espiritual'
  | 'primeiros-passos'
  | 'casamento';
