-- =====================================================================
-- Católicos Orantes: revisão de segurança (13/10/2026)
--
-- 1. Liturgia: só administradores e o build (chave de serviço) gravam.
--    Antes, qualquer visitante podia reescrever o texto da liturgia em cache.
-- 2. Remove políticas duplicadas.
-- 3. Formulários públicos (pedido de oração e sugestão): limite de tamanho
--    e o envio público não pode marcar o pedido como "lido".
-- 4. Funções: search_path fixo; is_admin() só para quem está logado.
-- 5. Bucket de imagens: só imagens, até 5 MB.
-- =====================================================================

-- 1. Liturgia
drop policy if exists "Authenticated can delete liturgy" on public.daily_liturgy;
drop policy if exists "Authenticated can insert liturgy" on public.daily_liturgy;
drop policy if exists "Authenticated can update liturgy" on public.daily_liturgy;
drop policy if exists "Somente admin" on public.daily_liturgy;
create policy "Somente admin" on public.daily_liturgy
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can insert liturgy cache" on public.daily_liturgy_cache;
drop policy if exists "Anyone can update liturgy cache" on public.daily_liturgy_cache;

-- 2. Duplicadas
drop policy if exists "public_read" on public.articles;           -- igual a "Artigos publicados são públicos"
drop policy if exists "anon_insert" on public.prayer_requests;    -- substituída abaixo

-- 3. Formulários públicos
drop policy if exists "Anyone can insert prayer requests" on public.prayer_requests;
create policy "Anyone can insert prayer requests" on public.prayer_requests
  for insert to anon, authenticated with check (coalesce(read, false) = false);

drop policy if exists "Anyone can insert suggestions" on public.user_suggestions;
create policy "Anyone can insert suggestions" on public.user_suggestions
  for insert to anon, authenticated with check (coalesce(read, false) = false);

alter table public.prayer_requests drop constraint if exists prayer_requests_tamanhos;
alter table public.prayer_requests add constraint prayer_requests_tamanhos check (
  char_length(coalesce(name, '')) <= 120
  and char_length(coalesce(email, '')) <= 255
  and char_length(coalesce(whatsapp, '')) <= 30
  and char_length(coalesce(message, '')) between 1 and 3000
) not valid;

alter table public.user_suggestions drop constraint if exists user_suggestions_tamanhos;
alter table public.user_suggestions add constraint user_suggestions_tamanhos check (
  char_length(coalesce(name, '')) <= 120
  and char_length(coalesce(email, '')) <= 255
  and char_length(coalesce(whatsapp, '')) <= 30
  and char_length(coalesce(category, '')) <= 80
  and char_length(coalesce(content_reference, '')) <= 600
  and char_length(coalesce(message, '')) between 1 and 4000
) not valid;

-- 4. Funções
alter function public.update_updated_at() set search_path = public;
revoke execute on function public.is_admin() from anon, public;
grant execute on function public.is_admin() to authenticated;

-- 5. Bucket de imagens
update storage.buckets
   set file_size_limit = 5242880,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
 where id = 'article-images';
