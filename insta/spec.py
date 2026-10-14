# -*- coding: utf-8 -*-
# Especificação visual de cada peça. Chave: (dia índice 0..14, hora).
# reel: lista de cenas (imagem, texto, estilo). carrossel: lista de slides. imagem: título e subtítulo. stories: quadros.
NOV = ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º"]
NOV_TEMA = ["Confiar quando nada faz sentido", "Pela família", "Pelo trabalho e pelo sustento", "Pela saúde",
            "Pela conversão de alguém que você ama", "Pela paz no coração", "Pela vocação",
            "Pelos casos que parecem perdidos", "Gratidão"]
NOV_ORACAO = ["Glorioso apóstolo São Judas Tadeu,", "parente e amigo de Jesus,", "a Igreja vos invoca nas causas difíceis.",
              "Intercedei por mim junto ao Senhor", "nesta necessidade:", "(faça agora o seu pedido)",
              "Que eu aceite a vontade de Deus com confiança", "e não perca a esperança. Amém."]

S = {}

# ---------- 15/10 ----------
S[(0, "07h00")] = dict(fmt="reel", arquivo="15-10_07h_reel_so-deus-basta", cenas=[
  ("teresa", "Se hoje tudo parece fora do lugar, escuta isso.", "gancho"),
  ("teresa", "Nada te perturbe.\nNada te espante.", "oracao"),
  ("teresa", "Tudo passa.\nDeus não muda.", "oracao"),
  ("teresa", "A paciência tudo alcança.\nQuem tem a Deus nada lhe falta.", "oracao"),
  ("teresa", "Só Deus basta.", "oracao"),
  ("teresa", "Santa Teresa de Ávila,\nrogai por nós.", "final")])

S[(0, "12h00")] = dict(fmt="carrossel", arquivo="15-10_12h_carrossel_santa-teresa", img="teresa", slides=[
  "Ela foi a primeira mulher doutora da Igreja. E começou como uma freira distraída.",
  "Nasceu em Ávila, na Espanha, em 1515. Entrou no Carmelo aos 20 anos.",
  "Por quase 20 anos viveu uma fé morna. Ela mesma conta isso no Livro da Vida.",
  "A virada veio diante de uma imagem de Cristo muito chagado. Ela decidiu levar a oração a sério.",
  "Reformou o Carmelo e fundou 17 mosteiros, com São João da Cruz como companheiro na reforma.",
  "Para ela, oração é \"tratar de amizade com quem sabemos que nos ama\".",
  "Em 1970, São Paulo VI a declarou doutora da Igreja.\n\nEm que ponto da oração você está hoje?"])

S[(0, "19h30")] = dict(fmt="reel", arquivo="15-10_19h30_reel_rezar-pelo-futuro-conjuge", cenas=[
  ("tobias", "E se você rezasse hoje por alguém que ainda nem conhece?", "gancho"),
  ("tobias", "Rezar pelo futuro cônjuge não é esperar de braços cruzados.", "frase"),
  ("sposalizio", "\"Senhor, onde estiver a pessoa que preparas para mim, guarda-a no Teu amor.\"", "oracao"),
  ("sposalizio", "Quem reza antes,\nama melhor depois.", "frase"),
  ("sposalizio", "Comente AMÉM\ne reze isso todos os dias.", "final")])

S[(0, "Dia todo")] = dict(fmt="stories", arquivo="15-10_stories", img="teresa", quadros=[
  ("Você conhece Santa Teresa de Ávila?", "ENQUETE: Sim / Ainda não"),
  ("Novo post: Só Deus basta", "Compartilhe o reel das 7h aqui"),
  ("Ela dizia que oração é conversar com um amigo.", "CAIXINHA: Qual é a sua maior dificuldade para rezar?"),
  ("Conheça o santo de cada dia", "LINK: catolicosorantes.com.br/santo-do-dia"),
  ("Respondendo vocês", "Cole aqui as respostas da caixinha")])

# ---------- 16/10 ----------
S[(1, "07h00")] = dict(fmt="reel", arquivo="16-10_07h_reel_sagrado-coracao", cenas=[
  ("sagrado", "Jesus fez promessas a uma freira francesa.", "gancho"),
  ("sagrado", "Ela se chamava Margarida Maria Alacoque.\nHoje é o dia dela.", "frase"),
  ("sagrado", "\"Eis o Coração que tanto amou os homens.\"", "oracao"),
  ("sagrado", "\"Abençoarei as casas onde a imagem do meu Coração for exposta e honrada.\"", "oracao"),
  ("sagrado", "Você tem a imagem do Sagrado Coração em casa?\nComente onde ela fica.", "final")])

