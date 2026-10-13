-- =====================================================================
-- Católicos Orantes: login público do Caminho da Fé + proteção do /admin
--
-- O QUE ESTE SCRIPT FAZ
-- 1. Cria a tabela "admins" e a função is_admin().
-- 2. Cadastra VOCÊ como administrador (troque o e-mail na linha marcada).
-- 3. Troca as regras antigas "qualquer usuário logado pode..." por
--    "somente administradores podem..." nas tabelas do painel e no Storage.
--    Regras públicas (leitura de artigos, envio de pedido de oração etc.) NÃO mudam:
--    políticas que valem também para anon/public são mantidas.
-- 4. Cria a tabela "caminho_progresso", onde cada pessoa só vê o próprio progresso.
--
-- COMO RODAR: Supabase > SQL Editor > New query > cole tudo > Run.
-- Se o e-mail não existir em Authentication > Users, o script para sem mudar nada.
-- =====================================================================

begin;

-- ---------- 1. Administradores ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Admin vê a lista de admins" on public.admins;
create policy "Admin vê a lista de admins" on public.admins
  for select to authenticated using (public.is_admin());

-- ---------- 2. Cadastra o primeiro administrador ----------
do $$
declare
  v_email text := 'geraldodiniz30@gmail.com';  -- <<<<<< TROQUE AQUI pelo e-mail que você usa no /admin
  v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = lower(v_email);
  if v_id is null then
    raise exception 'Usuário % não encontrado em Authentication > Users. Nada foi alterado.', v_email;
  end if;
  insert into public.admins (user_id) values (v_id) on conflict do nothing;
end $$;

-- ---------- 3. Troca "qualquer logado" por "somente admin" ----------
-- Remove as políticas que liberavam escrita/leitura para QUALQUER usuário autenticado
-- e recria uma política única de administrador em cada tabela.
do $$
declare
  t text;
  p record;
  tabelas text[] := array[
    'articles', 'saints_calendar', 'prayer_requests', 'user_suggestions',
    'article_generation_jobs', 'daily_liturgy_cache', 'daily_liturgy'
  ];
begin
  foreach t in array tabelas loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;
    for p in
      select policyname
      from pg_policies
      where schemaname = 'public'
        and tablename = t
        and (
          -- política só para logados (sem anon/public): ex. "Authenticated can update"
          ('authenticated' = any (roles) and not ('anon' = any (roles) or 'public' = any (roles)))
          -- ou política que testa "está logado" na condição
          or coalesce(qual, '') ilike '%authenticated%'
          or coalesce(with_check, '') ilike '%authenticated%'
          or coalesce(qual, '') ilike '%auth.uid() is not null%'
        )
    loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('drop policy if exists "Somente admin" on public.%I', t);
    execute format(
      'create policy "Somente admin" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end $$;

-- Storage (upload de imagens dos artigos): mesma regra
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      and (
        ('authenticated' = any (roles) and not ('anon' = any (roles) or 'public' = any (roles)))
        or coalesce(qual, '') ilike '%authenticated%'
        or coalesce(with_check, '') ilike '%authenticated%'
      )
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;
drop policy if exists "Somente admin envia arquivos" on storage.objects;
create policy "Somente admin envia arquivos" on storage.objects
  for insert to authenticated with check (public.is_admin());
drop policy if exists "Somente admin altera arquivos" on storage.objects;
create policy "Somente admin altera arquivos" on storage.objects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Somente admin apaga arquivos" on storage.objects;
create policy "Somente admin apaga arquivos" on storage.objects
  for delete to authenticated using (public.is_admin());

-- ---------- 4. Progresso do Caminho da Fé ----------
create table if not exists public.caminho_progresso (
  user_id uuid primary key references auth.users (id) on delete cascade,
  estado jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.caminho_progresso enable row level security;

drop policy if exists "Cada um lê o próprio progresso" on public.caminho_progresso;
create policy "Cada um lê o próprio progresso" on public.caminho_progresso
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Cada um cria o próprio progresso" on public.caminho_progresso;
create policy "Cada um cria o próprio progresso" on public.caminho_progresso
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Cada um atualiza o próprio progresso" on public.caminho_progresso;
create policy "Cada um atualiza o próprio progresso" on public.caminho_progresso
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Cada um apaga o próprio progresso" on public.caminho_progresso;
create policy "Cada um apaga o próprio progresso" on public.caminho_progresso
  for delete to authenticated using (auth.uid() = user_id);

commit;

-- ---------- Conferência (rode depois, se quiser) ----------
-- select tablename, policyname, roles, cmd from pg_policies
-- where schemaname in ('public','storage') order by tablename, policyname;
