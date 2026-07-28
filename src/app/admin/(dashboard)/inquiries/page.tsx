import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { requireCounselor } from "@/lib/supabase/admin-auth";
import type { InquiryStatusDb } from "@/lib/supabase/database.types";

export const metadata: Metadata = { title: "상담 문의 관리", robots: { index: false, follow: false } };

const STATUS_LABEL: Record<string, string> = {
  new: "신규",
  in_progress: "처리중",
  visited: "현장방문완료",
  quoted: "견적완료",
  completed: "완료",
  closed: "종결",
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { supabase } = await requireCounselor();
  const { q, status } = await searchParams;

  let query = supabase
    .from("inquiries")
    .select("id, inquiry_no, name, phone, inquiry_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status as InquiryStatusDb);
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,inquiry_no.ilike.%${q}%`);

  const { data: inquiries } = await query;

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <h1 className="text-xl font-extrabold text-slate-900">상담 문의 관리</h1>

        <form className="mt-4 flex flex-wrap gap-2" action="/admin/inquiries" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="이름, 연락처, 상담번호 검색"
            className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">전체 상태</option>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            검색
          </button>
        </form>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-3 py-2">상담번호</th>
                <th className="px-3 py-2">이름</th>
                <th className="px-3 py-2">연락처</th>
                <th className="px-3 py-2">유형</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2">접수일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(inquiries ?? []).map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="font-mono text-xs font-semibold text-orange-600"
                    >
                      {inq.inquiry_no ?? "-"}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-900">{inq.name}</td>
                  <td className="px-3 py-2 text-slate-600">{inq.phone}</td>
                  <td className="px-3 py-2 text-slate-500">{inq.inquiry_type}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {STATUS_LABEL[inq.status] ?? inq.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {new Date(inq.created_at).toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))}
              {(inquiries ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                    접수된 상담 문의가 없습니다.
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
