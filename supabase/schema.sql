-- Supabase Dashboard > SQL Editor içinde tek sefer çalıştırın.

create type public.user_role as enum ('admin', 'reception');
create type public.approval_status as enum ('pending', 'approved', 'rejected');
create type public.payment_method as enum ('cash', 'card', 'receivable');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.user_role not null default 'reception',
  approval_status public.approval_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id text primary key,
  room_number integer not null unique,
  floor integer not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table public.business_settings (
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.enforce_admin_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role = 'admin' and (tg_op = 'INSERT' or old.role is distinct from 'admin') then
    if (select count(*) from public.profiles where role = 'admin') >= 3 then
      raise exception 'En fazla 3 admin hesabı olabilir.';
    end if;
  end if;
  return new;
end;
$$;

create trigger limit_admin_count
before insert or update of role on public.profiles
for each row execute procedure public.enforce_admin_limit();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and approval_status = 'approved'
  );
$$;

create or replace function public.is_approved_user()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and approval_status = 'approved'
  );
$$;

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.business_settings enable row level security;
alter table public.cash_entries enable row level security;
grant select, update on public.business_settings to authenticated;
grant select on public.cash_entries to authenticated;

create policy "Kullanıcı kendi profilini, admin tüm profilleri görür"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Profilleri yalnızca admin günceller"
on public.profiles for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Onaylı kullanıcılar odaları görür"
on public.rooms for select to authenticated
using (public.is_approved_user());

create policy "Onaylı kullanıcılar odaları günceller"
on public.rooms for update to authenticated
using (public.is_approved_user())
with check (public.is_approved_user());

create policy "Ayarları admin görür"
on public.business_settings for select to authenticated
using (public.is_admin());

create policy "Ayarları admin günceller"
on public.business_settings for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Kasa hareketlerini yalnızca admin görür"
on public.cash_entries for select to authenticated
using (public.is_admin());

create or replace function public.set_room_audit_fields()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

create trigger set_room_audit
before update on public.rooms
for each row execute procedure public.set_room_audit_fields();

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

create trigger protect_room_definition
before update on public.rooms
for each row execute procedure public.protect_room_definition();

create or replace function public.check_in_room(p_room_id text, p_stay jsonb, p_amount numeric, p_payment_method public.payment_method)
returns void language plpgsql security definer set search_path = public as $$
declare current_room public.rooms;
begin
  if not public.is_approved_user() then raise exception 'Yetkisiz işlem.'; end if;
  select * into current_room from public.rooms where id = p_room_id for update;
  if current_room.id is null then raise exception 'Oda bulunamadı.'; end if;
  if current_room.data ->> 'status' <> 'available' then raise exception 'Oda müsait değil.'; end if;
  update public.rooms set data = jsonb_set(jsonb_set(data, '{status}', '"occupied"'), '{stay}', p_stay) where id = p_room_id;
  insert into public.cash_entries (room_id, room_number, guest_name, amount, payment_method, check_in_date, check_out_date, created_by)
  values (p_room_id, current_room.room_number, coalesce(p_stay ->> 'guestName', ''), p_amount, p_payment_method, (p_stay ->> 'checkInDate')::date, nullif(p_stay ->> 'checkOutDate', '')::date, auth.uid());
end;
$$;

