import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { createPostAction } from "../actions";

export const metadata: Metadata = { title: "새 게시글 등록", robots: { index: false, follow: false } };

const inputClass =
  "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-800";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-2xl">
        <h1 className="text-xl font-extrabold text-slate-900">새 게시글 등록</h1>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form action={createPostAction} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>슬러그(URL)</label>
              <input name="slug" required pattern="[a-z0-9-]+" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>카테고리</label>
              <select name="category" defaultValue="guide" className={inputClass}>
                <option value="guide">화재복구정보</option>
                <option value="notice">공지사항</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>제목</label>
            <input name="title" required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>요약(선택)</label>
            <input name="excerpt" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>본문</label>
            <textarea name="content" required rows={10} className={inputClass} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="status"
                value="published"
                defaultChecked
                className="h-4 w-4 border-slate-300"
              />
              공개
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="status" value="draft" className="h-4 w-4 border-slate-300" />
              비공개(초안)
            </label>
          </div>

          <Button type="submit" size="lg">
            등록
          </Button>
        </form>
      </Container>
    </section>
  );
}
