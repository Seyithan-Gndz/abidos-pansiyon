-- Authentication > Users altında olup public.profiles tablosunda bulunmayan
-- mevcut kullanıcıları resepsiyon/onay bekliyor olarak Personel modülüne ekler.

insert into public.profiles (
  id,
  email,
  full_name,
  role,
  approval_status
)
select
  users.id,
  coalesce(users.email, ''),
  coalesce(users.raw_user_meta_data ->> 'full_name', split_part(coalesce(users.email, ''), '@', 1)),
  'reception'::public.user_role,
  'pending'::public.approval_status
from auth.users as users
left join public.profiles as profiles on profiles.id = users.id
where profiles.id is null
on conflict (id) do nothing;

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;

-- Kontrol sonucu: Authentication kullanıcılarının tamamı burada görünmelidir.
select id, email, full_name, role, approval_status, created_at
from public.profiles
order by created_at;

