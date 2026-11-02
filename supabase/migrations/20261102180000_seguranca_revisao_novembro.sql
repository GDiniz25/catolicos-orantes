-- Revisão de segurança (02/11/2026). PROPOSTA: ainda não aplicada no banco; aplicar depois da aprovação.

-- 1) Funções sem search_path fixo (aviso do Supabase "Function Search Path Mutable")
alter function public.app_hoje() set search_path = public;
alter function public.app_idade(date) set search_path = public;
alter function public.app_nivel(integer) set search_path = public;
alter function public.app_nome_nivel(integer) set search_path = public;
alter function public.app_perfil_pronto(public.profiles) set search_path = public;
alter function public.app_xp_do_nivel(integer) set search_path = public;

-- 2) Limite de envios anônimos (pedido de oração e sugestões): no máximo 60 a cada 10 minutos no total
create or replace function public.limitar_envios_publicos()
returns trigger language plpgsql security definer set search_path = public as $$
declare n int;
begin
  execute format('select count(*) from %I.%I where created_at > now() - interval ''10 minutes''', tg_table_schema, tg_table_name) into n;
  if n >= 60 then
    raise exception 'Muitos envios em pouco tempo. Tente novamente em alguns minutos.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke all on function public.limitar_envios_publicos() from public, anon, authenticated;

drop trigger if exists limitar_envios on public.prayer_requests;
create trigger limitar_envios before insert on public.prayer_requests for each row execute function public.limitar_envios_publicos();
drop trigger if exists limitar_envios on public.user_suggestions;
create trigger limitar_envios before insert on public.user_suggestions for each row execute function public.limitar_envios_publicos();

-- 3) Tabelas de cópia de segurança criadas nas revisões de conteúdo: podem ser apagadas depois de conferir o site
-- drop table public.backup_novenas_20261031;
-- drop table public.backup_seo_20261102;
