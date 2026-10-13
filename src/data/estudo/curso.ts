/**
 * Conteúdo do Caminho da Fé.
 * Regra editorial: tudo aqui está no Catecismo da Igreja Católica (CIC),
 * no Código de Direito Canônico (CDC) ou na Sagrada Escritura, com a referência indicada.
 */
import type { Trilha, QuestaoNivelamento } from './tipos';

export const TRILHAS: Trilha[] = [
  // ───────────────────────── 1. DEUS E A REVELAÇÃO ─────────────────────────
  {
    id: 'deus',
    titulo: 'Deus e a Revelação',
    resumo: 'Quem é Deus, como Ele se revela e como a fé chega até nós.',
    icone: 'Sun',
    licoes: [
      {
        id: 'deus-1',
        titulo: 'O desejo de Deus',
        nivel: 1,
        ensino:
          'O desejo de Deus está inscrito no coração humano, porque fomos criados por Deus e para Deus. Só em Deus o homem encontra a verdade e a felicidade que procura sem cessar.',
        ref: 'CIC 27',
        questoes: [
          {
            tipo: 'vf',
            enunciado: 'Segundo o Catecismo, o desejo de Deus está inscrito no coração do homem.',
            correta: true,
            explica: 'O CIC 27 começa exatamente assim: o desejo de Deus está inscrito no coração do homem.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Por que o ser humano busca a Deus?',
            opcoes: ['Porque foi criado por Deus e para Deus', 'Por costume cultural', 'Por medo da morte'],
            correta: 0,
            explica: 'Fomos criados por Deus e para Deus, e Ele não cessa de nos atrair a Si (CIC 27).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Onde o homem encontra a verdade e a felicidade que procura?',
            opcoes: ['Só em Deus', 'Nos bens materiais', 'No sucesso profissional'],
            correta: 0,
            explica: 'Só em Deus o homem encontra a verdade e a felicidade que não cessa de procurar (CIC 27).',
          },
          {
            tipo: 'vf',
            enunciado: 'A razão humana, sozinha, nunca pode chegar a conhecer que Deus existe.',
            correta: false,
            explica: 'A Igreja ensina que Deus pode ser conhecido com certeza pela luz natural da razão, a partir das coisas criadas (CIC 36).',
          },
        ],
        leiaMais: [{ titulo: 'Fé e razão: a harmonia segundo a Igreja', href: '/catecismo/fe-e-razao-harmonia-igreja-catolica' }],
      },
      {
        id: 'deus-2',
        titulo: 'A Santíssima Trindade',
        nivel: 1,
        ensino:
          'Há um só Deus em três Pessoas: Pai, Filho e Espírito Santo. As três Pessoas são distintas entre si, mas não são três deuses: são um só Deus. É o mistério central da fé e da vida cristã.',
        ref: 'CIC 234; 253-254',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Quantas Pessoas há em Deus?',
            opcoes: ['Três', 'Uma', 'Duas'],
            correta: 0,
            explica: 'Um só Deus em três Pessoas: Pai, Filho e Espírito Santo (CIC 253).',
          },
          {
            tipo: 'vf',
            enunciado: 'Pai, Filho e Espírito Santo são três deuses diferentes.',
            correta: false,
            explica: 'Não professamos três deuses, mas um só Deus em três Pessoas (CIC 253).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue cada Pessoa da Trindade à ação que a tradição costuma lhe atribuir.',
            pares: [
              ['Pai', 'Criador'],
              ['Filho', 'Redentor'],
              ['Espírito Santo', 'Santificador'],
            ],
            explica: 'As obras de Deus são comuns às três Pessoas, mas a Igreja atribui a cada uma o que mais manifesta sua propriedade (CIC 258).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O mistério da Santíssima Trindade é...',
            opcoes: ['O mistério central da fé e da vida cristã', 'Um detalhe secundário da fé', 'Uma ideia surgida na Idade Média'],
            correta: 0,
            explica: 'É o mistério central da fé e da vida cristã, a fonte de todos os outros mistérios (CIC 234).',
          },
        ],
        leiaMais: [{ titulo: 'A Santíssima Trindade explicada', href: '/catecismo/a-santissima-trindade-explicada-de-forma-acessivel' }],
      },
      {
        id: 'deus-3',
        titulo: 'A Bíblia',
        nivel: 2,
        ensino:
          'A Sagrada Escritura tem Deus como autor, porque foi escrita sob a inspiração do Espírito Santo, e tem também autores humanos. A Bíblia católica tem 73 livros: 46 do Antigo Testamento e 27 do Novo Testamento.',
        ref: 'CIC 105-106; 120',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Quantos livros tem a Bíblia católica?',
            opcoes: ['73', '66', '72'],
            correta: 0,
            explica: 'São 46 livros do Antigo Testamento e 27 do Novo, somando 73 (CIC 120).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue cada parte da Bíblia ao número de livros.',
            pares: [
              ['Antigo Testamento', '46 livros'],
              ['Novo Testamento', '27 livros'],
            ],
            explica: 'A lista completa dos livros é chamada de cânon das Escrituras (CIC 120).',
          },
          {
            tipo: 'vf',
            enunciado: 'A Bíblia foi escrita sob a inspiração do Espírito Santo.',
            correta: true,
            explica: 'Deus é o autor da Sagrada Escritura, que foi escrita sob a inspiração do Espírito Santo (CIC 105).',
          },
          {
            tipo: 'ordenar',
            enunciado: 'Coloque os quatro Evangelhos na ordem em que aparecem na Bíblia.',
            itens: ['Mateus', 'Marcos', 'Lucas', 'João'],
            explica: 'Os Evangelhos são o coração de todas as Escrituras, porque são o principal testemunho da vida de Jesus (CIC 125).',
          },
        ],
        leiaMais: [
          { titulo: 'Diferença entre a Bíblia católica e a protestante', href: '/duvidas-da-fe/diferenca-entre-biblia-catolica-e-protestante' },
          { titulo: 'O que são os livros deuterocanônicos', href: '/duvidas-da-fe/o-que-sao-os-livros-deuterocanonicos' },
        ],
      },
      {
        id: 'deus-4',
        titulo: 'Escritura, Tradição e Magistério',
        nivel: 2,
        ensino:
          'A Revelação de Deus chega até nós pela Sagrada Escritura e pela Sagrada Tradição, que formam um só depósito da fé. O Magistério, isto é, o Papa e os bispos em comunhão com ele, tem a missão de interpretar autenticamente a Palavra de Deus.',
        ref: 'CIC 80-85; 97',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Por quais meios a Revelação de Deus é transmitida?',
            opcoes: ['Sagrada Escritura e Sagrada Tradição', 'Só pela Bíblia', 'Só pelos costumes populares'],
            correta: 0,
            explica: 'Escritura e Tradição estão intimamente unidas e formam um só depósito sagrado da Palavra de Deus (CIC 80; 97).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quem forma o Magistério da Igreja?',
            opcoes: ['O Papa e os bispos em comunhão com ele', 'Os teólogos mais conhecidos', 'Cada paróquia'],
            correta: 0,
            explica: 'O ofício de interpretar autenticamente a Palavra de Deus foi confiado aos bispos em comunhão com o sucessor de Pedro (CIC 85).',
          },
          {
            tipo: 'vf',
            enunciado: 'O Magistério está acima da Palavra de Deus.',
            correta: false,
            explica: 'O Magistério não está acima da Palavra de Deus, mas a seu serviço (CIC 86).',
          },
          {
            tipo: 'vf',
            enunciado: 'Escritura e Tradição formam um só depósito da fé.',
            correta: true,
            explica: 'Ambas formam um único depósito sagrado da Palavra de Deus confiado à Igreja (CIC 97).',
          },
        ],
        leiaMais: [
          { titulo: 'Dei Verbum: a Revelação divina', href: '/documentos-da-igreja/dei-verbum-a-revelacao-divina' },
          { titulo: 'O que é a infalibilidade papal', href: '/duvidas-da-fe/o-que-e-a-infalibilidade-papal' },
        ],
      },
      {
        id: 'deus-5',
        titulo: 'A Criação e os anjos',
        nivel: 3,
        ensino:
          'Deus criou o mundo livremente, do nada, por sabedoria e amor. Ele criou também os seres espirituais, os anjos, que são criaturas pessoais e imortais. Deus não abandona a criação: guia-a pela sua Providência.',
        ref: 'CIC 295-296; 302; 328-330',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'A partir de que Deus criou o mundo?',
            opcoes: ['Do nada', 'De uma matéria eterna', 'De si mesmo, por necessidade'],
            correta: 0,
            explica: 'Deus criou livremente "do nada" (CIC 296).',
          },
          {
            tipo: 'vf',
            enunciado: 'A existência dos anjos é uma verdade de fé.',
            correta: true,
            explica: 'A existência dos seres espirituais, que a Escritura chama de anjos, é uma verdade de fé (CIC 328).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Como se chama o modo como Deus conduz a criação para o seu fim?',
            opcoes: ['Providência', 'Destino', 'Acaso'],
            correta: 0,
            explica: 'A Providência divina são as disposições pelas quais Deus conduz a criação para a perfeição (CIC 302).',
          },
          {
            tipo: 'vf',
            enunciado: 'Deus criou o mundo por necessidade, porque precisava dele.',
            correta: false,
            explica: 'Deus criou livremente, por sabedoria e amor, não por necessidade (CIC 295).',
          },
        ],
        leiaMais: [
          { titulo: 'A Criação: o que a Igreja ensina', href: '/catecismo/a-criacao-o-que-a-igreja-ensina-sobre-a-origem-do-mundo' },
          { titulo: 'Anjos e demônios na doutrina católica', href: '/catecismo/anjos-e-demonios-doutrina-catolica' },
        ],
      },
      {
        id: 'deus-6',
        titulo: 'O pecado original',
        nivel: 3,
        ensino:
          'Nossos primeiros pais, tentados pelo demônio, desobedeceram a Deus e perderam a santidade original para si e para todos os seus descendentes. O pecado original é transmitido a todos e é apagado pelo Batismo, embora permaneçam suas consequências, como a inclinação ao mal.',
        ref: 'CIC 397; 404-405',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'O que apaga o pecado original?',
            opcoes: ['O Batismo', 'A Crisma', 'A Unção dos Enfermos'],
            correta: 0,
            explica: 'O Batismo, dando a vida da graça de Cristo, apaga o pecado original (CIC 405).',
          },
          {
            tipo: 'vf',
            enunciado: 'Depois do Batismo, desaparece também toda inclinação ao mal.',
            correta: false,
            explica: 'Permanecem as consequências, como a inclinação ao mal chamada concupiscência (CIC 405).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O pecado original foi, na sua origem, um ato de...',
            opcoes: ['Desobediência a Deus', 'Ignorância inevitável', 'Simples fraqueza física'],
            correta: 0,
            explica: 'O homem, tentado pelo diabo, deixou morrer em seu coração a confiança no Criador e desobedeceu (CIC 397).',
          },
          {
            tipo: 'vf',
            enunciado: 'O pecado original atinge apenas Adão e Eva.',
            correta: false,
            explica: 'Ele é transmitido a toda a humanidade (CIC 404).',
          },
        ],
        leiaMais: [{ titulo: 'O pecado original: significado e consequências', href: '/catecismo/o-pecado-original-significado-e-consequencias' }],
      },
    ],
  },

  // ───────────────────────── 2. JESUS CRISTO E A IGREJA ─────────────────────────
  {
    id: 'jesus',
    titulo: 'Jesus Cristo e a Igreja',
    resumo: 'Quem é Jesus, o que Ele fez por nós e a Igreja que Ele fundou.',
    icone: 'Cross',
    licoes: [
      {
        id: 'jesus-1',
        titulo: 'Verdadeiro Deus e verdadeiro homem',
        nivel: 1,
        ensino:
          'Jesus Cristo é o Filho eterno de Deus que se fez homem. Ele é verdadeiro Deus e verdadeiro homem, numa só Pessoa divina. A isso a Igreja chama Encarnação.',
        ref: 'CIC 461; 464',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Jesus Cristo é...',
            opcoes: ['Verdadeiro Deus e verdadeiro homem', 'Apenas um grande profeta', 'Um anjo que parecia homem'],
            correta: 0,
            explica: 'Jesus é verdadeiramente Deus e verdadeiramente homem (CIC 464).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Como se chama o mistério de o Filho de Deus se fazer homem?',
            opcoes: ['Encarnação', 'Ascensão', 'Transfiguração'],
            correta: 0,
            explica: 'A Igreja chama "Encarnação" o fato de o Filho de Deus ter assumido a natureza humana (CIC 461).',
          },
          {
            tipo: 'vf',
            enunciado: 'Em Jesus há duas pessoas, uma divina e outra humana.',
            correta: false,
            explica: 'Há duas naturezas, divina e humana, unidas numa só Pessoa, a do Filho de Deus (CIC 466-468).',
          },
          {
            tipo: 'vf',
            enunciado: 'O nome "Jesus" significa "Deus salva".',
            correta: true,
            explica: 'Em hebraico, Jesus quer dizer "Deus salva" (CIC 430).',
          },
        ],
        leiaMais: [{ titulo: 'O Credo Apostólico explicado', href: '/catecismo/o-credo-apostolico-cada-artigo-explicado' }],
      },
      {
        id: 'jesus-2',
        titulo: 'Paixão, morte e ressurreição',
        nivel: 1,
        ensino:
          'Jesus ofereceu livremente a sua vida na cruz para nos salvar do pecado. Ao terceiro dia ressuscitou dos mortos. A Ressurreição é a verdade culminante da nossa fé em Cristo.',
        ref: 'CIC 609; 638',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Coloque os acontecimentos na ordem certa.',
            itens: ['Última Ceia', 'Crucifixão', 'Ressurreição', 'Ascensão', 'Pentecostes'],
            explica: 'Da Última Ceia ao Pentecostes, cinquenta dias depois da Páscoa, quando o Espírito Santo desce sobre os Apóstolos.',
          },
          {
            tipo: 'vf',
            enunciado: 'Jesus ofereceu sua vida livremente, por amor.',
            correta: true,
            explica: 'Jesus aceitou livremente a sua Paixão e morte por amor ao Pai e aos homens (CIC 609).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Em que dia Jesus ressuscitou?',
            opcoes: ['Ao terceiro dia', 'No mesmo dia em que morreu', 'Quarenta dias depois'],
            correta: 0,
            explica: '"Ressuscitou ao terceiro dia", como professamos no Credo.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual é a verdade culminante da fé em Cristo?',
            opcoes: ['A Ressurreição', 'O nascimento em Belém', 'Os milagres'],
            correta: 0,
            explica: 'A Ressurreição de Jesus é a verdade culminante da nossa fé em Cristo (CIC 638).',
          },
        ],
        leiaMais: [{ titulo: 'Como fazer a Via-Sacra', href: '/duvidas-da-fe/como-fazer-a-via-sacra-nas-sextas-feiras-da-quaresma' }],
      },
      {
        id: 'jesus-3',
        titulo: 'Os sinais da Igreja',
        nivel: 2,
        ensino:
          'No Credo professamos a Igreja una, santa, católica e apostólica. São as quatro notas que indicam os traços essenciais da Igreja fundada por Cristo. "Católica" quer dizer universal.',
        ref: 'CIC 811; 830',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Monte a frase do Credo: "Creio na Igreja..."',
            itens: ['una,', 'santa,', 'católica', 'e apostólica'],
            explica: 'São as quatro notas da Igreja professadas no Credo Niceno-Constantinopolitano (CIC 811).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O que significa a palavra "católica"?',
            opcoes: ['Universal', 'Antiga', 'Romana'],
            correta: 0,
            explica: '"Católica" significa universal, no sentido de "segundo a totalidade" (CIC 830).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Por que a Igreja é chamada "apostólica"?',
            opcoes: ['Porque está fundada sobre os Apóstolos', 'Porque foi fundada por São Paulo', 'Porque só tem padres'],
            correta: 0,
            explica: 'Ela está construída sobre o fundamento dos Apóstolos e continua sendo guiada por seus sucessores, os bispos (CIC 857).',
          },
          {
            tipo: 'vf',
            enunciado: 'A Igreja é santa porque todos os seus membros já são santos.',
            correta: false,
            explica: 'A Igreja é santa por causa de Cristo, que a santifica; seus membros ainda estão a caminho da santidade (CIC 823; 827).',
          },
        ],
        leiaMais: [{ titulo: 'Igreja una, santa, católica e apostólica', href: '/catecismo/o-que-e-a-igreja-catolica-uma-santa-catolica-e-apostolica' }],
      },
      {
        id: 'jesus-4',
        titulo: 'Pedro e o Papa',
        nivel: 2,
        ensino:
          'Jesus escolheu Pedro como rocha sobre a qual edificaria a sua Igreja (Mt 16,18). O Papa, bispo de Roma, é o sucessor de Pedro e princípio visível da unidade da Igreja.',
        ref: 'CIC 881-882; Mt 16,18',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'De quem o Papa é sucessor?',
            opcoes: ['De São Pedro', 'De São Paulo', 'De São João'],
            correta: 0,
            explica: 'O Papa, bispo de Roma, é o sucessor de Pedro (CIC 882).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Complete: "Tu és Pedro, e sobre esta pedra edificarei a minha..."',
            opcoes: ['Igreja', 'casa', 'cidade'],
            correta: 0,
            explica: 'Mt 16,18.',
          },
          {
            tipo: 'vf',
            enunciado: 'O Papa é princípio visível da unidade da Igreja.',
            correta: true,
            explica: 'É o princípio e fundamento perpétuo e visível da unidade da fé e da comunhão (CIC 882).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Os bispos são sucessores de quem?',
            opcoes: ['Dos Apóstolos', 'Dos profetas', 'Dos sacerdotes do Templo'],
            correta: 0,
            explica: 'Os bispos sucedem aos Apóstolos como pastores da Igreja (CIC 862).',
          },
        ],
        leiaMais: [
          { titulo: 'Por que os católicos têm o Papa como líder', href: '/duvidas-da-fe/por-que-os-catolicos-tem-o-papa-como-lider' },
          { titulo: 'O que é a infalibilidade papal', href: '/duvidas-da-fe/o-que-e-a-infalibilidade-papal' },
        ],
      },
      {
        id: 'jesus-5',
        titulo: 'O Espírito Santo e Pentecostes',
        nivel: 3,
        ensino:
          'O Espírito Santo é a terceira Pessoa da Santíssima Trindade, Senhor que dá a vida. No dia de Pentecostes, Ele foi derramado sobre os Apóstolos reunidos com Maria, e a Igreja foi manifestada ao mundo.',
        ref: 'CIC 685; 731; 1076',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Quantos dias depois da Páscoa se celebra Pentecostes?',
            opcoes: ['Cinquenta', 'Quarenta', 'Sete'],
            correta: 0,
            explica: 'Pentecostes significa "quinquagésimo dia" e encerra os cinquenta dias do Tempo Pascal (CIC 731).',
          },
          {
            tipo: 'vf',
            enunciado: 'O Espírito Santo é uma força impessoal de Deus, não uma Pessoa.',
            correta: false,
            explica: 'O Espírito Santo é uma Pessoa divina, a terceira da Santíssima Trindade (CIC 685).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quem estava com os Apóstolos em Pentecostes, segundo os Atos?',
            opcoes: ['Maria, mãe de Jesus', 'Zacarias', 'João Batista'],
            correta: 0,
            explica: 'Todos perseveravam na oração com Maria, a mãe de Jesus (At 1,14).',
          },
          {
            tipo: 'vf',
            enunciado: 'No dia de Pentecostes, a Igreja foi manifestada publicamente.',
            correta: true,
            explica: 'No dia de Pentecostes, pela efusão do Espírito Santo, a Igreja foi manifestada ao mundo (CIC 1076).',
          },
        ],
        leiaMais: [
          { titulo: 'Os dons e frutos do Espírito Santo', href: '/catecismo/os-dons-e-frutos-do-espirito-santo' },
          { titulo: 'Novena ao Espírito Santo', href: '/novenas/novena-ao-espirito-santo-completa-com-meditacoes' },
        ],
      },
      {
        id: 'jesus-6',
        titulo: 'Concílios e documentos',
        nivel: 3,
        ensino:
          'Um Concílio Ecumênico reúne os bispos de todo o mundo em comunhão com o Papa. O primeiro foi o de Niceia, em 325, que professou a divindade do Filho. O mais recente foi o Concílio Vaticano II, realizado entre 1962 e 1965.',
        ref: 'CIC 884; 465',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Qual foi o primeiro Concílio Ecumênico?',
            opcoes: ['Niceia', 'Trento', 'Vaticano I'],
            correta: 0,
            explica: 'O Concílio de Niceia, em 325, confessou que o Filho é "consubstancial" ao Pai (CIC 465).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quando aconteceu o Concílio Vaticano II?',
            opcoes: ['1962 a 1965', '1869 a 1870', '1545 a 1563'],
            correta: 0,
            explica: 'O Vaticano II foi aberto por São João XXIII em 1962 e concluído por São Paulo VI em 1965.',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue o documento do Vaticano II ao seu tema.',
            pares: [
              ['Lumen Gentium', 'A Igreja'],
              ['Dei Verbum', 'A Revelação divina'],
              ['Sacrosanctum Concilium', 'A Liturgia'],
              ['Gaudium et Spes', 'A Igreja no mundo atual'],
            ],
            explica: 'Estas são as quatro constituições do Concílio Vaticano II.',
          },
          {
            tipo: 'vf',
            enunciado: 'Um Concílio Ecumênico só é válido em comunhão com o Papa.',
            correta: true,
            explica: 'Nunca existe concílio ecumênico que não seja confirmado ou ao menos aceito pelo sucessor de Pedro (CIC 884).',
          },
        ],
        leiaMais: [
          { titulo: 'O que é um Concílio Ecumênico', href: '/duvidas-da-fe/o-que-e-um-concilio-ecumenico' },
          { titulo: 'Lumen Gentium resumida', href: '/documentos-da-igreja/lumen-gentium-a-igreja-como-povo-de-deus' },
        ],
      },
    ],
  },

  // ───────────────────────── 3. SACRAMENTOS ─────────────────────────
  {
    id: 'sacramentos',
    titulo: 'Os sacramentos',
    resumo: 'Os sete sinais pelos quais Cristo nos dá a sua graça.',
    icone: 'Droplets',
    licoes: [
      {
        id: 'sac-1',
        titulo: 'O que é um sacramento',
        nivel: 1,
        ensino:
          'Os sacramentos são sinais eficazes da graça, instituídos por Cristo e confiados à Igreja, pelos quais nos é dada a vida divina. São sete: Batismo, Confirmação, Eucaristia, Penitência, Unção dos Enfermos, Ordem e Matrimônio.',
        ref: 'CIC 1113; 1131',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Quantos são os sacramentos?',
            opcoes: ['Sete', 'Dois', 'Dez'],
            correta: 0,
            explica: 'A Igreja celebra sete sacramentos (CIC 1113).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual destes NÃO é um sacramento?',
            opcoes: ['Bênção de uma casa', 'Matrimônio', 'Unção dos Enfermos'],
            correta: 0,
            explica: 'A bênção é um sacramental, não um sacramento. Os sete sacramentos estão no CIC 1113; os sacramentais, no CIC 1667.',
          },
          {
            tipo: 'vf',
            enunciado: 'Os sacramentos foram instituídos por Cristo.',
            correta: true,
            explica: 'São sinais eficazes da graça, instituídos por Cristo e confiados à Igreja (CIC 1131).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue cada grupo aos seus sacramentos.',
            pares: [
              ['Iniciação cristã', 'Batismo, Confirmação, Eucaristia'],
              ['Cura', 'Penitência, Unção dos Enfermos'],
              ['Serviço da comunhão', 'Ordem, Matrimônio'],
            ],
            explica: 'Essa é a divisão usada pelo Catecismo (CIC 1210-1211).',
          },
        ],
        leiaMais: [{ titulo: 'Todos os artigos sobre sacramentos', href: '/sacramentos' }],
      },
      {
        id: 'sac-2',
        titulo: 'O Batismo',
        nivel: 1,
        ensino:
          'O Batismo é o fundamento de toda a vida cristã e a porta para os outros sacramentos. Ele nos liberta do pecado, nos faz filhos de Deus e membros da Igreja. O rito essencial é a água, por imersão ou infusão, com as palavras "Eu te batizo em nome do Pai e do Filho e do Espírito Santo".',
        ref: 'CIC 1213; 1239-1240',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Qual sacramento é a porta para os outros?',
            opcoes: ['Batismo', 'Eucaristia', 'Confirmação'],
            correta: 0,
            explica: 'O Batismo é a porta que dá acesso aos demais sacramentos (CIC 1213).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual é o elemento essencial do Batismo?',
            opcoes: ['Água', 'Óleo', 'Sal'],
            correta: 0,
            explica: 'O rito essencial consiste em imergir na água ou derramar água sobre a cabeça, invocando a Santíssima Trindade (CIC 1239-1240).',
          },
          {
            tipo: 'vf',
            enunciado: 'Em caso de necessidade, qualquer pessoa pode batizar, desde que tenha a intenção de fazer o que a Igreja faz.',
            correta: true,
            explica: 'Em caso de necessidade, qualquer pessoa, mesmo não batizada, pode batizar, com a intenção requerida e usando a fórmula trinitária (CIC 1256).',
          },
          {
            tipo: 'vf',
            enunciado: 'Quem foi batizado validamente pode ser batizado de novo.',
            correta: false,
            explica: 'O Batismo imprime um selo espiritual indelével e não pode ser repetido (CIC 1272).',
          },
        ],
        leiaMais: [
          { titulo: 'O Batismo: significado, rito e graças', href: '/sacramentos/o-batismo-significado-rito-e-gracas' },
          { titulo: 'O significado dos símbolos do Batismo', href: '/sacramentos/significado-dos-simbolos-do-batismo' },
        ],
      },
      {
        id: 'sac-3',
        titulo: 'A Eucaristia',
        nivel: 2,
        ensino:
          'A Eucaristia é fonte e ápice de toda a vida cristã. Nela, pela consagração, o pão e o vinho se tornam o Corpo e o Sangue de Cristo. A Igreja chama essa mudança de transubstanciação.',
        ref: 'CIC 1324; 1376',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Como a Igreja chama a mudança do pão e do vinho no Corpo e Sangue de Cristo?',
            opcoes: ['Transubstanciação', 'Transfiguração', 'Consubstanciação'],
            correta: 0,
            explica: 'A Igreja chama essa conversão, de modo conveniente e apropriado, de transubstanciação (CIC 1376).',
          },
          {
            tipo: 'vf',
            enunciado: 'Na Eucaristia, Cristo está presente apenas de forma simbólica.',
            correta: false,
            explica: 'Cristo está presente verdadeira, real e substancialmente (CIC 1374).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quanto tempo de jejum é pedido antes de comungar?',
            opcoes: ['Uma hora', 'Três horas', 'Desde a meia-noite'],
            correta: 0,
            explica: 'Quem vai comungar deve abster-se de alimento e bebida, exceto água e remédios, por uma hora antes (CDC cân. 919).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O Catecismo chama a Eucaristia de...',
            opcoes: ['Fonte e ápice de toda a vida cristã', 'Um sacramento opcional', 'Uma lembrança da Última Ceia apenas'],
            correta: 0,
            explica: 'CIC 1324, citando o Concílio Vaticano II (Lumen Gentium 11).',
          },
        ],
        leiaMais: [
          { titulo: 'A Eucaristia: presença real de Cristo', href: '/sacramentos/a-eucaristia-presenca-real-de-cristo' },
          { titulo: 'O que é a transubstanciação', href: '/duvidas-da-fe/o-que-e-a-transubstanciacao-na-eucaristia' },
        ],
      },
      {
        id: 'sac-4',
        titulo: 'A Confissão',
        nivel: 2,
        ensino:
          'No sacramento da Penitência, Deus perdoa os pecados cometidos depois do Batismo. Os atos do penitente são três: contrição (arrependimento), confissão dos pecados e satisfação (cumprir a penitência). O sacerdote dá a absolvição.',
        ref: 'CIC 1422; 1450-1460',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Coloque os passos de uma boa confissão na ordem.',
            itens: ['Exame de consciência', 'Arrependimento', 'Confessar os pecados ao sacerdote', 'Receber a absolvição', 'Cumprir a penitência'],
            explica: 'Contrição, confissão e satisfação são os atos do penitente (CIC 1450-1460).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Com que frequência mínima a Igreja pede que o fiel confesse seus pecados graves?',
            opcoes: ['Ao menos uma vez por ano', 'Uma vez na vida', 'Todo domingo'],
            correta: 0,
            explica: 'Todo fiel deve confessar os pecados graves ao menos uma vez por ano (CIC 1457; CDC cân. 989).',
          },
          {
            tipo: 'vf',
            enunciado: 'O sacerdote pode revelar o que ouviu na confissão se for algo grave.',
            correta: false,
            explica: 'O sigilo sacramental é absoluto e não admite exceção (CIC 1467).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O que é a contrição?',
            opcoes: ['A dor da alma e a detestação do pecado, com o propósito de não pecar mais', 'Contar os pecados ao padre', 'Rezar a penitência'],
            correta: 0,
            explica: 'É a definição do CIC 1451.',
          },
        ],
        leiaMais: [
          { titulo: 'Como fazer uma boa confissão', href: '/exame-de-consciencia/como-fazer-uma-boa-confissao-passo-a-passo' },
          { titulo: 'Exame de consciência interativo', href: '/exame-de-consciencia' },
        ],
      },
      {
        id: 'sac-5',
        titulo: 'Confirmação e Unção',
        nivel: 3,
        ensino:
          'A Confirmação (Crisma) completa a graça do Batismo e nos une mais firmemente a Cristo pela efusão do Espírito Santo. A Unção dos Enfermos dá força e conforto a quem está em perigo por doença ou velhice.',
        ref: 'CIC 1285; 1316; 1514; 1520',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Quem é o ministro originário da Confirmação?',
            opcoes: ['O bispo', 'Qualquer leigo', 'O diácono'],
            correta: 0,
            explica: 'O ministro originário é o bispo; o presbítero pode confirmar com a faculdade devida (CIC 1312-1313).',
          },
          {
            tipo: 'vf',
            enunciado: 'A Unção dos Enfermos é só para quem está à beira da morte.',
            correta: false,
            explica: 'Não é só para quem está a ponto de morrer: o momento oportuno é quando o fiel começa a estar em perigo por doença ou velhice (CIC 1514).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quais sacramentos imprimem caráter e por isso não se repetem?',
            opcoes: ['Batismo, Confirmação e Ordem', 'Eucaristia, Penitência e Unção', 'Matrimônio e Ordem'],
            correta: 0,
            explica: 'Esses três conferem um caráter sacramental e não são repetidos (CIC 1121).',
          },
          {
            tipo: 'vf',
            enunciado: 'A Confirmação aumenta em nós os dons do Espírito Santo.',
            correta: true,
            explica: 'Entre seus efeitos, a Confirmação aumenta os dons do Espírito Santo (CIC 1303).',
          },
        ],
        leiaMais: [
          { titulo: 'A Confirmação e os dons do Espírito Santo', href: '/sacramentos/a-confirmacao-crisma-dons-do-espirito-santo' },
          { titulo: 'A Unção dos Enfermos', href: '/sacramentos/a-uncao-dos-enfermos-conforto-e-esperanca' },
        ],
      },
      {
        id: 'sac-6',
        titulo: 'Ordem e Matrimônio',
        nivel: 3,
        ensino:
          'A Ordem tem três graus: diaconato, presbiterado e episcopado. O Matrimônio é a aliança pela qual um homem e uma mulher constituem entre si uma comunhão de toda a vida; entre batizados, foi elevado por Cristo à dignidade de sacramento.',
        ref: 'CIC 1536; 1554; 1601',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Ordene os graus do sacramento da Ordem, do primeiro ao mais alto.',
            itens: ['Diaconato', 'Presbiterado', 'Episcopado'],
            explica: 'São os três graus do sacramento da Ordem (CIC 1554).',
          },
          {
            tipo: 'escolha',
            enunciado: 'No Matrimônio, quem são os ministros do sacramento?',
            opcoes: ['Os próprios noivos', 'O padre', 'Os padrinhos'],
            correta: 0,
            explica: 'Na Igreja latina, os esposos, como ministros da graça de Cristo, conferem mutuamente o sacramento; o sacerdote recebe o consentimento em nome da Igreja (CIC 1623; 1630).',
          },
          {
            tipo: 'vf',
            enunciado: 'A Igreja ensina que o Matrimônio validamente celebrado e consumado entre batizados é indissolúvel.',
            correta: true,
            explica: 'O vínculo matrimonial é estabelecido pelo próprio Deus e não pode ser dissolvido (CIC 1640).',
          },
          {
            tipo: 'escolha',
            enunciado: 'A declaração de nulidade matrimonial significa...',
            opcoes: ['Que o casamento nunca existiu validamente', 'Um divórcio católico', 'Uma punição aos esposos'],
            correta: 0,
            explica: 'A Igreja pode declarar a nulidade, isto é, que o matrimônio nunca existiu (CIC 1629).',
          },
        ],
        leiaMais: [
          { titulo: 'O sacramento da Ordem', href: '/sacramentos/o-sacramento-da-ordem-diaconato-presbiterado-e-episcopado' },
          { titulo: 'O sacramento do Matrimônio', href: '/sacramentos/o-sacramento-do-matrimonio-na-igreja-catolica' },
        ],
      },
    ],
  },

  // ───────────────────────── 4. VIDA EM CRISTO ─────────────────────────
  {
    id: 'moral',
    titulo: 'Vida em Cristo',
    resumo: 'Mandamentos, virtudes, pecado e caridade no dia a dia.',
    icone: 'Scale',
    licoes: [
      {
        id: 'moral-1',
        titulo: 'Os Dez Mandamentos',
        nivel: 1,
        ensino:
          'Os Dez Mandamentos resumem a lei de Deus. Os três primeiros falam do amor a Deus; os outros sete, do amor ao próximo. Jesus os resumiu em dois: amar a Deus sobre todas as coisas e ao próximo como a si mesmo.',
        ref: 'CIC 2055; 2067; Mt 22,37-40',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Coloque os três primeiros mandamentos na ordem.',
            itens: ['Amar a Deus sobre todas as coisas', 'Não tomar seu santo nome em vão', 'Guardar domingos e festas'],
            explica: 'Os três primeiros mandamentos tratam do amor a Deus (CIC 2067).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual é o quarto mandamento?',
            opcoes: ['Honrar pai e mãe', 'Não matar', 'Não furtar'],
            correta: 0,
            explica: 'O quarto mandamento abre a segunda tábua, sobre o amor ao próximo (CIC 2197).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue o mandamento ao número.',
            pares: [
              ['5º', 'Não matar'],
              ['7º', 'Não furtar'],
              ['8º', 'Não levantar falso testemunho'],
            ],
            explica: 'Segundo a fórmula catequética usada no Catecismo.',
          },
          {
            tipo: 'vf',
            enunciado: 'Jesus resumiu os mandamentos no amor a Deus e ao próximo.',
            correta: true,
            explica: 'Mt 22,37-40.',
          },
        ],
        leiaMais: [
          { titulo: 'Os Dez Mandamentos: guia completo', href: '/catecismo/os-dez-mandamentos-guia-completo-e-atualizado' },
          { titulo: 'Exame de consciência pelos Dez Mandamentos', href: '/exame-de-consciencia/exame-de-consciencia-pelos-dez-mandamentos' },
        ],
      },
      {
        id: 'moral-2',
        titulo: 'Os mandamentos da Igreja',
        nivel: 1,
        ensino:
          'Os mandamentos da Igreja garantem o mínimo indispensável de oração e esforço moral. São cinco: participar da Missa aos domingos e festas de preceito; confessar-se ao menos uma vez por ano; comungar ao menos na Páscoa; guardar jejum e abstinência nos dias estabelecidos; ajudar a Igreja em suas necessidades.',
        ref: 'CIC 2041-2043',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Quantos são os mandamentos da Igreja?',
            opcoes: ['Cinco', 'Dez', 'Sete'],
            correta: 0,
            explica: 'O Catecismo apresenta cinco mandamentos da Igreja (CIC 2042-2043).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Em que tempo a Igreja pede que se comungue ao menos uma vez?',
            opcoes: ['No tempo pascal', 'No Natal', 'No aniversário de Batismo'],
            correta: 0,
            explica: 'Receber a Eucaristia ao menos uma vez por ano, durante o tempo pascal (CIC 2042).',
          },
          {
            tipo: 'vf',
            enunciado: 'Participar da Missa aos domingos é um dos mandamentos da Igreja.',
            correta: true,
            explica: 'É o primeiro mandamento da Igreja (CIC 2042; 2180).',
          },
          {
            tipo: 'vf',
            enunciado: 'Ajudar a Igreja em suas necessidades é apenas um conselho, não um mandamento.',
            correta: false,
            explica: 'Os fiéis têm o dever de prover, cada um segundo suas possibilidades, às necessidades da Igreja (CIC 2043).',
          },
        ],
        leiaMais: [{ titulo: 'Por que ir à Missa todo domingo', href: '/duvidas-da-fe/por-que-temos-que-ir-a-missa-todo-domingo' }],
      },
      {
        id: 'moral-3',
        titulo: 'As virtudes',
        nivel: 2,
        ensino:
          'Virtude é uma disposição habitual e firme para fazer o bem. As virtudes teologais (fé, esperança e caridade) têm Deus como objeto. As virtudes cardeais (prudência, justiça, fortaleza e temperança) são as principais virtudes humanas.',
        ref: 'CIC 1803; 1805; 1812-1813',
        questoes: [
          {
            tipo: 'pares',
            enunciado: 'Ligue cada virtude ao seu grupo.',
            pares: [
              ['Esperança', 'Teologal'],
              ['Prudência', 'Cardeal'],
              ['Caridade', 'Teologal'],
              ['Temperança', 'Cardeal'],
            ],
            explica: 'Teologais: fé, esperança, caridade. Cardeais: prudência, justiça, fortaleza, temperança.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual é a maior das virtudes teologais?',
            opcoes: ['Caridade', 'Fé', 'Esperança'],
            correta: 0,
            explica: '"A maior delas é a caridade" (1Cor 13,13; CIC 1826).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quantas são as virtudes cardeais?',
            opcoes: ['Quatro', 'Três', 'Sete'],
            correta: 0,
            explica: 'Prudência, justiça, fortaleza e temperança (CIC 1805).',
          },
          {
            tipo: 'vf',
            enunciado: 'Virtude é uma disposição habitual e firme para fazer o bem.',
            correta: true,
            explica: 'Definição do CIC 1803.',
          },
        ],
        leiaMais: [
          { titulo: 'As virtudes teologais', href: '/catecismo/as-virtudes-teologais-fe-esperanca-caridade' },
          { titulo: 'As virtudes cardeais', href: '/catecismo/as-virtudes-cardeais-prudencia-justica-fortaleza-temperanca' },
        ],
      },
      {
        id: 'moral-4',
        titulo: 'Pecado mortal e venial',
        nivel: 2,
        ensino:
          'Para que um pecado seja mortal, são necessárias três condições ao mesmo tempo: matéria grave, pleno conhecimento e deliberado consentimento. O pecado venial enfraquece a caridade, mas não a destrói.',
        ref: 'CIC 1855; 1857; 1863',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Qual NÃO é uma das três condições do pecado mortal?',
            opcoes: ['Ter sido cometido em público', 'Matéria grave', 'Pleno conhecimento'],
            correta: 0,
            explica: 'As três condições são matéria grave, pleno conhecimento e deliberado consentimento (CIC 1857).',
          },
          {
            tipo: 'vf',
            enunciado: 'O pecado venial destrói a caridade no coração.',
            correta: false,
            explica: 'O pecado mortal destrói a caridade; o venial a deixa subsistir, embora a ofenda e fira (CIC 1855).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quem tem consciência de pecado grave, antes de comungar, deve...',
            opcoes: ['Confessar-se', 'Apenas rezar um Pai-Nosso', 'Comungar normalmente'],
            correta: 0,
            explica: 'Quem tem consciência de pecado grave deve receber o sacramento da Reconciliação antes de comungar (CIC 1385).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue cada pecado capital à virtude oposta.',
            pares: [
              ['Soberba', 'Humildade'],
              ['Avareza', 'Generosidade'],
              ['Ira', 'Paciência'],
            ],
            explica: 'Os sete pecados capitais estão no CIC 1866; a oposição às virtudes é ensinamento tradicional da catequese.',
          },
        ],
        leiaMais: [
          { titulo: 'Diferença entre pecado mortal e venial', href: '/duvidas-da-fe/qual-a-diferenca-entre-pecado-mortal-e-pecado-venial' },
          { titulo: 'Os pecados capitais e as virtudes opostas', href: '/catecismo/os-pecados-capitais-e-as-virtudes-opostas' },
        ],
      },
      {
        id: 'moral-5',
        titulo: 'As Bem-aventuranças',
        nivel: 3,
        ensino:
          'As Bem-aventuranças estão no centro da pregação de Jesus (Mt 5,3-12). Elas descrevem o rosto de Cristo e respondem ao desejo natural de felicidade que Deus colocou no coração humano.',
        ref: 'CIC 1716-1718',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Em que Evangelho estão as Bem-aventuranças do Sermão da Montanha?',
            opcoes: ['Mateus, capítulo 5', 'João, capítulo 3', 'Marcos, capítulo 16'],
            correta: 0,
            explica: 'Mt 5,3-12 (CIC 1716).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Complete: "Bem-aventurados os pobres em espírito, porque deles é..."',
            opcoes: ['o Reino dos Céus', 'a terra', 'a misericórdia'],
            correta: 0,
            explica: 'Mt 5,3.',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue cada Bem-aventurança à sua promessa.',
            pares: [
              ['Os mansos', 'possuirão a terra'],
              ['Os misericordiosos', 'alcançarão misericórdia'],
              ['Os puros de coração', 'verão a Deus'],
            ],
            explica: 'Mt 5,4.7.8.',
          },
          {
            tipo: 'vf',
            enunciado: 'As Bem-aventuranças respondem ao desejo natural de felicidade.',
            correta: true,
            explica: 'CIC 1718.',
          },
        ],
        leiaMais: [{ titulo: 'As Bem-aventuranças', href: '/catecismo/as-bem-aventurancas-o-caminho-da-felicidade-crista' }],
      },
      {
        id: 'moral-6',
        titulo: 'Obras de misericórdia',
        nivel: 3,
        ensino:
          'As obras de misericórdia são ações caritativas pelas quais socorremos o próximo em suas necessidades corporais e espirituais. São sete corporais e sete espirituais.',
        ref: 'CIC 2447',
        questoes: [
          {
            tipo: 'pares',
            enunciado: 'Ligue cada obra ao seu tipo.',
            pares: [
              ['Dar de comer a quem tem fome', 'Corporal'],
              ['Ensinar os que não sabem', 'Espiritual'],
              ['Visitar os enfermos', 'Corporal'],
              ['Rezar pelos vivos e pelos mortos', 'Espiritual'],
            ],
            explica: 'São sete obras corporais e sete espirituais (CIC 2447).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quantas são, ao todo, as obras de misericórdia?',
            opcoes: ['Catorze', 'Sete', 'Dez'],
            correta: 0,
            explica: 'Sete corporais mais sete espirituais.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual destas é uma obra de misericórdia espiritual?',
            opcoes: ['Perdoar as ofensas', 'Vestir os nus', 'Dar pousada aos peregrinos'],
            correta: 0,
            explica: 'Perdoar as ofensas é obra espiritual; as outras duas são corporais (CIC 2447).',
          },
          {
            tipo: 'vf',
            enunciado: 'A esmola aos pobres é um testemunho de caridade fraterna.',
            correta: true,
            explica: 'Dar esmola aos pobres é um dos principais testemunhos da caridade fraterna (CIC 2447).',
          },
        ],
        leiaMais: [{ titulo: 'A Doutrina Social da Igreja resumida', href: '/catecismo/a-doutrina-social-da-igreja-resumida' }],
      },
    ],
  },

  // ───────────────────────── 5. ORAÇÃO E LITURGIA ─────────────────────────
  {
    id: 'oracao',
    titulo: 'Oração e liturgia',
    resumo: 'Como rezar, a Missa e o ano litúrgico.',
    icone: 'HandHeart',
    licoes: [
      {
        id: 'oracao-1',
        titulo: 'O Pai-Nosso',
        nivel: 1,
        ensino:
          'O Pai-Nosso é a oração que o próprio Jesus ensinou. Ele contém sete pedidos e é chamado de "resumo de todo o Evangelho". Os três primeiros pedidos voltam-se para a glória do Pai; os quatro últimos, para as nossas necessidades.',
        ref: 'CIC 2759; 2761; 2803-2806',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Coloque os primeiros pedidos do Pai-Nosso na ordem.',
            itens: ['Santificado seja o vosso nome', 'Venha a nós o vosso Reino', 'Seja feita a vossa vontade'],
            explica: 'São os três pedidos voltados à glória do Pai (CIC 2804).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quantos pedidos tem o Pai-Nosso?',
            opcoes: ['Sete', 'Cinco', 'Dez'],
            correta: 0,
            explica: 'O Pai-Nosso tem sete pedidos (CIC 2803).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Como o Catecismo chama o Pai-Nosso, citando Tertuliano?',
            opcoes: ['Resumo de todo o Evangelho', 'Oração dos monges', 'Oração da noite'],
            correta: 0,
            explica: 'CIC 2761.',
          },
          {
            tipo: 'vf',
            enunciado: 'O Pai-Nosso foi ensinado diretamente por Jesus.',
            correta: true,
            explica: 'Mt 6,9-13 e Lc 11,2-4.',
          },
        ],
        leiaMais: [{ titulo: 'O Pai-Nosso: cada frase explicada', href: '/oracoes-do-dia-a-dia/o-pai-nosso-cada-frase-explicada' }],
      },
      {
        id: 'oracao-2',
        titulo: 'A Ave-Maria e o Terço',
        nivel: 1,
        ensino:
          'A Ave-Maria une a saudação do anjo e de Isabel a Maria (Lc 1,28.42) e o pedido da sua intercessão. No Terço, rezamos dezenas de Ave-Marias meditando os mistérios da vida de Jesus e de Maria.',
        ref: 'CIC 2676-2678; Lc 1,28.42',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'De onde vêm as primeiras palavras da Ave-Maria?',
            opcoes: ['Da saudação do anjo Gabriel e de Isabel', 'De um papa da Idade Média', 'Do livro dos Salmos'],
            correta: 0,
            explica: 'Lc 1,28 e Lc 1,42 (CIC 2676).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue o grupo de mistérios ao dia em que costuma ser rezado.',
            pares: [
              ['Gozosos', 'Segunda e sábado'],
              ['Dolorosos', 'Terça e sexta'],
              ['Gloriosos', 'Quarta e domingo'],
              ['Luminosos', 'Quinta'],
            ],
            explica: 'Distribuição proposta por São João Paulo II na carta Rosarium Virginis Mariae.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quantas Ave-Marias há em cada dezena?',
            opcoes: ['Dez', 'Sete', 'Cinco'],
            correta: 0,
            explica: 'Cada dezena tem um Pai-Nosso, dez Ave-Marias e o Glória.',
          },
          {
            tipo: 'vf',
            enunciado: 'No Terço, a ideia é só repetir orações, sem meditar.',
            correta: false,
            explica: 'O Rosário é oração que medita os mistérios de Cristo (CIC 2708; 971).',
          },
        ],
        leiaMais: [
          { titulo: 'Como rezar o Terço', href: '/como-rezar-o-terco' },
          { titulo: 'A Ave-Maria: significado e meditação', href: '/oracoes-do-dia-a-dia/a-ave-maria-significado-e-meditacao' },
        ],
      },
      {
        id: 'oracao-3',
        titulo: 'As partes da Missa',
        nivel: 2,
        ensino:
          'A Missa tem duas grandes partes, a Liturgia da Palavra e a Liturgia Eucarística, que formam um só ato de culto. Elas são precedidas pelos ritos iniciais e seguidas pelos ritos finais.',
        ref: 'CIC 1346',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Coloque as partes da Missa na ordem.',
            itens: ['Ritos iniciais', 'Liturgia da Palavra', 'Liturgia Eucarística', 'Ritos finais'],
            explica: 'Estrutura apresentada no CIC 1346 e na Instrução Geral do Missal Romano.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Em que parte da Missa acontece a consagração?',
            opcoes: ['Liturgia Eucarística', 'Liturgia da Palavra', 'Ritos iniciais'],
            correta: 0,
            explica: 'A consagração está na Oração Eucarística, coração da Liturgia Eucarística.',
          },
          {
            tipo: 'ordenar',
            enunciado: 'Ordene as leituras de uma Missa de domingo.',
            itens: ['Primeira leitura', 'Salmo responsorial', 'Segunda leitura', 'Evangelho'],
            explica: 'Aos domingos e solenidades há duas leituras, o salmo e o Evangelho.',
          },
          {
            tipo: 'vf',
            enunciado: 'Liturgia da Palavra e Liturgia Eucarística formam um só ato de culto.',
            correta: true,
            explica: 'CIC 1346.',
          },
        ],
        leiaMais: [
          { titulo: 'Como a Missa é dividida', href: '/duvidas-da-fe/como-a-missa-e-dividida-estrutura-e-partes-explicadas' },
          { titulo: 'Liturgia diária de hoje', href: '/liturgia-diaria' },
        ],
      },
      {
        id: 'oracao-4',
        titulo: 'O ano litúrgico',
        nivel: 2,
        ensino:
          'No ano litúrgico a Igreja celebra todo o mistério de Cristo. Ele começa no primeiro domingo do Advento e tem os tempos do Advento, Natal, Quaresma, Páscoa e Tempo Comum, cada um com sua cor litúrgica.',
        ref: 'CIC 1168-1171',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Quando começa o ano litúrgico?',
            opcoes: ['No primeiro domingo do Advento', 'Em 1º de janeiro', 'No domingo de Páscoa'],
            correta: 0,
            explica: 'O ano litúrgico começa com o Advento.',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue o tempo litúrgico à cor usada.',
            pares: [
              ['Tempo Comum', 'Verde'],
              ['Advento e Quaresma', 'Roxo'],
              ['Natal e Páscoa', 'Branco'],
              ['Pentecostes', 'Vermelho'],
            ],
            explica: 'Segundo a Instrução Geral do Missal Romano.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual é a maior solenidade do ano litúrgico?',
            opcoes: ['A Páscoa', 'O Natal', 'Pentecostes'],
            correta: 0,
            explica: 'A Páscoa é a "festa das festas", a "solenidade das solenidades" (CIC 1169).',
          },
          {
            tipo: 'vf',
            enunciado: 'A Quaresma prepara a celebração da Páscoa.',
            correta: true,
            explica: 'A Quaresma é o tempo de preparação para a Páscoa (CIC 540; 1438).',
          },
        ],
        leiaMais: [
          { titulo: 'O que representam as cores litúrgicas', href: '/duvidas-da-fe/o-que-representam-as-cores-liturgicas-da-missa' },
          { titulo: 'Calendário litúrgico', href: '/calendario-liturgico' },
        ],
      },
      {
        id: 'oracao-5',
        titulo: 'As formas de oração',
        nivel: 3,
        ensino:
          'A tradição cristã conhece três expressões principais da oração: a oração vocal, a meditação e a oração mental (contemplação). E várias formas: bênção e adoração, petição, intercessão, ação de graças e louvor.',
        ref: 'CIC 2626-2643; 2699-2724',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Qual NÃO é uma das três expressões da oração segundo o Catecismo?',
            opcoes: ['Oração mágica', 'Oração vocal', 'Meditação'],
            correta: 0,
            explica: 'As três expressões são oração vocal, meditação e oração mental (CIC 2699).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue cada forma de oração ao que ela faz.',
            pares: [
              ['Petição', 'Pedir algo para si'],
              ['Intercessão', 'Pedir pelos outros'],
              ['Ação de graças', 'Agradecer'],
              ['Louvor', 'Exaltar a Deus por quem Ele é'],
            ],
            explica: 'CIC 2629-2643.',
          },
          {
            tipo: 'vf',
            enunciado: 'A oração precisa sempre de muitas palavras.',
            correta: false,
            explica: 'A contemplação é um olhar de fé fixado em Jesus, um silêncio de amor (CIC 2715-2717).',
          },
          {
            tipo: 'escolha',
            enunciado: 'A Liturgia das Horas é...',
            opcoes: ['A oração pública da Igreja ao longo do dia', 'Uma devoção só para monges', 'A Missa rezada em horários fixos'],
            correta: 0,
            explica: 'É a oração pública da Igreja, que santifica o curso do dia (CIC 1174-1175).',
          },
        ],
        leiaMais: [
          { titulo: 'O que é a Liturgia das Horas', href: '/duvidas-da-fe/o-que-e-a-liturgia-das-horas-e-quem-deve-rezar' },
          { titulo: 'Orações do dia a dia', href: '/oracoes-do-dia-a-dia' },
        ],
      },
      {
        id: 'oracao-6',
        titulo: 'Sinais e gestos da liturgia',
        nivel: 3,
        ensino:
          'A liturgia usa sinais e símbolos: luz, água, óleo, incenso, gestos como ajoelhar-se e fazer o sinal da cruz. Por eles a Igreja exprime e vive a fé. O "Amém" significa "assim seja" e confirma a fé do que se ouviu ou rezou.',
        ref: 'CIC 1145-1152; 1061-1065',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'O que significa "Amém"?',
            opcoes: ['Assim seja / é verdade', 'Glória a Deus', 'Paz a vós'],
            correta: 0,
            explica: 'Em hebraico, "amém" vem da mesma raiz de "crer" e exprime solidez e fidelidade (CIC 1062).',
          },
          {
            tipo: 'vf',
            enunciado: 'Os sinais na liturgia são apenas decoração.',
            correta: false,
            explica: 'Por sinais e símbolos a Igreja exprime e realiza a ação de Deus (CIC 1145-1152).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O incenso que sobe na Missa simboliza principalmente...',
            opcoes: ['A oração que sobe a Deus', 'A purificação do ar', 'A riqueza da igreja'],
            correta: 0,
            explica: '"Suba a minha oração como incenso em vossa presença" (Sl 141,2).',
          },
          {
            tipo: 'vf',
            enunciado: 'Ajoelhar-se é um gesto de adoração e humildade.',
            correta: true,
            explica: 'Na liturgia, o corpo também reza: ajoelhar exprime adoração e penitência.',
          },
        ],
        leiaMais: [
          { titulo: 'O que é o Amém', href: '/duvidas-da-fe/o-que-e-o-amem-e-por-que-dizemos-na-missa' },
          { titulo: 'Por que existe incenso na Missa', href: '/duvidas-da-fe/por-que-existe-incenso-na-missa' },
        ],
      },
    ],
  },

  // ───────────────────────── 6. MARIA, SANTOS E VIDA ETERNA ─────────────────────────
  {
    id: 'maria',
    titulo: 'Maria, os santos e a vida eterna',
    resumo: 'Nossa Senhora, a comunhão dos santos e o que nos espera.',
    icone: 'Crown',
    licoes: [
      {
        id: 'maria-1',
        titulo: 'Maria, Mãe de Deus',
        nivel: 1,
        ensino:
          'Maria é verdadeiramente Mãe de Deus, porque é mãe de Jesus, que é Deus. O Concílio de Éfeso, em 431, proclamou esse título (Theotokos). Os católicos veneram Maria, mas adoram somente a Deus.',
        ref: 'CIC 495; 971',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'Por que Maria é chamada Mãe de Deus?',
            opcoes: ['Porque é mãe de Jesus, que é Deus', 'Porque existia antes de Deus', 'Por ser a maior das santas'],
            correta: 0,
            explica: 'Aquele que ela concebeu é o Filho eterno do Pai, verdadeiramente Deus (CIC 495).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Que Concílio proclamou Maria "Mãe de Deus"?',
            opcoes: ['Éfeso (431)', 'Trento (1545)', 'Vaticano II (1962)'],
            correta: 0,
            explica: 'O Concílio de Éfeso, em 431 (CIC 466; 495).',
          },
          {
            tipo: 'vf',
            enunciado: 'Os católicos adoram Maria.',
            correta: false,
            explica: 'O culto a Maria é de veneração e difere essencialmente do culto de adoração, prestado só a Deus (CIC 971).',
          },
          {
            tipo: 'vf',
            enunciado: 'Maria é modelo de fé para a Igreja.',
            correta: true,
            explica: 'Maria é para a Igreja modelo de fé e de caridade (CIC 967).',
          },
        ],
        leiaMais: [
          { titulo: 'Por que Maria é chamada Mãe de Deus', href: '/duvidas-da-fe/por-que-maria-e-chamada-de-mae-de-deus' },
          { titulo: 'Maria na Bíblia', href: '/devocoes-marianas/maria-na-biblia-todas-as-passagens-sobre-nossa-senhora' },
        ],
      },
      {
        id: 'maria-2',
        titulo: 'Os dogmas marianos',
        nivel: 1,
        ensino:
          'A Igreja professa quatro dogmas sobre Maria: Mãe de Deus, Virgindade perpétua, Imaculada Conceição (definida por Pio IX em 1854) e Assunção ao céu em corpo e alma (definida por Pio XII em 1950).',
        ref: 'CIC 490-493; 499; 966',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'A Imaculada Conceição significa que Maria...',
            opcoes: ['Foi preservada do pecado original desde a concepção', 'Concebeu Jesus sem pecado', 'Nunca morreu'],
            correta: 0,
            explica: 'Maria foi preservada imune de toda mancha do pecado original desde o primeiro instante da sua conceição (CIC 491).',
          },
          {
            tipo: 'pares',
            enunciado: 'Ligue o dogma ao Papa que o definiu.',
            pares: [
              ['Imaculada Conceição', 'Pio IX, 1854'],
              ['Assunção', 'Pio XII, 1950'],
            ],
            explica: 'CIC 491 e 966.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Em que dia se celebra a Imaculada Conceição?',
            opcoes: ['8 de dezembro', '15 de agosto', '12 de outubro'],
            correta: 0,
            explica: '8 de dezembro. A Assunção é em 15 de agosto; Nossa Senhora Aparecida, em 12 de outubro.',
          },
          {
            tipo: 'vf',
            enunciado: 'A Assunção significa que Maria foi levada ao céu em corpo e alma.',
            correta: true,
            explica: 'CIC 966.',
          },
        ],
        leiaMais: [{ titulo: 'Devoções marianas', href: '/devocoes-marianas' }],
      },
      {
        id: 'maria-3',
        titulo: 'A comunhão dos santos',
        nivel: 2,
        ensino:
          'A comunhão dos santos é a união de todos os fiéis em Cristo: os que caminham na terra, os que se purificam após a morte e os que já gozam da glória do céu. Por isso podemos pedir a intercessão dos santos e rezar pelos falecidos.',
        ref: 'CIC 954-958',
        questoes: [
          {
            tipo: 'escolha',
            enunciado: 'A comunhão dos santos une...',
            opcoes: ['Os fiéis da terra, do purgatório e do céu', 'Somente os santos canonizados', 'Somente os vivos'],
            correta: 0,
            explica: 'Os três estados da Igreja, unidos em Cristo (CIC 954).',
          },
          {
            tipo: 'vf',
            enunciado: 'É correto rezar pelos falecidos.',
            correta: true,
            explica: 'A Igreja, desde os primeiros tempos, honra a memória dos defuntos e oferece sufrágios por eles (CIC 958).',
          },
          {
            tipo: 'vf',
            enunciado: 'Pedir a intercessão de um santo tira a centralidade de Cristo.',
            correta: false,
            explica: 'Os santos intercedem por nós junto do Pai, apresentando os méritos de Cristo, único Mediador (CIC 956).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Qual dia a Igreja dedica à memória de todos os fiéis defuntos?',
            opcoes: ['2 de novembro', '1º de novembro', '25 de dezembro'],
            correta: 0,
            explica: '1º de novembro é Todos os Santos; 2 de novembro, Finados.',
          },
        ],
        leiaMais: [
          { titulo: 'A comunhão dos santos', href: '/catecismo/a-comunhao-dos-santos-significado-e-importancia' },
          { titulo: 'Por que os católicos rezam para os santos', href: '/duvidas-da-fe/por-que-os-catolicos-rezam-para-os-santos' },
        ],
      },
      {
        id: 'maria-4',
        titulo: 'Imagens e devoção',
        nivel: 2,
        ensino:
          'A veneração das imagens não contraria o mandamento que proíbe os ídolos. A honra prestada a uma imagem dirige-se a quem ela representa. Venera-se a pessoa representada; adora-se somente a Deus.',
        ref: 'CIC 2131-2132',
        questoes: [
          {
            tipo: 'vf',
            enunciado: 'Venerar uma imagem é o mesmo que adorá-la.',
            correta: false,
            explica: 'A honra prestada às imagens é veneração respeitosa, não adoração, que é devida só a Deus (CIC 2132).',
          },
          {
            tipo: 'escolha',
            enunciado: 'A honra prestada a uma imagem se dirige a...',
            opcoes: ['Quem ela representa', 'Ao material de que é feita', 'Ao artista que a fez'],
            correta: 0,
            explica: '"A honra prestada a uma imagem se dirige ao modelo original" (CIC 2132, citando São Basílio).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O que tornou possível representar Deus em imagens, segundo o Catecismo?',
            opcoes: ['A Encarnação do Filho de Deus', 'Uma decisão dos artistas', 'Os milagres eucarísticos'],
            correta: 0,
            explica: 'Ao encarnar-se, o Filho de Deus inaugurou uma nova "economia" das imagens (CIC 2131).',
          },
          {
            tipo: 'vf',
            enunciado: 'O culto às imagens foi defendido por um Concílio, o de Niceia II.',
            correta: true,
            explica: 'O Segundo Concílio de Niceia, em 787, justificou o culto dos ícones (CIC 2131).',
          },
        ],
        leiaMais: [{ titulo: 'Por que há imagens nas igrejas', href: '/duvidas-da-fe/por-que-os-catolicos-tem-imagens-e-estatuas-nas-igrejas' }],
      },
      {
        id: 'maria-5',
        titulo: 'Os Novíssimos',
        nivel: 3,
        ensino:
          'Os Novíssimos são as realidades últimas: morte, juízo, inferno e paraíso. Logo após a morte, cada um recebe o juízo particular. Quem morre na graça de Deus, mas ainda imperfeitamente purificado, passa pelo purgatório antes de entrar no céu.',
        ref: 'CIC 1021-1022; 1030; 1033',
        questoes: [
          {
            tipo: 'ordenar',
            enunciado: 'Coloque os Novíssimos na ordem tradicional.',
            itens: ['Morte', 'Juízo', 'Inferno', 'Paraíso'],
            explica: 'É a lista tradicional dos "quatro novíssimos" da catequese.',
          },
          {
            tipo: 'escolha',
            enunciado: 'O que é o purgatório?',
            opcoes: ['A purificação de quem morre na graça de Deus, mas imperfeitamente purificado', 'Uma segunda chance para quem rejeitou a Deus', 'Outro nome para o inferno'],
            correta: 0,
            explica: 'CIC 1030-1031.',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quando acontece o juízo particular?',
            opcoes: ['Logo após a morte', 'Só no fim do mundo', 'Ao longo da vida'],
            correta: 0,
            explica: 'Cada homem recebe na sua alma imortal a retribuição eterna logo após a morte, num juízo particular (CIC 1022).',
          },
          {
            tipo: 'vf',
            enunciado: 'A Igreja ensina a existência do inferno e sua eternidade.',
            correta: true,
            explica: 'CIC 1035.',
          },
        ],
        leiaMais: [
          { titulo: 'O purgatório: doutrina e fundamentos', href: '/catecismo/o-purgatorio-doutrina-e-fundamentos-biblicos' },
          { titulo: 'A vida eterna', href: '/catecismo/a-vida-eterna-o-que-a-igreja-ensina' },
        ],
      },
      {
        id: 'maria-6',
        titulo: 'A ressurreição da carne',
        nivel: 3,
        ensino:
          'Cremos na ressurreição da carne: no fim dos tempos, Deus dará a vida incorruptível aos nossos corpos, reunindo-os às almas. Cristo ressuscitado é a garantia da nossa ressurreição. Haverá o juízo final, quando Cristo voltar na glória.',
        ref: 'CIC 988-991; 997; 1038',
        questoes: [
          {
            tipo: 'vf',
            enunciado: 'Os católicos creem na reencarnação.',
            correta: false,
            explica: 'Não há "reencarnação" depois da morte: a vida humana é única (CIC 1013).',
          },
          {
            tipo: 'escolha',
            enunciado: 'O que acontecerá aos corpos no fim dos tempos?',
            opcoes: ['Serão ressuscitados e reunidos às almas', 'Desaparecerão para sempre', 'Voltarão em outras pessoas'],
            correta: 0,
            explica: 'Deus dará a vida incorruptível aos nossos corpos, reunindo-os às nossas almas (CIC 997).',
          },
          {
            tipo: 'escolha',
            enunciado: 'Quando acontecerá o juízo final?',
            opcoes: ['Na volta gloriosa de Cristo', 'No momento da morte de cada um', 'Já aconteceu'],
            correta: 0,
            explica: 'O juízo final acontecerá quando Cristo voltar na sua glória (CIC 1038-1040).',
          },
          {
            tipo: 'vf',
            enunciado: 'A ressurreição de Cristo é a garantia da nossa ressurreição.',
            correta: true,
            explica: 'Como Cristo ressuscitou verdadeiramente, assim também todos ressuscitarão (CIC 989).',
          },
        ],
        leiaMais: [{ titulo: 'O Credo Apostólico explicado', href: '/catecismo/o-credo-apostolico-cada-artigo-explicado' }],
      },
    ],
  },
];

