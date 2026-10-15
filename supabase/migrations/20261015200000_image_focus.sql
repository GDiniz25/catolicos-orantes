-- Ponto de foco de cada imagem (para cortar com object-cover sem perder o rosto ou o objeto principal).
-- Calculado por scripts/imagens-foco.mjs (smartcrop). Chave: a image_url completa, com ?v=.
create table if not exists public.image_focus (
  url text primary key,
  foco text not null,
  largura int,
  altura int,
  created_at timestamptz not null default now()
);
alter table public.image_focus enable row level security;
create policy "image_focus leitura publica" on public.image_focus for select to anon, authenticated using (true);
