# Dados das ferramentas (JSON)

Mesmas regras de _REGRAS.md quanto a NÃO INVENTAR, tom e travessões (proibidos). Português do Brasil.
Textos com HTML só podem usar: p, ul, ol, li, strong, em, a, blockquote, br. Links internos só da lista _slugs-site.txt.
Datas de festa: use o calendário romano geral (ou o costume do Brasil quando for diferente, dizendo isso). Se não tiver certeza da data, omita.

## padroeiros.json
Array. Um objeto por item da lista abaixo, nesta ordem:
{ "slug": "padroeiro-dos-medicos", "titulo": "Padroeiro dos médicos", "grupo": "profissao" | "causa" | "lugar",
  "santos": [ { "nome": "São Lucas Evangelista", "festa": "18 de outubro", "link": "/santos-e-oracoes/..." (opcional, só se existir) } ],
  "resumo": "1 frase direta respondendo quem é o padroeiro (até 160 caracteres)",
  "texto": "<p>...</p> 200 a 320 palavras: por que esse santo é padroeiro, quem declarou (só se tiver certeza), como pedir intercessão, sugestão de prática",
  "invocacao": "São Lucas, rogai por nós." }
Lista (use exatamente estes santos; se algum fato do motivo não for certo, fale só do que é certo):
profissao: médicos (São Lucas; São Cosme e São Damião), enfermeiros e doentes nos hospitais (São Camilo de Léllis; São João de Deus), professores (São João Batista de La Salle), estudantes (São Tomás de Aquino), jornalistas e escritores (São Francisco de Sales), músicos (Santa Cecília), advogados (Santo Ivo), bombeiros (São Floriano), policiais (São Miguel Arcanjo), motoristas e viajantes (São Cristóvão), trabalhadores (São José Operário, 1º de maio), donas de casa e cozinheiras (Santa Marta), cozinheiros (São Lourenço), agricultores (Santo Isidoro Lavrador), pescadores (São Pedro), dentistas (Santa Apolônia), farmacêuticos (São Cosme e São Damião), párocos (São João Maria Vianney), catequistas (São Carlos Borromeu), seminaristas e jovens (São Luís Gonzaga), carpinteiros (São José), contadores e bancários (São Mateus), artistas e pintores (São Lucas, segundo a tradição), arquitetos e pedreiros (São Tomé), militares (São Jorge, devoção popular; dizer que no Brasil não há padroeiro oficial único das Forças Armadas se não tiver certeza: melhor omitir essa afirmação), comunicadores e internet (não use Santo Isidoro de Sevilha como oficial; diga que não há padroeiro oficial da internet e que é popular a devoção a São Carlo Acutis e São Maximiliano Kolbe para a comunicação; Kolbe é tradicionalmente lembrado pelos meios de comunicação/imprensa).
causa: causas impossíveis (São Judas Tadeu; Santa Rita de Cássia), objetos perdidos (Santo Antônio), casamento e noivos (Santo Antônio, devoção popular no Brasil), famílias (Sagrada Família), mães que rezam pelos filhos (Santa Mônica), gestantes e partos (São Geraldo Majella; Santa Gianna Beretta Molla), crianças (São Nicolau, tradição), jovens (São João Bosco; São Luís Gonzaga), doentes de câncer (São Peregrino Laziosi), saúde mental (Santa Dinfna), olhos e visão (Santa Luzia), garganta (São Brás, bênção da garganta em 3 de fevereiro), boa morte (São José), desempregados e pão (São Caetano de Thiene, devoção popular no Brasil em 7 de agosto), tempestades (Santa Bárbara), epidemias (São Sebastião; São Roque), animais e ecologia (São Francisco de Assis), missões (Santa Teresinha; São Francisco Xavier), proteção contra o mal (São Miguel Arcanjo; São Bento), causas urgentes (Santo Expedito, devoção popular; não afirme fatos históricos incertos da vida dele).
lugar: Brasil (Nossa Senhora da Conceição Aparecida), América Latina (Nossa Senhora de Guadalupe), Europa (São Bento e os copadroeiros: Santos Cirilo e Metódio, Santa Brígida, Santa Catarina de Sena, Santa Teresa Benedita da Cruz), Igreja universal (São José, desde 1870).

## glossario.json
Array de 120 a 140 termos católicos que as pessoas buscam, em ordem alfabética:
{ "termo": "Advento", "slug": "advento", "definicao": "2 a 4 frases, claras e exatas", "link": "/... (opcional, só da lista)" }
Cubra: liturgia (ambão, antífona, homilia, ofertório, prefácio, epiclese, doxologia, Kyrie, Aleluia, Missal, lecionário, sacrário, presbitério, cálice, patena, casula, estola...), sacramentos e doutrina (graça, transubstanciação, sacramental, indulgência, purgatório, dogma, magistério, encíclica, exortação apostólica, motu proprio, concílio, Tradição, catecúmeno, crisma, viático, absolvição, penitência...), hierarquia (diácono, presbítero, bispo, arcebispo, cardeal, núncio, pároco, vigário, diocese, paróquia, prelazia, conclave, Santa Sé...), devoção (novena, ladainha, jaculatória, terço, rosário, escapulário, medalha, procissão, romaria, promessa...), tempos e festas (Advento, Quaresma, Tríduo Pascal, Pentecostes, Tempo Comum, solenidade, festa, memória...).

