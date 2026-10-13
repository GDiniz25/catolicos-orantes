-- =====================================================================
-- Católicos Orantes: progresso das ferramentas na conta do usuário
--
-- Guarda, para quem entrou com e-mail, o progresso de:
-- plano de leitura da Bíblia, consagração em 33 dias, novenas, notas da Lectio Divina,
-- resultado dos testes (santo de devoção e temperamento) e artigos lidos.
-- Cada pessoa só lê e altera as próprias linhas.
-- O exame de consciência continua sem ser salvo em lugar nenhum.
--
-- COMO RODAR: Supabase > SQL Editor > New query > cole tudo > Run.
-- =====================================================================

begin;

create table if not exists public.progresso_usuario (
  user_id uuid not null references auth.users (id) on delete cascade,
  chave text not null check (char_length(chave) <= 80),
  valor jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, chave)
);
alter table public.progresso_usuario enable row level security;

drop policy if exists "Cada um lê o próprio progresso" on public.progresso_usuario;
create policy "Cada um lê o próprio progresso" on public.progresso_usuario
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Cada um cria o próprio progresso" on public.progresso_usuario;
create policy "Cada um cria o próprio progresso" on public.progresso_usuario
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Cada um atualiza o próprio progresso" on public.progresso_usuario;
create policy "Cada um atualiza o próprio progresso" on public.progresso_usuario
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Cada um apaga o próprio progresso" on public.progresso_usuario;
create policy "Cada um apaga o próprio progresso" on public.progresso_usuario
  for delete to authenticated using (auth.uid() = user_id);

-- Limite de tamanho por linha (evita abuso): 200 KB
alter table public.progresso_usuario drop constraint if exists progresso_usuario_tamanho;
alter table public.progresso_usuario add constraint progresso_usuario_tamanho
  check (valor is null or pg_column_size(valor) <= 204800);

commit;
