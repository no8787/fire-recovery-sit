-- ============================================================================
-- 0006. posts (공지/화재복구정보 가이드) / faq_items
-- src/lib/mock/guide.ts(GuidePost), src/lib/mock/faq.ts(FaqItem)에 대응.
-- ============================================================================

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null default 'guide',
  title text not null,
  excerpt text,
  content text not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  author_id uuid references public.profiles (id),
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.posts is
  '공지/화재복구정보 가이드 게시글. content는 GuidePost.content(문단 배열)를 줄바꿈 2개로 join한 값을 저장.';

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.faq_items is '자주 묻는 질문. src/lib/mock/faq.ts(FaqItem)에 대응.';

drop trigger if exists trg_posts_set_updated_at on public.posts;
create trigger trg_posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_faq_items_set_updated_at on public.faq_items;
create trigger trg_faq_items_set_updated_at
before update on public.faq_items
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: 발행된 항목은 누구나 조회. editor 이상은 draft 포함 전체 CRUD.
-- ---------------------------------------------------------------------------
alter table public.posts enable row level security;

drop policy if exists "posts_select_published_or_editor" on public.posts;
create policy "posts_select_published_or_editor"
on public.posts for select
using (status = 'published' or public.is_editor_or_above());

drop policy if exists "posts_write_editor" on public.posts;
create policy "posts_write_editor"
on public.posts for all
using (public.is_editor_or_above())
with check (public.is_editor_or_above());

alter table public.faq_items enable row level security;

drop policy if exists "faq_items_select_published_or_editor" on public.faq_items;
create policy "faq_items_select_published_or_editor"
on public.faq_items for select
using (status = 'published' or public.is_editor_or_above());

drop policy if exists "faq_items_write_editor" on public.faq_items;
create policy "faq_items_write_editor"
on public.faq_items for all
using (public.is_editor_or_above())
with check (public.is_editor_or_above());
