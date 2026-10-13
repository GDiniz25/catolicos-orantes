-- Crédito das imagens dos artigos (arte sacra em domínio público do Wikimedia Commons).
-- COMO RODAR: Supabase > SQL Editor > New query > cole > Run. Pode rodar mais de uma vez.
alter table public.articles add column if not exists image_credit text;
