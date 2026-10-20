/**
 * Ponte do conteúdo para a prática: cada artigo indica duas ferramentas do site ligadas ao tema.
 * Regras por palavra-chave no slug primeiro (mais específicas), depois pela categoria.
 */
export interface FerramentaLink { href: string; rotulo: string }
export interface PonteFerramenta { titulo: string; texto: string; links: [FerramentaLink, FerramentaLink] }

const F = {
  laudes: { href: '/laudes-de-hoje', rotulo: 'Ver Laudes de hoje' },
  liturgia: { href: '/liturgia-diaria', rotulo: 'Liturgia diária' },
  terco: { href: '/terco-guiado', rotulo: 'Rezar o terço guiado' },
  misericordia: { href: '/terco-da-misericordia', rotulo: 'Rezar o Terço da Misericórdia' },
  novena: { href: '/planejador-de-novena', rotulo: 'Planejar minha novena' },
  exame: { href: '/exame-de-consciencia', rotulo: 'Fazer o exame de consciência' },
  viaSacra: { href: '/via-sacra', rotulo: 'Rezar a Via Sacra' },
  lectio: { href: '/lectio-divina', rotulo: 'Rezar a Lectio Divina' },
  plano: { href: '/plano-de-leitura-da-biblia', rotulo: 'Plano de leitura da Bíblia' },
  biblia: { href: '/encontre-na-biblia', rotulo: 'Encontre na Bíblia' },
  santoDia: { href: '/santo-do-dia', rotulo: 'Ver o santo do dia' },
  descubra: { href: '/descubra-seu-santo', rotulo: 'Descobrir meu santo' },
  padroeiros: { href: '/padroeiros', rotulo: 'Santos padroeiros' },
  datas: { href: '/datas-liturgicas', rotulo: 'Ver as datas do ano' },
  consagracao: { href: '/consagracao-a-nossa-senhora', rotulo: 'Consagração em 33 dias' },
  aprender: { href: '/aprender', rotulo: 'Fazer o Caminho da Fé' },
  glossario: { href: '/glossario', rotulo: 'Glossário católico' },
  temperamento: { href: '/teste-de-temperamento', rotulo: 'Fazer o teste de temperamento' },
  pedido: { href: '/pedido-de-oracao', rotulo: 'Deixar um pedido de oração' },
} satisfies Record<string, FerramentaLink>;

type Regra = { teste: RegExp; ponte: PonteFerramenta };
const p = (titulo: string, texto: string, a: FerramentaLink, b: FerramentaLink): PonteFerramenta => ({ titulo, texto, links: [a, b] });

const POR_SLUG: Regra[] = [
  { teste: /laudes|vesperas|completas|salterio|benedictus|magnificat|liturgia-das-horas|oficio|hora-media|canticos|salmos/, ponte: p('Reze a Liturgia das Horas hoje', 'Veja a semana do saltério e os salmos de Laudes, Vésperas e Completas de hoje, com o roteiro de cada hora.', F.laudes, F.liturgia) },
  { teste: /misericordia|faustina/, ponte: p('Reze o Terço da Misericórdia agora', 'Siga o terço conta por conta, com as orações de cada parte, no seu ritmo.', F.misericordia, F.terco) },
  { teste: /terco|rosario|misterios|ave-maria|salve-rainha|15-promessas/, ponte: p('Reze o terço agora, passo a passo', 'O terço guiado mostra os mistérios do dia e conduz cada dezena, conta por conta.', F.terco, F.consagracao) },
  { teste: /novena/, ponte: p('Organize sua novena', 'Escolha a data, veja os nove dias marcados no calendário e receba lembretes para não perder nenhum dia.', F.novena, F.pedido) },
  { teste: /contricao|confiss|exame|pecado|arrependimento|escrupulo|esqueci-um-pecado|preciso-contar/, ponte: p('Prepare sua confissão', 'Faça o exame de consciência guiado, pelos mandamentos e pelo seu estado de vida, e chegue ao confessionário com tranquilidade.', F.exame, F.liturgia) },
  { teste: /via-sacra|quaresma|semana-santa|triduo|cinzas|paixao/, ponte: p('Reze a Via Sacra', 'As 14 estações com leitura, meditação e oração, para rezar em casa ou na igreja.', F.viaSacra, F.datas) },
  { teste: /temperamento|colerico|sanguineo|melancolico|fleumatico/, ponte: p('Descubra seu temperamento', 'Responda ao teste e veja as virtudes que mais ajudam o seu temperamento a crescer na fé.', F.temperamento, F.descubra) },
  { teste: /consagracao|montfort|imaculado-coracao|escapulario|medalha-milagrosa/, ponte: p('Faça a consagração a Nossa Senhora', 'Uma preparação de 33 dias, com leitura e oração para cada dia, segundo São Luís de Montfort.', F.consagracao, F.terco) },
  { teste: /biblia|evangelho|lectio|deuterocanonicos|palavra/, ponte: p('Reze com a Palavra de Deus', 'Medite o Evangelho do dia em quatro passos ou siga um plano de leitura da Bíblia.', F.lectio, F.plano) },
  { teste: /(^|-)missa(-|$)|eucarist|comungar|primeira-comunhao|liturgia-da-palavra|ofertorio|cores-liturgicas|paramentos|vestes|objetos-liturgicos|gestos|amem|hosana|ato-penitencial/, ponte: p('Leia as leituras da Missa de hoje', 'Primeira leitura, salmo e Evangelho do dia, com a cor litúrgica e a celebração.', F.liturgia, F.lectio) },
  { teste: /advento|natal|presepio|epifania|pascoa|pentecostes|corpus-christi|cristo-rei|ano-a-b|tempo-comum|tempo-pascal|temporas/, ponte: p('Acompanhe o calendário litúrgico', 'Veja quando cai cada festa no ano e as leituras da Missa de hoje.', F.datas, F.liturgia) },
  { teste: /anjo|padroeir|nomes|santo|santa|sao-/, ponte: p('Conheça os santos do dia', 'Veja quem a Igreja celebra hoje e descubra o santo com quem você tem mais afinidade.', F.santoDia, F.descubra) },
  { teste: /oracao|oracoes|bencao|angelus|credo|pai-nosso|gloria/, ponte: p('Leve a oração para o seu dia', 'Comece pelas Laudes, a oração da manhã da Igreja, ou deixe um pedido para a comunidade rezar com você.', F.laudes, F.pedido) },
];

