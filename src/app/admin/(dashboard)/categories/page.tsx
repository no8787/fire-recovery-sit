import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "./actions";

export const metadata: Metadata = { title: "카테고리 관리", robots: { index: false, follow: false } };

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
const labelClass = "mb-1 block text-xs font-semibold text-slate-600";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { supabase } = await requireEditor();
  const { error } = await searchParams;

  const { data: categories } = await supabase
    .from("project_categories")
    .select("*")
    .order("kind")
    .order("sort_order");

  const construction = (categories ?? []).filter((c) => c.kind === "construction");
  const fireCase = (categories ?? []).filter((c) => c.kind === "fire_case");

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <h1 className="text-xl font-extrabold text-slate-900">카테고리 관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          시공사례(projects)가 참조하는 카테고리입니다. 사용 중인 카테고리는 삭제할 수 없습니다.
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-bold text-slate-900">새 카테고리 등록</p>
          <form action={createCategoryAction} className="mt-3 grid gap-3 sm:grid-cols-5">
            <div>
              <label className={labelClass}>구분</label>
              <select name="kind" className={inputClass} defaultValue="construction">
                <option value="construction">시공실적</option>
                <option value="fire_case">화재복구 사례</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>slug</label>
              <input name="slug" required className={inputClass} placeholder="예: hospital" />
            </div>
            <div>
              <label className={labelClass}>라벨</label>
              <input name="label" required className={inputClass} placeholder="예: 병원" />
            </div>
            <div>
              <label className={labelClass}>설명(선택)</label>
              <input name="description" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>정렬순서</label>
              <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
            </div>
            <div className="sm:col-span-5">
              <Button type="submit" size="md">
                등록
              </Button>
            </div>
          </form>
        </div>

        {[
          { title: "시공실적 카테고리", rows: construction },
          { title: "화재복구 사례 카테고리", rows: fireCase },
        ].map((group) => (
          <div key={group.title} className="mt-8">
            <p className="text-sm font-bold text-slate-900">{group.title}</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-3 py-2">slug</th>
                    <th className="px-3 py-2">라벨</th>
                    <th className="px-3 py-2">설명</th>
                    <th className="px-3 py-2">정렬</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {group.rows.map((cat) => (
                    <tr key={cat.id}>
                      <td className="px-3 py-2 font-mono text-xs text-slate-500">{cat.slug}</td>
                      <td colSpan={4} className="px-0 py-2">
                        <form
                          action={updateCategoryAction}
                          className="flex flex-wrap items-center gap-2 px-3"
                        >
                          <input type="hidden" name="id" value={cat.id} />
                          <input
                            name="label"
                            defaultValue={cat.label}
                            className={`${inputClass} w-32`}
                          />
                          <input
                            name="description"
                            defaultValue={cat.description ?? ""}
                            className={`${inputClass} w-48`}
                          />
                          <input
                            name="sort_order"
                            type="number"
                            defaultValue={cat.sort_order}
                            className={`${inputClass} w-20`}
                          />
                          <Button type="submit" size="md" variant="outline">
                            저장
                          </Button>
                          <button
                            type="submit"
                            form={`delete-${cat.id}`}
                            className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            삭제
                          </button>
                        </form>
                        <form id={`delete-${cat.id}`} action={deleteCategoryAction} className="hidden">
                          <input type="hidden" name="id" value={cat.id} />
                        </form>
                      </td>
                    </tr>
                  ))}
                  {group.rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                        등록된 카테고리가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
