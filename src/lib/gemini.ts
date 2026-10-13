import type { UnsplashImage } from './unsplash';
import { supabase } from './supabase';

interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  meta_description: string;
  content: string;
  image_alt: string;
  unsplashImages: UnsplashImage[];
}

interface JobStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result: GeneratedArticle | null;
  error_message: string | null;
}

async function pollJobStatus(jobId: string): Promise<GeneratedArticle> {
  const maxPolls = 120; // 4 minutes max (120 * 2s)
  for (let i = 0; i < maxPolls; i++) {
    const { data, error } = await supabase
      .from('article_generation_jobs')
      .select('status, progress, result, error_message')
      .eq('id', jobId)
      .single();

    if (error) throw new Error('Erro ao verificar status do job');

    const job = data as JobStatus;

    if (job.status === 'completed' && job.result) {
      return job.result as GeneratedArticle;
    }

    if (job.status === 'failed') {
      throw new Error(job.error_message || 'Erro ao gerar artigo');
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error('Tempo limite excedido aguardando geração do artigo');
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function buildInternalLinksContext(
  category: string,
  allTopics: { category: string; categorySlug: string; topics: string[] }[] = [],
  existingArticles: { title: string; slug: string; category: string }[] = []
): string {
  const existingLinks = existingArticles
    .filter((article) => article?.title && article?.slug && article?.category)
    .slice(0, 40)
    .map((article) => `- "${article.title}" → /${article.category}/${article.slug}`);

  const categoryContext = allTopics.find(
    (item) => item.category === category || item.categorySlug === category
  );

  const plannedLinks = (categoryContext?.topics ?? [])
    .slice(0, 20)
    .map((topic) => `- "${topic}" → /${categoryContext?.categorySlug ?? category}/${toSlug(topic)}`);

  const sections: string[] = [];
  if (existingLinks.length > 0) {
    sections.push(`Artigos publicados:\n${existingLinks.join('\n')}`);
  }
  if (plannedLinks.length > 0) {
    sections.push(`Temas planejados:\n${plannedLinks.join('\n')}`);
  }

  return sections.join('\n\n');
}

export async function generateArticle(
  category: string,
  topic: string,
  allTopics: { category: string; categorySlug: string; topics: string[] }[],
  existingArticles?: { title: string; slug: string; category: string }[],
  onProgress?: (progress: number) => void
): Promise<GeneratedArticle> {
  const body = {
    category,
    topic,
    internalLinksContext: buildInternalLinksContext(category, allTopics, existingArticles ?? []),
  };

  const maxInvokeAttempts = 3;
  let data: any = null;
  let lastErrorMessage = '';

  for (let attempt = 0; attempt < maxInvokeAttempts; attempt++) {
    const { data: invokeData, error } = await supabase.functions.invoke('generate-article', { body });

    if (!error) {
      data = invokeData;
      break;
    }

    lastErrorMessage = error.message || 'Erro ao iniciar geração do artigo';
    const isRetryable = /failed to send a request|failed to fetch|network|timeout/i.test(
      lastErrorMessage.toLowerCase()
    );

    if (!isRetryable || attempt === maxInvokeAttempts - 1) {
      throw new Error(lastErrorMessage);
    }

    await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  const jobId = data?.job_id;
  if (!jobId) {
    throw new Error('Job ID não retornado pela função');
  }

  // Poll for completion with progress callback
  const maxPolls = 120;
  for (let i = 0; i < maxPolls; i++) {
    const { data: jobData, error: jobError } = await supabase
      .from('article_generation_jobs')
      .select('status, progress, result, error_message')
      .eq('id', jobId)
      .single();

    if (jobError) throw new Error('Erro ao verificar status do job');

    const job = jobData as JobStatus;

    if (onProgress) onProgress(job.progress);

    if (job.status === 'completed' && job.result) {
      return job.result as GeneratedArticle;
    }

    if (job.status === 'failed') {
      throw new Error(job.error_message || 'Erro ao gerar artigo');
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error('Tempo limite excedido aguardando geração do artigo');
}

export const categoryTopics: Record<string, string[]> = {
  'como-rezar-o-terco': [
    'Guia completo para rezar o Santo Terço',
    'Os Mistérios Gozosos do Rosário e suas meditações',
    'Os Mistérios Dolorosos do Rosário e suas meditações',
    'Os Mistérios Gloriosos do Rosário e suas meditações',
    'Os Mistérios Luminosos do Rosário e suas meditações',
    'A história do Rosário e sua importância na vida católica',
    'Como meditar durante o Terço',
    'O Terço em família: guia prático',
    'O Terço da Misericórdia: como rezar e suas promessas',
    'A Coroa das Sete Dores de Maria',
    'O Rosário Bizantino e outras formas de rezar o Terço',
    'Como ensinar crianças a rezar o Terço',
    'O Terço dos Homens: história e espiritualidade',
    'Terço Mariano de Medjugorje',
    'As 15 Promessas de Nossa Senhora a quem reza o Rosário',
  ],
  'santos-e-oracoes': [
    'São Francisco de Assis: vida, milagres e oração',
    'Santa Teresinha do Menino Jesus: o pequeno caminho',
    'Santo Antônio de Pádua: o santo dos milagres',
    'São José: patrono da Igreja Universal',
    'São Padre Pio: vida e estigmas',
    'Santa Rita de Cássia: a santa das causas impossíveis',
    'São Miguel Arcanjo: proteção contra o mal',
    'Santa Faustina e a Divina Misericórdia',
    'São Pedro: o primeiro Papa e a pedra da Igreja',
    'São Paulo: o Apóstolo dos gentios',
    'São João Evangelista: o discípulo amado',
    'São Mateus: de cobrador de impostos a evangelista',
    'São Marcos Evangelista: vida e legado',
    'São Lucas Evangelista: médico e escritor sagrado',
    'São Tomé Apóstolo: de incrédulo a mártir da fé',
    'São Tiago Maior: apóstolo e peregrino',
    'São Judas Tadeu: o santo das causas impossíveis e desesperadas',
    'Santo André Apóstolo: o primeiro chamado',
    'São Bartolomeu Apóstolo: vida e martírio',
    'São Felipe Apóstolo: vida e pregação',
    'Santo Agostinho de Hipona: das Confissões à Cidade de Deus',
    'São Tomás de Aquino: o Doutor Angélico',
    'Santa Teresa de Ávila: doutora da oração mística',
    'São João da Cruz: a noite escura da alma',
    'São Jerônimo: tradutor da Bíblia e erudito',
    'Santo Ambrósio de Milão: pastor e doutor',
    'São Basílio Magno: pai da vida monástica oriental',
    'São Gregório Magno: Papa e doutor',
    'Santo Atanásio de Alexandria: defensor da fé nicena',
    'São Bernardo de Claraval: doutor melífluo',
    'Santa Catarina de Sena: doutora e mística',
    'São Roberto Belarmino: defensor da fé católica',
    'Santo Afonso Maria de Ligório: doutor da moral',
    'São Francisco de Sales: doutor da mansidão',
    'Santa Hildegarda de Bingen: mística e doutora',
    'São João Crisóstomo: boca de ouro',
    'São Leão Magno: Papa e doutor',
    'São José de Anchieta: apóstolo do Brasil',
    'Beata Nhá Chica: a santa mineira',
    'Frei Galvão: o primeiro santo brasileiro',
    'Santa Rosa de Lima: a primeira santa da América',
    'São Martín de Porres: o santo da vassoura',
    'Santo Toríbio de Mogrovejo: apóstolo da América',
    'Beato Carlo Acutis: o jovem santo da era digital',
    'São Sebastião: o mártir protetor contra pestes',
    'Santa Cecília: padroeira dos músicos',
    'Santa Luzia: protetora dos olhos',
    'Santa Bárbara: protetora contra tempestades',
    'Santa Inês: virgem e mártir',
    'São Jorge: o soldado de Cristo',
    'São Lourenço: diácono e mártir',
    'Santa Catarina de Alexandria: mártir e filósofa',
    'São Cosme e São Damião: os santos médicos',
    'Santos Mártires do Brasil: André de Soveral e companheiros',
    'São Bento de Núrsia: pai do monaquismo ocidental',
    'São Domingos de Gusmão: fundador dos Dominicanos',
    'Santo Inácio de Loyola: fundador dos Jesuítas',
    'São Francisco Xavier: o grande missionário',
    'São João Bosco: pai e mestre da juventude',
    'São Vicente de Paulo: o santo da caridade',
    'Santa Teresa de Calcutá: missionária da caridade',
    'São Maximiliano Kolbe: mártir da caridade em Auschwitz',
    'São João Maria Vianney: o santo Cura d\'Ars',
    'Santa Clara de Assis: fundadora das Clarissas',
    'São Filipe Néri: o apóstolo da alegria',
    'São Camilo de Léllis: patrono dos enfermeiros',
    'São João de Deus: fundador dos Irmãos Hospitaleiros',
    'Santa Margarida Maria Alacoque: e o Sagrado Coração',
    'São Luís Gonzaga: padroeiro da juventude',
    'São João Paulo II: o Papa peregrino',
    'São Pio X: o Papa da Eucaristia',
    'São João XXIII: o Papa bom',
    'Santa Edith Stein (Teresa Benedita da Cruz): filósofa e mártir',
    'São Josemaría Escrivá: fundador do Opus Dei',
    'Santa Gianna Beretta Molla: mãe e médica',
    'São Oscar Romero: mártir da justiça',
    'Abraão: pai da fé e amigo de Deus',
    'Moisés: libertador e legislador de Israel',
    'Rei Davi: o pastor que se tornou rei',
    'Profeta Elias: o profeta de fogo',
    'São João Batista: o precursor de Cristo',
    'Santa Maria Madalena: de pecadora a apóstola dos apóstolos',
  ],
  'milagres-eucaristicos': [
    'O Milagre Eucarístico de Lanciano',
    'O Milagre de Bolsena e a festa de Corpus Christi',
    'Milagre Eucarístico de Buenos Aires (1996)',
    'O Milagre de Santarém, Portugal',
    'Milagre Eucarístico de Sokółka, Polônia',
    'A ciência diante dos milagres eucarísticos',
    'Milagres Eucarísticos no Brasil',
    'O que a Igreja diz sobre os milagres eucarísticos',
    'Milagre Eucarístico de Orvieto, Itália',
    'Milagre Eucarístico de Cascia, Itália',
    'Milagre Eucarístico de Siena, Itália: hóstias intactas por séculos',
    'Milagre Eucarístico de Chirattakonam, Índia',
    'Milagre Eucarístico de Tixtla, México',
    'Milagre Eucarístico de Betânia, Venezuela',
    'Carlo Acutis e a catalogação dos milagres eucarísticos',
    'Milagre eucarístico de Lanciano: a primeira evidência',
    'Milagre eucarístico de Legnica, Polônia',
    'Milagre eucarístico de Bolsena e Orvieto',
    'Milagre eucarístico de Santarém, Portugal',
    'Milagre eucarístico de Siena: as hóstias incorruptas',
    'Milagre eucarístico de Cássia',
    'Quantos milagres eucarísticos são reconhecidos pela Igreja',
  ],
  'catecismo': [
    'A Santíssima Trindade explicada de forma acessível',
    'Os Dez Mandamentos: guia completo e atualizado',
    'As Bem-aventuranças: o caminho da felicidade cristã',
    'O Credo Apostólico: cada artigo explicado',
    'A graça e a justificação segundo o Catecismo',
    'Os pecados capitais e as virtudes opostas',
    'A vida eterna: o que a Igreja ensina',
    'A comunhão dos santos: significado e importância',
    'O que é a Igreja Católica: uma, santa, católica e apostólica',
    'A Criação: o que a Igreja ensina sobre a origem do mundo',
    'Anjos e demônios: o que diz a doutrina católica',
    'O livre-arbítrio e a Providência Divina',
    'O Purgatório: doutrina e fundamentos bíblicos',
    'A intercessão dos santos: por que rezamos aos santos',
    'Os dons e frutos do Espírito Santo',
    'A lei moral natural segundo a Igreja',
    'A doutrina social da Igreja resumida',
    'Fé e razão: a harmonia segundo a Igreja Católica',
    'O pecado original: significado e consequências',
    'As virtudes teologais: fé, esperança e caridade',
    'As virtudes cardeais: prudência, justiça, fortaleza e temperança',
    'O que é a graça santificante e como mantê-la',
    'A ressurreição dos mortos: o que a Igreja ensina',
    'O Juízo Final: particular e universal',
    'O Céu: o que sabemos pela doutrina católica',
    'O Inferno: existência, natureza e ensinamento da Igreja',
    'O que são os Novíssimos (morte, juízo, inferno e paraíso)',
    'A dignidade da pessoa humana segundo a Igreja',
    'O que é a consciência moral e como formá-la',
  ],
  'liturgia-das-horas': [
    'Introdução à Liturgia das Horas para leigos',
    'Como rezar Laudes (Oração da Manhã)',
    'Como rezar Vésperas (Oração da Tarde)',
    'Completas: a oração antes de dormir',
    'O Ofício das Leituras e sua riqueza espiritual',
    'A Hora Média: santificando o trabalho',
    'Salmos mais importantes da Liturgia das Horas',
    'Aplicativos e recursos para rezar a Liturgia das Horas',
    'História e origem da Liturgia das Horas',
    'Os Cânticos Bíblicos na Liturgia das Horas',
    'Como montar um grupo de oração com a Liturgia das Horas',
    'Como rezar as Vésperas: oração da tarde',
    'Como rezar as Completas: oração da noite',
    'Ofício das Leituras: o que é e como rezar',
    'Hora Média: Tércia, Sexta e Noa',
    'Como usar o breviário: guia para iniciantes',
    'Cântico de Zacarias (Benedictus): texto e significado',
    'Magnificat: texto e significado do cântico de Maria',
  ],
  'novenas': [
    'Novena ao Espírito Santo: completa com meditações',
    'Novena a Nossa Senhora Aparecida',
    'Novena a São José para o trabalho e a família',
    'Novena das Mãos Ensanguentadas para causas impossíveis',
    'Novena a Santa Teresinha com reflexões',
    'Novena ao Sagrado Coração de Jesus',
    'Novena a Nossa Senhora de Fátima',
    'Novena a São Judas Tadeu',
    'Novena a Nossa Senhora Desatadora dos Nós',
    'Novena a São Miguel Arcanjo',
    'Novena a Santo Antônio de Pádua',
    'Novena a Santa Rita de Cássia',
    'Novena de Natal: preparação para o nascimento de Jesus',
    'Novena ao Divino Pai Eterno',
    'Novena a Nossa Senhora do Perpétuo Socorro',
    'Novena a São Francisco de Assis',
    'Novena a Nossa Senhora das Graças',
    'Novena a São Bento contra o mal',
    'Novena ao Imaculado Coração de Maria',
    'Novena a Nossa Senhora de Lourdes pela cura',
    'Novena de Santo Antônio completa',
    'Novena de Nossa Senhora Aparecida completa',
    'Novena de São Judas Tadeu para causas impossíveis',
    'Novena de Nossa Senhora Desatadora dos Nós completa',
    'Novena de São José completa',
    'Novena de Santa Teresinha das Rosas',
    'Novena de São Miguel Arcanjo completa',
    'Novena de Nossa Senhora das Graças (Medalha Milagrosa)',
    'Novena de São Bento contra todo mal',
    'Novena de Santa Luzia pela visão',
    'Novena de Natal em família: como rezar',
    'Novena da Divina Misericórdia completa',
  ],
  'sacramentos': [
    'O Batismo: significado, rito e graças',
    'A Eucaristia: presença real de Cristo',
    'O Sacramento da Confissão: guia completo',
    'A Confirmação (Crisma): dons do Espírito Santo',
    'O Sacramento do Matrimônio na Igreja Católica',
    'O Sacramento da Ordem: diaconato, presbiterado e episcopado',
    'A Unção dos Enfermos: conforto e esperança',
    'A Primeira Comunhão: preparação e significado',
    'A importância da Confissão frequente',
    'Eucaristia e adoração: a presença real explicada',
    'O rito do Batismo passo a passo',
    'Preparação para o Matrimônio católico',
    'Vocação sacerdotal: sinais e caminho',
    'O que são os sacramentais (bênçãos, água benta, medalhas)',
    'A Eucaristia nas Escrituras: da Última Ceia aos Atos dos Apóstolos',
    'O padrinho e a madrinha: papel e responsabilidades nos sacramentos',
    'O que é a absolvição e como funciona na Confissão',
    'Pode comungar quem não é casado na Igreja?',
    'Casamento religioso vs civil: o que a Igreja ensina',
    'O que é o sacramento da Penitência e Reconciliação',
    'Batismo de adulto na Igreja Católica: passo a passo',
    'Documentos necessários para batizar na Igreja Católica',
    'Como escolher padrinhos de batismo: requisitos da Igreja',
    'Curso de batismo: o que é ensinado aos pais e padrinhos',
    'Significado dos símbolos do batismo: água, óleo, vela e veste branca',
    'Rito do casamento católico passo a passo',
    'Rito da Primeira Comunhão passo a passo',
    'Rito da Crisma passo a passo',
    'Como se confessar passo a passo: guia para iniciantes',
    'Unção dos enfermos: como pedir e como é o rito',
  ],
  'devocoes-marianas': [
    'A Consagração a Nossa Senhora segundo São Luís de Montfort',
    'O Santo Escapulário de Nossa Senhora do Carmo',
    'A Medalha Milagrosa: história e promessas',
    'Nossa Senhora de Guadalupe: a aparição que converteu milhões',
    'Nossa Senhora de Fátima: mensagem e segredos',
    'Nossa Senhora de Lourdes e as curas milagrosas',
    'Nossa Senhora Aparecida: Padroeira do Brasil',
    'As Sete Dores de Maria: meditação e oração',
    'Nossa Senhora do Perpétuo Socorro: história e devoção',
    'Nossa Senhora Desatadora dos Nós: origem e oração',
    'Nossa Senhora das Graças e a Medalha Milagrosa',
    'Nossa Senhora de Czestochowa: a Virgem Negra da Polônia',
    'Nossa Senhora do Rosário: origem e devoção',
    'Nossa Senhora de Medjugorje: as aparições e mensagens',
    'Nossa Senhora Rainha da Paz',
    'As aparições marianas reconhecidas pela Igreja',
    'O Imaculado Coração de Maria: devoção e consagração',
    'Nossa Senhora de La Salette: lágrimas e mensagem',
    'Nossa Senhora do Carmo e as almas do Purgatório',
    'Maria na Bíblia: todas as passagens sobre Nossa Senhora',
    'Aparição de Nossa Senhora de Fátima: história completa',
    'Aparição de Nossa Senhora de Lourdes: história e milagres',
    'Aparição de Nossa Senhora de Guadalupe: a tilma e seus mistérios',
    'Nossa Senhora de La Salette: mensagem e segredos',
    'Nossa Senhora de Akita: as lágrimas e a mensagem',
    'Aparições de Nossa Senhora no Brasil reconhecidas pela Igreja',
    'Os títulos de Nossa Senhora e seus significados',
    'Nossa Senhora de Knock: a aparição silenciosa',
  ],
  'calendario-liturgico': [
    'O Advento: tempo de preparação e esperança',
    'A Quaresma: significado, práticas e tradições',
    'O Tríduo Pascal: os três dias mais sagrados',
    'O Tempo Pascal: da Ressurreição a Pentecostes',
    'Corpus Christi: a festa do Corpo e Sangue de Cristo',
    'A festa de Todos os Santos e o Dia de Finados',
    'Cristo Rei: o significado da solenidade',
    'As cores litúrgicas e seus significados',
    'O Tempo Comum: santificando o cotidiano',
    'A Imaculada Conceição: 8 de dezembro',
    'A Anunciação do Senhor: 25 de março',
    'Pentecostes: a vinda do Espírito Santo',
    'A Assunção de Nossa Senhora: 15 de agosto',
    'Natal: o nascimento de Jesus Cristo',
    'Epifania do Senhor: a visita dos Reis Magos',
    'Semana Santa: dia a dia explicado',
  ],
  'exame-de-consciencia': [
    'Exame de consciência pelos Dez Mandamentos',
    'Exame de consciência para jovens e adolescentes',
    'Exame de consciência para casais e vida matrimonial',
    'Como fazer uma boa confissão: passo a passo',
    'Os pecados mais comuns e como identificá-los',
    'O arrependimento perfeito e imperfeito',
    'Frequência da confissão: orientações práticas',
    'Exame de consciência pelos pecados capitais',
    'Exame de consciência para profissionais e vida no trabalho',
    'Exame de consciência sobre caridade e vida comunitária',
    'Exame de consciência sobre o uso da tecnologia e redes sociais',
    'Exame de consciência para pais e educadores',
    'Ato de contrição: diferentes versões e como rezar',
    'Exame de consciência para idosos e doentes',
    'Exame de consciência sobre a fofoca e o julgamento',
    'Exame de consciência sobre omissões: o bem que deixei de fazer',
    'Exame de consciência para seminaristas e religiosos',
    'Ato de contrição curto para rezar antes de dormir',
    'Ato de contrição para crianças',
    'Exame de consciência para crianças da Primeira Comunhão',
    'Exame de consciência para casais',
    'Exame de consciência diário de Santo Inácio',
  ],
  'oracoes-do-dia-a-dia': [
    'As orações fundamentais do católico',
    'Orações da manhã para começar bem o dia',
    'Orações da noite e exame de consciência',
    'Orações antes e depois das refeições',
    'A Oração de São Miguel Arcanjo: proteção espiritual',
    'O Angelus: rezando três vezes ao dia',
    'Orações em momentos de dificuldade e sofrimento',
    'Orações pelos falecidos e almas do purgatório',
    'Oração de São Francisco de Assis: Senhor, fazei-me instrumento',
    'A Salve Rainha: história e significado',
    'O Pai Nosso: cada frase explicada',
    'A Ave Maria: significado e meditação',
    'O Glória ao Pai: origem e importância',
    'Oração do Credo Niceno-Constantinopolitano',
    'Orações para antes e depois do trabalho',
    'Orações para proteção da família',
    'A Consagração ao Sagrado Coração de Jesus',
    'O Magnificat: o cântico de Maria',
    'Orações para enfermos e pela cura',
    'Ladainha de Nossa Senhora (Ladainha Lauretana)',
    'Oração do Anjo da Guarda: história e devoção',
    'Orações para gestantes e pela vida nascente',
    'Oração da Serenidade: versão católica completa',
    'Orações para momentos de ansiedade e medo',
    'Orações de agradecimento a Deus',
    'Oração de São Bento contra o mal',
    'Orações para pedir sabedoria e discernimento',
    'Oração do Perdão: como perdoar pelo poder da oração',
    'Oração da manhã católica para começar o dia',
    'Oração da noite católica antes de dormir',
    'Oração de São Miguel Arcanjo completa',
    'Oração ao Anjo da Guarda: texto e explicação',
    'Credo dos Apóstolos e Credo Niceno: diferenças',
  ],
  'documentos-da-igreja': [
    'Lumen Gentium: a Igreja como Povo de Deus',
    'Dei Verbum: a Revelação Divina',
    'Laudato Si: o cuidado com a casa comum',
    'Deus Caritas Est: o amor cristão segundo Bento XVI',
    'Humanae Vitae: a vida humana e a moral conjugal',
    'Gaudium et Spes: a Igreja no mundo contemporâneo',
    'Redemptoris Mater: Maria na vida da Igreja',
    'Evangelii Gaudium: a alegria do Evangelho',
    'Sacrosanctum Concilium: a reforma da liturgia',
    'Fratelli Tutti: a fraternidade e a amizade social',
    'Veritatis Splendor: o esplendor da verdade moral',
    'Fides et Ratio: fé e razão segundo João Paulo II',
    'Redemptor Hominis: o Redentor do homem',
    'Populorum Progressio: o desenvolvimento dos povos',
    'Rerum Novarum: a questão operária e social',
    'Pacem in Terris: a paz entre todos os povos',
    'Dignitatis Humanae: a liberdade religiosa',
    'Nostra Aetate: relação com religiões não cristãs',
    'Amoris Laetitia: a alegria do amor na família',
    'Lumen Fidei: a luz da fé',
    'Spe Salvi: a esperança cristã segundo Bento XVI',
    'Christus Vivit: Cristo vive para os jovens',
    'Mater et Magistra: a Igreja e a questão social',
    'Centesimus Annus: cem anos de doutrina social',
    'Laborem Exercens: o valor do trabalho humano',
    'Dei Verbum resumida: a Revelação divina',
    'Sacrosanctum Concilium resumida: a liturgia',
    'Gaudium et Spes resumida: a Igreja no mundo',
    'Fratelli Tutti resumida',
  ],
  'ladainhas': [
    'Ladainha de Todos os Santos: texto completo e meditação',
    'Ladainha de Nossa Senhora (Ladainha Lauretana)',
    'Ladainha do Sagrado Coração de Jesus',
    'Ladainha do Preciosíssimo Sangue de Jesus',
    'Ladainha do Santíssimo Nome de Jesus',
    'Ladainha de São José',
    'Ladainha de Santo Antônio de Pádua',
    'Ladainha de Santa Teresinha do Menino Jesus',
    'Ladainha de São Francisco de Assis',
    'Ladainha de São Miguel Arcanjo',
    'Ladainha de Santa Rita de Cássia',
    'Ladainha de São Judas Tadeu',
    'Ladainha de São Bento',
    'Ladainha de São Padre Pio',
    'Ladainha de Santa Mônica',
    'Ladainha de Santo Expedito',
    'Ladainha de São Jorge',
    'Ladainha de Nossa Senhora Aparecida',
    'Ladainha de Nossa Senhora de Fátima',
    'Ladainha de Nossa Senhora das Graças',
    'Ladainha de Nossa Senhora do Perpétuo Socorro',
    'Ladainha de Nossa Senhora de Guadalupe',
    'Ladainha de São Sebastião',
    'Ladainha de Santa Catarina de Sena',
    'Ladainha de São João Paulo II',
    'Ladainha de São Tomás de Aquino',
    'Ladainha de Santa Faustina Kowalska',
    'Ladainha da Divina Misericórdia',
    'Ladainha do Espírito Santo',
    'Ladainha de São Luís Maria Grignion de Montfort',
  ],
  'duvidas-da-fe': [
    'O que são os anos A, B e C no ciclo litúrgico católico?',
    'O que representam as cores litúrgicas da missa?',
    'Como fazer a Via Sacra nas sextas-feiras da Quaresma?',
    'Quais são os costumes e tradições da Quaresma?',
    'Por que as imagens ficam cobertas com pano roxo na Quaresma?',
    'Por que não há decoração na igreja durante a Quaresma?',
    'Por que não se faz o cumprimento da paz de Cristo em certos momentos?',
    'O que é um Acólito? Qual a diferença para Coroinha?',
    'Católicos adoram imagens? A verdade sobre a veneração',
    'Por que os católicos rezam para os santos?',
    'Qual a diferença entre adoração, veneração e hiperdulia?',
    'O que é a Transubstanciação na Eucaristia?',
    'Por que os católicos confessam seus pecados a um padre?',
    'O que é o Purgatório e onde está na Bíblia?',
    'Por que Maria é chamada de Mãe de Deus?',
    'O que é a Infalibilidade Papal?',
    'Por que os padres católicos não se casam? O celibato sacerdotal',
    'O que é a Sucessão Apostólica?',
    'Qual a diferença entre pecado mortal e pecado venial?',
    'Por que os católicos batizam bebês?',
    'O que é a Liturgia das Horas e quem deve rezar?',
    'Por que os católicos usam água benta?',
    'O que é o Jejum Eucarístico e quanto tempo dura?',
    'Por que os católicos fazem o Sinal da Cruz?',
    'O que significa genuflexão e quando fazer?',
    'O que é a Quaresma e por que dura 40 dias?',
    'Por que os católicos não comem carne na Sexta-feira Santa?',
    'O que é a Semana Santa e o que acontece em cada dia?',
    'O que é o Tríduo Pascal?',
    'Por que existe o Advento antes do Natal?',
    'O que são as Têmporas e os Dias de Rogações?',
    'O que é o Santo Rosário e por que rezá-lo todos os dias?',
    'Por que os católicos têm o Papa como líder?',
    'O que é um Concílio Ecumênico?',
    'Qual a diferença entre rito romano e rito bizantino?',
    'O que é a Missa Tridentina (Forma Extraordinária)?',
    'Por que existe incenso na missa?',
    'O que é o Santíssimo Sacramento e a Adoração Eucarística?',
    'Por que os católicos acendem velas na igreja?',
    'O que são as Indulgências e como obtê-las?',
    'O que é o Escapulário e qual seu significado?',
    'Por que os católicos rezam pelos mortos?',
    'O que é a Comunhão dos Santos?',
    'Qual a diferença entre Bíblia católica e protestante?',
    'O que são os livros Deuterocanônicos?',
    'Por que os católicos têm imagens e estátuas nas igrejas?',
    'O que é um Diácono Permanente?',
    'O que são os votos religiosos (pobreza, castidade e obediência)?',
    'O que é a Extrema-Unção (Unção dos Enfermos)?',
    'Como funciona o processo de canonização de um santo?',
    'Por que algumas mulheres usam véu na missa?',
    'O que significa JHS e por que aparece nas igrejas?',
    'O que significa o símbolo Alfa e Ômega (A e Ω)?',
    'O que significa o P com X (Chi-Rho ou Cristograma)?',
    'O que significa Hosana nas alturas?',
    'O que é pecado mortal e como diferenciá-lo do venial?',
    'Por que não se pode comungar em estado de pecado mortal?',
    'Como a missa é dividida? Estrutura e partes explicadas',
    'Quais são os objetos litúrgicos usados na missa e seus nomes?',
    'O que fazer durante o ofertório na missa?',
    'Por que temos que ir à missa todo domingo?',
    'Por que fazemos o Sinal da Cruz em nome do Pai, do Filho e do Espírito Santo?',
    'O que é o Sacrário e por que a lâmpada fica acesa?',
    'O que significa INRI na cruz de Jesus?',
    'Por que o padre usa diferentes paramentos na missa?',
    'O que é a genuflexão e quando devemos fazê-la?',
    'Por que os católicos se ajoelham durante a consagração?',
    'O que é o Amém e por que dizemos tantas vezes na missa?',
    'Por que existe o jejum antes da comunhão?',
    'O que são as procissões e qual seu significado?',
    'O que é a Quaresma e o que significa o número 40 na Bíblia?',
    'Por que o pão e o vinho se tornam Corpo e Sangue de Cristo?',
    'O que é a Tradição Apostólica e qual sua importância?',
    'O que é o Magistério da Igreja?',
    'Por que existem diferentes ordens religiosas na Igreja?',
    'O que é uma basílica e qual a diferença para uma catedral?',
    'O que é a excomunhão e quando ela acontece?',
    'O que são os dias de preceito (dias santos de obrigação)?',
    'Por que os católicos fazem peregrinações?',
    'O que é o Jubileu e o Ano Santo na Igreja Católica?',
    'O que é a Doutrina da Imaculada Conceição?',
    'O que significa a Assunção de Nossa Senhora?',
    'O que é simonia e por que é proibida?',
    'O que é heresia, cisma e apostasia?',
    'Por que a Igreja Católica é contra o divórcio?',
    'O que é a nulidade matrimonial (anulação)?',
    'Partes da missa explicadas passo a passo',
    'Por que o católico faz o sinal da cruz',
    'Pode comungar sem se confessar?',
    'Quando ajoelhar, ficar de pé e sentar na missa',
    'O que significa o Amém na missa',
    'Por que se reza o Cordeiro de Deus três vezes',
  ],
};

export const categoryLabelsMap: Record<string, string> = {
  'como-rezar-o-terco': 'Como Rezar o Terço',
  'santos-e-oracoes': 'Santos e Orações',
  'milagres-eucaristicos': 'Milagres Eucarísticos',
  'catecismo': 'Catecismo',
  'liturgia-das-horas': 'Liturgia das Horas',
  'novenas': 'Novenas',
  'sacramentos': 'Sacramentos',
  'devocoes-marianas': 'Devoções Marianas',
  'calendario-liturgico': 'Calendário Litúrgico',
  'exame-de-consciencia': 'Exame de Consciência',
  'oracoes-do-dia-a-dia': 'Orações do Dia a Dia',
  'documentos-da-igreja': 'Documentos da Igreja',
  'ladainhas': 'Ladainhas',
  'duvidas-da-fe': 'Dúvidas da Fé',
};
