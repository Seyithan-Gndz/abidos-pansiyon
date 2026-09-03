-- Supabase Dashboard > SQL Editor içinde tek sefer çalıştırın.

create type public.user_role as enum ('admin', 'reception');
create type public.approval_status as enum ('pending', 'approved', 'rejected');

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

