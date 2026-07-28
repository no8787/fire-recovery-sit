import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { createProjectAction } from "../actions";

export const metadata: Metadata = { title: "새 시공사례 등록", robots: { index: false, follow: false } };

const inputClass =
  "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-800";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; kind?: string }>;
}) {
  const { supabase } = await requireEditor();
  const { error, kind } = await searchParams;
  const defaultKind = kind === "fire_case" ? "fire_case" : "construction";

  const { data: categories } = await supabase
    .from("project_categories")
    .select("id, kind, slug, label")
    .order("kind")
    .order("sort_order");

  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-2xl">
        <h1 className="text-xl font-extrabold text-slate-900">새 시공사례 등록</h1>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form action={createProjectAction} className="mt-6 space-y-5">
          <div>
            <label className={labelClass}>구분</label>
            <select name="kind" className={inputClass} defaultValue={defaultKind}>
              <option value="construction">시공실적</option>
              <option value="fire_case">화재복구 사례</option>
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>슬러그(URL, 영문/숫자/하이픈)</label>
              <input name="slug" required pattern="[a-z0-9-]+" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>카테고리</label>
              <select name="category_id" required className={inputClass}>
                <option value="">선택해 주세요</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.kind === "construction" ? "시공실적" : "화재복구"}] {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>제목</label>
            <input name="title" required className={inputClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>지역/발주처</label>
              <input name="region" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>건물 유형</label>
              <input name="building_type" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>공사기간</label>
              <input name="period" required className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>공사유형(project_nature)</label>
            <input
              name="project_nature"
              required
              className={inputClass}
              placeholder="예: 실내인테리어, 리모델링, 화재"
            />
          </div>

          <div>
            <label className={labelClass}>공사 범위(한 줄에 하나씩)</label>
            <textarea name="scope" rows={3} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>설명</label>
            <textarea name="description" required rows={4} className={inputClass} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="is_featured" className="h-4 w-4 rounded border-slate-300" />
              대표 노출(홈페이지 강조)
            </label>
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
            등록하고 이미지 추가하기
          </Button>
        </form>
      </Container>
    </section>
  );
}
