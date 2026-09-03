-- Mevcut Supabase projesinde SQL Editor içinde bir kez çalıştırın.

create table if not exists public.business_settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null default 'Abidos Pansiyon',
  phone text not null default '',
  address text not null default '',
  check_in_time time not null default '14:00',
  check_out_time time not null default '11:00',
  currency text not null default 'TRY',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.business_settings enable row level security;
grant select, update on public.business_settings to authenticated;

drop policy if exists "Ayarları admin görür" on public.business_settings;
create policy "Ayarları admin görür"
on public.business_settings for select to authenticated
using (public.is_admin());

drop policy if exists "Ayarları admin günceller" on public.business_settings;
create policy "Ayarları admin günceller"
on public.business_settings for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.set_business_settings_audit()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists set_business_settings_audit on public.business_settings;
create trigger set_business_settings_audit
before update on public.business_settings
for each row execute procedure public.set_business_settings_audit();

insert into public.business_settings (id) values (1)
on conflict (id) do nothing;

