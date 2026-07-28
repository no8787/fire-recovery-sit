import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getCurrentStaff, isCounselorOrAbove, isEditorOrAbove } from "@/lib/supabase/admin-auth";
import { logoutAction } from "@/app/admin/login/actions";

// /admin/(dashboard) 이하 전체 페이지가 공유하는 인증 셸.
// middleware.ts가 1차로 /admin/** 접근을 막고, 여기서 2차로 staff 프로필을 조회해
// 화면별 메뉴를 역할에 맞게 보여준다(메뉴만 숨기는 게 아니라 각 서버 액션도 admin-auth로 재검증한다).
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentStaff();

  const navItems = [
    { href: "/admin", label: "대시보드", show: true },
    { href: "/admin/inquiries", label: "상담 문의", show: isCounselorOrAbove(profile.role) },
    { href: "/admin/projects", label: "시공사례", show: isEditorOrAbove(profile.role) },
    { href: "/admin/categories", label: "카테고리", show: isEditorOrAbove(profile.role) },
    { href: "/admin/posts", label: "게시글", show: isEditorOrAbove(profile.role) },
    { href: "/admin/faq", label: "FAQ", show: isEditorOrAbove(profile.role) },
  ].filter((item) => item.show);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-extrabold text-slate-900">
              더가연 관리자
            </Link>
            <nav className="hidden gap-4 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 hover:text-orange-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              {user.email} · <span className="font-semibold text-slate-700">{profile.role}</span>
            </span>
            <form action={logoutAction}>
              <button type="submit" className="font-semibold text-slate-500 hover:text-orange-600">
                로그아웃
              </button>
            </form>
          </div>
        </Container>
        <div className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 text-xs font-medium text-slate-600 hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
