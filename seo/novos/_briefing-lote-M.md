# Briefing dos lotes M (milagres eucarísticos do catálogo de Carlo Acutis)

Leia antes: `_REGRAS.md`, `_modelo.json`, `_slugs-site.txt` e o seu lote em `_plano.json`. Cada item do plano traz `arquivo_catalogo` (texto do painel da exposição "Milagres Eucarísticos no mundo", idealizada por São Carlo Acutis) e `painel` (link público do painel).

## Fonte e fidelidade (o mais importante)
- Leia o `arquivo_catalogo` inteiro. Ele tem duas partes: "TEXTO DA PAGINA" (texto do site, às vezes com espaços quebrados no meio das palavras e acentos estragados) e "OCR DO PAINEL" (leitura automática da imagem, com erros). Reconstrua o sentido com cuidado. Quando um nome, data ou número estiver ilegível ou ambíguo, NÃO chute: confirme em fonte confiável (WebSearch/WebFetch: site oficial do santuário, paróquia ou diocese, Vatican News, ACI Digital, enciclopédias de referência) ou deixe de fora.
- Só escreva fatos que estejam no catálogo ou em fonte confiável que você consultou. Nada de detalhes inventados para encher texto.
- O texto do catálogo é protegido: escreva com as suas palavras. Não copie frases nem traduza parágrafos inteiros. Não reproduza inscrições longas.
- Tom sóbrio: "segundo o relato", "conta a tradição", "o catálogo registra". Nunca "comprovado pela ciência", "prova irrefutável", "inexplicável" como certeza. Exames científicos: só o que a fonte diz, atribuído a quem fez.
- Reconhecimento da Igreja: diga exatamente o que a fonte informa (bispo que aprovou o culto, bula, festa, indulgências). Se a fonte não menciona aprovação formal, diga que o catálogo não menciona decreto de reconhecimento. Não chame de "reconhecido" o que não foi.
- Relatos medievais que acusam judeus de profanar hóstias (ex.: Paris 1290, Bruxelas 1370, Poznań, Deggendorf e similares): apresente como relato da época, com cuidado. Diga com clareza que acusações desse tipo contra judeus foram comuns na Idade Média, alimentaram perseguições e hoje são reconhecidas como injustas, e que a Igreja rejeita todo antissemitismo (Concílio Vaticano II, declaração Nostra Aetate, n. 4). Se houver posição oficial local (ex.: a arquidiocese de Bruxelas em 1968 e 1977), confirme em fonte e cite. Nunca reproduza linguagem hostil.
- Relíquia hoje: diga onde está e se ainda existe, só se a fonte disser. Se foi perdida ou destruída, diga.

## Objetivo de SEO
Ser a melhor página em português para "milagre eucarístico de {cidade}" e variações. Título até 60 caracteres começando por "Milagre eucarístico de {Cidade}" (use o `titulo_sugerido` como base; pode acrescentar um complemento curto se couber). Primeiro parágrafo com a resposta direta: o que aconteceu, quando, onde, e onde está a relíquia hoje (se a fonte disser), com o termo principal em <strong>.

## Estrutura sugerida (adapte aos fatos disponíveis)
1. Parágrafo inicial.
2. `<h2>O que aconteceu em {Cidade}?</h2>`: o relato, em ordem, com nomes e datas confirmados.
3. `<h2>Onde está a relíquia hoje?</h2>` ou `<h2>Como é a devoção hoje?</h2>`: igreja, festa, procissão, peregrinação (só fatos).
4. `<h2>A Igreja reconheceu o milagre de {Cidade}?</h2>`: o que a fonte diz.
5. `<h2>O que o milagre de {Cidade} ensina sobre a Eucaristia?</h2>`: ligação com a fé na presença real (Catecismo da Igreja Católica, n. 1374 a 1377; Jo 6,51-56; 1Cor 11,23-29). Breve, sem sermão, e lembrando que a fé na presença real não depende de milagres (a Igreja não obriga a crer em revelações ou prodígios particulares).
6. `<h2>Perguntas frequentes</h2>` com 3 ou 4 <h3>.
7. `<h2>Para aprofundar</h2>`: 2 a 4 links internos de `_slugs-site.txt`. Sempre inclua /milagres-eucaristicos/carlo-acutis-catalogacao-milagres-eucaristicos e, quando fizer sentido, outro milagre do mesmo país ou época (há links novos no fim do arquivo de slugs) ou /milagres-eucaristicos/o-que-a-igreja-diz-sobre-os-milagres-eucaristicos.
8. `<h2>Fontes</h2><p>...</p>`: SEMPRE o painel: `<a href="{painel}" target="_blank" rel="noopener noreferrer">Milagres Eucarísticos no mundo: catálogo da exposição de São Carlo Acutis</a>`; o Catecismo (link de `_REGRAS.md`); a Bíblia sem link; outras fontes consultadas pelo nome (sem link, a não ser vatican.va). Termine com a frase final obrigatória.

Tamanho: 750 a 1.300 palavras. O tamanho segue a quantidade de fatos. Melhor um texto de 800 palavras certo do que 1.300 com enchimento. Não repita a mesma ideia.

## Proibições (validar.py confere parte delas)
Sem travessões (— ou –), sem " · ", sem "jornada", "mergulhar", "poderosa", "infalível", "garantido". Sem h1, img, style, class. Datas no formato brasileiro.

## image_alt
Escreva algo neutro como "Igreja de {nome} em {cidade}, onde se guarda a relíquia do milagre eucarístico" (outra pessoa escolhe a foto e ajusta o texto).

## Saída
`seo/novos/lote-Mk.json` (k = número do seu lote). Grave a cada 2 ou 3 artigos. No fim rode `python3 seo/novos/validar.py Mk` até "VALIDACAO OK". Não faça commit nem push.
Ao terminar, devolva: slugs prontos, e para cada artigo uma linha com os pontos em que você teve dúvida ou divergência entre fontes.
