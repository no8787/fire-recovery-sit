import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { resolveImageSrc } from "@/lib/supabase/image-src";
import {
  updateProjectAction,
  deleteProjectImageAction,
  setThumbnailAction,
  updateImageSortAction,
} from "../actions";

export const metadata: Metadata = { title: "시공사례 수정", robots: { index: false, follow: false } };

const inputClass =
  "w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-800";

const STAGE_OPTIONS = [
  { value: "", label: "단계 없음(갤러리)" },
  { value: "before", label: "전(before)" },
  { value: "during", label: "중(during)" },
  { value: "after", label: "후(after)" },
];

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const { supabase } = await requireEditor();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();

  const [{ data: categories }, { data: images }] = await Promise.all([
    supabase
      .from("project_categories")
      .select("id, label")
      .eq("kind", project.kind)
      .order("sort_order"),
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("sort_order"),
  ]);

  // 시드 데이터의 정적 경로와 실제 Storage 업로드 경로를 구분해야 한다.
  // 예전에는 getPublicUrl()을 무조건 호출해서 시드 이미지 27건이 전부 깨져 보였다.
  const imagesWithUrl = (images ?? []).map((img) => ({
    ...img,
    publicUrl: resolveImageSrc(supabase, img.storage_path),
  }));

  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-900">시공사례 수정</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
            {project.kind === "construction" ? "시공실적" : "화재복구 사례"} · {project.status}
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

        {/* ---------------- 기본 정보 ---------------- */}
        <form action={updateProjectAction} className="mt-6 space-y-5 rounded-xl border border-slate-200 bg-white p-5">
          <input type="hidden" name="id" value={project.id} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>슬러그(수정 불가)</label>
              <input value={project.slug} disabled className={`${inputClass} bg-slate-50 text-slate-400`} />
            </div>
            <div>
              <label className={labelClass}>카테고리</label>
              <select name="category_id" required defaultValue={project.category_id} className={inputClass}>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>제목</label>
            <input name="title" required defaultValue={project.title} className={inputClass} />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>지역/발주처</label>
              <input name="region" required defaultValue={project.region} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>건물 유형</label>
              <input
                name="building_type"
                required
                defaultValue={project.building_type}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>공사기간</label>
              <input name="period" required defaultValue={project.period} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>공사유형</label>
            <input
              name="project_nature"
              required
              defaultValue={project.project_nature}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>공사 범위(한 줄에 하나씩)</label>
            <textarea name="scope" rows={3} defaultValue={project.scope.join("\n")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>설명</label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={project.description}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={project.is_featured}
                className="h-4 w-4 rounded border-slate-300"
              />
              대표 노출(홈페이지 강조)
            </label>
            <div className="flex items-center gap-2">
              <label className={labelClass}>정렬순서</label>
              <input
                name="sort_order"
                type="number"
                defaultValue={project.sort_order}
                className={`${inputClass} w-24`}
              />
            </div>
          </div>

          <Button type="submit" size="lg">
            저장
          </Button>
        </form>

        {/* ---------------- 이미지 관리 ---------------- */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-bold text-slate-900">이미지 관리</p>
          <p className="mt-1 text-xs text-slate-500">
            jpg/jpeg/png/webp, 5MB 이하만 업로드할 수 있습니다.
          </p>

          <MultiImageUpload
            projectId={project.id}
            projectTitle={project.title}
            projectRegion={project.region}
            projectNature={project.project_nature}
            inputClass={inputClass}
            labelClass={labelClass}
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {imagesWithUrl.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-lg border border-slate-200">
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  <Image
                    src={img.publicUrl}
                    alt={img.alt_text ?? project.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  {project.thumbnail_url === img.publicUrl && (
                    <span className="absolute left-2 top-2 rounded bg-orange-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      대표 이미지
                    </span>
                  )}
                </div>
                <div className="space-y-2 p-3">
                  <form action={updateImageSortAction} className="space-y-2">
                    <input type="hidden" name="image_id" value={img.id} />
                    <input type="hidden" name="project_id" value={project.id} />
                    <div className="flex flex-wrap items-center gap-2">
                      <select name="stage" defaultValue={img.stage ?? ""} className={`${inputClass} w-32`}>
                        {STAGE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <input
                        name="sort_order"
                        type="number"
                        defaultValue={img.sort_order}
                        className={`${inputClass} w-16`}
                      />
                    </div>
                    <input
                      name="caption"
                      defaultValue={img.caption ?? ""}
                      placeholder="캡션(선택)"
                      className={`${inputClass} text-xs`}
                    />
                    <input
                      name="alt_text"
                      defaultValue={img.alt_text ?? ""}
                      placeholder="대체텍스트(선택)"
                      className={`${inputClass} text-xs`}
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      저장
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    <form action={setThumbnailAction}>
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="public_url" value={img.publicUrl} />
                      <button
                        type="submit"
                        className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        대표로 지정
                      </button>
                    </form>
                    <form action={deleteProjectImageAction}>
                      <input type="hidden" name="image_id" value={img.id} />
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="storage_path" value={img.storage_path} />
                      <ConfirmSubmitButton
                        confirmMessage="이 이미지를 삭제할까요? 되돌릴 수 없습니다."
                        className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        삭제
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
              </div>
            ))}
            {imagesWithUrl.length === 0 && (
              <p className="text-sm text-slate-400 sm:col-span-2">
                등록된 이미지가 없습니다. 위에서 업로드해 주세요.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
