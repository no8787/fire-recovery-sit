-- ============================================================================
-- 0010. projects.sort_order 추가 + project_images.caption/alt_text 추가
-- Sprint 2-2 관리자 화면(시공사례 정렬순서, 이미지 alt/caption 입력)을 위한 보완 마이그레이션.
-- 전부 ADD COLUMN ... DEFAULT 형태의 순수 추가라 기존 데이터에 영향 없는 안전한 마이그레이션이다.
-- ============================================================================

alter table public.projects
  add column if not exists sort_order integer not null default 0;

comment on column public.projects.sort_order is '관리자 화면에서 지정하는 목록 정렬순서(작을수록 먼저 노출).';

create index if not exists projects_sort_order_idx on public.projects (kind, category_id, sort_order);

alter table public.project_images
  add column if not exists caption text,
  add column if not exists alt_text text;

comment on column public.project_images.caption is '이미지 하단에 노출할 짧은 설명(예: STEP 1 · 화재 직후).';
comment on column public.project_images.alt_text is '접근성을 위한 대체텍스트. 비어 있으면 프로젝트 제목으로 대체한다.';
