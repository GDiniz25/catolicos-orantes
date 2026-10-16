# Reflexões da Bíblia, capítulo por capítulo

Site católico catolicosorantes.com.br. Cada capítulo da Bíblia ganha uma página própria (ex.: /biblia/mateus/5) com explicação da passagem e reflexão. Ela aparece no Plano de leitura da Bíblia e deve ser a melhor página em português para buscas como "Mateus 5 explicação", "reflexão de Mateus 5", "o que significa Mateus 5".

Público: católicos brasileiros comuns, muitos começando a ler a Bíblia. Tom didático, sereno, fiel ao Magistério da Igreja Católica. Frases curtas, português do Brasil.

## Fidelidade (o mais importante)
- Interpretação católica: a Bíblia lida na Tradição e no Magistério (Dei Verbum 12; Catecismo 109 a 119). Sentido literal primeiro (o que o texto diz no seu contexto), depois o sentido espiritual e a aplicação.
- Não invente. Fatos históricos, geográficos e culturais só se amplamente estabelecidos. Onde estudiosos divergem (autoria, datação), diga que há debate, sem tomar partido como se fosse certeza.
- Catecismo: cite número (CIC n.) SOMENTE se conferir o texto no site do Vaticano (https://www.vatican.va/archive/cathechism_po/index_new/prima-pagina-cic_po.html, use WebFetch nas páginas do índice). Se não conferir, não cite o número. Um ou dois números bem escolhidos por capítulo bastam; não é obrigatório.
- Padres da Igreja, santos e papas: só atribua uma ideia ou frase se tiver certeza da fonte (obra). Na dúvida, não cite. Nada de frases famosas apócrifas.
- Texto bíblico: a tradução da CNBB é protegida. NÃO copie trechos longos. Pode citar no máximo 1 ou 2 versículos curtos por capítulo entre aspas, com referência (ex.: Mt 5,3). O resto, com suas palavras (paráfrase).
- Paralelos: cite passagens paralelas e ligações com o Antigo/Novo Testamento só com referência correta.
- Liturgia: diga que o trecho é lido em tal domingo/festa só se tiver certeza; na dúvida, não diga.
- Sem moralismo e sem polêmica com outras igrejas. Temas difíceis (violência no AT, escravidão, pureza ritual, mulheres) explicados com o contexto e a leitura da Igreja, com serenidade.

## Estrutura (campo "html")
HTML permitido: p, h2, h3, ul, ol, li, strong, em, a, blockquote, br. Sem h1, img, style, class, travessões (— ou –), " · ", "mergulhar", "jornada", "poderosa".
1. Parágrafo inicial (2 a 4 frases): do que trata o capítulo, direto, com "{Livro} {cap}" em <strong>. É a resposta destacada no Google.
2. <h2>Contexto de {Livro} {cap}</h2>: onde o capítulo se situa no livro, quem fala, para quem, momento histórico. Breve.
3. <h2>Explicação de {Livro} {cap}</h2>: o capítulo por blocos, cada bloco com <h3>Versículos X a Y: tema</h3> (ou "Versículo X") cobrindo o capítulo inteiro em ordem, sem pular trechos. Explique o sentido, palavras-chave, costumes da época, ligações bíblicas. Este é o coração da página.
4. <h2>O que {Livro} {cap} ensina para a fé católica?</h2> (pergunta): pontos de doutrina e como a Igreja lê o texto (Catecismo, liturgia, sacramentos), com cuidado de fidelidade.
5. <h2>Reflexão para hoje</h2>: 2 a 4 parágrafos aplicando à vida (família, trabalho, oração, sofrimento), concreto, sem sermão.
6. <h2>Para rezar com {Livro} {cap}</h2>: <ul> com 2 ou 3 perguntas para meditar e um <blockquote> com uma oração curta própria, marcada antes com "Sugestão de oração:".
7. <h2>Fontes</h2><p>Bíblia Sagrada (tradução da CNBB); Catecismo da Igreja Católica (link acima, se citou); outros documentos usados pelo nome (link só se vatican.va com certeza).</p>
Links internos: pode linkar capítulos vizinhos e paralelos como /biblia/{livro-slug}/{cap} (slugs: nome do livro minúsculo, sem acento, espaços viram hífen: mateus, marcos, lucas, joao, atos-dos-apostolos, 1-corintios, cantico-dos-canticos, salmos...), e artigos do site SOMENTE da lista /home/claude/catolicos-orantes/seo/novos/_slugs-site.txt. Não use links externos fora de vatican.va (target="_blank" rel="noopener noreferrer").
Tamanho: 800 a 1.500 palavras, proporcional ao capítulo (capítulos longos e densos pedem mais). Sem enchimento e sem repetir ideias.

## Campos
Cada capítulo é um objeto:
{"livro": "mateus", "cap": 5, "titulo": "Mateus 5: explicação e reflexão das bem-aventuranças", "meta": "...", "html": "...", "faq": [{"q": "...", "a": "..."}]}
- titulo: até 60 caracteres, começando por "{Livro} {cap}" (ex.: "Mateus 5: as bem-aventuranças explicadas"); use o tema mais buscado do capítulo.
- meta: 120 a 155 caracteres, com "{Livro} {cap}", dizendo o que a página entrega.
- faq: 3 perguntas que as pessoas fazem sobre o capítulo, respostas de 1 a 3 frases (texto puro, sem HTML).

## Saída
Arquivo JSON (array de objetos) no caminho indicado na sua tarefa, em /home/claude/catolicos-orantes/src/data/biblia-reflexoes/. Grave o arquivo inteiro a cada 2 capítulos. Se já existir, mantenha os prontos e continue dos que faltam.
No fim rode `python3 /home/claude/catolicos-orantes/seo/biblia/validar.py ARQUIVO` até "VALIDACAO OK". Não faça commit nem push. Responda em português: capítulos prontos e uma linha com pontos de dúvida, se houver.
