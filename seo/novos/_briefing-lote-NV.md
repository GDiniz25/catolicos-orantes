# Briefing dos lotes NV (novas novenas por intenção)

Leia antes: `_REGRAS.md`, `_modelo.json`, `_slugs-site.txt` e o seu lote em `_plano.json` (o campo "foco" diz o santo, a data e as intenções). Veja também um artigo de novena já publicado para manter o padrão: consulte no Supabase (projeto dialdbrhpqrwilsisnkn, tabela articles, categoria 'novenas', por exemplo slug 'novena-de-sao-judas-tadeu'), só para estrutura e tom.

## Objetivo
Ser a melhor página do Brasil para "novena de/a {nome}" e variações ("novena de {nome} 9 dias", "oração da novena de {nome}", "quando começa a novena de {nome}", "novena para {intenção}"). O site está criando uma página que indica a novena certa para cada necessidade (proteção, cura, emprego, família, gravidez, dívidas, relacionamento etc.): deixe clara, no texto, para quais intenções a devoção é tradicional, sem prometer resultado.

## Estrutura obrigatória (igual às novenas do site)
1. Parágrafo inicial: o que é a novena, quando rezar (próxima data, com dia da semana, em 2026 ou 2027) e para quais intenções, com "novena de/a {nome}" em <strong>.
2. `<h2>Quando rezar a novena de {nome}?</h2>`: datas exatas da próxima novena terminando na véspera da festa; diga que pode ser rezada em qualquer época; link para o Planejador: "monte a sua novena com lembretes no <a href="/planejador-de-novena">Planejador de Novena</a>"; e para a nova página: "não sabe qual novena rezar? Veja <a href="/qual-novena-rezar">qual novena rezar para cada necessidade</a>".
3. `<h2>Quem é ...?</h2>` ou `<h2>O que é ...?</h2>`: história e sentido, só com fatos verificados.
4. `<h2>Para quais intenções rezar a novena de {nome}?</h2>`: as intenções tradicionais, em lista, cada uma com 1 frase. Lembre que se pode rezar por qualquer necessidade e que a graça vem de Deus.
5. `<h2>Como rezar a novena de {nome}?</h2>`: roteiro fixo de cada dia em <ol>; "oração inicial" e "oração final" escritas uma vez, marcadas como "Sugestão de oração" em <blockquote>.
6. `<h2>Novena de {nome}: os 9 dias</h2>` com 9 <h3> ("1º dia: tema"), cada um com referência bíblica (pode citar 1 versículo curto com referência), meditação de 2 a 4 frases e oração curta do dia marcada como sugestão. Temas diferentes, ligados ao santo ou ao mistério.
7. Seção prática (dia da festa: Missa, confissão, caridade; onde houver, santuário no Brasil, só se confirmado).
8. `<h2>Perguntas frequentes</h2>` (3 ou 4 <h3>), `<h2>Para aprofundar</h2>`, `<h2>Fontes</h2>` como em `_REGRAS.md`.
Tamanho: 1.800 a 2.600 palavras.

## Fidelidade (obrigatório)
- Verifique com WebSearch/WebFetch todos os fatos do santo (datas de vida, canonização, festa litúrgica, padroados) em fonte confiável (Vatican News, vatican.va, santuários oficiais, ordens religiosas, CNBB). O que não confirmar, não escreva. Lendas e tradições sempre ditas como tais.
- Calcule as datas da novena com cuidado (dia da semana correto). Para festas móveis (Divina Misericórdia, Sagrada Família), confirme a data do ano.
- Nunca prometa resultado. A novena é perseverança na oração (Lc 18,1); os santos intercedem (CIC 956). Para saúde e gravidez: diga que a oração não substitui acompanhamento médico. Para dívidas: responsabilidade e busca de orientação. Para relacionamentos: liberdade da outra pessoa, discernimento, castidade no namoro; a oração não "amarra" ninguém (nada de simpatia).
- Orações tradicionais longas com tradução protegida (por exemplo, textos do Diário de Santa Faustina) NÃO podem ser copiadas: descreva a intenção do dia e escreva uma sugestão própria. Orações tradicionais curtas e de domínio comum (Pai-Nosso, Ave-Maria, Glória, Salve-Rainha, jaculatórias consagradas) podem.
- Não use "poderosa", "infalível", "garantida", "milagrosa" como adjetivo de oração. Sem travessões (— ou –), sem " · ", sem "jornada" nem "mergulhar".
- Devoções com sincretismo (São Jorge, Cosme e Damião, Santa Bárbara): trate com respeito e clareza, explicando a fé católica sem atacar outras religiões.

## image_alt
Descreva uma pintura de arte sacra do santo ou do mistério. Outra pessoa escolhe a imagem final.

## Saída
`seo/novos/lote-NVk.json`. Grave a cada 2 artigos. Rode `python3 seo/novos/validar.py NVk` até "VALIDACAO OK". Não faça commit nem push. Devolva os slugs e uma linha por artigo com fatos que dependem de confirmação.
