# Novos artigos do Católicos Orantes

Público: católicos brasileiros que pesquisam no Google ou perguntam a assistentes de IA. Tom: didático, direto, sereno, acolhedor, fiel ao Magistério da Igreja Católica Apostólica Romana. Português do Brasil, frases curtas.

## Regra número 1: não inventar
- Só escreva o que é doutrina, prática ou história amplamente estabelecida e verificável. Na dúvida, não escreva.
- Números do Catecismo (CIC), cânones do Código de Direito Canônico (CDC), datas, nomes de documentos e citações bíblicas: use SOMENTE se tiver certeza. Se não tiver certeza do número, cite o documento sem número.
- Nada de estatísticas, depoimentos, "estudos mostram", milagres não reconhecidos ou promessas ("oração infalível", "poderosa", "garantida"). Nunca prometa resultado de oração.
- Citações literais: apenas da Bíblia (indique a referência, ex.: Fl 4,6-7) e de orações tradicionais da Igreja com o texto usual no Brasil. Não atribua frases a santos ou papas se não tiver certeza absoluta do texto.
- Orações novas, escritas por você, só se marcadas como "Sugestão de oração" e em linguagem simples, sem atribuir a ninguém.
- Temas que tocam saúde (ansiedade, luto, gula etc.): diga com clareza que a fé não substitui acompanhamento médico ou psicológico quando necessário.
- Quando o briefing do lote trouxer fatos (ex.: Papa Leão XIV), use SOMENTE esses fatos.

## Estrutura de cada artigo (HTML no campo content)
1. Primeiro parágrafo: responde direto à pergunta do título em 2 ou 3 frases, com o termo principal em <strong>. Bom para resposta destacada do Google e das IAs.
2. 4 a 7 seções <h2>; pelo menos 2 h2 em forma de pergunta terminando em "?". Use <h3> dentro das seções quando ajudar.
3. Use listas (<ul>/<ol>) para passos e itens; <blockquote> para citações bíblicas e textos de oração; <table> quando comparar (opcional).
4. Seção <h2>Perguntas frequentes</h2> com 3 ou 4 <h3> (perguntas como as pessoas buscam) e respostas em <p> de 1 a 3 frases.
5. Seção <h2>Para aprofundar</h2> com 2 a 4 links internos <a href="/categoria/slug">Título</a> em <ul>, SOMENTE para endereços da lista _slugs-site.txt.
6. Seção final <h2>Fontes</h2><p>...</p>: documentos usados. Links permitidos:
   - Catecismo: https://www.vatican.va/archive/cathechism_po/index_new/prima-pagina-cic_po.html
   - Código de Direito Canônico: https://www.vatican.va/archive/cod-iuris-canonici/portuguese/codex-iuris-canonici_po.pdf
   - outros documentos em vatican.va apenas com URL que você tem certeza; na dúvida, sem link.
   Links externos com target="_blank" rel="noopener noreferrer". Bíblia: "Bíblia Sagrada (tradução da CNBB)" sem link.
   Termine com a frase exata: "As explicações deste artigo não substituem o acompanhamento de um sacerdote."
7. Tamanho: 1.100 a 1.800 palavras de conteúdo real, rico e útil (exemplos práticos, passos, explicações), sem enrolação e sem repetir a mesma ideia.

HTML permitido: p, h2, h3, ul, ol, li, strong, em, a, table, thead, tbody, tr, th, td, blockquote, br. Sem h1, img, style ou class.

## Estilo
- Sem travessões ("—" ou "–") em lugar nenhum. Use ponto, vírgula ou dois-pontos.
- Sem jargão vazio, sem "neste artigo vamos", sem "mergulhar", sem "jornada", sem exclamações em excesso.
- Título: até 60 caracteres, termo de busca no início, só a primeira letra maiúscula e nomes próprios.
- meta_description: 120 a 155 caracteres, com o termo principal, dizendo o que a página entrega.
- excerpt: até 160 caracteres, diferente da meta.
- image_alt: descrição curta e neutra de uma imagem de arte sacra adequada ao tema.

## Saída
Arquivo JSON (array) `lote-X.json` com objetos: slug, category, title, meta_description, excerpt, image_alt, content. Use exatamente os slugs e categorias do plano. Grave aos poucos (a cada 2 ou 3 artigos, regrave o arquivo inteiro) para não perder trabalho.
Ao final rode: `python3 validar.py X` e corrija até dar "VALIDACAO OK".
Se o arquivo já existir, carregue-o, mantenha os artigos prontos e escreva só os que faltam.
