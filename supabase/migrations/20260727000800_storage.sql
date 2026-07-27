-- ============================================================================
-- 0008. Storage 버킷 + RLS
-- inquiry-files: 비공개(상담 첨부파일, staff만 조회)
-- project-images: 공개(시공실적/화재복구 사례 사진)
-- post-images: 공개(공지/가이드 게시글 이미지)
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('inquiry-files', 'inquiry-files', false, 10485760),
  ('project-images', 'project-images', true, 10485760),
  ('post-images', 'post-images', true, 10485760)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- inquiry-files: 공개 방문자는 업로드(INSERT)만 가능, 조회/삭제는 counselor 이상만.
-- ---------------------------------------------------------------------------
create policy "inquiry_files_bucket_insert_public"
on storage.objects for insert
with check (bucket_id = 'inquiry-files');

create policy "inquiry_files_bucket_select_staff"
on storage.objects for select
using (bucket_id = 'inquiry-files' and public.is_counselor_or_above());

create policy "inquiry_files_bucket_delete_staff"
on storage.objects for delete
using (bucket_id = 'inquiry-files' and public.is_counselor_or_above());

-- ---------------------------------------------------------------------------
-- project-images: 누구나 조회 가능(공개 버킷), 쓰기는 editor 이상만.
-- ---------------------------------------------------------------------------
create policy "project_images_bucket_select_public"
on storage.objects for select
using (bucket_id = 'project-images');

create policy "project_images_bucket_insert_editor"
on storage.objects for insert
with check (bucket_id = 'project-images' and public.is_editor_or_above());

create policy "project_images_bucket_update_editor"
on storage.objects for update
using (bucket_id = 'project-images' and public.is_editor_or_above())
with check (bucket_id = 'project-images' and public.is_editor_or_above());

create policy "project_images_bucket_delete_editor"
on storage.objects for delete
using (bucket_id = 'project-images' and public.is_editor_or_above());

-- ---------------------------------------------------------------------------
-- post-images: 누구나 조회 가능(공개 버킷), 쓰기는 editor 이상만.
-- ---------------------------------------------------------------------------
create policy "post_images_bucket_select_public"
on storage.objects for select
using (bucket_id = 'post-images');

create policy "post_images_bucket_insert_editor"
on storage.objects for insert
with check (bucket_id = 'post-images' and public.is_editor_or_above());

create policy "post_images_bucket_update_editor"
on storage.objects for update
using (bucket_id = 'post-images' and public.is_editor_or_above())
with check (bucket_id = 'post-images' and public.is_editor_or_above());

create policy "post_images_bucket_delete_editor"
on storage.objects for delete
using (bucket_id = 'post-images' and public.is_editor_or_above());