## nomes.json
Array de 80 nomes próprios comuns no Brasil ligados a santos (masculinos e femininos: Ana, Antônio, Bárbara, Bento, Bernardo, Carlos, Catarina, Cecília, Clara, Cristina, Davi, Domingos, Edith? não; use nomes de uso comum), em ordem alfabética:
{ "nome": "Clara", "slug": "clara", "genero": "f" | "m",
  "origem": "latim" | "grego" | "hebraico" | "germânico" | ... ,
  "significado": "luminosa, brilhante" ou null se você não tiver certeza da etimologia,
  "santos": [ { "nome": "Santa Clara de Assis", "festa": "11 de agosto", "link": "/santos-e-oracoes/..." opcional } ] (1 a 3 santos ou beatos com esse nome, só com festa certa),
  "texto": "<p>...</p> 100 a 180 palavras: o nome, o santo principal em 2 ou 3 frases, por que é uma boa escolha católica para o Batismo (Catecismo 2156 a 2159 sobre o nome cristão)" }
Somente etimologias amplamente aceitas. Nada de "nome de origem incerta" inventado como certo.

## exames.json
Objeto com 4 chaves: "casados", "jovens", "criancas", "primeira-confissao". Cada uma:
{ "titulo": "Exame de consciência para casados", "descricao": "meta de 120 a 155 caracteres", "intro": "<p>...</p> 120 a 200 palavras",
  "secoes": [ { "titulo": "1º mandamento: amar a Deus sobre todas as coisas", "perguntas": ["Deixei de rezar...?", ...] } ],
  "conselhos": "<p>...</p> como se confessar depois, 80 a 150 palavras, link para /exame-de-consciencia/como-fazer-uma-boa-confissao-passo-a-passo se existir na lista" }
Seções pelos 10 mandamentos (na forma catequética usada no Brasil) e, para adultos, também os deveres próprios do estado (deveres de esposos e pais; estudos, namoro e internet para jovens). Para crianças e primeira confissão: linguagem simples, perguntas curtas, sem temas impróprios para a idade. Perguntas na primeira pessoa, 4 a 8 por seção. Fiel à moral católica, sem escrúpulo nem dureza.

## consagracao.json
Preparação de 33 dias para a consagração total a Jesus por Maria segundo São Luís Maria Grignion de Montfort (Tratado da Verdadeira Devoção), seguida do dia da consagração:
{ "etapas": [ { "id": "preliminar", "nome": "Doze dias de esvaziamento do espírito do mundo", "dias": [1,12], "oracoes": ["Veni Creator Spiritus", "Ave Maris Stella", "Magnificat", "Glória ao Pai"], "texto": "<p>...</p>" },
    { "id": "semana1", "nome": "Primeira semana: conhecimento de si mesmo", "dias": [13,19], ...},
    { "id": "semana2", "nome": "Segunda semana: conhecimento da Santíssima Virgem", "dias": [20,26], ... },
    { "id": "semana3", "nome": "Terceira semana: conhecimento de Jesus Cristo", "dias": [27,33], ... } ],
  "dias": [ { "dia": 1, "tema": "...", "leitura": "referência (Mt 5,1-12; Imitação de Cristo, livro I, cap. 1; Tratado da Verdadeira Devoção, n. ...) só se tiver certeza", "meditacao": "<p>...</p> 120 a 200 palavras, original, simples", "proposito": "uma frase prática" } ... 33 dias ],
  "dia_consagracao": { "texto": "<p>...</p> o que fazer no dia: confissão (antes ou no período), comunhão, ato de consagração (remeter ao artigo /devocoes-marianas/a-consagracao-a-nossa-senhora-segundo-sao-luis-de-montfort se estiver na lista), gesto de oferta" },
  "aviso": "<p>As orações indicadas para cada etapa seguem o esquema mais difundido; edições do Tratado podem trazer pequenas variações.</p>" }
Para as orações das semanas, use o esquema mais difundido: preliminar (Veni Creator, Ave Maris Stella, Magnificat, Glória); semana 1 (Ladainha do Espírito Santo, Ladainha de Nossa Senhora, Ave Maris Stella); semana 2 (Ladainha do Espírito Santo, Ladainha de Nossa Senhora, Ave Maris Stella, oração a Maria de São Luís de Montfort); semana 3 (Ladainha do Espírito Santo, Ave Maris Stella, Ladainha do Santíssimo Nome de Jesus, oração a Jesus de São Luís de Montfort, "Ó Jesus que viveis em Maria"). Não reproduza textos longos das orações; só os nomes.

## via-sacra.json
14 estações da Via Sacra tradicional:
{ "estacoes": [ { "n": 1, "titulo": "Jesus é condenado à morte", "leitura": "Mc 15,12-15 (referência só se tiver certeza)", "meditacao": "<p>...</p> 90 a 150 palavras, original", "oracao": "Sugestão de oração: ... (1 a 2 frases)" } ],
  "abertura": "<p>...</p>", "encerramento": "<p>...</p>" }
O versículo entre as estações é fixo e será colocado pelo site: "Nós vos adoramos, Senhor Jesus Cristo, e vos bendizemos. Porque pela vossa santa cruz remistes o mundo."

## temperamento.json
Teste dos quatro temperamentos (não é doutrina nem diagnóstico; ferramenta de autoconhecimento usada na tradição espiritual).
{ "afirmacoes": [ { "texto": "Gosto de assumir a liderança quando algo precisa ser feito.", "temperamento": "colerico" } ... 32 afirmações, 8 por temperamento, misturadas, curtas, do dia a dia ],
  "resultados": { "colerico": { "nome": "Colérico", "resumo": "1 frase", "forcas": ["..."], "desafios": ["..."], "virtude_chave": "Mansidão e humildade", "conselhos": ["5 conselhos espirituais práticos"], "oracao": "Sugestão de oração: ...", "artigo": "/duvidas-da-fe/temperamento-colerico" }, "sanguineo": {...}, "melancolico": {...}, "fleumatico": {...} } }
