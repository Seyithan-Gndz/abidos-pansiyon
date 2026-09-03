-- Mevcut Supabase projesinde SQL Editor içinde bir kez çalıştırın.

create type public.payment_method as enum ('cash', 'card', 'receivable');

create table public.cash_entries (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.rooms(id),
  room_number integer not null,
  guest_name text not null,
  amount numeric(12,2) not null check (amount >= 0),
  payment_method public.payment_method not null,
  check_in_date date not null,
  check_out_date date,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.cash_entries enable row level security;
grant select on public.cash_entries to authenticated;

create policy "Kasa hareketlerini yalnızca admin görür"
on public.cash_entries for select to authenticated
using (public.is_admin());

create or replace function public.check_in_room(
  p_room_id text,
  p_stay jsonb,
  p_amount numeric,
  p_payment_method public.payment_method
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  current_room public.rooms;
begin
  if not public.is_approved_user() then raise exception 'Yetkisiz işlem.'; end if;
  select * into current_room from public.rooms where id = p_room_id for update;
  if current_room.id is null then raise exception 'Oda bulunamadı.'; end if;
  if current_room.data ->> 'status' <> 'available' then raise exception 'Oda müsait değil.'; end if;
  if p_amount < 0 then raise exception 'Tutar geçersiz.'; end if;

  update public.rooms set data = jsonb_set(jsonb_set(data, '{status}', '"occupied"'), '{stay}', p_stay)
  where id = p_room_id;

  insert into public.cash_entries (room_id, room_number, guest_name, amount, payment_method, check_in_date, check_out_date, created_by)
  values (p_room_id, current_room.room_number, coalesce(p_stay ->> 'guestName', ''), p_amount, p_payment_method,
    (p_stay ->> 'checkInDate')::date, nullif(p_stay ->> 'checkOutDate', '')::date, auth.uid());
end;
$$;

create or replace function public.check_out_room(p_room_id text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_approved_user() then raise exception 'Yetkisiz işlem.'; end if;
  update public.rooms set data = (data - 'stay') || '{"status":"available"}'::jsonb
  where id = p_room_id and data ->> 'status' = 'occupied';
  if not found then raise exception 'Dolu oda bulunamadı.'; end if;
end;
$$;

grant execute on function public.check_in_room(text, jsonb, numeric, public.payment_method) to authenticated;
grant execute on function public.check_out_room(text) to authenticated;