/** Nivelamento: 3 perguntas por trilha (nível 1, 2 e 3). */
export const NIVELAMENTO: QuestaoNivelamento[] = [
  { trilha: 'deus', nivel: 1, enunciado: 'Quantas Pessoas há na Santíssima Trindade?', opcoes: ['Três', 'Uma', 'Duas', 'Não sei'], correta: 0 },
  { trilha: 'deus', nivel: 2, enunciado: 'Quantos livros tem a Bíblia católica?', opcoes: ['66', '73', '72', 'Não sei'], correta: 1 },
  { trilha: 'deus', nivel: 3, enunciado: 'O que apaga o pecado original?', opcoes: ['A Crisma', 'A Confissão', 'O Batismo', 'Não sei'], correta: 2 },

  { trilha: 'jesus', nivel: 1, enunciado: 'Jesus Cristo é...', opcoes: ['Um profeta', 'Verdadeiro Deus e verdadeiro homem', 'Um anjo', 'Não sei'], correta: 1 },
  { trilha: 'jesus', nivel: 2, enunciado: 'O que significa "católica"?', opcoes: ['Romana', 'Antiga', 'Universal', 'Não sei'], correta: 2 },
  { trilha: 'jesus', nivel: 3, enunciado: 'Qual foi o primeiro Concílio Ecumênico?', opcoes: ['Niceia', 'Trento', 'Vaticano II', 'Não sei'], correta: 0 },

  { trilha: 'sacramentos', nivel: 1, enunciado: 'Quantos são os sacramentos?', opcoes: ['Dois', 'Sete', 'Dez', 'Não sei'], correta: 1 },
  { trilha: 'sacramentos', nivel: 2, enunciado: 'Como se chama a conversão do pão no Corpo de Cristo?', opcoes: ['Transfiguração', 'Transubstanciação', 'Encarnação', 'Não sei'], correta: 1 },
  { trilha: 'sacramentos', nivel: 3, enunciado: 'Quais sacramentos não podem ser repetidos?', opcoes: ['Eucaristia e Penitência', 'Batismo, Confirmação e Ordem', 'Matrimônio e Unção', 'Não sei'], correta: 1 },

  { trilha: 'moral', nivel: 1, enunciado: 'Qual é o quarto mandamento?', opcoes: ['Não matar', 'Honrar pai e mãe', 'Não furtar', 'Não sei'], correta: 1 },
  { trilha: 'moral', nivel: 2, enunciado: 'Quais são as virtudes teologais?', opcoes: ['Prudência, justiça, fortaleza', 'Fé, esperança e caridade', 'Humildade e paciência', 'Não sei'], correta: 1 },
  { trilha: 'moral', nivel: 3, enunciado: 'Qual destas NÃO é condição do pecado mortal?', opcoes: ['Matéria grave', 'Pleno conhecimento', 'Ter testemunhas', 'Não sei'], correta: 2 },

  { trilha: 'oracao', nivel: 1, enunciado: 'Quem ensinou o Pai-Nosso?', opcoes: ['São Paulo', 'Jesus', 'Um papa', 'Não sei'], correta: 1 },
  { trilha: 'oracao', nivel: 2, enunciado: 'Quando começa o ano litúrgico?', opcoes: ['1º de janeiro', 'Na Páscoa', 'No 1º domingo do Advento', 'Não sei'], correta: 2 },
  { trilha: 'oracao', nivel: 3, enunciado: 'O que é a Liturgia das Horas?', opcoes: ['A oração pública da Igreja ao longo do dia', 'A Missa em horários fixos', 'Uma devoção só para monges', 'Não sei'], correta: 0 },

  { trilha: 'maria', nivel: 1, enunciado: 'Os católicos adoram Maria?', opcoes: ['Sim', 'Não, veneram; adoram só a Deus', 'Depende da festa', 'Não sei'], correta: 1 },
  { trilha: 'maria', nivel: 2, enunciado: 'O que é a comunhão dos santos?', opcoes: ['Só os santos canonizados', 'A união dos fiéis da terra, do purgatório e do céu', 'A Missa de Todos os Santos', 'Não sei'], correta: 1 },
  { trilha: 'maria', nivel: 3, enunciado: 'Quando acontece o juízo particular?', opcoes: ['No fim do mundo', 'Logo após a morte', 'Durante a vida', 'Não sei'], correta: 1 },
];

export const totalLicoes = TRILHAS.reduce((n, t) => n + t.licoes.length, 0);
export const licaoPorId = (id: string) => {
  for (const t of TRILHAS) {
    const l = t.licoes.find((x) => x.id === id);
    if (l) return { trilha: t, licao: l };
  }
  return null;
};
