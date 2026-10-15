# Briefing dos lotes L (ladainhas)

Leia antes: `_REGRAS.md`, `_modelo.json`, `_slugs-site.txt` e o seu lote em `_plano.json` (o "foco" traz fatos e fontes permitidos). Veja também como as ladainhas já publicadas estão estruturadas consultando uma delas no Supabase, se quiser (tabela articles, categoria 'ladainhas'), mas NÃO copie erros.

## Objetivo de SEO
Ser a melhor página do Brasil para "ladainha de/da/do {nome}" e variações ("ladainha ... completa", "ladainha ... escrita", "ladainha ... para imprimir", "oração da ladainha ..."). Primeiro parágrafo com a resposta direta e o termo em <strong>.

## Estrutura de cada artigo
1. Parágrafo inicial (o que é, quando rezar, se é aprovada para uso público ou de uso devocional e privado).
2. `<h2>Ladainha de ...: texto completo</h2>` com o texto inteiro. Formato: cada invocação em um <p> curto ou use <ul> sem marcadores visuais? Use <p> com <br> entre invocações do mesmo bloco e <strong> para as respostas do povo na primeira ocorrência (ex.: "rogai por nós"). Separe blocos (Kyrie, invocações, súplicas, Cordeiro de Deus, versículo, oração final) com <h3>.
3. `<h2>Quem é ...?</h2>` ou `<h2>O que é ...?</h2>`: só fatos do foco.
4. `<h2>Como rezar a ladainha ...?</h2>`: passos práticos (sozinho, em família, em grupo com dirigente e respostas), quando rezar, ligação com outras orações.
5. Seção de significado (2 ou 3 invocações explicadas com a Bíblia).
6. FAQ (3 ou 4), Para aprofundar, Fontes, frase final das regras.
Tamanho: 1.200 a 2.000 palavras.

## Fidelidade
- Ladainhas aprovadas para uso público são só seis (Santíssimo Nome de Jesus, Sagrado Coração, Preciosíssimo Sangue, Lauretana, São José, Todos os Santos). Todas as outras: diga claramente "de uso devocional e privado" e nunca chame de "oficial" ou "aprovada".
- Nada de "poderosa", "infalível", "milagrosa", "garantida"; nunca prometa graças, cura ou proteção.
- Fatos sobre santos: só os do foco. Lendas e tradições ditas como tais.
- Não reproduza letras de músicas nem cite gravações.
- Sem travessões (— ou –) e sem " · ".

## Imagens
Preencha image_alt com a descrição de uma pintura de arte sacra adequada.

## Saída
`lote-L1.json` (ou L2, L3). Rode `python3 validar.py L1` até "VALIDACAO OK".
