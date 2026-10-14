/**
 * Configuração central do site. Tudo que é "fonte da verdade" de SEO
 * (nome, URL, categorias, descrições) fica aqui.
 */
export const SITE_URL = 'https://catolicosorantes.com.br';
export const SITE_NAME = 'Católicos Orantes';
export const SITE_TITLE = 'Católicos Orantes: oração, santos, liturgia e doutrina católica';
export const SITE_DESCRIPTION =
  'Guia completo da fé católica: liturgia diária, versículo do dia, santos, orações, sacramentos, catecismo, novenas e devoções.';
export const GA_ID = 'G-5E1SKZTPDY';
/** Google Tag Manager: carrega o GA4 e todos os eventos (contêiner da conta Católicos Orantes) */
export const GTM_ID = 'GTM-MD2C4754';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const LOGO_URL = `${SITE_URL}/logo.png`;

// A chave "anon" do Supabase é pública por natureza (já ia no bundle do site antigo).
// Os valores do .env têm prioridade; estes são apenas fallback.
export const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || 'https://dialdbrhpqrwilsisnkn.supabase.co';
export const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpYWxkYnJocHFyd2lsc2lzbmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NjE3MjgsImV4cCI6MjA4ODQzNzcyOH0.8ewZRjUd6HBtMkeJSOewePXb4uN9AYicIn8tfDv7kiA';

