-- ============================================================================
-- 0003. inquiries (상담 접수)
-- src/lib/types.ts의 ContactFormValues / src/components/contact/ContactForm.tsx 필드에 맞춰 설계.
-- 공개 방문자는 INSERT만 가능하고 SELECT는 불가하다(자기 접수 조회 UI 없음, 상담번호로만 확인 가능).
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'inquiry_type') then
    create type public.inquiry_type as enum ('긴급화재복구', '일반상담', '현장방문', '협력문의');
  end if;
  if not exists (select 1 from pg_type where typname = 'insurance_status') then
    create type public.insurance_status as enum ('yes', 'no', 'unknown');
  end if;
  if not exists (select 1 from pg_type where typname = 'inquiry_status') then
    create type public.inquiry_status as enum ('new', 'in_progress', 'visited', 'quoted', 'completed', 'closed');
  end if;
end $$;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_no text unique,
  inquiry_type public.inquiry_type not null,
  name text not null,
  company_name text,
  phone text not null,
  email text,
  site_address text not null,
  building_type text not null,
  fire_date date,
  damage_description text not null,
  has_insurance public.insurance_status not null default 'unknown',
  preferred_visit_date date,
  message text,
  privacy_agreed boolean not null default false,
  status public.inquiry_status not null default 'new',
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.inquiries is
  '화재복구 상담 접수. ContactForm.tsx 제출 데이터가 저장되는 테이블.';
comment on column public.inquiries.inquiry_no is 'FIRE-YYYYMMDD-0001 형식, BEFORE INSERT 트리거로 자동 채번.';
comment on column public.inquiries.building_type is 'BuildingType(TS) 값을 그대로 저장. 목록이 계속 넓어질 수 있어 enum이 아닌 text.';

drop trigger if exists trg_inquiries_set_updated_at on public.inquiries;
create trigger trg_inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- BEFORE INSERT 트리거: inquiry_no가 비어 있으면 next_inquiry_no()로 자동 세팅
-- ---------------------------------------------------------------------------
create or replace function public.set_inquiry_no()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.inquiry_no is null then
    new.inquiry_no := public.next_inquiry_no();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_inquiry_no on public.inquiries;
create trigger trg_set_inquiry_no
before insert on public.inquiries
for each row execute function public.set_inquiry_no();

-- ---------------------------------------------------------------------------
-- RLS: 공개 방문자는 INSERT만(SELECT 불가). counselor 이상은 CRUD 전체.
-- ---------------------------------------------------------------------------
alter table public.inquiries enable row level security;

drop policy if exists "inquiries_insert_public" on public.inquiries;
create policy "inquiries_insert_public"
on public.inquiries for insert
with check (true);

drop policy if exists "inquiries_all_staff" on public.inquiries;
create policy "inquiries_all_staff"
on public.inquiries for all
using (public.is_counselor_or_above())
with check (public.is_counselor_or_above());