const POR_CATEGORIA: Record<string, PonteFerramenta> = {
  'liturgia-das-horas': POR_SLUG[0].ponte,
  'como-rezar-o-terco': POR_SLUG[2].ponte,
  novenas: POR_SLUG[3].ponte,
  'exame-de-consciencia': POR_SLUG[4].ponte,
  'santos-e-oracoes': p('Conheça os santos do dia', 'Veja quem a Igreja celebra hoje e descubra o santo com quem você tem mais afinidade.', F.santoDia, F.descubra),
  'calendario-liturgico': p('Acompanhe o calendário litúrgico', 'Veja quando cai cada festa no ano e as leituras da Missa de hoje.', F.datas, F.liturgia),
  'devocoes-marianas': p('Reze com Nossa Senhora', 'Reze o terço guiado com os mistérios do dia ou comece a consagração em 33 dias.', F.terco, F.consagracao),
  ladainhas: p('Continue rezando', 'A ladainha combina bem com o terço: reze o terço guiado ou deixe um pedido de oração.', F.terco, F.pedido),
  'oracoes-do-dia-a-dia': p('Leve a oração para o seu dia', 'Comece pelas Laudes, a oração da manhã da Igreja, ou deixe um pedido para a comunidade rezar com você.', F.laudes, F.pedido),
  sacramentos: p('Viva os sacramentos', 'Prepare a confissão com o exame de consciência guiado e acompanhe as leituras da Missa de hoje.', F.exame, F.liturgia),
  'milagres-eucaristicos': p('Leia as leituras da Missa de hoje', 'Primeira leitura, salmo e Evangelho do dia, com a cor litúrgica e a celebração.', F.liturgia, F.lectio),
  catecismo: p('Aprenda a fé passo a passo', 'Lições curtas sobre a doutrina, com teste de nível, e um glossário com as palavras da fé.', F.aprender, F.glossario),
  'documentos-da-igreja': p('Aprenda a fé passo a passo', 'Lições curtas sobre a doutrina, com teste de nível, e um glossário com as palavras da fé.', F.aprender, F.glossario),
  'duvidas-da-fe': p('Aprenda a fé passo a passo', 'Lições curtas sobre a doutrina, com teste de nível, e um glossário com as palavras da fé.', F.aprender, F.glossario),
  'vida-espiritual': p('Reze agora, com calma', 'Medite o Evangelho do dia em quatro passos ou reze o terço guiado, conta por conta, no seu ritmo.', F.lectio, F.terco),
  casamento: p('Rezem juntos pelo casamento', 'Rezem o terço guiado como casal ou deixem um pedido para a comunidade rezar pela vida a dois.', F.terco, F.pedido),
  'parabolas-de-jesus': p('Reze com a Palavra de Deus', 'Medite o Evangelho do dia em quatro passos ou siga um plano de leitura da Bíblia.', F.lectio, F.plano),
  'primeiros-passos': p('Aprenda a fé no seu ritmo', 'O Caminho da Fé ensina o essencial em lições curtas, e as leituras da Missa de hoje ajudam a acompanhar a celebração.', F.aprender, F.liturgia),
};

export function ferramentasDoArtigo(a: { category: string; slug: string }): PonteFerramenta | null {
  const porSlug = POR_SLUG.find((r) => r.teste.test(a.slug));
  return porSlug?.ponte ?? POR_CATEGORIA[a.category] ?? null;
}
