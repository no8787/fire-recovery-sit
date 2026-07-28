import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { createFaqAction, updateFaqAction, toggleFaqPublishAction, deleteFaqAction } from "./actions";

export const metadata: Metadata = { title: "FAQ 관리", robots: { index: false, follow: false } };

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
const labelClass = "mb-1 block text-xs font-semibold text-slate-600";

export default async function AdminFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { supabase } = await requireEditor();
  const { error } = await searchParams;

  const { data: items } = await supabase
    .from("faq_items")
    .select("*")
    .order("sort_order")
    .order("created_at");

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <h1 className="text-xl font-extrabold text-slate-900">FAQ 관리</h1>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-bold text-slate-900">새 FAQ 등록</p>
          <form action={createFaqAction} className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={labelClass}>카테고리</label>
                <input name="category" defaultValue="일반" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>정렬순서</label>
                <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>질문</label>
              <input name="question" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>답변</label>
              <textarea name="answer" required rows={3} className={inputClass} />
            </div>
            <Button type="submit" size="md">
              등록
            </Button>
          </form>
        </div>

        <div className="mt-6 space-y-3">
          {(items ?? []).map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <form action={updateFaqAction} className="space-y-2">
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-2 sm:grid-cols-4">
                  <input name="category" defaultValue={item.category} className={inputClass} />
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={item.sort_order}
                    className={inputClass}
                  />
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status === "published" ? "공개" : "비공개"}
                  </span>
                </div>
                <input name="question" defaultValue={item.question} className={inputClass} />
                <textarea name="answer" defaultValue={item.answer} rows={2} className={inputClass} />
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" size="md" variant="outline">
                    저장
                  </Button>
                </div>
              </form>
              <div className="mt-2 flex flex-wrap gap-2">
                <form action={toggleFaqPublishAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input
                    type="hidden"
                    name="next_status"
                    value={item.status === "published" ? "draft" : "published"}
                  />
                  <button
                    type="submit"
                    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {item.status === "published" ? "비공개 전환" : "공개 전환"}
                  </button>
                </form>
                <form action={deleteFaqAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmitButton
                    confirmMessage="이 FAQ를 삭제할까요?"
                    className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    삭제
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
          {(items ?? []).length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
              등록된 FAQ가 없습니다.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
