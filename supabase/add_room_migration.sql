-- Mevcut Supabase projesinde SQL Editor içinde bir kez çalıştırın.
-- Oda numarasını seçilen kattaki son numaranın devamı olarak güvenle üretir.

create or replace function public.add_room(
  p_floor integer,
  p_capacity integer,
  p_bed_info text,
  p_rental_type text,
  p_rate text,
  p_note text default ''
)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  next_room_number integer;
  new_room_id text;
  room_data jsonb;
begin
  if not public.is_admin() then raise exception 'Bu işlem yalnızca admin tarafından yapılabilir.'; end if;
  if p_floor < 1 or p_floor > 20 then raise exception 'Kat 1-20 arasında olmalıdır.'; end if;
  if p_capacity < 1 or p_capacity > 20 then raise exception 'Kapasite 1-20 arasında olmalıdır.'; end if;
  if length(trim(p_bed_info)) < 2 then raise exception 'Yatak bilgisi zorunludur.'; end if;
  if p_rental_type not in ('daily', 'monthly') then raise exception 'Konaklama türü geçersiz.'; end if;
  if length(trim(p_rate)) = 0 then raise exception 'Fiyat zorunludur.'; end if;

  perform pg_advisory_xact_lock(73001, p_floor);
  select coalesce(max(room_number), p_floor * 100) + 1 into next_room_number
  from public.rooms
  where floor = p_floor and room_number between p_floor * 100 + 1 and p_floor * 100 + 99;

  if next_room_number > p_floor * 100 + 99 then raise exception 'Bu katta kullanılabilir oda numarası kalmadı.'; end if;
  new_room_id := 'room-' || next_room_number;
  room_data := jsonb_build_object(
    'id', new_room_id,
    'roomNumber', next_room_number,
    'floor', p_floor,
    'capacity', p_capacity,
    'bedInfo', trim(p_bed_info),
    'rentalType', p_rental_type,
    'status', 'available'
  );
  if p_rental_type = 'daily' then room_data := room_data || jsonb_build_object('price', trim(p_rate));
  else room_data := room_data || jsonb_build_object('monthlyPrice', trim(p_rate)); end if;
  if length(trim(coalesce(p_note, ''))) > 0 then room_data := room_data || jsonb_build_object('note', trim(p_note)); end if;

  insert into public.rooms (id, room_number, floor, data)
  values (new_room_id, next_room_number, p_floor, room_data);
  return next_room_number;
end;
$$;

grant execute on function public.add_room(integer, integer, text, text, text, text) to authenticated;

