import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { updatePostAction } from "../actions";

export const metadata: Metadata = { title: "게시글 수정", robots: { index: false, follow: false } };

const inputClass =
  "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-800";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const { supabase } = await requireEditor();

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();

  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-900">게시글 수정</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
            {post.status === "published" ? "공개" : "비공개"}
          </span>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {saved && (
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            저장되었습니다.
          </p>
        )}

        <form action={updatePostAction} className="mt-6 space-y-5">
          <input type="hidden" name="id" value={post.id} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>슬러그(수정 불가)</label>
              <input value={post.slug} disabled className={`${inputClass} bg-slate-50 text-slate-400`} />
            </div>
            <div>
              <label className={labelClass}>카테고리</label>
              <select name="category" defaultValue={post.category} className={inputClass}>
                <option value="guide">화재복구정보</option>
                <option value="notice">공지사항</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>제목</label>
            <input name="title" required defaultValue={post.title} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>요약(선택)</label>
            <input name="excerpt" defaultValue={post.excerpt ?? ""} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>본문</label>
            <textarea
              name="content"
              required
              rows={10}
              defaultValue={post.content}
              className={inputClass}
            />
          </div>

          <Button type="submit" size="lg">
            저장
          </Button>
        </form>
      </Container>
    </section>
  );
}
