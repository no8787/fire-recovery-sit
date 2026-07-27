-- ============================================================================
-- 0007. activity_logs
-- 관리자/스태프의 주요 조작(상담 상태 변경, 콘텐츠 작성 등)을 기록하는 감사 로그.
-- ============================================================================

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

comment on table public.activity_logs is
  '감사 로그. action 예: inquiry.status_changed, project.created, post.published 등. 수정/삭제 불가(append-only).';

-- 애플리케이션 코드가 매번 INSERT 문을 직접 만들지 않도록 헬퍼 함수를 제공한다.
create or replace function public.log_activity(
  p_action text,
  p_target_table text default null,
  p_target_id uuid default null,
  p_metadata jsonb default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.activity_logs (actor_id, action, target_table, target_id, metadata)
  values (auth.uid(), p_action, p_target_table, p_target_id, p_metadata)
  returning id into v_id;
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS: 조회는 admin 이상만, 기록은 log_activity() 함수(SECURITY DEFINER)를 통해서만.
-- update/delete 정책이 없어 append-only로 동작한다.
-- ---------------------------------------------------------------------------
alter table public.activity_logs enable row level security;

create policy "activity_logs_select_admin"
on public.activity_logs for select
using (public.is_admin_or_above());

create policy "activity_logs_insert_staff"
on public.activity_logs for insert
with check (public.is_staff());
