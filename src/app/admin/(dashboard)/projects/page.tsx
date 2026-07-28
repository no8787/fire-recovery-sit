import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { togglePublishAction, deleteProjectAction } from "./actions";

export const metadata: Metadata = { title: "시공사례 관리", robots: { index: false, follow: false } };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; kind?: string }>;
}) {
  const { supabase } = await requireEditor();
  const { error, kind } = await searchParams;
  const activeKind = kind === "fire_case" ? "fire_case" : "construction";

  const { data: projects } = await supabase
    .from("projects")
    .select("id, slug, title, status, is_featured, sort_order, kind, project_categories(label)")
    .eq("kind", activeKind)
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold text-slate-900">시공사례 관리</h1>
          <Button href="/admin/projects/new" size="md">
            새 시공사례 등록
          </Button>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Link
            href="/admin/projects?kind=construction"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              activeKind === "construction"
                ? "bg-orange-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            시공실적
          </Link>
          <Link
            href="/admin/projects?kind=fire_case"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              activeKind === "fire_case" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            화재복구 사례
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-3 py-2">제목</th>
                <th className="px-3 py-2">카테고리</th>
                <th className="px-3 py-2">정렬</th>
                <th className="px-3 py-2">대표</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(projects ?? []).map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="font-semibold text-slate-900 hover:text-orange-600"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {(p.project_categories as unknown as { label: string } | null)?.label ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-500">{p.sort_order}</td>
                  <td className="px-3 py-2">{p.is_featured ? "★" : ""}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {p.status === "published" ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <form action={togglePublishAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <input
                          type="hidden"
                          name="next_status"
                          value={p.status === "published" ? "draft" : "published"}
                        />
                        <button
                          type="submit"
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          {p.status === "published" ? "비공개 전환" : "공개 전환"}
                        </button>
                      </form>
                      <form action={deleteProjectAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmSubmitButton
                          confirmMessage={`"${p.title}"을(를) 완전히 삭제할까요? 이미지도 함께 삭제되며 되돌릴 수 없습니다.`}
                          className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          삭제
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(projects ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                    등록된 시공사례가 없습니다.
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
