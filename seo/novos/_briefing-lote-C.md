# Briefing dos lotes C (Casamento católico)

Leia antes: `_REGRAS.md`, `_modelo.json`, `_slugs-site.txt`, o seu lote em `_plano.json` (campo "foco") e a pesquisa em
`/tmp/claude-0/-home-claude/ea23e928-e04e-5f54-a90c-7293828e4fa2/scratchpad/pesquisa-casamento.md` (demanda, músicas por momento com fontes, rito, simbologia, documentos e normas, com fontes e o que varia por diocese).

## Público e objetivo
Noivos católicos brasileiros e suas famílias, organizando o casamento. Muita gente chega pelo Google com dúvida prática ("quantos padrinhos", "músicas para entrada da noiva", "leituras para casamento"). Primeiro parágrafo com a resposta direta e o termo principal em <strong>. Tom acolhedor, prático e fiel à Igreja, sem moralismo.

## Fidelidade (o mais importante)
- Só fatos da pesquisa ou confirmados em fonte confiável (CNBB, dioceses, vatican.va, Código de Direito Canônico, Catecismo, Planalto para leis). Use WebSearch/WebFetch para conferir o que não estiver na pesquisa.
- Separe sempre o que é norma da Igreja inteira, o que é norma de uma diocese (diga qual) e o que é costume. Quando variar, diga "confirme na sua paróquia".
- Nada de valores em reais, prazos ou números que não estejam em fonte. Nada de "o Papa proibiu" sem documento (o suposto decreto de Leão XIV sobre músicas não tem fonte: não repita, e onde fizer sentido diga que não há documento oficial conhecido).
- O Ritual brasileiro (tradução CNBB) não pode ser copiado: descreva as partes e parafraseie as fórmulas. Citações literais só da Bíblia (com referência) e de orações tradicionais.
- MÚSICAS: NUNCA reproduza letras, nem um verso. Cite só título, compositor ou intérprete (diga "interpretada por" quando a autoria não estiver confirmada) e explique por que combina com o momento. Use tabelas (<table>) para listas por momento quando ajudar. Diga quantas fontes citam quando isso for útil, sem inventar ranking.
- Leituras bíblicas: dê a referência e um resumo; pode citar 1 ou 2 versículos curtos entre aspas com referência.
- Orações dos fiéis e outras orações escritas por você: marque como "Sugestão" e não atribua a ninguém.

## Estrutura
A de `_REGRAS.md` (4 a 7 h2, pelo menos 2 em pergunta, FAQ com 3 ou 4 h3, Para aprofundar com 2 a 4 links internos de `_slugs-site.txt`, Fontes, frase final). Nos links internos, prefira artigos da própria seção /casamento/ (todos os slugs novos estão no fim de `_slugs-site.txt`) e os já existentes: /sacramentos/o-sacramento-do-matrimonio-na-igreja-catolica, /sacramentos/preparacao-para-o-matrimonio-catolico, /sacramentos/noivado-catolico-como-viver, /oracoes-do-dia-a-dia/oracao-pelo-casamento, /duvidas-da-fe/namoro-com-pessoa-de-outra-religiao.
Fontes: links externos só vatican.va (Catecismo, Código de Direito Canônico com os links de `_REGRAS.md`; documentos que você confirmou). Demais fontes pelo nome, sem link.
Tamanho: 1.100 a 1.800 palavras de conteúdo útil, sem enchimento.

## Proibições
Sem travessões (— ou –), sem " · ", sem "jornada", "mergulhar", "poderosa", "infalível", "garantido", "dia mais feliz da sua vida" e clichês de site de casamento. Sem h1, img, style, class.

## image_alt
Descreva uma pintura de arte sacra adequada (ex.: "Casamento da Virgem, pintura renascentista") ou uma foto (alianças sobre a Bíblia). Outra pessoa escolhe a imagem final.

## Saída
`seo/novos/lote-Ck.json` (k = seu lote). Grave a cada 2 artigos. No fim rode `python3 seo/novos/validar.py Ck` até "VALIDACAO OK". Não faça commit nem push. Devolva os slugs prontos e uma linha por artigo com dúvidas ou pontos que dependem de confirmação.