export interface CategoryConfig {
  slug: string;
  title: string;
  /** Subtítulo exibido no topo da página */
  subtitle: string;
  /** Meta description */
  description: string;
  keywords: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'como-rezar-o-terco',
    title: 'Como Rezar o Terço',
    subtitle: 'Guia completo com os Mistérios Gozosos, Dolorosos, Gloriosos e Luminosos.',
    description: 'Aprenda a rezar o Santo Terço com guia completo dos Mistérios Gozosos, Dolorosos, Gloriosos e Luminosos.',
    keywords: 'como rezar o terço, santo terço católico, mistérios do terço, oração do terço',
  },
  {
    slug: 'santos-e-oracoes',
    title: 'Santos e Orações',
    subtitle: 'Catálogo de santos, suas histórias, dias litúrgicos e orações específicas.',
    description: 'Conheça a história dos santos católicos, seus dias litúrgicos e orações específicas para cada santo.',
    keywords: 'santos católicos, oração aos santos, santo do dia, devoção aos santos',
  },
  {
    slug: 'milagres-eucaristicos',
    title: 'Milagres Eucarísticos',
    subtitle: 'Relatos históricos de milagres eucarísticos reconhecidos pela Igreja.',
    description: 'Relatos históricos de milagres eucarísticos reconhecidos pela Igreja Católica ao longo dos séculos.',
    keywords: 'milagres eucarísticos, eucaristia, presença real de Jesus, igreja católica',
  },
  {
    slug: 'catecismo',
    title: 'Catecismo',
    subtitle: 'Resumos organizados por tema da doutrina católica.',
    description: 'Resumos organizados por tema da doutrina católica segundo o Catecismo da Igreja.',
    keywords: 'catecismo da igreja católica, doutrina católica, ensinamentos católicos',
  },
  {
    slug: 'liturgia-das-horas',
    title: 'Liturgia das Horas',
    subtitle: 'Guia de como rezar as horas canônicas ao longo do dia.',
    description: 'Guia completo de como rezar as horas canônicas: Laudes, Vésperas, Completas e mais.',
    keywords: 'liturgia das horas, laudes, vésperas, completas, breviário',
  },
  {
    slug: 'novenas',
    title: 'Novenas',
    subtitle: 'Coleção de novenas populares organizadas por intenção e devoção.',
    description: 'Coleção de novenas católicas populares organizadas por intenção e devoção.',
    keywords: 'novenas católicas, oração de novena, novena poderosa, devoções católicas',
  },
  {
    slug: 'sacramentos',
    title: 'Sacramentos',
    subtitle: 'Explicação dos 7 sacramentos com fundamentação bíblica e doutrinária.',
    description: 'Explicação dos 7 sacramentos da Igreja Católica com fundamentação bíblica e doutrinária.',
    keywords: 'sete sacramentos, sacramentos da igreja católica, batismo, eucaristia, crisma',
  },
  {
    slug: 'devocoes-marianas',
    title: 'Devoções Marianas',
    subtitle: 'Consagração, Escapulário, Medalha Milagrosa, aparições e outras devoções a Nossa Senhora.',
    description: 'Consagração a Nossa Senhora, Escapulário, Medalha Milagrosa, aparições e devoções marianas.',
    keywords: 'devoções marianas, nossa senhora, consagração mariana, escapulário',
  },
  {
    slug: 'calendario-liturgico',
    title: 'Calendário Litúrgico',
    subtitle: 'Santo do dia, tempos litúrgicos e festas da Igreja Católica.',
    description: 'Santo do dia, tempos litúrgicos e festas da Igreja Católica ao longo do ano.',
    keywords: 'calendário litúrgico, santo do dia, tempos litúrgicos, festas católicas',
  },
  {
    slug: 'exame-de-consciencia',
    title: 'Exame de Consciência',
    subtitle: 'Checklist interativo e guia completo para se preparar para a Confissão',
    description:
      'Aprenda a fazer o exame de consciência passo a passo e use o checklist interativo para preparar sua confissão, com base no Catecismo da Igreja.',
    keywords:
      'exame de consciência, como fazer exame de consciência, checklist exame de consciência, exame de consciência para confissão, exame de consciência católico, como se preparar para a confissão',
  },
  {
    slug: 'oracoes-do-dia-a-dia',
    title: 'Orações do Dia a Dia',
    subtitle: 'Pai Nosso, Ave Maria, Salve Rainha, Angelus e outras orações essenciais.',
    description: 'Pai Nosso, Ave Maria, Salve Rainha, Angelus e outras orações essenciais do católico.',
    keywords: 'orações católicas, pai nosso, ave maria, salve rainha, angelus',
  },
  {
    slug: 'documentos-da-igreja',
    title: 'Documentos da Igreja',
    subtitle: 'Encíclicas e documentos importantes do Magistério resumidos.',
    description: 'Encíclicas e documentos importantes do Magistério da Igreja Católica resumidos.',
    keywords: 'documentos da igreja, encíclicas, magistério da igreja, doutrina católica',
  },
  {
    slug: 'ladainhas',
    title: 'Ladainhas',
    subtitle: 'Coleção completa de ladainhas católicas: de santos, de Nossa Senhora, do Sagrado Coração e mais.',
    description: 'Ladainhas católicas tradicionais: de Nossa Senhora, dos santos e do Sagrado Coração.',
    keywords: 'ladainhas católicas, ladainha de nossa senhora, ladainha dos santos',
  },
  {
    slug: 'duvidas-da-fe',
    title: 'Dúvidas da Fé',
    subtitle: 'Respostas claras para as principais dúvidas sobre a fé católica, liturgia, tradições e costumes da Igreja.',
    description: 'Respostas claras para dúvidas sobre fé católica, liturgia, tradições e ensinamentos da Igreja.',
    keywords: 'dúvidas da fé católica, perguntas católicas, ensinamentos da igreja',
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export const categoryLabel = (slug: string) => categoryBySlug(slug)?.title ?? slug;

/** Páginas fixas (fora das categorias) para sitemap e llms.txt */
export const STATIC_PAGES = [
  { path: '/', title: 'Início', changefreq: 'daily', priority: 1.0 },
  { path: '/liturgia-diaria', title: 'Liturgia Diária', changefreq: 'daily', priority: 0.9 },
  { path: '/versiculo-do-dia', title: 'Versículo do Dia', changefreq: 'daily', priority: 0.9 },
  { path: '/santo-do-dia', title: 'Santo do Dia', changefreq: 'daily', priority: 0.9 },
  { path: '/laudes-de-hoje', title: 'Laudes de hoje (Liturgia das Horas)', changefreq: 'daily', priority: 0.9 },
  { path: '/aprender', title: 'Caminho da Fé (curso interativo)', changefreq: 'weekly', priority: 0.8 },
  { path: '/descubra-seu-santo', title: 'Descubra seu santo (teste de afinidade)', changefreq: 'monthly', priority: 0.8 },
  { path: '/ferramentas', title: 'Ferramentas católicas', changefreq: 'monthly', priority: 0.8 },
  { path: '/terco-guiado', title: 'Terço guiado', changefreq: 'monthly', priority: 0.8 },
  { path: '/terco-da-misericordia', title: 'Terço da Misericórdia guiado', changefreq: 'monthly', priority: 0.7 },
  { path: '/via-sacra', title: 'Via Sacra', changefreq: 'monthly', priority: 0.7 },
  { path: '/lectio-divina', title: 'Lectio Divina guiada', changefreq: 'daily', priority: 0.7 },
  { path: '/planejador-de-novena', title: 'Planejador de novena', changefreq: 'monthly', priority: 0.7 },
  { path: '/consagracao-a-nossa-senhora', title: 'Consagração a Nossa Senhora em 33 dias', changefreq: 'monthly', priority: 0.7 },
  { path: '/teste-de-temperamento', title: 'Teste de temperamento', changefreq: 'monthly', priority: 0.7 },
  { path: '/santo-do-aniversario', title: 'Santo do aniversário', changefreq: 'monthly', priority: 0.7 },
  { path: '/nomes-de-santos', title: 'Nomes de santos', changefreq: 'monthly', priority: 0.7 },
  { path: '/padroeiros', title: 'Santos padroeiros', changefreq: 'monthly', priority: 0.7 },
  { path: '/plano-de-leitura-da-biblia', title: 'Plano de leitura da Bíblia', changefreq: 'monthly', priority: 0.7 },
  { path: '/datas-liturgicas', title: 'Datas litúrgicas', changefreq: 'monthly', priority: 0.7 },
  { path: '/glossario', title: 'Glossário católico', changefreq: 'monthly', priority: 0.6 },
  { path: '/encontre-na-biblia', title: 'Encontre na Bíblia', changefreq: 'weekly', priority: 0.7 },
  { path: '/pedido-de-oracao', title: 'Pedido de Oração', changefreq: 'monthly', priority: 0.6 },
  { path: '/sugestoes', title: 'Sugestões e Correções', changefreq: 'yearly', priority: 0.3 },
  { path: '/termos-de-uso', title: 'Termos de Uso', changefreq: 'yearly', priority: 0.2 },
  { path: '/politica-de-privacidade', title: 'Política de Privacidade', changefreq: 'yearly', priority: 0.2 },
] as const;
