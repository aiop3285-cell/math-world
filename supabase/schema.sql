-- Math World schema and secure scoring foundation.
-- Apply this file to a fresh database or use the versioned migration.


create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'طالب',
  phone text default '',
  role text not null default 'student' check (role in ('student','admin')),
  points integer not null default 0 check (points >= 0),
  notify_tracks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create index if not exists profiles_points_idx on public.profiles (points desc);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
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

drop policy if exists "read own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "leaderboard read" on public.profiles;
drop policy if exists "admin manages all" on public.profiles;

create policy "insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());
create policy "admin manages all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.prevent_sensitive_profile_changes()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() and (
    new.points is distinct from old.points
    or new.role is distinct from old.role
    or new.created_at is distinct from old.created_at
  ) then
    raise exception 'sensitive_profile_fields_are_server_managed';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_sensitive_profile_fields on public.profiles;
create trigger protect_sensitive_profile_fields
  before update on public.profiles
  for each row execute function public.prevent_sensitive_profile_changes();

create table if not exists public.activity_catalog (
  activity_key text primary key,
  activity_type text not null check (activity_type in ('lesson','quiz','final'))
);
alter table public.activity_catalog enable row level security;

insert into public.activity_catalog (activity_key, activity_type) values
('lesson:lim-l1','lesson'),('lesson:lim-l2','lesson'),('lesson:lim-l3','lesson'),('lesson:lim-l4','lesson'),('lesson:lim-l5','lesson'),
('lesson:drv-l1','lesson'),('lesson:drv-l2','lesson'),('lesson:drv-l3','lesson'),('lesson:drv-l4','lesson'),('lesson:drv-l5','lesson'),
('lesson:int-l1','lesson'),('lesson:int-l2','lesson'),('lesson:int-l3','lesson'),('lesson:int-l4','lesson'),
('lesson:ode-l1','lesson'),('lesson:ode-l2','lesson'),('lesson:ode-l3','lesson'),('lesson:ode-l4','lesson'),
('lesson:lap-l1','lesson'),('lesson:lap-l2','lesson'),('lesson:lap-l3','lesson'),('lesson:lap-l4','lesson'),
('lesson:mat-l1','lesson'),('lesson:mat-l2','lesson'),('lesson:mat-l3','lesson'),('lesson:mat-l4','lesson'),
('lesson:eng-l1','lesson'),('lesson:eng-l2','lesson'),('lesson:eng-l3','lesson'),('lesson:eng-l4','lesson'),('lesson:eng-l5','lesson'),('lesson:eng-l6','lesson'),('lesson:eng-l7','lesson'),
('quiz:lim-u1','quiz'),('quiz:lim-u2','quiz'),('quiz:drv-u1','quiz'),('quiz:drv-u2','quiz'),
('quiz:int-u1','quiz'),('quiz:int-u2','quiz'),('quiz:ode-u1','quiz'),('quiz:ode-u2','quiz'),
('quiz:lap-u1','quiz'),('quiz:lap-u2','quiz'),('quiz:mat-u1','quiz'),('quiz:mat-u2','quiz'),
('quiz:engadv-u1','quiz'),('quiz:engadv-u2','quiz'),('quiz:engadv-u3','quiz'),
('final:prep','final'),('final:secondary','final'),('final:university','final'),('final:engineering','final')
on conflict (activity_key) do nothing;

create table if not exists public.activity_claims (
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_key text not null,
  activity_type text not null check (activity_type in ('lesson','quiz','final','practice','challenge')),
  score_pct integer check (score_pct is null or score_pct between 0 and 100),
  awarded_points integer not null default 0 check (awarded_points >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, activity_key)
);
alter table public.activity_claims enable row level security;
drop policy if exists "read own activity claims" on public.activity_claims;
create policy "read own activity claims" on public.activity_claims
  for select using (auth.uid() = user_id or public.is_admin());

create table if not exists public.student_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.student_progress enable row level security;
drop policy if exists "read own progress" on public.student_progress;
create policy "read own progress" on public.student_progress
  for select using (auth.uid() = user_id or public.is_admin());

