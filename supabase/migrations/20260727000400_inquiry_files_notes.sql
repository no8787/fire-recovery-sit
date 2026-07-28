-- ============================================================================
-- 0004. inquiry_files (상담 첨부파일) / inquiry_notes (상담원 내부 메모)
-- ============================================================================

create table if not exists public.inquiry_files (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  file_size integer,
  mime_type text,
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

comment on table public.inquiry_files is
  '상담 접수 시 첨부한 피해 사진 등. storage.objects의 inquiry-files 버킷 경로(storage_path)를 참조.';

create table if not exists public.inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  note text not null,
  created_at timestamptz not null default now()
);

comment on table public.inquiry_notes is '상담원/관리자만 보는 내부 메모. 공개 방문자에게는 절대 노출하지 않는다.';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.inquiry_files enable row level security;

-- 공개 방문자: 상담 접수 직후 첨부파일 메타데이터 INSERT만 가능(SELECT 불가).
-- 실제 업로드는 서버 API route(service_role)를 경유하지만, 클라이언트 직접 접근 경로도 열어둔다.
drop policy if exists "inquiry_files_insert_public" on public.inquiry_files;
create policy "inquiry_files_insert_public"
on public.inquiry_files for insert
with check (true);

drop policy if exists "inquiry_files_all_staff" on public.inquiry_files;
create policy "inquiry_files_all_staff"
on public.inquiry_files for all
using (public.is_counselor_or_above())
with check (public.is_counselor_or_above());

alter table public.inquiry_notes enable row level security;

-- inquiry_notes는 공개 방문자에게 어떤 정책도 부여하지 않는다(기본 전체 차단).
drop policy if exists "inquiry_notes_all_staff" on public.inquiry_notes;
create policy "inquiry_notes_all_staff"
on public.inquiry_notes for all
using (public.is_counselor_or_above())
with check (public.is_counselor_or_above());
