/**
 * "Descubra seu santo": perguntas e santos, por afinidade.
 * Regra editorial: só dados verificáveis (datas de festa do calendário romano ou do Brasil,
 * anos de canonização e fatos da vida amplamente documentados).
 * O teste não "define" um padroeiro: sugere santos cuja vida combina com o momento da pessoa.
 */

export type Traco =
  | 'contemplacao'
  | 'caridade'
  | 'estudo'
  | 'familia'
  | 'trabalho'
  | 'juventude'
  | 'combate'
  | 'conversao'
  | 'confianca'
  | 'missao'
  | 'simplicidade'
  | 'misericordia'
  | 'eucaristia'
  | 'maria'
  | 'brasil'
  | 'saude'
  | 'protecao'
  | 'martirio'
  | 'era_antiga'
  | 'era_media'
  | 'era_moderna'
  | 'era_atual';

export interface SantoAfinidade {
  id: string;
  nome: string;
  festa: { mes: number; dia: number };
  resumo: string;
  tracos: Partial<Record<Traco, number>>;
  /** artigo principal no site (categoria/slug) */
  artigo?: string;
  /** novena ou ladainha no site */
  oracao?: { titulo: string; chave: string };
}

/** Frase que explica a afinidade, por traço */
export const MOTIVO: Record<Traco, string> = {
  contemplacao: 'você busca a oração silenciosa, a sós com Deus',
  caridade: 'seu coração se move por quem sofre',
  estudo: 'você quer entender a fé a fundo',
  familia: 'a família está no centro da sua vida',
  trabalho: 'você quer santificar o trabalho de cada dia',
  juventude: 'você vive a fé com energia de jovem',
  combate: 'você enfrenta um bom combate espiritual',
  conversao: 'você está em um caminho de volta para Deus',
  confianca: 'você aprende a confiar em Deus nas provações',
  missao: 'você sente o chamado de levar Jesus aos outros',
  simplicidade: 'você valoriza a humildade e as coisas simples',
  misericordia: 'a misericórdia de Deus fala alto para você',
  eucaristia: 'Jesus na Eucaristia é o centro da sua fé',
  maria: 'você tem amor especial por Nossa Senhora',
  brasil: 'você quis conhecer santos que viveram no Brasil',
  saude: 'você reza pela saúde e pelos doentes',
  protecao: 'você pede proteção contra o mal e os perigos',
  martirio: 'a coragem dos mártires inspira você',
  era_antiga: 'você se identifica com os primeiros cristãos',
  era_media: 'você se identifica com os santos da Idade Média',
  era_moderna: 'você se identifica com os santos da Idade Moderna',
  era_atual: 'você se identifica com santos do nosso tempo',
};

/** Traços de época só desempatam: não aparecem como "motivo" no resultado */
export const TRACOS_DE_EPOCA: Traco[] = ['era_antiga', 'era_media', 'era_moderna', 'era_atual'];