S[(1, "12h00")] = dict(fmt="imagem", arquivo="16-10_12h_imagem_sao-geraldo", img="visitacao",
  titulo="São Geraldo Majella, rogai pelas mães e pelos bebês que estão chegando.",
  sub="16 de outubro, dia de São Geraldo")

S[(1, "19h30")] = dict(fmt="reel", arquivo="16-10_19h30_reel_nao-se-apaixone", cenas=[
  ("tobias2", "Não se apaixone pelo que alguém promete.", "gancho"),
  ("tobias2", "Observe o que essa pessoa faz quando ninguém está vendo.", "frase"),
  ("tobias2", "Como trata a família.\nSe cumpre a palavra.\nSe reza.", "frase"),
  ("tobias2", "\"Pelos frutos os conhecereis.\"\nMateus 7,16", "final")])

S[(1, "Dia todo")] = dict(fmt="stories", arquivo="16-10_stories", img="sagrado", quadros=[
  ("Sexta-feira é dia de lembrar a Paixão de Jesus.", "ENQUETE: Você faz alguma penitência às sextas? Sim / Quero começar"),
  ("Novo post: a promessa do Sagrado Coração", "Compartilhe o reel das 7h aqui"),
  ("Sagrado Coração de Jesus, eu me entrego a Vós hoje.", ""),
  ("Por quem você quer que a gente reze hoje?", "CAIXINHA: Deixe aqui o primeiro nome"),
  ("Rezando por todos os nomes que vocês enviaram", "Grave um vídeo curto aqui")])

# ---------- 17/10 ----------
S[(2, "07h00")] = dict(fmt="reel", arquivo="17-10_07h_reel_sou-trigo-de-deus", cenas=[
  ("inacio", "Ele foi jogado às feras...", "gancho"),
  ("inacio", "...e falou do próprio martírio com palavras da Eucaristia.", "frase"),
  ("eucaristia", "\"Sou trigo de Deus e serei moído pelos dentes das feras para me tornar pão puro de Cristo.\"", "oracao"),
  ("inacio", "Santo Inácio de Antioquia, bispo e mártir.\nCarta aos Romanos, por volta do ano 107.", "frase"),
  ("inacio", "Ele já chamava a Igreja de católica.", "final")])

S[(2, "12h00")] = dict(fmt="carrossel", arquivo="17-10_12h_carrossel_igreja-antes-do-ano-110", img="ceia", slides=[
  "Antes do ano 110, os cristãos já faziam isso. E muita gente acha que é invenção católica.",
  "Chamavam a Igreja de católica.\n\nSanto Inácio, Carta aos Esmirnenses 8",
  "Acreditavam que a Eucaristia é a carne de Cristo.\n\nCarta aos Esmirnenses 7",
  "Tinham bispos, presbíteros e diáconos.\n\nCarta aos Magnésios 6",
  "Reuniam-se no domingo, o dia do Senhor.\n\nCarta aos Magnésios 9",
  "Reconheciam um lugar especial à Igreja de Roma.\n\nCarta aos Romanos, saudação",
  "A fé que você professa no domingo é a mesma dos mártires."])

S[(2, "19h30")] = dict(fmt="reel", arquivo="17-10_19h30_reel_sabado-com-maria", cenas=[
  ("virgem_oracao", "Hoje é sábado.\nDia de Nossa Senhora.", "gancho"),
  ("virgem_oracao", "Sabe por quê?", "frase"),
  ("virgem_oracao", "Porque no Sábado Santo, quando os discípulos fugiram, ela continuou crendo.", "frase"),
  ("virgem_oracao", "Maria, ensina-me a esperar como tu esperaste.", "oracao"),
  ("virgem_oracao", "Reze uma Ave-Maria agora\ne comente AMÉM.", "final")])

S[(2, "Dia todo")] = dict(fmt="stories", arquivo="17-10_stories", img="fe_rafael", quadros=[
  ("Colérico ou sanguíneo?", "ENQUETE: Colérico / Sanguíneo"),
  ("Melancólico ou fleumático?", "ENQUETE: Melancólico / Fleumático"),
  ("Cada temperamento ama de um jeito.", "Colérico decide. Sanguíneo encanta. Melancólico aprofunda. Fleumático acalma."),
  ("Descubra o seu temperamento", "LINK: catolicosorantes.com.br/teste-de-temperamento"),
  ("Fez o teste?", "Mande o print do resultado por direct")])

