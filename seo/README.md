# Revisão de SEO dos artigos

1. `npm run seo:export`: baixa todos os artigos do Supabase para `seo/export/`.
2. `npm run seo:audit`: gera `seo/relatorio-<data>.md` com os problemas de cada artigo.
3. Coloque os artigos revisados (JSON, array com `slug` e os campos alterados) em `seo/revisado/`.
4. `npm run seo:apply`: mostra o que mudaria. `npm run seo:apply -- --write`: grava no banco (faz backup antes).
   Precisa de `SUPABASE_SERVICE_ROLE_KEY` no `.env` (Supabase > Project Settings > API). Nunca envie essa chave ao GitHub.
5. No `/admin`, clique em "Publicar alterações no site".
