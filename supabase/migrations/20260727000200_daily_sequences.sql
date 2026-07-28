-- ============================================================================
-- 0002. daily_sequences + 상담번호 채번 함수
-- 형식: FIRE-YYYYMMDD-0001 (Asia/Seoul 기준 날짜, 하루 단위로 0001부터 재시작)
-- INSERT ... ON CONFLICT ... DO UPDATE ... RETURNING 단일 원자적 SQL로 동시접수 중복을 방지한다.
-- ============================================================================

create table if not exists public.daily_sequences (
  seq_date date primary key,
  last_value integer not null default 0
);

comment on table public.daily_sequences is '상담번호(FIRE-YYYYMMDD-0001) 채번 전용 카운터. 애플리케이션에서 직접 접근하지 않는다.';

create or replace function public.next_inquiry_no()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date date := (now() at time zone 'Asia/Seoul')::date;
  v_next integer;
begin
  insert into public.daily_sequences (seq_date, last_value)
  values (v_date, 1)
  on conflict (seq_date)
  do update set last_value = public.daily_sequences.last_value + 1
  returning last_value into v_next;

  return 'FIRE-' || to_char(v_date, 'YYYYMMDD') || '-' || lpad(v_next::text, 4, '0');
end;
$$;

comment on function public.next_inquiry_no() is
  '단일 원자적 upsert(INSERT..ON CONFLICT..DO UPDATE..RETURNING)로 동시접수에도 중복 없는 상담번호를 발급한다.';

-- daily_sequences는 애플리케이션/스태프 누구도 직접 조회·수정할 필요가 없다.
-- RLS를 켜고 정책을 하나도 만들지 않아 전체 차단하며, next_inquiry_no()는
-- SECURITY DEFINER(postgres 소유)로 실행되어 이 RLS를 우회해 정상 동작한다.
alter table public.daily_sequences enable row level security;