export const SANTOS: SantoAfinidade[] = [
  // ─────────────── Primeiros séculos ───────────────
  {
    id: 'sao-jose',
    nome: 'São José',
    festa: { mes: 3, dia: 19 },
    resumo: 'Esposo da Virgem Maria e pai adotivo de Jesus, o carpinteiro de Nazaré. Proclamado patrono da Igreja universal pelo Papa Pio IX em 1870.',
    tracos: { familia: 3, trabalho: 3, protecao: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-jose-patrono-da-igreja-universal',
    oracao: { titulo: 'Novena a São José', chave: 'novenas/novena-a-sao-jose-para-o-trabalho-e-a-familia' },
  },
  {
    id: 'sao-joao-batista',
    nome: 'São João Batista',
    festa: { mes: 6, dia: 24 },
    resumo: 'O precursor que preparou o caminho de Jesus, pregou a conversão no deserto e batizou o Senhor no Jordão. Morreu mártir por defender a verdade.',
    tracos: { conversao: 2, missao: 2, martirio: 2, combate: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-joao-batista-o-precursor-de-cristo',
  },
  {
    id: 'sao-pedro',
    nome: 'São Pedro',
    festa: { mes: 6, dia: 29 },
    resumo: 'Pescador da Galileia escolhido por Jesus como a pedra sobre a qual edificaria a Igreja. Negou o Mestre, chorou o pecado, foi perdoado e morreu mártir em Roma.',
    tracos: { misericordia: 2, conversao: 1, missao: 2, martirio: 1, trabalho: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-pedro-o-primeiro-papa-e-a-pedra-da-igreja',
  },
  {
    id: 'sao-paulo',
    nome: 'São Paulo Apóstolo',
    festa: { mes: 6, dia: 29 },
    resumo: 'Perseguidor dos cristãos que se converteu no caminho de Damasco e se tornou o apóstolo dos gentios. Suas cartas fazem parte do Novo Testamento.',
    tracos: { conversao: 3, missao: 3, estudo: 1, martirio: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-paulo-o-apostolo-dos-gentios',
  },
  {
    id: 'sao-judas-tadeu',
    nome: 'São Judas Tadeu',
    festa: { mes: 10, dia: 28 },
    resumo: 'Um dos doze apóstolos de Jesus, parente do Senhor segundo a tradição. É muito invocado nas causas difíceis e desesperadas.',
    tracos: { confianca: 3, missao: 1, martirio: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-judas-tadeu-santo-causas-impossiveis',
    oracao: { titulo: 'Ladainha de São Judas Tadeu', chave: 'ladainhas/ladainha-de-sao-judas-tadeu' },
  },
  {
    id: 'sao-lucas',
    nome: 'São Lucas Evangelista',
    festa: { mes: 10, dia: 18 },
    resumo: 'Médico, companheiro de São Paulo e autor do Evangelho e dos Atos dos Apóstolos. É o evangelista que mais conta sobre a infância de Jesus e Nossa Senhora.',
    tracos: { estudo: 2, saude: 2, maria: 1, missao: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-lucas-evangelista-medico-escritor',
  },
  {
    id: 'santa-maria-madalena',
    nome: 'Santa Maria Madalena',
    festa: { mes: 7, dia: 22 },
    resumo: 'Discípula que seguiu Jesus até a Cruz e foi a primeira testemunha da Ressurreição. A Igreja a chama de "apóstola dos apóstolos".',
    tracos: { conversao: 2, misericordia: 2, contemplacao: 1, eucaristia: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/santa-maria-madalena-apostola-ressurreicao',
  },
  {
    id: 'sao-sebastiao',
    nome: 'São Sebastião',
    festa: { mes: 1, dia: 20 },
    resumo: 'Soldado romano martirizado por não renunciar à fé, no tempo das perseguições. É invocado como protetor contra a fome, a peste e a guerra.',
    tracos: { martirio: 3, protecao: 2, saude: 1, combate: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-sebastiao-o-martir-protetor-contra-pestes',
  },
  {
    id: 'sao-jorge',
    nome: 'São Jorge',
    festa: { mes: 4, dia: 23 },
    resumo: 'Soldado mártir dos primeiros séculos, lembrado na tradição como o cavaleiro que vence o dragão, imagem da vitória da fé sobre o mal.',
    tracos: { protecao: 3, combate: 2, martirio: 2, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-jorge-soldado-de-cristo',
    oracao: { titulo: 'Ladainha de São Jorge', chave: 'ladainhas/ladainha-de-sao-jorge' },
  },
  {
    id: 'santa-luzia',
    nome: 'Santa Luzia',
    festa: { mes: 12, dia: 13 },
    resumo: 'Jovem cristã de Siracusa, na Sicília, que consagrou a vida a Deus e morreu mártir no início do século IV. É invocada como protetora dos olhos.',
    tracos: { saude: 3, martirio: 2, juventude: 1, combate: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/santa-luzia-protetora-dos-olhos',
  },
  {
    id: 'santa-barbara',
    nome: 'Santa Bárbara',
    festa: { mes: 12, dia: 4 },
    resumo: 'Virgem e mártir dos primeiros séculos, lembrada pela firmeza na fé. É invocada como protetora contra tempestades e raios.',
    tracos: { protecao: 3, martirio: 2, confianca: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/santa-barbara-protetora-contra-tempestades',
  },
  {
    id: 'sao-cosme-e-sao-damiao',
    nome: 'São Cosme e São Damião',
    festa: { mes: 9, dia: 26 },
    resumo: 'Irmãos médicos que cuidavam dos doentes sem cobrar e morreram mártires. São padroeiros dos médicos e muito queridos no Brasil.',
    tracos: { saude: 3, caridade: 2, martirio: 1, familia: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-cosme-e-sao-damiao-os-santos-medicos',
  },
  {
    id: 'sao-jeronimo',
    nome: 'São Jerônimo',
    festa: { mes: 9, dia: 30 },
    resumo: 'Doutor da Igreja que traduziu a Bíblia para o latim, a Vulgata. Ensinou que "ignorar as Escrituras é ignorar Cristo".',
    tracos: { estudo: 3, combate: 1, contemplacao: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/sao-jeronimo-tradutor-da-biblia-e-erudito',
  },
  {
    id: 'santo-agostinho',
    nome: 'Santo Agostinho',
    festa: { mes: 8, dia: 28 },
    resumo: 'Depois de anos longe de Deus, converteu-se, tornou-se bispo de Hipona e Doutor da Igreja. Contou a própria história nas Confissões.',
    tracos: { conversao: 3, estudo: 3, contemplacao: 1, era_antiga: 1 },
    artigo: 'santos-e-oracoes/santo-agostinho-de-hipona-das-confissoes-a-cidade-de-deus',
  },
  {
    id: 'santa-monica',
    nome: 'Santa Mônica',
    festa: { mes: 8, dia: 27 },
    resumo: 'Mãe de Santo Agostinho, rezou durante anos pela conversão do filho até vê-lo batizado. Modelo das mães que rezam pelos filhos.',
    tracos: { familia: 3, conversao: 2, confianca: 1, era_antiga: 1 },
    oracao: { titulo: 'Ladainha de Santa Mônica', chave: 'ladainhas/ladainha-de-santa-monica' },
  },
  {
    id: 'sao-miguel-arcanjo',
    nome: 'São Miguel Arcanjo',
    festa: { mes: 9, dia: 29 },
    resumo: 'O arcanjo que a Escritura mostra à frente da luta contra o mal (Ap 12,7). A Igreja o invoca como protetor no combate espiritual.',
    tracos: { protecao: 3, combate: 2, confianca: 1 },
    artigo: 'santos-e-oracoes/sao-miguel-arcanjo-protecao-contra-o-mal',
    oracao: { titulo: 'Novena a São Miguel Arcanjo', chave: 'novenas/novena-a-sao-miguel-arcanjo' },
  },

  // ─────────────── Idade Média ───────────────
  {
    id: 'sao-bento',
    nome: 'São Bento',
    festa: { mes: 7, dia: 11 },
    resumo: 'Pai do monaquismo no Ocidente, resumiu a vida cristã em oração e trabalho. Sua medalha é sinal de proteção contra o mal. É padroeiro da Europa.',
    tracos: { protecao: 2, trabalho: 2, contemplacao: 2, combate: 1, era_media: 1 },
    artigo: 'santos-e-oracoes/sao-bento-de-nursia-pai-do-monaquismo-ocidental',
    oracao: { titulo: 'Novena a São Bento', chave: 'novenas/novena-a-sao-bento-contra-o-mal' },
  },
  {
    id: 'sao-francisco-de-assis',
    nome: 'São Francisco de Assis',
    festa: { mes: 10, dia: 4 },
    resumo: 'Deixou a riqueza para viver a pobreza do Evangelho e fundou os Frades Menores. São João Paulo II o proclamou padroeiro da ecologia em 1979.',
    tracos: { simplicidade: 3, caridade: 2, conversao: 1, missao: 1, era_media: 1 },
    artigo: 'santos-e-oracoes/sao-francisco-de-assis-vida-milagres-e-oracao',
    oracao: { titulo: 'Novena a São Francisco de Assis', chave: 'novenas/novena-a-sao-francisco-de-assis' },
  },
  {
    id: 'santa-clara',
    nome: 'Santa Clara de Assis',
    festa: { mes: 8, dia: 11 },
    resumo: 'Seguiu o exemplo de São Francisco e fundou as Clarissas, irmãs dedicadas à oração e à pobreza. Viveu décadas no mosteiro de São Damião.',
    tracos: { contemplacao: 3, simplicidade: 2, eucaristia: 1, era_media: 1 },
    artigo: 'santos-e-oracoes/santa-clara-de-assis-fundadora-das-clarissas',
  },
  {
    id: 'santo-antonio',
    nome: 'Santo Antônio de Pádua',
    festa: { mes: 6, dia: 13 },
    resumo: 'Frade franciscano nascido em Lisboa, grande pregador e Doutor da Igreja. Lembrado pela caridade com os pobres, é muito querido no Brasil.',
    tracos: { missao: 2, estudo: 2, caridade: 1, era_media: 1 },
    artigo: 'santos-e-oracoes/santo-antonio-de-padua-o-santo-dos-milagres',
    oracao: { titulo: 'Novena a Santo Antônio', chave: 'novenas/novena-a-santo-antonio-de-padua' },
  },
  {
    id: 'sao-domingos',
    nome: 'São Domingos de Gusmão',
    festa: { mes: 8, dia: 8 },
    resumo: 'Fundador da Ordem dos Pregadores, os dominicanos, dedicada a anunciar e explicar a fé. A tradição liga a ele a difusão do Rosário.',
    tracos: { missao: 2, estudo: 2, maria: 2, era_media: 1 },
    artigo: 'santos-e-oracoes/sao-domingos-de-gusmao-fundador-dos-dominicanos',
  },
  {
    id: 'sao-tomas-de-aquino',
    nome: 'São Tomás de Aquino',
    festa: { mes: 1, dia: 28 },
    resumo: 'Frade dominicano, autor da Suma Teológica e dos hinos de Corpus Christi. É o Doutor Angélico e patrono das escolas católicas.',
    tracos: { estudo: 3, eucaristia: 2, contemplacao: 1, era_media: 1 },
    artigo: 'santos-e-oracoes/sao-tomas-de-aquino-o-doutor-angelico',
    oracao: { titulo: 'Ladainha de São Tomás de Aquino', chave: 'ladainhas/ladainha-de-sao-tomas-de-aquino' },
  },
  {
    id: 'santa-catarina-de-sena',
    nome: 'Santa Catarina de Sena',
    festa: { mes: 4, dia: 29 },
    resumo: 'Leiga dominicana de grande vida de oração, aconselhou papas e trabalhou pela paz na Igreja. Doutora da Igreja desde 1970 e padroeira da Europa.',
    tracos: { contemplacao: 2, missao: 2, combate: 1, estudo: 1, era_media: 1 },
    artigo: 'santos-e-oracoes/santa-catarina-de-sena-doutora-e-mistica',
    oracao: { titulo: 'Ladainha de Santa Catarina de Sena', chave: 'ladainhas/ladainha-de-santa-catarina-de-sena' },
  },
  {
    id: 'santa-rita',
    nome: 'Santa Rita de Cássia',
    festa: { mes: 5, dia: 22 },
    resumo: 'Esposa, mãe, viúva e depois monja agostiniana em Cássia. Perdoou os assassinos do marido e é invocada nas causas impossíveis.',
    tracos: { confianca: 3, familia: 2, misericordia: 1, era_media: 1 },
    artigo: 'santos-e-oracoes/santa-rita-de-cassia-a-santa-das-causas-impossiveis',
    oracao: { titulo: 'Novena a Santa Rita', chave: 'novenas/novena-a-santa-rita-de-cassia' },
  },

  // ─────────────── Idade Moderna ───────────────
  {
    id: 'santo-inacio',
    nome: 'Santo Inácio de Loyola',
    festa: { mes: 7, dia: 31 },
    resumo: 'Soldado ferido em batalha, converteu-se lendo a vida de Cristo e dos santos. Escreveu os Exercícios Espirituais e fundou a Companhia de Jesus.',
    tracos: { conversao: 2, missao: 2, combate: 1, estudo: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/santo-inacio-de-loyola-fundador-dos-jesuitas',
  },
  {
    id: 'sao-francisco-xavier',
    nome: 'São Francisco Xavier',
    festa: { mes: 12, dia: 3 },
    resumo: 'Um dos primeiros companheiros de Santo Inácio de Loyola, levou o Evangelho à Índia e ao Japão. É padroeiro das missões.',
    tracos: { missao: 3, combate: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-francisco-xavier-o-grande-missionario',
  },
  {
    id: 'santa-teresa-de-avila',
    nome: 'Santa Teresa de Ávila',
    festa: { mes: 10, dia: 15 },
    resumo: 'Reformadora do Carmelo e mestra da oração interior. Foi a primeira mulher proclamada Doutora da Igreja, em 1970.',
    tracos: { contemplacao: 3, conversao: 1, estudo: 1, combate: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/santa-teresa-de-avila-doutora-oracao-mistica',
  },
  {
    id: 'sao-joao-da-cruz',
    nome: 'São João da Cruz',
    festa: { mes: 12, dia: 14 },
    resumo: 'Frade carmelita, companheiro de Santa Teresa de Ávila na reforma do Carmelo. Poeta e místico, escreveu sobre a "noite escura". Doutor da Igreja.',
    tracos: { contemplacao: 3, confianca: 2, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-joao-da-cruz-a-noite-escura-da-alma',
  },
  {
    id: 'sao-francisco-de-sales',
    nome: 'São Francisco de Sales',
    festa: { mes: 1, dia: 24 },
    resumo: 'Bispo de Genebra conhecido pela mansidão. Escreveu a "Filoteia" para mostrar que a santidade é para todos, inclusive os leigos. Doutor da Igreja.',
    tracos: { estudo: 2, simplicidade: 2, missao: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-francisco-de-sales-doutor-da-mansidao',
  },
  {
    id: 'sao-luis-gonzaga',
    nome: 'São Luís Gonzaga',
    festa: { mes: 6, dia: 21 },
    resumo: 'Jovem nobre italiano que deixou tudo para ser jesuíta. Morreu aos 23 anos depois de cuidar de doentes de uma epidemia em Roma. Padroeiro da juventude.',
    tracos: { juventude: 3, saude: 1, caridade: 1, combate: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-luis-gonzaga-padroeiro-da-juventude',
  },
  {
    id: 'sao-camilo',
    nome: 'São Camilo de Léllis',
    festa: { mes: 7, dia: 14 },
    resumo: 'Ex-soldado de vida desregrada que se converteu e dedicou a vida aos doentes. Fundou os Camilianos e é padroeiro dos enfermos e dos enfermeiros.',
    tracos: { saude: 3, caridade: 2, conversao: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-camilo-de-lellis-patrono-dos-enfermeiros',
  },
  {
    id: 'sao-vicente-de-paulo',
    nome: 'São Vicente de Paulo',
    festa: { mes: 9, dia: 27 },
    resumo: 'Padre francês que organizou o cuidado dos pobres e fundou os Lazaristas e, com Santa Luísa de Marillac, as Filhas da Caridade. Padroeiro das obras de caridade.',
    tracos: { caridade: 3, missao: 1, trabalho: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-vicente-de-paulo-santo-caridade',
  },
  {
    id: 'santa-rosa-de-lima',
    nome: 'Santa Rosa de Lima',
    festa: { mes: 8, dia: 23 },
    resumo: 'Leiga dominicana do Peru, de intensa vida de oração e cuidado com os pobres e doentes. Foi a primeira santa canonizada das Américas.',
    tracos: { contemplacao: 2, caridade: 1, simplicidade: 1, saude: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/santa-rosa-de-lima-primeira-santa-america',
  },
  {
    id: 'sao-martinho-de-porres',
    nome: 'São Martinho de Porres',
    festa: { mes: 11, dia: 3 },
    resumo: 'Irmão dominicano de Lima, filho de pai espanhol e mãe de origem africana. Cuidava dos doentes e dos pobres e é lembrado pela vassoura, sinal da sua humildade.',
    tracos: { simplicidade: 3, caridade: 2, saude: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-martin-de-porres-o-santo-da-vassoura',
  },
  {
    id: 'sao-jose-de-anchieta',
    nome: 'São José de Anchieta',
    festa: { mes: 6, dia: 9 },
    resumo: 'Jesuíta nascido nas Canárias, chegou ao Brasil em 1553, participou da fundação de São Paulo e evangelizou os povos indígenas. Canonizado em 2014.',
    tracos: { missao: 3, brasil: 3, estudo: 1, maria: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-jose-de-anchieta-apostolo-do-brasil',
  },
  {
    id: 'martires-do-brasil',
    nome: 'Santos Mártires de Cunhaú e Uruaçu',
    festa: { mes: 10, dia: 3 },
    resumo: 'Padre André de Soveral, Mateus Moreira e companheiros, mortos em 1645 no Rio Grande do Norte por não renunciarem à fé católica. Canonizados em 2017.',
    tracos: { martirio: 3, brasil: 3, eucaristia: 1, combate: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/santos-martires-do-brasil-andre-de-soveral-e-companheiros',
  },
  {
    id: 'frei-galvao',
    nome: 'Santo Antônio de Sant’Anna Galvão (Frei Galvão)',
    festa: { mes: 10, dia: 25 },
    resumo: 'Frade franciscano paulista, primeiro santo nascido no Brasil, canonizado em 2007. Era muito devoto de Nossa Senhora.',
    tracos: { brasil: 3, maria: 2, saude: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/frei-galvao-primeiro-santo-brasileiro',
  },
  {
    id: 'sao-joao-maria-vianney',
    nome: 'São João Maria Vianney',
    festa: { mes: 8, dia: 4 },
    resumo: 'O Cura d’Ars, padre de uma pequena aldeia francesa que passava longas horas no confessionário. É o padroeiro dos párocos.',
    tracos: { misericordia: 3, simplicidade: 1, eucaristia: 1, combate: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-joao-maria-vianney-cura-d-ars',
  },
  {
    id: 'sao-joao-bosco',
    nome: 'São João Bosco',
    festa: { mes: 1, dia: 31 },
    resumo: 'Padre italiano que dedicou a vida à educação dos jovens pobres e fundou os Salesianos. Grande devoto de Nossa Senhora Auxiliadora.',
    tracos: { juventude: 3, caridade: 1, maria: 1, trabalho: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/sao-joao-bosco-pai-e-mestre-da-juventude',
  },
  {
    id: 'beata-nha-chica',
    nome: 'Beata Nhá Chica',
    festa: { mes: 6, dia: 14 },
    resumo: 'Francisca de Paula de Jesus, leiga de Baependi, em Minas Gerais, conhecida pela oração, pela caridade e pelo amor a Nossa Senhora. Beatificada em 2013.',
    tracos: { brasil: 3, simplicidade: 2, maria: 1, caridade: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/beata-nha-chica-a-santa-mineira',
  },
  {
    id: 'santa-teresinha',
    nome: 'Santa Teresinha do Menino Jesus',
    festa: { mes: 10, dia: 1 },
    resumo: 'Carmelita francesa que ensinou a "pequena via": fazer as coisas pequenas com grande amor. Doutora da Igreja desde 1997 e padroeira das missões.',
    tracos: { simplicidade: 3, confianca: 2, contemplacao: 1, missao: 1, era_moderna: 1 },
    artigo: 'santos-e-oracoes/santa-teresinha-pequeno-caminho',
    oracao: { titulo: 'Novena a Santa Teresinha', chave: 'novenas/novena-a-santa-teresinha-com-reflexoes' },
  },

  // ─────────────── Século XX e XXI ───────────────
  {
    id: 'sao-pio-x',
    nome: 'São Pio X',
    festa: { mes: 8, dia: 21 },
    resumo: 'Papa de 1903 a 1914. Incentivou a comunhão frequente e permitiu que as crianças recebessem a Eucaristia mais cedo.',
    tracos: { eucaristia: 3, juventude: 1, estudo: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/sao-pio-x-o-papa-da-eucaristia',
  },
  {
    id: 'santa-faustina',
    nome: 'Santa Faustina',
    festa: { mes: 10, dia: 5 },
    resumo: 'Religiosa polonesa a quem Jesus confiou a mensagem da Divina Misericórdia e a jaculatória "Jesus, eu confio em vós". Canonizada em 2000.',
    tracos: { misericordia: 3, confianca: 2, contemplacao: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/santa-faustina-e-a-divina-misericordia',
    oracao: { titulo: 'Ladainha de Santa Faustina', chave: 'ladainhas/ladainha-de-santa-faustina-kowalska' },
  },
  {
    id: 'sao-maximiliano-kolbe',
    nome: 'São Maximiliano Kolbe',
    festa: { mes: 8, dia: 14 },
    resumo: 'Frade franciscano, grande devoto da Imaculada, usou a imprensa para evangelizar. Em Auschwitz, ofereceu a vida no lugar de um pai de família.',
    tracos: { maria: 3, missao: 2, martirio: 2, caridade: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/sao-maximiliano-kolbe-martir-auschwitz',
  },
  {
    id: 'santa-edith-stein',
    nome: 'Santa Teresa Benedita da Cruz (Edith Stein)',
    festa: { mes: 8, dia: 9 },
    resumo: 'Filósofa judia alemã que se converteu ao catolicismo e se tornou carmelita. Morreu em Auschwitz em 1942. É copadroeira da Europa.',
    tracos: { estudo: 2, conversao: 2, contemplacao: 1, martirio: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/santa-edith-stein-teresa-benedita-da-cruz-filosofa-e-martir',
  },
  {
    id: 'sao-padre-pio',
    nome: 'São Padre Pio',
    festa: { mes: 9, dia: 23 },
    resumo: 'Frade capuchinho que passou longas horas no confessionário, trouxe os estigmas por cinquenta anos e fundou um hospital, a Casa Alívio do Sofrimento. Canonizado em 2002.',
    tracos: { misericordia: 2, combate: 2, confianca: 2, era_atual: 1 },
    artigo: 'santos-e-oracoes/sao-padre-pio-vida-e-estigmas',
    oracao: { titulo: 'Ladainha de São Padre Pio', chave: 'ladainhas/ladainha-de-sao-padre-pio' },
  },
  {
    id: 'sao-josemaria',
    nome: 'São Josemaría Escrivá',
    festa: { mes: 6, dia: 26 },
    resumo: 'Fundador do Opus Dei, ensinou que o trabalho e a vida comum são caminho de santidade. Canonizado em 2002.',
    tracos: { trabalho: 3, simplicidade: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/sao-josemaria-escriva-fundador-do-opus-dei',
  },
  {
    id: 'santa-gianna',
    nome: 'Santa Gianna Beretta Molla',
    festa: { mes: 4, dia: 28 },
    resumo: 'Médica e mãe italiana que deu a vida para que a filha que esperava pudesse nascer. Canonizada em 2004.',
    tracos: { familia: 3, saude: 2, era_atual: 1 },
    artigo: 'santos-e-oracoes/santa-gianna-beretta-molla-mae-e-medica',
  },
  {
    id: 'santa-teresa-de-calcuta',
    nome: 'Santa Teresa de Calcutá',
    festa: { mes: 9, dia: 5 },
    resumo: 'Fundou as Missionárias da Caridade para servir os mais pobres dos pobres. Canonizada em 2016.',
    tracos: { caridade: 3, saude: 2, simplicidade: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/santa-teresa-de-calcuta-missionaria-da-caridade',
  },
  {
    id: 'sao-joao-paulo-ii',
    nome: 'São João Paulo II',
    festa: { mes: 10, dia: 22 },
    resumo: 'Papa de 1978 a 2005. Criou as Jornadas Mundiais da Juventude e instituiu o Domingo da Divina Misericórdia. Canonizado em 2014.',
    tracos: { juventude: 3, familia: 2, misericordia: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/sao-joao-paulo-ii-papa-peregrino',
    oracao: { titulo: 'Ladainha de São João Paulo II', chave: 'ladainhas/ladainha-de-sao-joao-paulo-ii' },
  },
  {
    id: 'santa-dulce-dos-pobres',
    nome: 'Santa Dulce dos Pobres',
    festa: { mes: 8, dia: 13 },
    resumo: 'Religiosa baiana que dedicou a vida aos pobres e doentes de Salvador. Primeira santa mulher nascida no Brasil, canonizada em 2019.',
    tracos: { caridade: 3, brasil: 3, saude: 2, confianca: 1, era_atual: 1 },
  },
  {
    id: 'sao-carlo-acutis',
    nome: 'São Carlo Acutis',
    festa: { mes: 10, dia: 12 },
    resumo: 'Jovem italiano que usou a internet para divulgar os milagres eucarísticos. Morreu aos 15 anos, em 2006, e foi canonizado em 2025.',
    tracos: { juventude: 3, eucaristia: 3, missao: 1, era_atual: 1 },
    artigo: 'santos-e-oracoes/beato-carlo-acutis-o-jovem-santo-da-era-digital',
  },
];

export interface Pergunta {
  id: string;
  texto: string;
  opcoes: { texto: string; tracos: Partial<Record<Traco, number>> }[];
}

export const PERGUNTAS: Pergunta[] = [
  {
    id: 'momento',
    texto: 'Em que momento da vida você está?',
    opcoes: [
      { texto: 'Estudando ou começando a vida adulta', tracos: { juventude: 2, estudo: 1 } },
      { texto: 'Cuidando da família e dos filhos', tracos: { familia: 3 } },
      { texto: 'Trabalhando muito, com pouco tempo livre', tracos: { trabalho: 3 } },
      { texto: 'Passando por uma provação difícil', tracos: { confianca: 3 } },
      { texto: 'Enfrentando uma doença, minha ou de alguém', tracos: { saude: 3 } },
      { texto: 'Voltando para a fé depois de um tempo longe', tracos: { conversao: 3 } },
    ],
  },
  {
    id: 'oracao',
    texto: 'Como você mais gosta de rezar?',
    opcoes: [
      { texto: 'Em silêncio, a sós com Deus', tracos: { contemplacao: 3 } },
      { texto: 'Com o terço nas mãos', tracos: { maria: 3 } },
      { texto: 'Na Missa ou diante do Santíssimo', tracos: { eucaristia: 3 } },
      { texto: 'Com palavras simples, ao longo do dia', tracos: { simplicidade: 2, trabalho: 1 } },
      { texto: 'Lendo a Bíblia e bons livros', tracos: { estudo: 3 } },
    ],
  },
  {
    id: 'pedido',
    texto: 'Pelo que você mais pede a intercessão dos santos?',
    opcoes: [
      { texto: 'Saúde, minha ou de alguém querido', tracos: { saude: 3 } },
      { texto: 'Proteção contra perigos e contra o mal', tracos: { protecao: 3 } },
      { texto: 'Causas que parecem impossíveis', tracos: { confianca: 3 } },
      { texto: 'Trabalho e sustento', tracos: { trabalho: 3 } },
      { texto: 'Estudos e provas', tracos: { estudo: 2, juventude: 1 } },
      { texto: 'Família e filhos', tracos: { familia: 3 } },
      { texto: 'A conversão de alguém que amo', tracos: { conversao: 3 } },
    ],
  },
  {
    id: 'coracao',
    texto: 'O que mais toca o seu coração?',
    opcoes: [
      { texto: 'Cuidar de quem sofre e dos pobres', tracos: { caridade: 3 } },
      { texto: 'Anunciar Jesus a quem não o conhece', tracos: { missao: 3 } },
      { texto: 'Entender e explicar a fé', tracos: { estudo: 3 } },
      { texto: 'O perdão de Deus na Confissão', tracos: { misericordia: 3 } },
      { texto: 'Proteger as pessoas que eu amo', tracos: { protecao: 2, familia: 1 } },
    ],
  },
  {
    id: 'historia',
    texto: 'Que tipo de história de santo mais inspira você?',
    opcoes: [
      { texto: 'De quem mudou de vida por completo', tracos: { conversao: 3 } },
      { texto: 'De quem deu a vida pela fé', tracos: { martirio: 3 } },
      { texto: 'De quem viveu de forma simples e escondida', tracos: { simplicidade: 3 } },
      { texto: 'De quem escreveu e ensinou', tracos: { estudo: 3 } },
      { texto: 'De quem cuidou de doentes e pobres', tracos: { caridade: 2, saude: 1 } },
      { texto: 'De quem viajou para anunciar Jesus', tracos: { missao: 3 } },
    ],
  },
  {
    id: 'virtude',
    texto: 'Qual virtude você mais quer fazer crescer?',
    opcoes: [
      { texto: 'Humildade', tracos: { simplicidade: 3 } },
      { texto: 'Paciência', tracos: { confianca: 2, simplicidade: 1 } },
      { texto: 'Pureza', tracos: { combate: 1, maria: 1, juventude: 1 } },
      { texto: 'Coragem', tracos: { combate: 2, martirio: 1 } },
      { texto: 'Caridade', tracos: { caridade: 3 } },
      { texto: 'Confiança em Deus', tracos: { confianca: 2, misericordia: 1 } },
    ],
  },
  {
    id: 'luta',
    texto: 'Qual é a sua maior luta hoje?',
    opcoes: [
      { texto: 'Ansiedade e medo do futuro', tracos: { confianca: 2, misericordia: 1 } },
      { texto: 'Tentações que se repetem', tracos: { combate: 3 } },
      { texto: 'Falta de tempo para Deus', tracos: { trabalho: 2, simplicidade: 1 } },
      { texto: 'Problemas na família', tracos: { familia: 3 } },
      { texto: 'Dúvidas de fé', tracos: { estudo: 2, conversao: 1 } },
      { texto: 'Culpa por erros do passado', tracos: { misericordia: 2, conversao: 2 } },
      { texto: 'Agitação: não consigo fazer silêncio', tracos: { contemplacao: 3 } },
      { texto: 'Medo da violência e do mal', tracos: { protecao: 3 } },
    ],
  },
  {
    id: 'servir',
    texto: 'Onde você se vê servindo a Deus?',
    opcoes: [
      { texto: 'Em casa, com a família', tracos: { familia: 2 } },
      { texto: 'No meu trabalho', tracos: { trabalho: 3 } },
      { texto: 'Na paróquia', tracos: { eucaristia: 2, maria: 1 } },
      { texto: 'Com doentes e pobres', tracos: { caridade: 2, saude: 1 } },
      { texto: 'Na internet e com os jovens', tracos: { juventude: 3 } },
      { texto: 'Em missão, onde for preciso', tracos: { missao: 3 } },
      { texto: 'Rezando por todos, em silêncio', tracos: { contemplacao: 3 } },
    ],
  },
  {
    id: 'imagem',
    texto: 'Qual imagem mais combina com você?',
    opcoes: [
      { texto: 'Uma pequena flor', tracos: { simplicidade: 3 } },
      { texto: 'A oficina de um carpinteiro', tracos: { trabalho: 2, familia: 1 } },
      { texto: 'Uma pilha de livros', tracos: { estudo: 3 } },
      { texto: 'Um escudo', tracos: { protecao: 2, combate: 1 } },
      { texto: 'Um rosário', tracos: { maria: 3 } },
      { texto: 'Uma mão estendida', tracos: { caridade: 3 } },
      { texto: 'A Hóstia consagrada', tracos: { eucaristia: 3 } },
      { texto: 'Uma palma, sinal dos mártires', tracos: { martirio: 3 } },
      { texto: 'Uma vela acesa', tracos: { contemplacao: 2, confianca: 1 } },
    ],
  },
  {
    id: 'epoca',
    texto: 'De que época você gostaria de conhecer um santo?',
    opcoes: [
      { texto: 'Dos tempos de Jesus e dos primeiros cristãos', tracos: { era_antiga: 2 } },
      { texto: 'Da Idade Média', tracos: { era_media: 2 } },
      { texto: 'Dos séculos XVI a XIX', tracos: { era_moderna: 2 } },
      { texto: 'Do nosso tempo, séculos XX e XXI', tracos: { era_atual: 2 } },
      { texto: 'Tanto faz', tracos: {} },
    ],
  },
  {
    id: 'brasil',
    texto: 'Quer que o resultado inclua santos que viveram no Brasil?',
    opcoes: [
      { texto: 'Sim, gostaria de conhecer', tracos: { brasil: 3 } },
      { texto: 'Tanto faz', tracos: {} },
    ],
  },
];

/** Calcula os santos mais afins. Normaliza pelo "tamanho" de cada santo para não favorecer quem tem mais traços. */
export function calcular(respostas: number[]): { santo: SantoAfinidade; pontos: number; motivos: Traco[] }[] {
  const perfil: Partial<Record<Traco, number>> = {};
  respostas.forEach((r, i) => {
    const op = PERGUNTAS[i]?.opcoes[r];
    if (!op) return;
    for (const [t, v] of Object.entries(op.tracos) as [Traco, number][]) perfil[t] = (perfil[t] ?? 0) + v;
  });
  return SANTOS.map((s) => {
    const pares = Object.entries(s.tracos) as [Traco, number][];
    const norma = Math.sqrt(pares.reduce((n, [, v]) => n + v * v, 0)) || 1;
    const contrib = pares.map(([t, v]) => [t, v * (perfil[t] ?? 0)] as const).filter(([, c]) => c > 0);
    const pontos = contrib.reduce((n, [, c]) => n + c, 0) / norma;
    const motivos = [...contrib]
      .filter(([t]) => !TRACOS_DE_EPOCA.includes(t))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([t]) => t);
    return { santo: s, pontos, motivos };
  }).sort((a, b) => b.pontos - a.pontos);
}