create or replace function public.claim_activity(
  p_activity_key text,
  p_activity_type text,
  p_score_pct integer default null,
  p_correct_count integer default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_key text := trim(coalesce(p_activity_key, ''));
  v_type text := lower(trim(coalesce(p_activity_type, '')));
  v_award integer := 0;
  v_total integer := 0;
  v_existing public.activity_claims%rowtype;
begin
  if v_user is null then raise exception 'authentication_required'; end if;
  if v_key = '' or length(v_key) > 160 then raise exception 'invalid_activity_key'; end if;
  if v_type not in ('lesson','quiz','final','practice','challenge') then raise exception 'invalid_activity_type'; end if;
  if p_score_pct is not null and (p_score_pct < 0 or p_score_pct > 100) then raise exception 'invalid_score'; end if;
  if p_correct_count is not null and (p_correct_count < 0 or p_correct_count > 1000) then raise exception 'invalid_correct_count'; end if;

  if v_type in ('lesson','quiz','final') and not exists (
    select 1 from public.activity_catalog where activity_key = v_key and activity_type = v_type
  ) then
    raise exception 'unknown_activity';
  end if;
  if v_type = 'practice' and v_key !~ '^practice:[A-Za-z0-9_-]{8,120}$' then raise exception 'invalid_practice_key'; end if;
  if v_type = 'challenge' and v_key !~ '^challenge:[0-9]{8}$' then raise exception 'invalid_challenge_key'; end if;

  if v_type = 'lesson' then v_award := 15;
  elsif v_type = 'quiz' then
    if coalesce(p_score_pct, 0) >= 60 then v_award := 30; end if;
    if coalesce(p_score_pct, 0) = 100 then v_award := 40; end if;
  elsif v_type = 'final' then
    if coalesce(p_score_pct, 0) >= 60 then v_award := 50; end if;
  elsif v_type = 'practice' then
    v_award := least(20, greatest(0, coalesce(p_correct_count, 0) * 2));
  elsif v_type = 'challenge' then
    if coalesce(p_score_pct, 0) = 100 then v_award := 20; end if;
  end if;

  insert into public.activity_claims (user_id, activity_key, activity_type, score_pct, awarded_points, metadata, updated_at)
  values (v_user, v_key, v_type, p_score_pct, v_award, coalesce(p_metadata, '{}'::jsonb), now())
  on conflict (user_id, activity_key) do nothing;

  if not found then
    select * into v_existing
    from public.activity_claims
    where user_id = v_user and activity_key = v_key
    for update;

    v_award := 0;
    if v_type = 'quiz' and coalesce(p_score_pct, 0) = 100
       and coalesce(v_existing.score_pct, 0) < 100 then
      v_award := 10;
      update public.activity_claims
      set score_pct = 100, awarded_points = awarded_points + 10, updated_at = now()
      where user_id = v_user and activity_key = v_key;
    elsif v_type in ('quiz','final') and p_score_pct is not null
       and p_score_pct > coalesce(v_existing.score_pct, 0) then
      update public.activity_claims
      set score_pct = p_score_pct, updated_at = now()
      where user_id = v_user and activity_key = v_key;
    end if;
  end if;

  if v_award > 0 then
    update public.profiles set points = points + v_award where id = v_user returning points into v_total;
  else
    select points into v_total from public.profiles where id = v_user;
  end if;
  if v_total is null then v_total := 0; end if;

  return jsonb_build_object(
    'activity_key', v_key,
    'awarded_points', v_award,
    'total_points', v_total,
    'duplicate', v_award = 0
  );
end;
$$;

grant execute on function public.claim_activity(text, text, integer, integer, jsonb) to authenticated;

create or replace function public.get_my_progress()
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'points', coalesce((select points from public.profiles where id = auth.uid()), 0),
    'completed_lessons', coalesce((
      select jsonb_agg(substr(activity_key, 8) order by created_at)
      from public.activity_claims where user_id = auth.uid() and activity_type = 'lesson'
    ), '[]'::jsonb),
    'passed_quizzes', coalesce((
      select jsonb_agg(substr(activity_key, 6) order by created_at)
      from public.activity_claims where user_id = auth.uid() and activity_type = 'quiz' and score_pct >= 60
    ), '[]'::jsonb),
    'quiz_scores', coalesce((
      select jsonb_object_agg(substr(activity_key, 6), score_pct)
      from public.activity_claims where user_id = auth.uid() and activity_type = 'quiz' and score_pct is not null
    ), '{}'::jsonb)
  );
$$;
grant execute on function public.get_my_progress() to authenticated;

create or replace function public.save_progress_snapshot(p_progress jsonb)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  insert into public.student_progress (user_id, data, updated_at)
  values (auth.uid(), coalesce(p_progress, '{}'::jsonb) - 'points' - '_progCache', now())
  on conflict (user_id) do update set data = excluded.data, updated_at = now();
  return true;
end;
$$;
grant execute on function public.save_progress_snapshot(jsonb) to authenticated;

create or replace view public.leaderboard_view
with (security_invoker = true)
as
  select id, name, points
  from public.profiles
  where auth.role() = 'authenticated';
grant select on public.leaderboard_view to authenticated;
