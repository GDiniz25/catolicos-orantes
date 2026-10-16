/**
 * Qual novena rezar para cada necessidade.
 * Usado pela página /qual-novena-rezar: a pessoa escreve o pedido, o navegador procura estas palavras
 * (sem acento, em minúsculas) e soma os pontos de cada novena. Nada sai do aparelho.
 * "palavras" são começos de palavra (só contam no início de uma palavra) (ex.: "proteg" pega proteger, proteção, protegido).
 */
export interface Intencao {
  id: string;
  /** Rótulo curto, usado nos botões e títulos */
  nome: string;
  /** Título da seção na página ("Novena para ...") */
  titulo: string;
  /** Uma frase sobre a intenção */
  texto: string;
  palavras: string[];
  /** Slugs dos artigos da categoria novenas, do mais indicado para o menos */
  novenas: string[];
}

export const INTENCOES: Intencao[] = [
  {
    id: 'protecao',
    nome: 'Proteção',
    titulo: 'Novena para proteção',
    texto: 'Para pedir a Deus proteção contra o mal, os perigos e as tentações, com a intercessão dos arcanjos e dos santos guerreiros da fé.',
    palavras: ['proteg', 'protej', 'protecao', 'livr', 'mal ', 'males', 'maligno', 'perigo', 'inimig', 'inveja', 'violencia', 'assalt', 'seguranca', 'guard', 'ataque', 'demon', 'espiritual'],
    novenas: ['novena-a-sao-miguel-arcanjo', 'novena-a-sao-rafael-arcanjo', 'novena-a-sao-bento-contra-o-mal', 'novena-a-sao-jorge'],
  },
  {
    id: 'relacionamento',
    nome: 'Namoro e casamento',
    titulo: 'Novena para o namoro, o noivado e o casamento',
    texto: 'Para pedir discernimento, a pessoa certa, a bênção sobre o namoro e o casamento, e a superação do que afasta o casal.',
    palavras: ['namor', 'noiv', 'casament', 'casar', 'relacion', 'marido', 'esposa', 'conjuge', 'juntos', 'junto', 'pessoa certa', 'alma gemea', 'amor da minha', 'reconcil', 'separa', 'voltar com', 'ex '],
    novenas: ['novena-a-sao-rafael-arcanjo', 'novena-a-santo-antonio-de-padua', 'novena-a-sagrada-familia', 'novena-a-nossa-senhora-desatadora-dos-nos'],
  },
  {
    id: 'impossivel',
    nome: 'Causas difíceis',
    titulo: 'Novena para causas difíceis e impossíveis',
    texto: 'Para as situações que parecem não ter saída, os obstáculos e as barreiras que só Deus pode remover.',
    palavras: ['impossiv', 'barreira', 'obstacul', 'dificil', 'dificeis', 'desesper', 'sem saida', 'bloque', 'trav', 'enrol', 'complicad'],
    novenas: ['novena-a-santa-rita-de-cassia', 'novena-de-sao-judas-tadeu', 'novena-a-nossa-senhora-desatadora-dos-nos', 'novena-das-maos-ensanguentadas-para-causas-impossiveis'],
  },
  {
    id: 'urgente',
    nome: 'Causas urgentes',
    titulo: 'Novena para causas urgentes',
    texto: 'Para os pedidos que têm prazo e pressa, sem deixar de confiar no tempo de Deus.',
    palavras: ['urgent', 'rapido', 'pressa', 'prazo', 'imediat', 'amanha'],
    novenas: ['novena-a-santo-expedito', 'novena-a-nossa-senhora-do-perpetuo-socorro'],
  },
  {
    id: 'saude',
    nome: 'Saúde e cura',
    titulo: 'Novena pela saúde e pela cura',
    texto: 'Para pedir saúde, cura e força a quem está doente, e sabedoria para médicos e cuidadores. A oração caminha junto com o tratamento médico.',
    palavras: ['saude', 'cura', 'curar', 'doen', 'enferm', 'cancer', 'cirurg', 'hospital', 'tratament', 'exame', 'dor ', 'dores', 'diagnost', 'internad', 'remedio', 'medic'],
    novenas: ['novena-a-nossa-senhora-de-lourdes-pela-cura', 'novena-a-sao-charbel', 'novena-a-sao-camilo-de-lelis', 'novena-a-sao-cosme-e-sao-damiao', 'novena-a-santa-dulce-dos-pobres'],
  },
  {
    id: 'gravidez',
    nome: 'Gravidez e parto',
    titulo: 'Novena pela gravidez e pelo parto',
    texto: 'Para pedir a graça de ter filhos, uma gestação tranquila e um bom parto, com a intercessão de Maria e dos protetores das mães.',
    palavras: ['gravid', 'gestant', 'gestac', 'parto', 'bebe', 'engravid', 'fertil', 'ter filho', 'ser mae', 'gerar', 'nenem', 'nascimento'],
    novenas: ['novena-a-nossa-senhora-do-bom-parto', 'novena-a-sao-geraldo-majela', 'novena-a-sagrada-familia'],
  },
  {
    id: 'filhos',
    nome: 'Filhos e conversão',
    titulo: 'Novena pelos filhos e pela conversão de alguém',
    texto: 'Para os pais que rezam pelos filhos, pela volta de alguém à fé e pela libertação de vícios.',
    palavras: ['filho', 'filha', 'convers', 'convert', 'afastad', 'longe de deus', 'vicio', 'drog', 'alcool', 'bebida', 'jogo', 'fe do', 'voltar para a igreja', 'rebeld'],
    novenas: ['novena-a-santa-monica', 'novena-a-nossa-senhora-desatadora-dos-nos', 'novena-a-nossa-senhora-auxiliadora'],
  },
  {
    id: 'familia',
    nome: 'Família',
    titulo: 'Novena pela família',
    texto: 'Para pedir paz, união e proteção para o lar, os pais, os filhos e os casais.',
    palavras: ['familia', 'lar', 'casa ', 'pais', 'brig', 'uniao', 'paz em casa', 'parente'],
    novenas: ['novena-a-sagrada-familia', 'novena-a-sao-jose-para-o-trabalho-e-a-familia', 'novena-ao-imaculado-coracao-de-maria'],
  },
  {
    id: 'trabalho',
    nome: 'Emprego e trabalho',
    titulo: 'Novena para conseguir emprego e pelo trabalho',
    texto: 'Para quem procura emprego, enfrenta problemas no trabalho ou quer abençoar o próprio negócio.',
    palavras: ['emprego', 'trabalh', 'servic', 'empres', 'negocio', 'desempreg', 'entrevista', 'vaga', 'salario', 'chefe', 'clientes', 'vendas'],
    novenas: ['novena-a-sao-jose-para-o-trabalho-e-a-familia', 'novena-a-santo-expedito', 'novena-ao-divino-pai-eterno'],
  },
  {
    id: 'dividas',
    nome: 'Dívidas e finanças',
    titulo: 'Novena para quem está endividado',
    texto: 'Para pedir ajuda nas dificuldades financeiras, sabedoria para organizar as contas e generosidade com quem tem menos.',
    palavras: ['divida', 'endivid', 'financ', 'dinheiro', 'contas', 'pagar', 'aluguel', 'pobreza', 'nome sujo', 'banco', 'emprestim'],
    novenas: ['novena-a-santa-edwiges', 'novena-a-sao-jose-para-o-trabalho-e-a-familia', 'novena-ao-divino-pai-eterno'],
  },
  {
    id: 'estudos',
    nome: 'Estudos e provas',
    titulo: 'Novena para os estudos e as provas',
    texto: 'Para pedir luz, sabedoria e serenidade em provas, vestibular, Enem e concursos.',
    palavras: ['estud', 'prova', 'vestibular', 'enem', 'concurso', 'faculdade', 'escola', 'aprova', 'tcc', 'formatura'],
    novenas: ['novena-ao-espirito-santo-completa-com-meditacoes', 'novena-a-nossa-senhora-auxiliadora', 'novena-a-santo-expedito'],
  },
  {
    id: 'decisao',
    nome: 'Decisões e vocação',
    titulo: 'Novena para tomar uma decisão e descobrir a vocação',
    texto: 'Para pedir discernimento antes de uma escolha importante e clareza sobre o caminho que Deus propõe.',
    palavras: ['decis', 'decidir', 'discern', 'vocac', 'caminho', 'escolh', 'duvida', 'futuro', 'mudanc', 'sacerdo', 'religios'],
    novenas: ['novena-ao-espirito-santo-completa-com-meditacoes', 'novena-da-graca-sao-francisco-xavier', 'novena-a-sao-jose-para-o-trabalho-e-a-familia'],
  },
  {
    id: 'luto',
    nome: 'Luto e falecidos',
    titulo: 'Novena pelos falecidos e por quem está de luto',
    texto: 'Para rezar pelas almas de quem partiu e pedir consolo para quem ficou.',
    palavras: ['luto', 'falec', 'morte', 'morreu', 'faleceu', 'perda', 'perdi', 'saudade', 'alma', 'purgatorio', 'finados', 'velorio', 'enterro'],
    novenas: ['novena-pelas-almas-do-purgatorio', 'novena-a-nossa-senhora-das-dores', 'novena-ao-sagrado-coracao-de-jesus'],
  },
  {
    id: 'sofrimento',
    nome: 'Sofrimento e ansiedade',
    titulo: 'Novena para momentos de sofrimento, tristeza e ansiedade',
    texto: 'Para encontrar consolo, paz interior e confiança em Deus nos dias difíceis. A oração não substitui o acompanhamento de um profissional de saúde quando ele é necessário.',
    palavras: ['sofr', 'triste', 'ansied', 'depress', 'angust', 'medo', 'consolo', 'paz interior', 'solid', 'sozinh', 'chor', 'cansad', 'desanim'],
    novenas: ['novena-a-nossa-senhora-das-dores', 'novena-a-sao-padre-pio', 'novena-ao-sagrado-coracao-de-jesus', 'novena-da-divina-misericordia'],
  },
  {
    id: 'perdao',
    nome: 'Perdão e misericórdia',
    titulo: 'Novena para pedir perdão e misericórdia',
    texto: 'Para quem carrega culpa, quer recomeçar e confiar na misericórdia de Deus, com o caminho da Confissão.',
    palavras: ['perdao', 'perdo', 'pecado', 'misericordia', 'culpa', 'confiss', 'arrepend', 'recomec'],
    novenas: ['novena-da-divina-misericordia', 'novena-ao-sagrado-coracao-de-jesus', 'novena-a-sao-padre-pio'],
  },
  {
    id: 'viagem',
    nome: 'Viagens e trânsito',
    titulo: 'Novena para viagens e proteção no trânsito',
    texto: 'Para pedir proteção em viagens, na estrada e no dia a dia de quem dirige.',
    palavras: ['viag', 'viajar', 'estrada', 'carro', 'motorista', 'transito', 'dirigir', 'moto', 'caminhao', 'aviao'],
    novenas: ['novena-a-sao-cristovao', 'novena-a-sao-rafael-arcanjo'],
  },
  {
    id: 'tempestades',
    nome: 'Tempestades e desastres',
    titulo: 'Novena para proteção contra tempestades',
    texto: 'Para pedir proteção em tempos de chuvas fortes, raios, enchentes e outros perigos da natureza.',
    palavras: ['tempestade', 'chuva', 'raio', 'enchente', 'trovao', 'incendio', 'desastre'],
    novenas: ['novena-a-santa-barbara', 'novena-a-sao-miguel-arcanjo'],
  },
  {
    id: 'maria',
    nome: 'Devoção a Nossa Senhora',
    titulo: 'Novenas a Nossa Senhora',
    texto: 'Para entregar qualquer pedido a Maria, mãe de Jesus, que intercede por seus filhos.',
    palavras: ['nossa senhora', 'maria', 'mae de deus', 'virgem', 'terco', 'rosario', 'escapulario', 'aparecida'],
    novenas: ['novena-a-nossa-senhora-aparecida', 'novena-a-nossa-senhora-do-perpetuo-socorro', 'novena-a-nossa-senhora-do-rosario', 'novena-a-nossa-senhora-do-carmo', 'novena-de-nossa-senhora-das-gracas'],
  },
  {
    id: 'gratidao',
    nome: 'Gratidão e graças',
    titulo: 'Novena para pedir uma graça ou agradecer',
    texto: 'Para pedir uma graça especial ou agradecer por uma graça recebida.',
    palavras: ['graca', 'agradec', 'gratid', 'obrigad', 'alcancad', 'pedido', 'intenc'],
    novenas: ['novena-de-nossa-senhora-das-gracas', 'novena-da-graca-sao-francisco-xavier', 'novena-a-santa-teresinha-com-reflexoes', 'novena-ao-divino-pai-eterno'],
  },
  {
    id: 'pobres',
    nome: 'Pobres e caridade',
    titulo: 'Novena pelos pobres e para crescer na caridade',
    texto: 'Para pedir pelos mais pobres e doentes e para aprender a servir com humildade.',
    palavras: ['pobre', 'carid', 'servir', 'humild', 'fome', 'morador de rua', 'voluntar', 'cozinh'],
    novenas: ['novena-a-santa-dulce-dos-pobres', 'novena-a-sao-benedito', 'novena-a-sao-francisco-de-assis'],
  },
];

/** Palavras que indicam risco à vida: a página mostra primeiro um aviso com o CVV (188) */
export const PALAVRAS_DE_RISCO = ['suicid', 'me matar', 'tirar minha vida', 'tirar a minha vida', 'quero morrer', 'nao quero mais viver', 'acabar com a minha vida', 'me machucar'];
