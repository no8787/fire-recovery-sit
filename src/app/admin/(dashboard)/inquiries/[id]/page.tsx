import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { requireCounselor } from "@/lib/supabase/admin-auth";
import { updateInquiryStatusAction, assignInquiryAction, addInquiryNoteAction } from "../actions";

export const metadata: Metadata = { title: "상담 문의 상세", robots: { index: false, follow: false } };

const STATUS_LABEL: Record<string, string> = {
  new: "신규",
  in_progress: "처리중",
  visited: "현장방문완료",
  quoted: "견적완료",
  completed: "완료",
  closed: "종결",
};

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

export default async function InquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const { supabase } = await requireCounselor();

  const { data: inquiry } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!inquiry) notFound();

  const [{ data: files }, { data: notes }, { data: staff }] = await Promise.all([
    supabase.from("inquiry_files").select("*").eq("inquiry_id", id).order("created_at"),
    supabase
      .from("inquiry_notes")
      .select("id, note, created_at, author_id, profiles(full_name, email)")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email, role").order("full_name"),
  ]);

  const filesWithUrl = await Promise.all(
    (files ?? []).map(async (f) => {
      const { data } = await supabase.storage
        .from("inquiry-files")
        .createSignedUrl(f.storage_path, 60 * 10);
      return { ...f, signedUrl: data?.signedUrl ?? null };
    })
  );

  const fields: [string, string | null][] = [
    ["상담 유형", inquiry.inquiry_type],
    ["이름", inquiry.name],
    ["업체명", inquiry.company_name],
    ["연락처", inquiry.phone],
    ["이메일", inquiry.email],
    ["현장 주소", inquiry.site_address],
    ["건물 유형", inquiry.building_type],
    ["화재 발생일", inquiry.fire_date],
    ["보험 가입 여부", inquiry.has_insurance],
    ["방문 희망일", inquiry.preferred_visit_date],
    ["피해 내용", inquiry.damage_description],
    ["문의 내용", inquiry.message],
  ];

  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-3xl">
        <Link
          href="/admin/inquiries"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          목록으로
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-900">
            {inquiry.name}님 상담 · <span className="font-mono text-base">{inquiry.inquiry_no}</span>
          </h1>
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

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-900">접수 내용</p>
            <dl className="mt-3 space-y-2 text-sm">
              {fields.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="shrink-0 text-slate-500">{label}</dt>
                  <dd className="text-right text-slate-800">{value || "-"}</dd>
                </div>
              ))}
            </dl>

            {filesWithUrl.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-500">첨부파일</p>
                <ul className="mt-2 space-y-1">
                  {filesWithUrl.map((f) => (
                    <li key={f.id}>
                      {f.signedUrl ? (
                        <a
                          href={f.signedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-orange-600 underline"
                        >
                          {f.file_name}
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">{f.file_name} (링크 생성 실패)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">상태 변경</p>
              <form action={updateInquiryStatusAction} className="mt-3 flex gap-2">
                <input type="hidden" name="id" value={inquiry.id} />
                <select name="status" defaultValue={inquiry.status} className={inputClass}>
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="md">
                  변경
                </Button>
              </form>

              <p className="mt-4 text-sm font-bold text-slate-900">담당자 배정</p>
              <form action={assignInquiryAction} className="mt-3 flex gap-2">
                <input type="hidden" name="id" value={inquiry.id} />
                <select
                  name="assigned_to"
                  defaultValue={inquiry.assigned_to ?? ""}
                  className={inputClass}
                >
                  <option value="">미배정</option>
                  {(staff ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name ?? s.email} ({s.role})
                    </option>
                  ))}
                </select>
                <Button type="submit" size="md" variant="outline">
                  배정
                </Button>
              </form>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">내부 메모</p>
              <form action={addInquiryNoteAction} className="mt-3 space-y-2">
                <input type="hidden" name="inquiry_id" value={inquiry.id} />
                <textarea name="note" rows={3} required className={inputClass} />
                <Button type="submit" size="md" variant="outline">
                  메모 추가
                </Button>
              </form>

              <ul className="mt-4 space-y-3">
                {(notes ?? []).map((n) => {
                  const author = n.profiles as unknown as { full_name: string | null; email: string } | null;
                  return (
                    <li key={n.id} className="rounded-md bg-slate-50 p-3 text-xs">
                      <p className="text-slate-700">{n.note}</p>
                      <p className="mt-1 text-slate-400">
                        {author?.full_name ?? author?.email ?? "알 수 없음"} ·{" "}
                        {new Date(n.created_at).toLocaleString("ko-KR")}
                      </p>
                    </li>
                  );
                })}
                {(notes ?? []).length === 0 && (
                  <p className="text-xs text-slate-400">등록된 메모가 없습니다.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
