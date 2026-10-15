-- Reflexões do Evangelho do dia (só as revisadas aparecem no site)
create table if not exists public.evangelho_reflexao (
  date date primary key,
  referencia text not null,
  titulo text not null,
  texto_html text not null,
  revisado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.evangelho_reflexao enable row level security;
create policy "Leitura publica das reflexoes revisadas" on public.evangelho_reflexao for select using (revisado = true);
