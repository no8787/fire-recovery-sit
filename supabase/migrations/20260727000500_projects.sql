-- ============================================================================
-- 0005. project_categories / projects / project_images
-- "시공실적"(kind=construction, 지명원 실제 실적)과 "화재복구 사례"(kind=fire_case, 현재 0건)를
-- 같은 테이블 구조로 관리하되 kind 컬럼으로 분리한다.
-- 두 데이터셋의 카테고리 slug가 겹칠 수 있어(예: commercial/public) slug 단독이 아니라
-- (kind, slug) 조합으로 유일성을 보장한다.
-- ============================================================================

create type public.project_kind as enum ('construction', 'fire_case');

create table public.project_categories (
  id uuid primary key default gen_random_uuid(),
  kind public.project_kind not null,
  slug text not null,
  label text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (kind, slug)
);

comment on table public.project_categories is
  'kind=construction: 시공실적 8개 분류(공공기관/병원/학교/복지시설/LH/도시공사/군부대/상업시설). kind=fire_case: 화재복구 사례 분류(현재 데이터 없음, 분류만 준비).';

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  kind public.project_kind not null default 'construction',
  slug text unique not null,
  title text not null,
  category_id uuid not null references public.project_categories (id),
  region text not null,
  building_type text not null,
  project_nature text not null,
  period text not null,
  scope text[] not null default '{}',
  description text not null,
  thumbnail_url text,
  is_featured boolean not null default false,
  is_sample boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published')),
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.projects is
  '/portfolio(시공실적, kind=construction)와 /fire-cases(화재복구 사례, kind=fire_case) 공통 데이터 테이블. src/lib/mock/portfolio.ts, src/lib/data/construction-records.ts, src/lib/data/fire-recovery-cases.ts에 대응.';
comment on column public.projects.project_nature is '기존 TS의 damageType 필드에 대응. 시공실적은 실내인테리어/리모델링/설계 제안 등, 화재복구 사례는 화재/그을음·냄새 등.';

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  storage_path text not null,
  stage text check (stage in ('before', 'during', 'after')),
  is_render boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (project_id, storage_path)
);

comment on table public.project_images is
  'stage가 null이면 단계 구분 없는 갤러리 사진(시공실적), before/during/after면 화재복구 사례의 전/중/후 비교 사진. is_render=true는 3D 렌더링/설계 제안 이미지(실제 시공사진 아님).';
comment on column public.project_images.storage_path is
  'Sprint 2-1 시드에서는 기존 public/images/construction/** 경로 문자열을 그대로 저장(프론트가 계속 정적 파일을 서빙). project-images Storage 버킷으로 실제 업로드/전환하는 작업은 Sprint 2-2 TODO.';

create trigger trg_projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- project.kind가 소속 category.kind와 반드시 일치하도록 강제
create or replace function public.guard_project_kind_matches_category()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category_kind public.project_kind;
begin
  select kind into v_category_kind from public.project_categories where id = new.category_id;
  if v_category_kind is null then
    raise exception 'category_id %가 존재하지 않습니다', new.category_id;
  end if;
  if v_category_kind <> new.kind then
    raise exception 'project.kind(%)가 category.kind(%)와 일치하지 않습니다', new.kind, v_category_kind;
  end if;
  return new;
end;
$$;

create trigger trg_guard_project_kind_matches_category
before insert or update on public.projects
for each row execute function public.guard_project_kind_matches_category();

-- ---------------------------------------------------------------------------
-- RLS: 발행된(published) 항목은 누구나 조회. editor 이상은 draft 포함 전체 CRUD.
-- ---------------------------------------------------------------------------
alter table public.project_categories enable row level security;

create policy "project_categories_select_public"
on public.project_categories for select
using (true);

create policy "project_categories_write_editor"
on public.project_categories for all
using (public.is_editor_or_above())
with check (public.is_editor_or_above());

alter table public.projects enable row level security;

create policy "projects_select_published_or_editor"
on public.projects for select
using (status = 'published' or public.is_editor_or_above());

create policy "projects_write_editor"
on public.projects for all
using (public.is_editor_or_above())
with check (public.is_editor_or_above());

alter table public.project_images enable row level security;

create policy "project_images_select_published_or_editor"
on public.project_images for select
using (
  exists (
    select 1 from public.projects p
    where p.id = project_images.project_id
      and (p.status = 'published' or public.is_editor_or_above())
  )
);

create policy "project_images_write_editor"
on public.project_images for all
using (public.is_editor_or_above())
with check (public.is_editor_or_above());
