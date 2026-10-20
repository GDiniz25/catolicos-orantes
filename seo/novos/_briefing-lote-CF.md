# Briefing dos lotes CF (catequese, família e paróquia)

Leia antes: `_REGRAS.md`, `_modelo.json`, `_slugs-site.txt` e o seu lote em `_plano.json` (campo "foco"). Para tom e estrutura, veja no Supabase (projeto dialdbrhpqrwilsisnkn, tabela articles) um artigo publicado da mesma categoria.

## Objetivo
Ser a melhor página do Brasil para a busca do título, com conteúdo prático que um pai, catequista, leitor ou coordenador de música use de verdade. Público: famílias, catequistas e agentes de pastoral.

## Regras extras
- Siga `_REGRAS.md` (estrutura, FAQ 3 ou 4, Para aprofundar, Fontes, frase final, sem travessões, sem " · ", sem "jornada", sem "mergulhar").
- Fidelidade: confirme com WebSearch/WebFetch tudo o que for fato (datas do Advento 2026 e ano litúrgico, cânones do CDC, números do CIC e da IGMR, Evangelhos dominicais). O que não confirmar, não escreva. Sem número se não tiver certeza.
- Bíblia: cite no máximo 1 ou 2 versículos curtos por artigo, com referência; no resto, resuma com suas palavras (o texto da CNBB tem direitos autorais).
- Nunca copie letra de música nem texto de material de catequese de terceiros.
- Artigos "para imprimir" ou com atividades: inclua a seção pedida (`<h2>... para imprimir</h2>`) com conteúdo pronto para usar: tabelas (`<table>` com `<thead>`), listas, frases com lacuna `______`, perguntas com gabarito ao final. Nada de imagens.
- Parábolas: cada página deve ter o link para o capítulo explicado em /biblia/{livro}/{capítulo} (já existe) e para as outras parábolas do lote (os slugs do lote `parabolas-de-jesus/...` podem ser linkados mesmo sem estar em _slugs-site.txt). Estrutura sugerida: resumo da parábola, contexto, explicação parte por parte (h3), o que significa hoje, perguntas para reflexão, sugestão de oração.
- Tamanho: 1.300 a 2.200 palavras (calendário do Advento pode passar disso por causa da tabela).

## image_alt
Descreva uma pintura de arte sacra adequada (a escolha final é feita por outra pessoa).

## Saída
`seo/novos/lote-CFk.json`. Grave a cada artigo. Rode `python3 seo/novos/validar.py CFk` até "VALIDACAO OK" (os slugs de todos os lotes CF já estão em _slugs-site.txt e podem ser linkados). Não faça commit nem push. Devolva os slugs e uma lista curta dos fatos verificados e das fontes usadas.