# ---------- 18/10 ----------
S[(3, "07h00")] = dict(fmt="reel", arquivo="18-10_07h_reel_dai-a-cesar", cenas=[
  ("mateus", "Armaram uma armadilha para Jesus.\nE Ele saiu dela com uma frase.", "gancho"),
  ("mateus", "Perguntaram se era lícito pagar imposto a César.", "frase"),
  ("mateus", "Se dissesse sim, trairia o povo.\nSe dissesse não, seria denunciado aos romanos.", "frase"),
  ("mateus", "\"Dai a César o que é de César,\ne a Deus o que é de Deus.\"\nMt 22,21", "oracao"),
  ("mateus", "A moeda tinha a imagem de César.\nVocê tem a imagem de quem?\nGn 1,27", "final")])

S[(3, "12h00")] = dict(fmt="imagem", arquivo="18-10_12h_imagem_dia-das-missoes", img="mateus",
  titulo="Você também é missionário. Mesmo sem sair de casa.",
  sub="Dia Mundial das Missões\n\"Ide e fazei discípulos de todas as nações.\" Mt 28,19")

S[(3, "19h30")] = dict(fmt="reel", arquivo="18-10_19h30_reel_casal-na-missa", cenas=[
  ("cana", "Casal que vai à Missa junto...", "gancho"),
  ("cana", "...aprende a se ajoelhar antes de discutir.", "frase"),
  ("cana", "...escuta a mesma Palavra e leva para casa.", "frase"),
  ("cana", "...lembra toda semana que o amor tem um terceiro: Deus.", "frase"),
  ("cana", "Marque quem você quer levar à Missa no próximo domingo.", "final")])

S[(3, "Dia todo")] = dict(fmt="stories", arquivo="18-10_stories", img="missa", quadros=[
  ("Bom domingo! Já foi à Missa?", "ENQUETE: Sim / Vou mais tarde"),
  ("Evangelho de hoje: Mt 22,15-21", "LINK: catolicosorantes.com.br/liturgia-diaria"),
  ("Qual frase da homilia ficou com você?", "CAIXINHA"),
  ("Dia das Missões: reze uma Ave-Maria por um missionário.", ""),
  ("Amanhã começa a Novena de São Judas Tadeu", "ADESIVO DE LEMBRETE: Novena de São Judas, 19/10")])

# ---------- Novena 19 a 27 ----------
for i in range(9):
    dia = 4 + i
    d = 19 + i
    cenas = [("judas" if i % 2 == 0 else "judas_greco", f"{NOV[i]} dia da Novena\nde São Judas Tadeu", "gancho"),
             ("judas" if i % 2 == 0 else "judas_greco", f"Intenção de hoje:\n{NOV_TEMA[i]}", "frase")]
    for k in range(0, len(NOV_ORACAO), 2):
        cenas.append(("judas" if i % 2 == 0 else "judas_greco", "\n".join(NOV_ORACAO[k:k+2]), "oracao"))
    cenas.append(("judas" if i % 2 == 0 else "judas_greco", "Pai-Nosso, Ave-Maria e Glória.", "oracao"))
    prox = f"Amanhã rezamos o {NOV[i+1]} dia." if i < 8 else "Amanhã é a festa de São Judas!"
    cenas.append(("judas" if i % 2 == 0 else "judas_greco", f"Comente o seu pedido.\n{prox}", "final"))
    S[(dia, "06h30")] = dict(fmt="reel", arquivo=f"{d}-10_06h30_reel_novena-sao-judas-dia-{i+1}", cenas=cenas)

# ---------- 19/10 ----------
S[(4, "12h00")] = dict(fmt="carrossel", arquivo="19-10_12h_carrossel_quem-e-sao-judas", img="judas", slides=[
  "Por que São Judas é o santo das causas impossíveis?",
  "Ele foi um dos doze apóstolos.\nNão é Judas Iscariotes, o traidor.",
  "Lucas o chama de Judas de Tiago. Mateus e Marcos o chamam de Tadeu.",
  "A tradição o reconhece como autor da Carta de São Judas, no Novo Testamento.",
  "Por causa do nome, muitos evitavam pedir sua intercessão. Ficou conhecido como o santo esquecido.",
  "A devoção popular o tornou o santo dos casos difíceis e desesperados.",
  "Festa: 28 de outubro, com São Simão.\nA novena começou hoje. Reze com a gente."])

S[(4, "19h30")] = dict(fmt="reel", arquivo="19-10_19h30_reel_amor-verdadeiro", cenas=[
  (None, "Amor verdadeiro sempre encontra um caminho...\nou isso só existe nos filmes?", "preto"),
  ("sposalizio", "Encontra.", "frase"),
  ("sposalizio", "Quando os dois procuram o caminho de Deus primeiro.", "frase"),
  ("sposalizio", "\"Buscai primeiro o Reino de Deus.\"\nMt 6,33", "final")])