create or replace function public.check_out_room(p_room_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_approved_user() then raise exception 'Yetkisiz işlem.'; end if;
  update public.rooms set data = (data - 'stay') || '{"status":"available"}'::jsonb where id = p_room_id and data ->> 'status' = 'occupied';
  if not found then raise exception 'Dolu oda bulunamadı.'; end if;
end;
$$;

grant execute on function public.check_in_room(text, jsonb, numeric, public.payment_method) to authenticated;
grant execute on function public.check_out_room(text) to authenticated;

create or replace function public.add_room(p_floor integer, p_capacity integer, p_bed_info text, p_rental_type text, p_rate text, p_note text default '')
returns integer language plpgsql security definer set search_path = public as $$
declare next_room_number integer; new_room_id text; room_data jsonb;
begin
  if not public.is_admin() then raise exception 'Bu işlem yalnızca admin tarafından yapılabilir.'; end if;
  if p_floor < 1 or p_floor > 20 then raise exception 'Kat 1-20 arasında olmalıdır.'; end if;
  if p_capacity < 1 or p_capacity > 20 then raise exception 'Kapasite 1-20 arasında olmalıdır.'; end if;
  if length(trim(p_bed_info)) < 2 or length(trim(p_rate)) = 0 then raise exception 'Zorunlu oda bilgileri eksik.'; end if;
  if p_rental_type not in ('daily', 'monthly') then raise exception 'Konaklama türü geçersiz.'; end if;
  perform pg_advisory_xact_lock(73001, p_floor);
  select coalesce(max(room_number), p_floor * 100) + 1 into next_room_number from public.rooms
  where floor = p_floor and room_number between p_floor * 100 + 1 and p_floor * 100 + 99;
  if next_room_number > p_floor * 100 + 99 then raise exception 'Bu katta kullanılabilir oda numarası kalmadı.'; end if;
  new_room_id := 'room-' || next_room_number;
  room_data := jsonb_build_object('id',new_room_id,'roomNumber',next_room_number,'floor',p_floor,'capacity',p_capacity,'bedInfo',trim(p_bed_info),'rentalType',p_rental_type,'status','available');
  if p_rental_type = 'daily' then room_data := room_data || jsonb_build_object('price',trim(p_rate)); else room_data := room_data || jsonb_build_object('monthlyPrice',trim(p_rate)); end if;
  if length(trim(coalesce(p_note,''))) > 0 then room_data := room_data || jsonb_build_object('note',trim(p_note)); end if;
  insert into public.rooms (id,room_number,floor,data) values (new_room_id,next_room_number,p_floor,room_data);
  return next_room_number;
end;
$$;

grant execute on function public.add_room(integer, integer, text, text, text, text) to authenticated;

create or replace function public.set_business_settings_audit()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

create trigger set_business_settings_audit
before update on public.business_settings
for each row execute procedure public.set_business_settings_audit();

insert into public.business_settings (id) values (1);

insert into public.rooms (id, room_number, floor, data) values
('room-501',501,5,'{"id":"room-501","roomNumber":501,"floor":5,"capacity":1,"bedInfo":"Uzun süreli konaklama","monthlyPrice":"12.000 ₺ / ay","note":"8 yıldır konaklıyor","status":"occupied","stay":{"guestName":"Mustafa Öner","checkInDate":"2018-09-01","checkOutDate":null,"nights":"monthly","guestCount":1,"appliedPrice":"12.000 ₺ / ay","note":"Uzun süreli misafir"}}'),
('room-502',502,5,'{"id":"room-502","roomNumber":502,"floor":5,"capacity":3,"bedInfo":"2 tekli yatak","monthlyPrice":"15.000–25.000 ₺ / ay","note":"Çatı katı","status":"available"}'),
('room-401',401,4,'{"id":"room-401","roomNumber":401,"floor":4,"capacity":5,"bedInfo":"5 tekli yatak","price":"4.000–5.500 ₺","status":"available"}'),
('room-402',402,4,'{"id":"room-402","roomNumber":402,"floor":4,"capacity":2,"bedInfo":"1 duble yatak","price":"2.000–2.500 ₺","note":"1 tekli yatak ilave edilebilir","status":"available"}'),
('room-403',403,4,'{"id":"room-403","roomNumber":403,"floor":4,"capacity":4,"bedInfo":"1 duble + 2 tekli yatak","price":"3.000–4.500 ₺","status":"available"}'),
('room-404',404,4,'{"id":"room-404","roomNumber":404,"floor":4,"capacity":2,"bedInfo":"1 duble yatak","price":"2.000–2.500 ₺","status":"available"}'),
('room-301',301,3,'{"id":"room-301","roomNumber":301,"floor":3,"capacity":3,"bedInfo":"3 tekli yatak","price":"2.500–3.000 ₺","note":"Banyo/WC içeride","status":"available"}'),
('room-302',302,3,'{"id":"room-302","roomNumber":302,"floor":3,"capacity":2,"bedInfo":"2 tekli yatak","price":"2.000–2.500 ₺","note":"Banyo/WC içeride","status":"available"}'),
('room-303',303,3,'{"id":"room-303","roomNumber":303,"floor":3,"capacity":3,"bedInfo":"3 tekli yatak","price":"2.500–3.000 ₺","note":"Banyo/WC içeride","status":"available"}'),
('room-304',304,3,'{"id":"room-304","roomNumber":304,"floor":3,"capacity":4,"bedInfo":"4 tekli yatak","price":"2.500–4.500 ₺","status":"available"}'),
('room-305',305,3,'{"id":"room-305","roomNumber":305,"floor":3,"capacity":1,"bedInfo":"1 tekli yatak","price":"1.250–1.500 ₺","monthlyPrice":"17.500 ₺ / ay","status":"available"}'),
('room-306',306,3,'{"id":"room-306","roomNumber":306,"floor":3,"capacity":2,"bedInfo":"2 tekli yatak","price":"1.800–2.500 ₺","note":"Banyo/WC kapının karşısında","status":"available"}'),
('room-201',201,2,'{"id":"room-201","roomNumber":201,"floor":2,"capacity":3,"bedInfo":"3 tekli yatak","price":"2.500–3.000 ₺","note":"Banyo/WC içeride","status":"available"}'),
('room-202',202,2,'{"id":"room-202","roomNumber":202,"floor":2,"capacity":2,"bedInfo":"2 tekli yatak","price":"2.000–2.500 ₺","note":"Banyo/WC içeride","status":"available"}'),
('room-203',203,2,'{"id":"room-203","roomNumber":203,"floor":2,"capacity":3,"bedInfo":"3 tekli yatak","price":"2.500–3.000 ₺","note":"Banyo/WC içeride","status":"available"}'),
('room-204',204,2,'{"id":"room-204","roomNumber":204,"floor":2,"capacity":4,"bedInfo":"4 tekli yatak","price":"2.500–4.500 ₺","status":"available"}'),
('room-205',205,2,'{"id":"room-205","roomNumber":205,"floor":2,"capacity":1,"bedInfo":"Uzun süreli konaklama","monthlyPrice":"13.000 ₺ / ay","note":"Aylık verilmiş","status":"available"}'),
('room-206',206,2,'{"id":"room-206","roomNumber":206,"floor":2,"capacity":2,"bedInfo":"2 tekli yatak","price":"1.800–2.500 ₺","note":"Banyo/WC kapının karşısında","status":"available"}'),
('room-101',101,1,'{"id":"room-101","roomNumber":101,"floor":1,"capacity":2,"bedInfo":"—","note":"Şu an depo olarak kullanılıyor","status":"out_of_service"}'),
('room-102',102,1,'{"id":"room-102","roomNumber":102,"floor":1,"capacity":2,"bedInfo":"Oda yatağı","price":"Yaklaşık 1.500 ₺","status":"available"}'),
('room-103',103,1,'{"id":"room-103","roomNumber":103,"floor":1,"capacity":2,"bedInfo":"Oda yatağı","price":"Yaklaşık 1.500 ₺","status":"available"}'),
('room-104',104,1,'{"id":"room-104","roomNumber":104,"floor":1,"capacity":4,"bedInfo":"4 tekli yatak","price":"2.500–4.500 ₺","status":"available"}')
on conflict (id) do nothing;

-- İlk kullanıcı kayıt olduktan sonra onu admin yapmak için e-postayı değiştirip çalıştırın:
-- update public.profiles set role = 'admin', approval_status = 'approved'
-- where email = 'ilk-admin@ornek.com';
