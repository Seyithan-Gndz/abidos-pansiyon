-- Mevcut Supabase projesinde SQL Editor içinde bir kez çalıştırın.

create table public.audit_logs (
  id bigint generated always as identity primary key,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  room_number integer,
  details jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
alter table public.audit_logs enable row level security;
grant select on public.audit_logs to authenticated;

create policy "İşlem geçmişini yalnızca admin görür"
on public.audit_logs for select to authenticated
using (public.is_admin());

create or replace function public.audit_room_changes()
returns trigger language plpgsql security definer set search_path = public as $$
declare log_action text; log_details jsonb;
begin
  if tg_op = 'INSERT' then
    log_action := 'room_created';
    log_details := jsonb_build_object('room', new.data);
  elsif old.data ->> 'status' = 'available' and new.data ->> 'status' = 'occupied' then
    log_action := 'check_in';
    log_details := jsonb_build_object('stay', new.data -> 'stay');
  elsif old.data ->> 'status' = 'occupied' and new.data ->> 'status' = 'available' then
    log_action := 'check_out';
    log_details := jsonb_build_object('stay', old.data -> 'stay');
  elsif (new.data - 'status' - 'stay') is distinct from (old.data - 'status' - 'stay')
    or new.room_number is distinct from old.room_number or new.floor is distinct from old.floor then
    log_action := 'room_updated';
    log_details := jsonb_build_object('before', old.data - 'stay', 'after', new.data - 'stay');
  else
    return new;
  end if;
  insert into public.audit_logs (action, entity_type, entity_id, room_number, details, created_by)
  values (log_action, 'room', new.id, new.room_number, log_details, auth.uid());
  return new;
end;
$$;

drop trigger if exists audit_room_changes on public.rooms;
create trigger audit_room_changes after insert or update on public.rooms
for each row execute procedure public.audit_room_changes();

create or replace function public.audit_profile_changes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role or new.approval_status is distinct from old.approval_status then
    insert into public.audit_logs (action, entity_type, entity_id, details, created_by)
    values ('staff_updated', 'profile', new.id::text,
      jsonb_build_object('email',new.email,'oldRole',old.role,'newRole',new.role,'oldStatus',old.approval_status,'newStatus',new.approval_status), auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists audit_profile_changes on public.profiles;
create trigger audit_profile_changes after update on public.profiles
for each row execute procedure public.audit_profile_changes();

create or replace function public.audit_business_settings_changes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_logs (action, entity_type, entity_id, details, created_by)
  values ('settings_updated', 'settings', new.id::text, jsonb_build_object('businessName',new.business_name), auth.uid());
  return new;
end;
$$;

drop trigger if exists audit_business_settings_changes on public.business_settings;
create trigger audit_business_settings_changes after update on public.business_settings
for each row execute procedure public.audit_business_settings_changes();