S[(4, "Dia todo")] = dict(fmt="stories", arquivo="19-10_stories", img="judas", quadros=[
  ("Hoje começa a Novena de São Judas Tadeu", "ENQUETE: Vou rezar / Vou rezar com a família"),
  ("1º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Qual é o seu pedido para São Judas?", "CAIXINHA"),
  ("Planeje os 9 dias", "LINK: catolicosorantes.com.br/planejador-de-novena"),
  ("Salve no destaque", "Crie o destaque \"Novena São Judas\"")])

# ---------- 20/10 ----------
S[(5, "12h00")] = dict(fmt="reel", arquivo="20-10_12h_reel_terco-em-60s", cenas=[
  ("rosario", "Você reza o terço errado?\nTalvez esteja pulando uma parte.", "gancho"),
  ("rosario", "Começa no crucifixo:\nsinal da cruz e Creio.", "frase"),
  ("rosario", "Conta grande: Pai-Nosso.\nTrês contas: três Ave-Marias.\nGlória.", "frase"),
  ("dolorosos", "Cada dezena: anuncie o mistério, Pai-Nosso, 10 Ave-Marias, Glória e a oração de Fátima.", "frase"),
  ("dolorosos", "No final: Salve-Rainha.\nHoje é terça: mistérios dolorosos.", "final")])

S[(5, "19h30")] = dict(fmt="carrossel", arquivo="20-10_19h30_carrossel_pronto-para-namorar", img="tobias", slides=[
  "Você está pronto(a) para namorar?\nNão é sobre idade.",
  "Você não precisa de alguém para se sentir inteiro(a).",
  "Você tem vida de oração própria, que não depende de ninguém.",
  "Você sabe o que quer: um namoro com rumo ao casamento.",
  "Você aceita ouvir um \"não\" sem perder a paz.",
  "Você já perdoou as feridas do último relacionamento, ou está tratando delas.",
  "Quer descobrir como você ama?\nFaça o quiz afetivo católico. Link na bio."])

S[(5, "Dia todo")] = dict(fmt="stories", arquivo="20-10_stories", img="rosario", quadros=[
  ("Hoje às 21h tem terço ao vivo", "ADESIVO DE LEMBRETE: Terço ao vivo, 21h"),
  ("2º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Você reza o terço todo dia?", "ENQUETE: Sim / Às vezes / Quero começar"),
  ("Ao vivo agora: mistérios dolorosos", "Entre na live"),
  ("Obrigado a quem rezou com a gente!", "")])

# ---------- 21/10 ----------
S[(6, "12h00")] = dict(fmt="reel", arquivo="21-10_12h_reel_sao-jose-futuro-namoro", cenas=[
  ("jose", "Você sabia?", "gancho"),
  ("jose", "São José foi o homem que Deus escolheu para cuidar de Maria e de Jesus.", "frase"),
  ("jose", "Ele sabe o que é amar com pureza, trabalhar e proteger.", "frase"),
  ("jose", "\"São José, prepara meu coração e o coração de quem Deus tem para mim.\"", "oracao"),
  ("jose", "Comente SÃO JOSÉ\ne reze toda quarta com a gente.", "final")])

S[(6, "19h30")] = dict(fmt="carrossel", arquivo="21-10_19h30_carrossel_mortal-ou-venial", img="pedro_lagrimas", slides=[
  "Nem todo pecado é igual. E saber disso muda a sua confissão.",
  "Pecado mortal tem 3 condições juntas: matéria grave, pleno conhecimento e deliberado consentimento.\n\nCatecismo 1857",
  "Se falta uma delas, o pecado é venial.",
  "O pecado mortal rompe a amizade com Deus e pede a confissão antes de comungar.\n\nCatecismo 1385",
  "O pecado venial enfraquece a caridade, mas não a destrói.\n\nCatecismo 1863",
  "Os veniais também podem ser confessados, e a Igreja recomenda isso.\n\nCatecismo 1458",
  "Prepare sua próxima confissão com o exame de consciência guiado. Link na bio."])

S[(6, "Dia todo")] = dict(fmt="stories", arquivo="21-10_stories", img="jose", quadros=[
  ("Quarta-feira é dia de São José", "CAIXINHA: Qual pedido você entrega a São José hoje?"),
  ("3º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Qual era a profissão de São José?", "QUIZ: Carpinteiro / Pescador / Pastor"),
  ("Resposta: carpinteiro", "\"Não é ele o filho do carpinteiro?\" Mt 13,55"),
  ("Novo reel: São José e o seu futuro namoro", "Compartilhe o reel das 12h aqui")])

