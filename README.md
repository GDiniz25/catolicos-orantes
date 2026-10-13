# Católicos Orantes (Astro)

Site 100% estático gerado com **Astro**, sem nenhuma dependência do Lovable.
Cada página (home, categorias, artigos, santos, liturgia, versículo) sai do build como **HTML pronto**,
com título, descrição, canonical, Open Graph e dados estruturados (JSON-LD) já no código-fonte.
O Google e as IAs leem o conteúdo sem precisar executar JavaScript.

O banco continua sendo o **seu Supabase** (mesmas tabelas, mesmo painel `/admin`).

## O que mudou em relação ao site do Lovable

| Antes (Lovable / SPA) | Agora (Astro / estático) |
|---|---|
| HTML vazio (`<div id="root">`), conteúdo só após o JS | HTML completo em todas as páginas |
| Meta tags trocadas via JavaScript | Meta tags e JSON-LD no HTML |
| Sitemap via Edge Function + redirect em JS | `sitemap.xml` estático (mesmos nomes de arquivo) |
| FAQ em acordeão (texto fora do HTML) | `<details>`: texto sempre no HTML |
| 6 fontes do Google bloqueando a renderização | 4 fontes self-hosted, só os pesos usados |
| supabase-js + React em todas as páginas | JS só onde há interação (ilhas) |
| `lovable-tagger`, `previewAuthStorage`, gateway de IA do Lovable | Removidos. Chat bíblico usa Gemini direto |
| Liturgia/versículo trocavam de dia às 21h para quem está no Brasil | Corrigido (fuso de Brasília real) |

Novidades de SEO/GEO: breadcrumbs visíveis + `BreadcrumbList`, `CollectionPage` nas categorias,
sumário com âncoras nos artigos, "Artigos recentes" na home, `rss.xml`, `llms.txt`,
`robots.txt` liberando robôs de IA, imagens no sitemap, páginas de santos sem conteúdo com `noindex`
e fora do sitemap, links "Ler artigo" só quando o artigo existe (sem links quebrados).

Todas as URLs foram mantidas: `/novenas`, `/novenas/slug-do-artigo`, `/santos/slug`, etc.

## Rodar no computador

Requisito: Node.js 20 ou 22.

```bash
npm install
cp .env.example .env      # e preencha (ou use o .env antigo, os nomes são os mesmos)
npm run dev               # http://localhost:4321
npm run build             # gera a pasta dist/
npm run preview           # serve a dist/ localmente
npm test                  # testes
```

Depois do primeiro `npm install`, **faça commit do `package-lock.json`**.

## Deploy na Hostinger (automático via GitHub Actions)

O arquivo `.github/workflows/deploy.yml` faz build e envia a pasta `dist/` por FTP:

- a cada push na branch `main`;
- todo dia às 00:05 e 07:00 (Brasília), para atualizar liturgia, santo e versículo do dia;
- quando você clica em **"Publicar alterações no site"** no `/admin`;
- quando a Edge Function `publish-scheduled` publica artigos agendados.

### 1. Secrets no GitHub
Repositório > Settings > Secrets and variables > Actions > New repository secret:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://dialdbrhpqrwilsisnkn.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | chave `anon` do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | chave de serviço (só o build usa, para guardar o cache da liturgia) |
| `FTP_SERVER` | host FTP da Hostinger (hPanel > Arquivos > Contas FTP) |
| `FTP_USERNAME` | usuário FTP |
| `FTP_PASSWORD` | senha FTP |
| `FTP_SERVER_DIR` | opcional. Padrão `public_html/` |

### 2. Edge Functions no Supabase
```bash
supabase functions deploy bible-chat
supabase functions deploy trigger-deploy
supabase functions deploy publish-scheduled
```
Secrets (Supabase > Edge Functions > Secrets):

| Nome | Para quê |
|---|---|
| `GEMINI_API_KEY` | já existia. Agora também usado pelo chat "Encontre na Bíblia" |
| `GITHUB_REPO` | ex.: `seu-usuario/catolicos-orantes` |
| `GITHUB_DEPLOY_TOKEN` | token *fine-grained* do GitHub com **Contents: Read and write** só neste repositório |

A função `sitemap` antiga não é mais usada (pode ser removida do Supabase).
O secret `LOVABLE_API_KEY` também pode ser apagado.

### 3. Domínio
1. Na Hostinger, adicione o domínio `catolicosorantes.com.br` e ative o SSL.
2. Rode o primeiro deploy (Actions > "Build e deploy" > Run workflow) e teste pelo link temporário da Hostinger.
3. Troque o DNS (registro A / CNAME) do Lovable para a Hostinger.
4. Desconecte o domínio do projeto no Lovable.

## Checklist de virada (SEO)

- [ ] `https://catolicosorantes.com.br/novenas` abre sem barra no final e sem `.html`
- [ ] `/novenas/` e `www.` redirecionam (301) para a versão sem barra e sem www
- [ ] Ver código-fonte de um artigo: título, texto e `application/ld+json` aparecem no HTML
- [ ] `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/llms.txt` respondem
- [ ] Uma URL inexistente devolve status **404** (não 200)
- [ ] Google Search Console: reenviar `sitemap.xml` e inspecionar 3 a 5 URLs principais
- [ ] Rich Results Test em 1 artigo e no `/exame-de-consciencia` (FAQ)
- [ ] PageSpeed Insights (mobile) na home e em um artigo
- [ ] Acompanhar "Páginas" e "Desempenho" no Search Console nas 4 semanas seguintes

## Fluxo de publicação

1. Escreva/edite/agende o artigo no `/admin` como antes.
2. Clique em **"Publicar alterações no site"** (ou espere o build diário / o agendamento).
3. Em poucos minutos o artigo está no ar como HTML estático e entra no sitemap.

