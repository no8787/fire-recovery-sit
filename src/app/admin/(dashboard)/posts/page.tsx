import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { togglePostPublishAction, deletePostAction } from "./actions";

export const metadata: Metadata = { title: "게시글 관리", robots: { index: false, follow: false } };

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { supabase } = await requireEditor();
  const { error } = await searchParams;

  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, category, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold text-slate-900">게시글 관리</h1>
          <Button href="/admin/posts/new" size="md">
            새 게시글 등록
          </Button>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-3 py-2">제목</th>
                <th className="px-3 py-2">카테고리</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(posts ?? []).map((post) => (
                <tr key={post.id}>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-semibold text-slate-900 hover:text-orange-600"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-slate-500">{post.category}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {post.status === "published" ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <form action={togglePostPublishAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input
                          type="hidden"
                          name="next_status"
                          value={post.status === "published" ? "draft" : "published"}
                        />
                        <button
                          type="submit"
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          {post.status === "published" ? "비공개 전환" : "공개 전환"}
                        </button>
                      </form>
                      <form action={deletePostAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`"${post.title}"을(를) 삭제할까요?`}
                          className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          삭제
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(posts ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-slate-400">
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