# ---------- 22/10 ----------
S[(7, "10h00")] = dict(fmt="reel", arquivo="22-10_10h_reel_nao-tenhais-medo", cenas=[
  ("jp2", "22 de outubro de 1978.", "gancho"),
  ("jp2", "Na Missa de início do pontificado, ele disse:", "frase"),
  ("jp2", "\"Não tenhais medo!\nAbri, ou melhor, escancarai as portas a Cristo!\"", "oracao"),
  ("jp2", "Por isso hoje é o dia de São João Paulo II.", "frase"),
  ("jp2", "Que porta você ainda não abriu para Cristo?", "final")])

S[(7, "19h30")] = dict(fmt="carrossel", arquivo="22-10_19h30_carrossel_jp2-amor", img="lava_pes", slides=[
  "O papa que mais falou sobre o amor humano.",
  "Antes de ser papa, como padre Karol Wojtyła, acompanhou muitos jovens casais.",
  "Escreveu o livro \"Amor e Responsabilidade\", em 1960.",
  "Como papa, fez 129 catequeses sobre o corpo e o amor: a Teologia do Corpo (1979 a 1984).",
  "A ideia central: o corpo revela que fomos feitos para nos doar.",
  "Para ele, o contrário de amar não é odiar: é usar o outro.\n\nO seu namoro é doação ou uso?"])

S[(7, "Dia todo")] = dict(fmt="stories", arquivo="22-10_stories", img="caridade", quadros=[
  ("Você demonstra amor mais com...", "ENQUETE: Palavras / Atitudes"),
  ("4º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Existem jeitos diferentes de amar e de se apegar.", "Conhecer o seu evita muita dor."),
  ("Quiz afetivo católico", "LINK: app.catolicosorantes.com.br/quiz"),
  ("Mandou o resultado por direct?", "A gente responde com uma dica")])

# ---------- 23/10 ----------
S[(8, "12h00")] = dict(fmt="reel", arquivo="23-10_12h_reel_faz-anos-sem-confessar", cenas=[
  ("confissao", "Faz anos que você não se confessa?\nAssista até o fim.", "gancho"),
  ("confissao", "O padre não vai se assustar.\nEle já ouviu de tudo.", "frase"),
  ("confissao", "Ele não pode contar nada a ninguém.\nÉ o sigilo sacramental.\nCatecismo 1467", "frase"),
  ("prodigo", "Comece assim:\n\"Padre, faz muito tempo que não me confesso e quero voltar.\"", "oracao"),
  ("prodigo", "O filho pródigo não precisou de discurso.\nO pai correu até ele.\nLc 15,20", "final")])

S[(8, "19h30")] = dict(fmt="imagem", arquivo="23-10_19h30_imagem_limite-e-cuidado", img="tobias2",
  titulo="Limite é cuidado.", sub="Quem respeita seus limites respeita seu coração.")

