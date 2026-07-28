import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getCurrentStaff, isCounselorOrAbove, isEditorOrAbove } from "@/lib/supabase/admin-auth";
import { logoutAction } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const { supabase, user, profile } = await getCurrentStaff();

  const [inquiriesNew, projectsCount, postsCount, faqCount] = await Promise.all([
    isCounselorOrAbove(profile.role)
      ? supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new")
      : Promise.resolve({ count: null }),
    isEditorOrAbove(profile.role)
      ? supabase.from("projects").select("id", { count: "exact", head: true })
      : Promise.resolve({ count: null }),
    isEditorOrAbove(profile.role)
      ? supabase.from("posts").select("id", { count: "exact", head: true })
      : Promise.resolve({ count: null }),
    isEditorOrAbove(profile.role)
      ? supabase.from("faq_items").select("id", { count: "exact", head: true })
      : Promise.resolve({ count: null }),
  ]);

  const cards = [
    {
      href: "/admin/inquiries",
      label: "신규 상담 문의",
      value: inquiriesNew.count,
      show: isCounselorOrAbove(profile.role),
    },
    {
      href: "/admin/projects",
      label: "등록된 시공사례",
      value: projectsCount.count,
      show: isEditorOrAbove(profile.role),
    },
    {
      href: "/admin/posts",
      label: "게시글",
      value: postsCount.count,
      show: isEditorOrAbove(profile.role),
    },
    {
      href: "/admin/faq",
      label: "FAQ 항목",
      value: faqCount.count,
      show: isEditorOrAbove(profile.role),
    },
  ].filter((c) => c.show);

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-2xl font-extrabold text-slate-900">관리자 대시보드</h1>
        <p className="mt-2 text-sm text-slate-500">
          {profile.full_name ?? user.email}님, {profile.role} 권한으로 로그인되어 있습니다.
        </p>

        {cards.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <p className="text-2xl font-extrabold text-slate-900">{card.value ?? "-"}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{card.label}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 max-w-md rounded-xl border border-slate-200 bg-white p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">이메일</dt>
              <dd className="font-semibold text-slate-900">{profile.email ?? user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">이름</dt>
              <dd className="font-semibold text-slate-900">{profile.full_name ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">역할</dt>
              <dd className="font-semibold text-slate-900">{profile.role}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">활성 상태</dt>
              <dd className="font-semibold text-slate-900">
                {profile.is_active ? "활성" : "비활성"}
              </dd>
            </div>
          </dl>
        </div>

        <form action={logoutAction} className="mt-6">
          <Button type="submit" variant="outline">
            로그아웃
          </Button>
        </form>
      </Container>
    </section>
  );
}