## Estrutura

```
src/
  config/site.ts          nome, URL, categorias e textos de SEO (fonte da verdade)
  layouts/BaseLayout      <head> completo: meta, OG, canonical, JSON-LD, GA4
  pages/                  rotas (cada arquivo = uma URL)
    [category].astro      páginas de categoria
    [category]/[slug]     artigos
    santos/[slug]         santos
    sitemap*.xml.ts, rss.xml.ts, llms.txt.ts, search-index.json.ts
  components/astro/       componentes sem JS (header, footer, breadcrumbs, FAQ...)
  components/islands/     partes interativas (formulários, calendário, liturgia, chat)
  components/admin/       painel /admin (React, igual ao anterior)
  lib/data.ts             leitura do Supabase no build
public/.htaccess          URLs limpas, 301, cache, compressão e segurança (Hostinger)
supabase/functions/       Edge Functions (sem Lovable)
```

## Login do Caminho da Fé e proteção do /admin

1. Supabase > SQL Editor: rode `supabase/migrations/20261011150000_login_caminho_e_admins.sql`
   (troque antes o e-mail na linha marcada pelo e-mail que você usa no /admin).
2. Supabase > Authentication > URL Configuration:
   - Site URL: `https://catolicosorantes.com.br`
   - Redirect URLs: `https://catolicosorantes.com.br/**` e `http://localhost:4321/**`
     (o link de acesso volta para a página onde a pessoa pediu o login: plano de leitura, novena, Minha conta etc.)
3. Authentication > Sign In / Providers > Email: ativado, com "Confirm email" ligado.
4. Authentication > Emails > SMTP: configure um SMTP próprio (o envio padrão do Supabase é limitado a poucos e-mails por hora).
5. Authentication > Emails > Templates > Magic Link: texto em português (modelo em `docs/email-magic-link.html`).
6. Google (opcional): ative o provedor Google no Supabase e coloque `PUBLIC_LOGIN_GOOGLE=true` no `.env` e nos secrets do GitHub.
7. Progresso das ferramentas na conta: rode `supabase/migrations/20261013120000_progresso_usuario.sql` no SQL Editor.

### O que fica salvo na conta

| Ferramenta | Chave no navegador | Como junta dois aparelhos |
|---|---|---|
| Caminho da Fé | `co-caminho-v1` (tabela `caminho_progresso`) | regra própria do curso |
| Plano de leitura da Bíblia | `co-leitura-biblia-v1` | soma os dias lidos (mesmo plano e início) |
| Consagração em 33 dias | `co-consagracao-v1` | soma os dias rezados (mesma festa) |
| Novenas | `co-novena-<novena>-<início>` | soma os dias rezados |
| Lectio Divina | `co-lectio-<data>` | vale a anotação mais recente |
| Santo de devoção e temperamento | `co-santo-afinidade-v1`, `co-temperamento-v1` | vale o resultado mais recente |
| Artigos lidos | `co-lidos-v1` | soma as listas |

Não vão para a conta: o exame de consciência (nunca é salvo), o tamanho da letra e o terço guiado (não guarda estado).
Código: `src/lib/progresso.ts`. Página da conta: `/minha-conta` (fora do sitemap, noindex).

## Páginas por data

- `/santo-do-dia/12-de-outubro`: 366 páginas fixas, uma por dia do ano.
- `/liturgia-diaria/12-de-outubro-de-2026`: de 7 dias atrás a 7 dias à frente, refeitas a cada build.
- IndexNow: depois de cada deploy, `scripts/indexnow.mjs` avisa Bing e Yandex das páginas novas.

## Imagens dos artigos (arte sacra em domínio público)

As imagens vêm do Wikimedia Commons, apenas obras em domínio público (PD ou CC0), com crédito exibido abaixo da imagem.

1. Uma vez só: rode `supabase/migrations/20261012120000_credito_imagem.sql` no SQL Editor do Supabase.
2. `npm run imagens:buscar` gera `seo/imagens/revisar.html` com até 8 pinturas por artigo (nada é alterado).
3. Abra a página, confira as sugestões, troque o que quiser e clique em **Baixar escolhas.json**. Mova o arquivo para `seo/imagens/`.
4. `npm run imagens:aplicar` mostra a simulação. `npm run imagens:aplicar -- --write` aplica (com backup em `seo/backup/`).
5. `npm run build` e publique a pasta `dist`.

## Descubra seu santo

Teste de afinidade em `/descubra-seu-santo`. Perguntas, santos e pesos ficam em `src/data/santoAfinidade.ts`.

## Segurança (revisão de 13/10/2026)

- Banco: rode `supabase/migrations/20261013150000_seguranca_revisao.sql` no SQL Editor (liturgia só pelo build/admin,
  limites de tamanho nos formulários, bucket só com imagens até 5 MB, `is_admin()` só para logados).
- Funções `scrape-saints`, `generate-saint-content` e `search-unsplash`: exigem um administrador logado (tabela `admins`).
- Cabeçalhos: CSP, HSTS, COOP, nosniff e X-Frame-Options no `public/.htaccess`.
- O cache da liturgia é gravado só pelo build, com `SUPABASE_SERVICE_ROLE_KEY` do `.env` (essa chave nunca vai para o navegador).

## Imagens leves

`npm run imagens:variantes -- --write` cria versões WebP de 240, 480 e 960 px de cada pintura no Storage.
O build usa essas versões automaticamente (`src/lib/imagens.ts`); sem elas, usa a original.
Rode de novo sempre que aplicar imagens novas (`imagens:aplicar`).
