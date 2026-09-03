-- Mevcut Supabase projesinde SQL Editor içinde bir kez çalıştırın.
-- Resepsiyon yalnızca doluluk/konaklama bilgisini, admin tüm oda tanımını değiştirebilir.

create or replace function public.protect_room_definition()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.id is distinct from old.id
      or new.room_number is distinct from old.room_number
      or new.floor is distinct from old.floor
      or (new.data - 'status' - 'stay') is distinct from (old.data - 'status' - 'stay') then
      raise exception 'Oda özelliklerini yalnızca admin değiştirebilir.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_room_definition on public.rooms;
create trigger protect_room_definition
before update on public.rooms
for each row execute procedure public.protect_room_definition();

