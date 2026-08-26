-- ============================================================
-- عالم الرياضيات | Math World — Supabase schema
-- شغّل هذا الملف كاملًا في SQL Editor داخل مشروع Supabase.
-- ============================================================

-- 1) جدول الملفات الشخصية
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text not null default 'طالب',
  phone         text default '',
  role          text not null default 'student' check (role in ('student','admin')),
  points        integer not null default 0 check (points >= 0),
  notify_tracks jsonb   not null default '[]'::jsonb,
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- منع التكرار في قائمة الإشعارات
-- (اختياري) فهرس مساعد
create index if not exists profiles_points_idx on public.profiles (points desc);

-- 2) إنشاء ملف شخصي تلقائيًا مع كل مستخدم جديد
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, 'student'), '@', 1)),
    coalesce(new.phone, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) سياسات RLS — الطالب يرى ويعدّل ملفه فقط
drop policy if exists "read own profile"    on public.profiles;
drop policy if exists "update own profile"  on public.profiles;
drop policy if exists "insert own profile"  on public.profiles;
drop policy if exists "leaderboard read"    on public.profiles;
drop policy if exists "admin manages all"   on public.profiles;

create policy "insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id or is_admin());

-- قراءة الحد الأدنى للوحة الترتيب لكل المستخدمين المسجلين
create policy "leaderboard read"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

create policy "admin manages all"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- 4) دالة تحديد المدير على مستوى الخادم
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- 5) ترقية مدير (نفّذها يدويًا بعد تسجيل حسابك الأول):
--    استبدل البريد أدناه ببريدك ثم شغّل السطرين.
--
-- update public.profiles
--    set role = 'admin'
--  where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================

-- 6) توصيات إعدادات المصادقة (Authentication → Policies):
--    - Minimum password length: 8
--    - Enable "Confirm email" = ON
--    - Rate limits الافتراضية مفعّلة (حماية من التخمين)
-- 7) لتشغيل الهاتف/OTP: Authentication → Providers → Phone
--    اربط مزود SMS (Twilio / MessageBird / Vonage) ثم اجعل
--    PHONE_AUTH_ENABLED: true في env.js
