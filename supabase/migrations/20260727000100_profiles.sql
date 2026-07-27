-- ============================================================================
-- 0001. profiles + RBAC 헬퍼 함수
-- 관리자/스태프 계정을 위한 auth.users 확장 테이블과, 이후 모든 마이그레이션의
-- RLS 정책이 공통으로 사용하는 역할 판별 함수(is_staff, is_admin_or_above 등)를 정의한다.
-- 역할 계층: super_admin > admin > counselor(상담 전담) / editor(콘텐츠 전담)
-- ============================================================================

create extension if not exists "pgcrypto";

create type public.user_role as enum ('super_admin', 'admin', 'counselor', 'editor');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'counselor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is '관리자/스태프 계정 프로필. auth.users 1:1 확장.';
comment on column public.profiles.role is 'super_admin/admin/counselor/editor. counselor=상담 전담, editor=콘텐츠 전담.';

-- ---------------------------------------------------------------------------
-- updated_at 자동 갱신 (모든 테이블에서 재사용)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 신규 가입(auth.users insert) 시 profiles 행 자동 생성 (기본 role=counselor)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    'counselor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- role 변경은 super_admin만 가능하도록 강제 (RLS만으로는 컬럼 단위 제어가 번거로워 트리거로 보강)
-- ---------------------------------------------------------------------------
create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_super_admin() then
    raise exception 'role 변경은 super_admin만 가능합니다';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- RBAC 헬퍼 함수 (SECURITY DEFINER: profiles RLS와의 순환 참조를 피하기 위해
-- postgres 소유로 실행되어 RLS를 우회한 채 role을 조회한다)
-- ---------------------------------------------------------------------------
create or replace function public.has_any_role(roles public.user_role[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true and role = any(roles)
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_any_role(array['super_admin', 'admin', 'counselor', 'editor']::public.user_role[]);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_any_role(array['super_admin']::public.user_role[]);
$$;

create or replace function public.is_admin_or_above()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_any_role(array['super_admin', 'admin']::public.user_role[]);
$$;

create or replace function public.is_counselor_or_above()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_any_role(array['super_admin', 'admin', 'counselor']::public.user_role[]);
$$;

create or replace function public.is_editor_or_above()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_any_role(array['super_admin', 'admin', 'editor']::public.user_role[]);
$$;

-- guard_profile_role_change()가 is_super_admin()을 참조하므로 함수 정의 이후에 트리거 등록
create trigger trg_guard_profile_role_change
before update on public.profiles
for each row execute function public.guard_profile_role_change();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_self_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin_or_above());

create policy "profiles_update_self_or_admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin_or_above())
with check (id = auth.uid() or public.is_admin_or_above());

create policy "profiles_delete_super_admin"
on public.profiles for delete
using (public.is_super_admin());
-- INSERT는 handle_new_user() 트리거(SECURITY DEFINER)로만 이루어지며,
-- 클라이언트의 직접 INSERT는 정책이 없어 기본적으로 거부된다.
