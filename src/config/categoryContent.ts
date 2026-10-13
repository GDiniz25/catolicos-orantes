/**
 * Texto didático de cada página de categoria: introdução (HTML simples) e perguntas frequentes.
 * Serve ao leitor (sabe o que vai encontrar), ao Google (página deixa de ser só uma lista)
 * e aos assistentes de IA (resposta direta + FAQ em JSON-LD).
 *
 * Regra editorial: só o que está no Catecismo, no Código de Direito Canônico e nos livros litúrgicos.
 */
export interface CategoryContent {
  /** Resposta direta em 1 ou 2 frases (aparece em destaque e no JSON-LD) */
  lead: string;
  /** Parágrafos de introdução, em HTML (p, strong, a, ul, li) */
  intro: string;
  faq: { q: string; a: string }[];
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'como-rezar-o-terco': {
    lead: 'O Terço é a oração em que se meditam os mistérios da vida de Jesus e de Maria rezando o Pai-Nosso, dez Ave-Marias e o Glória em cada dezena.',
    intro: `<p>O <strong>Santo Terço</strong> é a terça parte do Rosário: cinco mistérios, cada um com um Pai-Nosso, dez Ave-Marias e um Glória. Enquanto as contas passam pelos dedos, a mente contempla um momento da vida de Cristo. É uma oração simples de aprender e profunda de viver.</p>
<p>Os mistérios se dividem em quatro grupos: <strong>gozosos</strong> (segunda e sábado), <strong>dolorosos</strong> (terça e sexta), <strong>gloriosos</strong> (quarta e domingo) e <strong>luminosos</strong> (quinta), estes últimos propostos por São João Paulo II na carta <em>Rosarium Virginis Mariae</em>.</p>
<p>Aqui você encontra o passo a passo completo, o texto de cada oração, a lista dos mistérios com as passagens bíblicas e respostas para as dúvidas mais comuns de quem está começando.</p>`,
    faq: [
      { q: 'Qual a diferença entre Terço e Rosário?', a: 'O Rosário completo tem os vinte mistérios (quatro grupos de cinco). O Terço é a terça parte: cinco mistérios, com cinquenta Ave-Marias. No uso comum, "rezar o terço" significa rezar um dos grupos de mistérios.' },
      { q: 'Quais mistérios rezar em cada dia da semana?', a: 'Gozosos na segunda e no sábado; dolorosos na terça e na sexta; gloriosos na quarta e no domingo; luminosos na quinta. É um costume recomendado pela Igreja, não uma obrigação.' },
      { q: 'Quanto tempo leva para rezar o Terço?', a: 'Rezado com calma, um Terço leva entre quinze e vinte minutos. Pode ser dividido ao longo do dia, uma dezena de cada vez.' },
      { q: 'Preciso ter o terço nas mãos para rezar?', a: 'Não. As contas ajudam a contar as orações e a manter a atenção, mas é possível rezar contando nos dedos ou acompanhando um áudio.' },
    ],
  },
  'santos-e-oracoes': {
    lead: 'Os santos são homens e mulheres que viveram a graça de Deus de modo heroico e que a Igreja propõe como intercessores e modelos de vida cristã.',
    intro: `<p>A Igreja Católica honra os <strong>santos</strong> porque neles brilha a obra de Deus. Eles não são adorados: a adoração é devida somente a Deus. Os santos são venerados e invocados como intercessores, como quem pede a oração de um amigo que já está junto do Senhor (Catecismo, nn. 956-957).</p>
<p>Nesta seção estão as histórias dos santos mais queridos do povo brasileiro, as orações próprias de cada um, as datas em que são celebrados e o que a Igreja ensina sobre a comunhão dos santos.</p>
<p>Para saber quem é celebrado hoje, veja o <a href="/santo-do-dia">Santo do Dia</a>.</p>`,
    faq: [
      { q: 'Católico adora os santos?', a: 'Não. Católicos adoram somente a Deus. Aos santos se presta veneração, isto é, respeito e honra, e se pede a intercessão deles, como se pede a oração de um irmão na fé.' },
      { q: 'O que é a comunhão dos santos?', a: 'É a união entre os fiéis que ainda caminham na terra, os que se purificam no purgatório e os que já estão no céu. Todos formam um só corpo em Cristo e ajudam uns aos outros pela oração.' },
      { q: 'Como alguém se torna santo?', a: 'Pela santidade de vida reconhecida pela Igreja num processo que passa pelas etapas de servo de Deus, venerável, beato e santo. A canonização declara que a pessoa está no céu e pode ser venerada em toda a Igreja.' },
      { q: 'Posso rezar para um santo pedir algo específico?', a: 'Sim. A tradição associa certos santos a causas específicas, mas toda intercessão é dirigida a Deus, que é quem concede as graças.' },
    ],
  },
  'milagres-eucaristicos': {
    lead: 'Milagres eucarísticos são fatos extraordinários, examinados pela Igreja, em que a hóstia ou o vinho consagrados apresentaram sinais visíveis da presença real de Cristo.',
    intro: `<p>A fé católica ensina que, na Missa, o pão e o vinho se tornam verdadeiramente o Corpo e o Sangue de Cristo, ainda que as aparências permaneçam (Catecismo, nn. 1374-1377). Os <strong>milagres eucarísticos</strong> não fundam essa fé, que se apoia na palavra de Jesus, mas a confirmam de modo sensível.</p>
<p>Ao longo dos séculos, a Igreja examinou com rigor relatos como os de Lanciano, Bolsena, Siena e, mais recentemente, Buenos Aires e Sokółka. Aqui você encontra a história de cada um, o que foi investigado e o que a Igreja reconheceu.</p>`,
    faq: [
      { q: 'A Igreja obriga a acreditar nos milagres eucarísticos?', a: 'Não. São fatos reconhecidos pela autoridade eclesiástica local como dignos de fé, mas não fazem parte do depósito da fé. A presença real de Cristo na Eucaristia, sim, é dogma.' },
      { q: 'Qual é o milagre eucarístico mais antigo reconhecido?', a: 'O de Lanciano, na Itália, tradicionalmente datado do século VIII, em que a hóstia e o vinho consagrados se transformaram em carne e sangue, conservados até hoje.' },
      { q: 'O que é a transubstanciação?', a: 'É o termo com que a Igreja explica que, na consagração, toda a substância do pão e do vinho se converte na substância do Corpo e do Sangue de Cristo, permanecendo apenas as aparências.' },
    ],
  },
  catecismo: {
    lead: 'O Catecismo da Igreja Católica é a exposição oficial e organizada da fé católica, publicada por São João Paulo II em 1992, em quatro partes: o Credo, os sacramentos, a vida moral e a oração.',
    intro: `<p>O <strong>Catecismo da Igreja Católica</strong> reúne, de forma ordenada, o que a Igreja crê, celebra, vive e reza. Suas quatro partes seguem a estrutura clássica da catequese: a profissão de fé (Credo), a celebração do mistério cristão (liturgia e sacramentos), a vida em Cristo (moral e mandamentos) e a oração cristã (com o Pai-Nosso).</p>
<p>Nesta seção, cada artigo resume um tema do Catecismo em linguagem clara, sempre com a referência aos parágrafos, para que você possa conferir e aprofundar na fonte.</p>`,
    faq: [
      { q: 'Catecismo e Bíblia são a mesma coisa?', a: 'Não. A Bíblia é a Palavra de Deus escrita. O Catecismo explica a fé da Igreja a partir da Escritura, da Tradição e do Magistério, e cita a Bíblia constantemente.' },
      { q: 'O que significa o número depois de "CIC"?', a: 'É o parágrafo do Catecismo. Por exemplo, CIC 1374 é o parágrafo 1374, que trata da presença real de Cristo na Eucaristia. A numeração vai de 1 a 2865.' },
      { q: 'Existe uma versão resumida do Catecismo?', a: 'Sim. O Compêndio do Catecismo da Igreja Católica, publicado em 2005, apresenta a mesma doutrina em 598 perguntas e respostas. Há também o YouCat, voltado aos jovens.' },
      { q: 'Onde ler o Catecismo completo?', a: 'O texto integral em português está disponível gratuitamente no site da Santa Sé (vatican.va).' },
    ],
  },
  'liturgia-das-horas': {
    lead: 'A Liturgia das Horas é a oração oficial da Igreja, distribuída ao longo do dia em horas como Laudes (manhã), Vésperas (tarde) e Completas (noite), composta principalmente de salmos.',
    intro: `<p>A <strong>Liturgia das Horas</strong>, também chamada Ofício Divino ou Breviário, santifica as horas do dia com a oração dos salmos, leituras bíblicas, hinos e cânticos. É a oração pública da Igreja, rezada por bispos, padres, diáconos, religiosos e, cada vez mais, por leigos (Catecismo, nn. 1174-1178).</p>
<p>As horas principais são as <strong>Laudes</strong>, ao amanhecer, e as <strong>Vésperas</strong>, ao entardecer. Completam o dia o Ofício das Leituras, a Hora Média e as <strong>Completas</strong>, antes de dormir.</p>
<p>Aqui você aprende a estrutura de cada hora, o sentido das antífonas e dos cânticos evangélicos e como começar a rezar em casa ou em comunidade.</p>`,
    faq: [
      { q: 'Leigos podem rezar a Liturgia das Horas?', a: 'Sim. O Concílio Vaticano II recomenda que os leigos rezem o Ofício Divino, sobretudo Laudes e Vésperas. Para os leigos não há obrigação; para os clérigos, sim.' },
      { q: 'Quais são as horas da Liturgia das Horas?', a: 'Ofício das Leituras, Laudes (manhã), Hora Média (Tércia, Sexta ou Noa), Vésperas (tarde) e Completas (noite).' },
      { q: 'Preciso do livro para rezar?', a: 'O livro impresso é o mais completo, mas há aplicativos e sites que trazem o ofício do dia. O importante é rezar os textos aprovados para a data litúrgica.' },
      { q: 'Quanto tempo leva uma hora litúrgica?', a: 'Laudes e Vésperas levam de dez a quinze minutos. Completas, cerca de cinco. O Ofício das Leituras é mais longo por causa das leituras.' },
    ],
  },
  novenas: {
    lead: 'Novena é a oração feita durante nove dias seguidos com uma intenção, à imitação dos nove dias em que os Apóstolos e Maria rezaram entre a Ascensão e Pentecostes.',
    intro: `<p>A <strong>novena</strong> é uma forma de oração perseverante. Durante nove dias, a pessoa ou a comunidade reza pedindo uma graça, preparando uma festa ou agradecendo. A origem está nos nove dias de oração no Cenáculo, antes da vinda do Espírito Santo (cf. At 1,14).</p>
<p>Nesta seção estão as novenas mais rezadas no Brasil, com o texto completo de cada dia: Nossa Senhora Aparecida, Nossa Senhora Desatadora dos Nós, Santa Rita, Santo Expedito, Sagrado Coração de Jesus, Espírito Santo, Natal e muitas outras.</p>
<p>Uma novena não é fórmula mágica. É um pedido feito com fé e confiança, unido à oração da Igreja.</p>`,
    faq: [
      { q: 'Por que a novena tem nove dias?', a: 'Pelo exemplo dos Apóstolos, que rezaram com Maria durante os nove dias entre a Ascensão de Jesus e Pentecostes. O número lembra perseverança na oração.' },
      { q: 'Posso rezar a novena fora da data da festa do santo?', a: 'Sim. As novenas preparatórias terminam na véspera da festa, mas qualquer novena pode ser rezada em qualquer época do ano.' },
      { q: 'Se eu esquecer um dia, preciso recomeçar?', a: 'Não há regra que obrigue a recomeçar. Reze o dia esquecido e continue. Deus olha o coração, não a contagem perfeita.' },
      { q: 'A novena garante a graça pedida?', a: 'Não. Toda oração de pedido é feita na confiança de que Deus responde do modo e no tempo que são melhores para nós, como ensina o Catecismo ao tratar da oração de petição.' },
    ],
  },
  sacramentos: {
    lead: 'Os sete sacramentos são sinais eficazes da graça, instituídos por Cristo e confiados à Igreja: Batismo, Confirmação, Eucaristia, Penitência, Unção dos Enfermos, Ordem e Matrimônio.',
    intro: `<p>Um <strong>sacramento</strong> é um sinal sensível, instituído por Cristo, que comunica a graça que significa (Catecismo, n. 1131). A água do Batismo lava e dá a vida nova; o pão e o vinho consagrados alimentam com o próprio Cristo; a absolvição do sacerdote perdoa de fato.</p>
<p>Os sacramentos se agrupam em três: os da <strong>iniciação cristã</strong> (Batismo, Confirmação e Eucaristia), os de <strong>cura</strong> (Penitência e Unção dos Enfermos) e os a serviço da <strong>comunhão</strong> (Ordem e Matrimônio).</p>
<p>Aqui você encontra o que cada sacramento é, como se preparar, quem pode receber, o que a paróquia costuma pedir e as respostas para as dúvidas mais frequentes.</p>`,
    faq: [
      { q: 'Quais são os sete sacramentos?', a: 'Batismo, Confirmação (Crisma), Eucaristia, Penitência (Confissão), Unção dos Enfermos, Ordem e Matrimônio.' },
      { q: 'Quais sacramentos só podem ser recebidos uma vez?', a: 'Batismo, Confirmação e Ordem imprimem um caráter permanente e não se repetem. Os demais podem ser recebidos mais de uma vez; o Matrimônio, só depois da morte do cônjuge ou de declaração de nulidade.' },
      { q: 'Quem pode batizar?', a: 'Os ministros ordinários são o bispo, o padre e o diácono. Em perigo de morte, qualquer pessoa, mesmo não batizada, pode batizar, desde que use água, diga a fórmula trinitária e queira fazer o que a Igreja faz.' },
      { q: 'O que é preciso para comungar?', a: 'Estar batizado e em estado de graça (sem pecado grave não confessado), guardar o jejum eucarístico de uma hora e ter feito a primeira Comunhão, conforme a prática da Igreja.' },
    ],
  },
  'devocoes-marianas': {
    lead: 'Devoções marianas são as formas aprovadas pela Igreja de honrar Maria, Mãe de Deus, como o Rosário, o Escapulário, a Medalha Milagrosa, a consagração e as novenas às suas invocações.',
    intro: `<p>A Igreja honra <strong>Maria</strong> com um culto especial, chamado hiperdulia, porque ela é a Mãe de Deus e a primeira dos discípulos. Essa veneração é diferente da adoração, reservada a Deus, e conduz sempre a Cristo (Catecismo, nn. 971).</p>
<p>Nesta seção estão as devoções mais difundidas: o Escapulário de Nossa Senhora do Carmo, a Medalha Milagrosa, a Consagração segundo São Luís de Montfort, as aparições reconhecidas (Guadalupe, Lourdes, Fátima) e as invocações queridas do Brasil, como Nossa Senhora Aparecida.</p>`,
    faq: [
      { q: 'Por que os católicos rezam a Maria?', a: 'Porque Maria intercede por nós junto de seu Filho, como nas bodas de Caná. Rezar a Maria é pedir que ela nos leve a Jesus; nunca é colocá-la no lugar de Deus.' },
      { q: 'O que significa consagrar-se a Nossa Senhora?', a: 'É entregar-se a Jesus pelas mãos de Maria, confiando-lhe a própria vida para viver melhor o Batismo. A forma mais conhecida é a de São Luís Maria Grignion de Montfort.' },
      { q: 'Quais aparições de Maria a Igreja reconhece?', a: 'Entre as reconhecidas estão Guadalupe (1531), Rue du Bac (1830), La Salette (1846), Lourdes (1858), Fátima (1917) e Banneux (1933). O reconhecimento declara que não há nada contra a fé, sem obrigar a crer.' },
      { q: 'O Escapulário salva automaticamente?', a: 'Não. O Escapulário é sinal de consagração a Maria e de compromisso com uma vida cristã. A promessa associada a ele supõe a fidelidade de quem o usa.' },
    ],
  },
  'calendario-liturgico': {
    lead: 'O calendário litúrgico organiza o ano da Igreja em tempos (Advento, Natal, Quaresma, Páscoa e Tempo Comum) e celebra ao longo dele os mistérios de Cristo e a memória dos santos.',
    intro: `<p>O <strong>ano litúrgico</strong> começa no primeiro domingo do Advento e percorre toda a vida de Cristo: a espera (Advento), o nascimento (Natal), a conversão (Quaresma), a Paixão e a Ressurreição (Tríduo Pascal e Tempo Pascal) e o crescimento na fé (Tempo Comum).</p>
<p>Cada tempo tem sua cor litúrgica: roxo no Advento e na Quaresma, branco no Natal e na Páscoa, vermelho nas festas do Espírito Santo e dos mártires, verde no Tempo Comum.</p>
<p>Aqui você entende cada tempo, as solenidades, festas e memórias, os dias de preceito no Brasil e o santo de cada dia. Para as leituras de hoje, veja a <a href="/liturgia-diaria">Liturgia Diária</a>.</p>`,
    faq: [
      { q: 'Quais são os tempos do ano litúrgico?', a: 'Advento, Natal, Quaresma, Tríduo Pascal, Tempo Pascal e Tempo Comum. O Tempo Comum é dividido em duas partes: depois do Natal e depois de Pentecostes.' },
      { q: 'Qual a diferença entre solenidade, festa e memória?', a: 'A solenidade é o grau mais alto (Natal, Páscoa, Pentecostes, Todos os Santos). A festa é o grau intermediário. A memória, obrigatória ou facultativa, lembra um santo com celebração mais simples.' },
      { q: 'Quais são os dias santos de guarda no Brasil?', a: 'Além dos domingos: Santa Maria Mãe de Deus (1º de janeiro), Corpus Christi, Imaculada Conceição (8 de dezembro) e Natal (25 de dezembro), conforme determinação da CNBB.' },
      { q: 'O que significam as cores litúrgicas?', a: 'Branco: alegria e pureza. Vermelho: Espírito Santo e martírio. Roxo: penitência e espera. Verde: esperança e crescimento. Rosa: alegria no meio da penitência (3º domingo do Advento e 4º da Quaresma).' },
    ],
  },
  'exame-de-consciencia': {
    lead: 'O exame de consciência é a revisão sincera dos próprios pensamentos, palavras, ações e omissões à luz dos mandamentos, feita antes da confissão ou ao fim de cada dia.',
    intro: `<p>Antes de pedir perdão, é preciso reconhecer onde se falhou. O <strong>exame de consciência</strong> é esse olhar honesto sobre a própria vida, iluminado pela Palavra de Deus (Catecismo, n. 1454). Não é um exercício de culpa, mas de verdade e de confiança na misericórdia.</p>
<p>Aqui você encontra um checklist interativo que monta a lista do que confessar, um guia passo a passo, modelos de exame pelos Dez Mandamentos e pelos deveres de estado, o exame diário de Santo Inácio e respostas sobre escrúpulos e esquecimentos.</p>`,
    faq: [
      { q: 'Com que frequência fazer o exame de consciência?', a: 'Um breve exame todas as noites e um exame mais completo antes de cada confissão. Os pecados graves devem ser confessados antes de comungar.' },
      { q: 'Preciso anotar os pecados?', a: 'Não é obrigatório, mas ajuda, principalmente depois de muito tempo sem confessar. A lista pode ser destruída depois.' },
      { q: 'O que devo dizer na confissão?', a: 'Os pecados graves, com a espécie e o número aproximado de vezes. Não é preciso contar detalhes desnecessários nem nomear outras pessoas.' },
    ],
  },
  'oracoes-do-dia-a-dia': {
    lead: 'As orações do dia a dia são as fórmulas básicas da vida católica: Sinal da Cruz, Pai-Nosso, Ave-Maria, Glória, Credo, Salve-Rainha, Angelus, orações da manhã, da noite e das refeições.',
    intro: `<p>Jesus ensinou aos discípulos o <strong>Pai-Nosso</strong>, que o Catecismo chama de "resumo de todo o Evangelho" (n. 2761). A partir dele, a Igreja formou um tesouro de orações simples que acompanham o católico do despertar ao deitar.</p>
<p>Nesta seção estão os textos oficiais em português, o significado de cada oração, quando rezar cada uma e como montar uma rotina de oração em casa, sozinho ou em família.</p>`,
    faq: [
      { q: 'Quais orações todo católico deveria saber?', a: 'Sinal da Cruz, Pai-Nosso, Ave-Maria, Glória ao Pai, Credo, Salve-Rainha e o Ato de Contrição. Com elas é possível rezar o Terço e preparar-se para a confissão.' },
      { q: 'O que é o Angelus?', a: 'É a oração que lembra a Encarnação, rezada tradicionalmente às 6h, ao meio-dia e às 18h. No Tempo Pascal é substituída pelo Regina Caeli.' },
      { q: 'Posso rezar com minhas próprias palavras?', a: 'Sim. A oração espontânea é valiosa. As fórmulas da Igreja ajudam quando faltam palavras e unem a nossa oração à de todos os fiéis.' },
    ],
  },
  'documentos-da-igreja': {
    lead: 'Documentos da Igreja são os textos do Magistério, como encíclicas, exortações apostólicas, constituições conciliares e cartas, pelos quais o Papa e os bispos ensinam a fé e orientam a vida cristã.',
    intro: `<p>Encíclica, exortação apostólica, constituição, motu proprio, carta apostólica: cada tipo de <strong>documento pontifício</strong> tem um peso e uma finalidade. As constituições do Concílio Vaticano II e as encíclicas estão entre os textos mais importantes do Magistério recente.</p>
<p>Aqui você encontra resumos fiéis dos principais documentos, com o contexto em que foram escritos, as ideias centrais e links para o texto integral no site da Santa Sé.</p>`,
    faq: [
      { q: 'O que é uma encíclica?', a: 'É uma carta do Papa dirigida a toda a Igreja (e às vezes a todas as pessoas de boa vontade) sobre um tema de fé, moral ou vida social. É um dos documentos de maior autoridade do Magistério ordinário.' },
      { q: 'Qual a diferença entre encíclica e exortação apostólica?', a: 'A encíclica trata de doutrina de modo mais sistemático. A exortação apostólica costuma recolher as conclusões de um Sínodo e tem caráter mais pastoral e prático.' },
      { q: 'Os católicos são obrigados a seguir tudo o que está nos documentos?', a: 'O que é ensinado em matéria de fé e moral pede adesão. Em questões prudenciais, técnicas ou disciplinares, o Magistério orienta e os fiéis devem acolher com respeito, mantendo a liberdade legítima de juízo.' },
    ],
  },
  ladainhas: {
    lead: 'Ladainha é uma oração em forma de invocações repetidas, em que o guia proclama títulos ou pedidos e a assembleia responde "rogai por nós" ou "tende piedade de nós".',
    intro: `<p>A <strong>ladainha</strong> é uma das formas mais antigas de oração comunitária. As aprovadas para uso público são a Ladainha de Nossa Senhora (Lauretana), a dos Santos, a do Sagrado Coração de Jesus, a do Santíssimo Nome de Jesus, a do Preciosíssimo Sangue e a de São José.</p>
<p>Aqui estão os textos completos em português, a origem de cada ladainha, quando são rezadas na liturgia (como a Ladainha dos Santos na Vigília Pascal e nas ordenações) e como usá-las na oração pessoal.</p>`,
    faq: [
      { q: 'Qual é a ladainha mais conhecida?', a: 'A Ladainha de Nossa Senhora, chamada Lauretana por ter se difundido a partir do santuário de Loreto, na Itália. É rezada tradicionalmente ao final do Terço.' },
      { q: 'Quando se reza a Ladainha dos Santos?', a: 'Na Vigília Pascal, antes do Batismo; nas ordenações; na profissão religiosa; na dedicação de igrejas e em procissões penitenciais. Também pode ser rezada em particular.' },
      { q: 'Posso acrescentar santos à ladainha?', a: 'Na oração particular, sim. Na liturgia, só os santos previstos no rito e, conforme as normas, o padroeiro do lugar ou os santos ligados à celebração.' },
    ],
  },
  'duvidas-da-fe': {
    lead: 'Respostas claras, com base no Catecismo e no Direito Canônico, para as perguntas que os católicos fazem sobre Missa, sacramentos, costumes, símbolos e vida de fé.',
    intro: `<p>Por que o padre usa roxo? Posso comungar duas vezes no mesmo dia? O que significa JHS? Em cada artigo desta seção, uma <strong>dúvida real</strong> recebe uma resposta direta, fundamentada no que a Igreja ensina, sem opinião pessoal e sem complicar.</p>
<p>Quando a resposta depende da sua situação concreta, o artigo diz isso claramente e recomenda conversar com um sacerdote. Não encontrou sua pergunta? Envie pela página de <a href="/sugestoes">sugestões</a>.</p>`,
    faq: [
      { q: 'As respostas aqui têm autoridade da Igreja?', a: 'As respostas resumem o que está no Catecismo, no Código de Direito Canônico e nos livros litúrgicos, com as referências indicadas. A autoridade é desses documentos; o site apenas os explica.' },
      { q: 'Posso perguntar algo que não está no site?', a: 'Sim. Use a página de sugestões. As perguntas mais frequentes viram novos artigos.' },
      { q: 'E se um padre me disse algo diferente?', a: 'Procure a fonte indicada no artigo e, se a dúvida continuar, pergunte ao próprio padre com a referência em mãos. Em questões de orientação pessoal, o confessor conhece a sua situação.' },
    ],
  },
};