S[(8, "Dia todo")] = dict(fmt="stories", arquivo="23-10_stories", img="confissao", quadros=[
  ("Quando foi sua última confissão?", "ENQUETE: Este mês / Este ano / Faz tempo"),
  ("5º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("3 passos", "Exame. Arrependimento. Propósito."),
  ("Exame de consciência guiado", "LINK: catolicosorantes.com.br/exame-de-consciencia"),
  ("Mande sua dúvida sobre confissão", "CAIXINHA: Respondo amanhã")])

# ---------- 24/10 ----------
S[(9, "12h00")] = dict(fmt="carrossel", arquivo="24-10_12h_carrossel_duvidas-confissao", img="madalena", slides=[
  "Vocês perguntaram sobre confissão. A Igreja responde.",
  "\"Esqueci um pecado. E agora?\"\n\nSe esqueceu sem querer, ele foi perdoado junto. Diga na próxima confissão.",
  "\"Posso me confessar com qualquer padre?\"\n\nSim, com qualquer padre que tenha a faculdade de ouvir confissões.",
  "\"Tenho vergonha.\"\n\nO padre está ali em nome de Cristo. A vergonha passa, a paz fica.",
  "\"Preciso dizer detalhes?\"\n\nDiga a espécie do pecado grave e o número aproximado de vezes, sem detalhes desnecessários.\n\nCódigo de Direito Canônico, cânon 988",
  "Mais dúvidas? O site tem artigos sobre cada uma delas. Link na bio."])

S[(9, "19h30")] = dict(fmt="reel", arquivo="24-10_19h30_reel_maria-discerniu", cenas=[
  ("anunciacao_leo", "Maria fez uma pergunta antes de dizer sim.", "gancho"),
  ("anunciacao_leo", "\"Como acontecerá isso?\"\nLc 1,34", "oracao"),
  ("anunciacao", "Perguntar não é falta de fé.\nÉ discernimento.", "frase"),
  ("anunciacao", "\"Faça-se em mim segundo a tua palavra.\"\nLc 1,38", "oracao"),
  ("anunciacao", "Antes do seu próximo sim,\nreze e pergunte.", "final")])

S[(9, "Dia todo")] = dict(fmt="stories", arquivo="24-10_stories", img="madonna_sasso", quadros=[
  ("Qual é o seu título favorito de Nossa Senhora?", "CAIXINHA"),
  ("6º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Vocês perguntaram, a Igreja responde", "Compartilhe o carrossel das 12h aqui"),
  ("Consagração a Nossa Senhora em 33 dias", "LINK: catolicosorantes.com.br/consagracao-a-nossa-senhora"),
  ("Os títulos mais citados", "Cole aqui as respostas da caixinha")])

# ---------- 25/10 ----------
S[(10, "10h00")] = dict(fmt="reel", arquivo="25-10_10h_reel_frei-galvao", cenas=[
  ("madonna_sasso", "O primeiro santo nascido no Brasil.", "gancho"),
  ("madonna_sasso", "Frei Galvão nasceu em Guaratinguetá (SP), em 1739.", "frase"),
  ("madonna_sasso", "Foi franciscano e construiu o Mosteiro da Luz, em São Paulo.", "frase"),
  ("virgem_oracao", "As pílulas de Frei Galvão são papeizinhos com uma oração a Nossa Senhora.", "frase"),
  ("madonna_sasso", "Bento XVI o canonizou em São Paulo,\nem 11 de maio de 2007.", "frase"),
  ("madonna_sasso", "Comente a sua cidade.\nSanto Antônio de Sant'Ana Galvão, rogai por nós.", "final")])

S[(10, "12h00")] = dict(fmt="carrossel", arquivo="25-10_12h_carrossel_maior-mandamento", img="trindade", slides=[
  "Jesus resumiu a Bíblia inteira em 2 frases.",
  "Um doutor da Lei perguntou: qual é o maior mandamento?\n\nMt 22,36",
  "\"Amarás o Senhor teu Deus de todo o teu coração, de toda a tua alma e de todo o teu entendimento.\"\n\nMt 22,37",
  "\"Amarás o teu próximo como a ti mesmo.\"\n\nMt 22,39",
  "\"Desses dois mandamentos dependem toda a Lei e os Profetas.\"\n\nMt 22,40",
  "Desafio da semana: um gesto de amor a Deus e um ao próximo por dia.\n\nComente o seu."])

S[(10, "19h30")] = dict(fmt="reel", arquivo="25-10_19h30_reel_comunidade", cenas=[
  ("tobias", "Católicos solteiros, comentem:\ncidade, idade e santo de devoção.", "gancho"),
  ("tobias", "Curta o comentário de quem também leva a fé a sério.", "frase"),
  ("tobias", "Só uma regra: respeito.\nIsso aqui é lugar de católico.", "frase"),
  ("tobias", "Quer ir além do comentário?\nA comunidade do app é feita para isso.\nLink na bio.", "final")])

S[(10, "Dia todo")] = dict(fmt="stories", arquivo="25-10_stories", img="madonna_sasso", quadros=[
  ("Hoje é dia de Frei Galvão no Brasil", "ENQUETE: Já tomou as pílulas de Frei Galvão? Sim / Nunca"),
  ("7º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Evangelho de hoje: Mt 22,34-40", "LINK: catolicosorantes.com.br/liturgia-diaria"),
  ("Comente lá: cidade, idade e santo", "Compartilhe o reel das 19h30 aqui"),
  ("Olha de onde vocês são!", "Cole aqui prints dos comentários, sem expor ninguém")])

# ---------- 26/10 ----------
S[(11, "12h00")] = dict(fmt="reel", arquivo="26-10_12h_reel_causa-impossivel", cenas=[
  ("esperanca", "Para Deus, nada é impossível.\nLc 1,37", "gancho"),
  ("esperanca", "Mas Ele não é uma máquina de pedidos.", "frase"),
  ("esperanca", "Às vezes a resposta é sim.\nÀs vezes é espera.\nÀs vezes é algo melhor do que você pediu.", "frase"),
  ("judas", "O santo das causas impossíveis ensina a confiar no tempo de Deus.", "final")])

S[(11, "19h30")] = dict(fmt="carrossel", arquivo="26-10_19h30_carrossel_feridas", img="madalena", slides=[
  "As feridas que ninguém vê, mas que definem os seus relacionamentos.",
  "Medo de ser abandonado(a): você aceita qualquer coisa para não ficar só.",
  "Medo de se entregar: você se afasta quando a relação fica séria.",
  "Necessidade de aprovação: você muda quem é para agradar.",
  "A graça cura, mas também usa meios humanos: oração, sacramentos e acompanhamento.",
  "Se você se viu aqui, o espaço de acolhimento do app pode ajudar. Link na bio."])

S[(11, "Dia todo")] = dict(fmt="stories", arquivo="26-10_stories", img="judas_greco", quadros=[
  ("Faltam 2 dias para São Judas", "ADESIVO DE CONTAGEM REGRESSIVA: 28/10, 0h"),
  ("8º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Compartilhe a novena com quem precisa de um milagre", ""),
  ("Já recebeu uma graça por intercessão de São Judas?", "CAIXINHA: Conte aqui"),
  ("Obrigado por compartilharem", "As respostas vão para o post do dia 28")])

# ---------- 27/10 ----------
S[(12, "12h00")] = dict(fmt="imagem", arquivo="27-10_12h_imagem_vespera-sao-judas", img="judas_greco",
  titulo="Amanhã, 28 de outubro: festa de São Judas Tadeu.", sub="Apóstolo de Jesus e padroeiro das causas difíceis.")

S[(12, "19h30")] = dict(fmt="reel", arquivo="27-10_19h30_reel_quem-quer-construir", cenas=[
  ("tobias", "Quem quer construir não foge da conversa.", "gancho"),
  ("tobias", "Fé. Filhos. Dinheiro.\nFamília. Castidade.", "frase"),
  ("tobias", "Se esses assuntos dão briga hoje, imagina depois do altar.", "frase"),
  ("sposalizio", "Namoro é para conversar sobre o que importa.", "final")])

S[(12, "Dia todo")] = dict(fmt="stories", arquivo="27-10_stories", img="judas", quadros=[
  ("Hoje é o 9º e último dia da novena", "ENQUETE: Rezei todos os dias / Quase todos"),
  ("9º dia da novena", "Compartilhe o reel das 6h30 aqui"),
  ("Amanhã: Missa e agradecimento", ""),
  ("A história de São Judas", "LINK: catolicosorantes.com.br/santo-do-dia"),
  ("Falta 1 dia", "ADESIVO DE CONTAGEM REGRESSIVA")])

# ---------- 28/10 ----------
S[(13, "06h30")] = dict(fmt="reel", arquivo="28-10_06h30_reel_festa-sao-judas", cenas=[
  ("judas_greco", "28 de outubro.\nDia de São Judas Tadeu.", "gancho"),
  ("judas", "Apóstolo de Jesus e mártir.", "frase")] +
  [("judas", "\n".join(NOV_ORACAO[k:k+2]), "oracao") for k in range(0, len(NOV_ORACAO), 2)] +
  [("judas_greco", "Comente o seu pedido.\nÀs 21h rezamos por todos eles.", "final")])

S[(13, "12h00")] = dict(fmt="carrossel", arquivo="28-10_12h_carrossel_como-pedir-uma-graca", img="judas", slides=[
  "Você pediu uma graça a São Judas. E agora?",
  "Os santos não substituem Deus. Eles rezam conosco e por nós, como amigos que já chegaram ao Céu.\n\nCatecismo 956",
  "Continue pedindo com fé e perseverança.\n\n\"Orar sempre, sem desanimar.\" Lc 18,1",
  "Acolha a resposta de Deus, mesmo quando ela for diferente do que você pediu.",
  "Agradeça: participe da Missa e, se puder, ajude alguém em necessidade.",
  "Conte nos comentários a graça que você recebeu."])

S[(13, "19h30")] = dict(fmt="reel", arquivo="28-10_19h30_reel_como-cristo-ama-a-igreja", cenas=[
  ("lava_pes", "Nenhum homem deveria conquistar uma mulher se não estiver disposto a cuidar dela como Cristo cuida da Igreja.", "gancho"),
  ("lava_pes", "\"Maridos, amai as vossas mulheres, como Cristo amou a Igreja.\"\nEf 5,25", "final")])

S[(13, "Dia todo")] = dict(fmt="stories", arquivo="28-10_stories", img="judas_greco", quadros=[
  ("Feliz dia de São Judas Tadeu!", ""),
  ("Reze com a gente", "Compartilhe o reel das 6h30 aqui"),
  ("Vai à Missa hoje?", "ENQUETE: Sim / Vou rezar em casa"),
  ("21h: rezando pelos pedidos", "Entre na live"),
  ("Obrigado por estes 9 dias", "Na próxima semana: Todos os Santos e Finados")])

# ---------- 29/10 ----------
S[(14, "07h00")] = dict(fmt="reel", arquivo="29-10_07h_reel_melhor-que-conto-de-fadas", cenas=[
  (None, "O amor que Deus prepara é melhor do que os de contos de fadas.", "preto"),
  ("cana", "Porque conto de fadas termina no casamento.", "frase"),
  ("cana", "O amor que vem de Deus começa nele.", "final")])

S[(14, "12h00")] = dict(fmt="carrossel", arquivo="29-10_12h_carrossel_santos-e-finados", img="todos_santos", slides=[
  "1º e 2 de novembro não são a mesma coisa.",
  "1º de novembro: Solenidade de Todos os Santos. Celebramos todos os que já estão no Céu, conhecidos ou não.",
  "2 de novembro: Comemoração de Todos os Fiéis Defuntos. Rezamos pelos que morreram.",
  "A Igreja ensina que existe purificação depois da morte para quem morreu na graça de Deus, mas ainda precisa ser purificado.\n\nCatecismo 1030",
  "Por isso rezamos pelos mortos e oferecemos Missas por eles.\n\nCatecismo 1032",
  "Em 2026, 1º de novembro cai num domingo e 2 de novembro numa segunda.",
  "Faça uma lista de quem você vai lembrar no dia 2."])

S[(14, "19h30")] = dict(fmt="reel", arquivo="29-10_19h30_reel_descubra-seu-santo", cenas=[
  ("todos_santos", "Todo católico tem um santo que parece ter sido escolhido para ele.", "gancho"),
  ("trindade", "Qual é o seu?", "frase"),
  ("todos_santos", "O teste está no site:\ncatolicosorantes.com.br/descubra-seu-santo", "frase"),
  ("trindade", "Faça o teste e comente o santo que apareceu para você.", "final")])

S[(14, "Dia todo")] = dict(fmt="stories", arquivo="29-10_stories", img="todos_santos", quadros=[
  ("Foram 15 dias rezando juntos", "ENQUETE: Novena / Santos"),
  ("Qual tema mais te ajudou?", "ENQUETE: Namoro / Dúvidas da fé"),
  ("Para continuar todo dia", "Trilhas de oração no app, um passo por dia"),
  ("Jornada de oração", "LINK: app.catolicosorantes.com.br/oracao"),
  ("Que tema você quer ver na próxima quinzena?", "CAIXINHA")])

POOLS = {'15-10_12h_carrossel_santa-teresa': ['teresa', 'teresa', 'virgem_oracao', 'dolorosos', 'teresa', 'fe_rafael', 'teresa'], '17-10_12h_carrossel_igreja-antes-do-ano-110': ['ceia', 'inacio', 'eucaristia', 'missa', 'ceia', 'inacio', 'eucaristia'], '19-10_12h_carrossel_quem-e-sao-judas': ['judas', 'judas_greco', 'judas', 'judas_greco', 'judas', 'judas_greco', 'judas'], '20-10_19h30_carrossel_pronto-para-namorar': ['tobias', 'sposalizio', 'oracao_familia', 'cana', 'tobias2', 'virgem_oracao', 'sposalizio'], '21-10_19h30_carrossel_mortal-ou-venial': ['pedro_lagrimas', 'confissao', 'prodigo', 'eucaristia', 'madalena', 'confissao', 'pedro_lagrimas'], '22-10_19h30_carrossel_jp2-amor': ['jp2', 'sposalizio', 'cana', 'lava_pes', 'caridade', 'tobias'], '24-10_12h_carrossel_duvidas-confissao': ['confissao', 'prodigo', 'pedro_lagrimas', 'madalena', 'confissao', 'prodigo'], '25-10_12h_carrossel_maior-mandamento': ['trindade', 'mateus', 'fe_rafael', 'caridade', 'lava_pes', 'trindade'], '26-10_19h30_carrossel_feridas': ['madalena', 'prodigo', 'pedro_lagrimas', 'esperanca', 'sagrado', 'oracao_familia'], '28-10_12h_carrossel_como-pedir-uma-graca': ['judas', 'judas_greco', 'esperanca', 'virgem_oracao', 'eucaristia', 'judas'], '29-10_12h_carrossel_santos-e-finados': ['todos_santos', 'trindade', 'finados', 'finados', 'missa', 'todos_santos', 'trindade']}
for _k, _p in S.items():
    if _p.get('arquivo') in POOLS: _p['imgs'] = POOLS[_p['arquivo']]

exec(open(__file__.replace('spec.py','stories.py') if '__file__' in globals() else 'stories.py', encoding='utf-8').read())
for _d, _q in ST.items():
    for _k, _p in S.items():
        if _k[0] == _d and _p['fmt'] == 'stories': _p['quadros'] = _q
