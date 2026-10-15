# Briefing dos lotes S (Vida Espiritual) e P (Primeiros Passos na Fé)

Leia antes, nesta ordem: `_REGRAS.md` (obrigatório), `_modelo.json` (formato), `_slugs-site.txt` (únicos links internos permitidos) e o seu lote em `_plano.json` (campo "foco" de cada artigo traz o conteúdo esperado e as fontes).

## Objetivo
O Católicos Orantes quer ser o maior hub de conteúdo católico do Brasil. Estes artigos atendem quem está em conversão, voltando à Igreja ou querendo rezar de verdade. São perguntas íntimas ("por que não sinto nada quando rezo?"). Cada artigo deve ser a melhor resposta em português para a busca do título, melhor do que qualquer blog ou vídeo: profundo, acolhedor, prático e fiel ao Magistério.

## Duas categorias novas
- `vida-espiritual` (Vida Espiritual): oração, aridez, discernimento, presença de Deus.
- `primeiros-passos` (Primeiros Passos na Fé): conversão, retorno, sacramentos de adulto, Missa, dúvidas de iniciante.

## Copy (princípios do Copy Squad aplicados)
1. Entre na conversa que já acontece na cabeça do leitor (Robert Collier). Abra o artigo nomeando a dor ou a dúvida com as palavras dele, em 1 frase, e responda logo em seguida. O primeiro parágrafo continua sendo a resposta direta com o termo principal em <strong> (regra do SEO).
2. O leitor sabe qual é o problema, mas não sabe a solução (Eugene Schwartz: consciente do problema). Não perca tempo convencendo de que o problema existe; mostre o caminho.
3. Escorregador (Joe Sugarman): frases curtas, parágrafos de 2 a 4 linhas, cada parágrafo puxa o próximo. Nada de introdução genérica.
4. Concreto vence abstrato: exemplos do cotidiano brasileiro (ônibus, trabalho, filhos, celular), passos numerados, "faça isto amanhã de manhã".
5. Acolher sem diluir: tom de um padre experiente e amigo, que não julga e não esconde a verdade. Nunca condene o leitor; nunca relativize a doutrina.
6. Termine as seções práticas com uma ação simples que o leitor pode fazer hoje.

## SEO
- Título com o termo de busca no início (até 60 caracteres). Pode usar o título sugerido do plano.
- Use variações naturais nos h2/h3 e no FAQ (ex.: "como rezar", "como orar", "como fazer uma oração", "como começar a rezar").
- FAQ com perguntas reais como as pessoas digitam no Google.
- Links internos: 3 a 6 no corpo do texto (além do "Para aprofundar"), SOMENTE para endereços de `_slugs-site.txt`. Ligue os artigos novos entre si quando fizer sentido (eles já estão na lista). Ferramentas úteis: /terco-guiado, /liturgia-diaria, /lectio-divina, /laudes-de-hoje, /exame-de-consciencia, /aprender, /descubra-seu-santo, /plano-de-leitura-da-biblia, /encontre-na-biblia, /terco-da-misericordia.
- Tamanho: 1.400 a 2.200 palavras de conteúdo útil.

## Fidelidade (reforço do _REGRAS.md)
- Números do Catecismo e cânones: os indicados no "foco" foram conferidos; outros, só com certeza absoluta. Na dúvida, cite o documento sem número.
- Citações literais só da Bíblia, de orações tradicionais e das frases que o "foco" autoriza expressamente (ex.: CIC 2558 com Santa Teresinha, CIC 2709 com Santa Teresa, CIC 2715 com o camponês de Ars, CIC 157 com Newman, CIC 133 com São Jerônimo, Agostinho: "fizeste-nos para ti, e inquieto está o nosso coração enquanto não repousar em ti", Confissões I,1). Nada mais entre aspas atribuído a santos ou papas.
- Saúde mental: quando o tema tocar tristeza, depressão, TOC, vícios ou pensamentos de se ferir, diga com clareza que a fé não substitui acompanhamento médico e psicológico e que buscar ajuda é compatível com a fé. Em temas de autodepreciação, cite o CVV (telefone 188, 24 horas, gratuito).
- Nunca prometa resultados ("faça isso e vai sentir Deus").
- Sem travessões (— ou –) e sem " · " em nenhum campo. Sem "jornada", "mergulhar", "poderosa", "infalível", "garantido".
- image_alt: descrição curta de uma pintura de arte sacra adequada (o site aplicará a obra depois). Ex.: "Santa Teresa de Ávila em oração, pintura barroca".

## Saída
`lote-S1.json` (ou o seu lote) como array, gravando a cada artigo pronto. Rode `python3 validar.py S1` até "VALIDACAO OK".
