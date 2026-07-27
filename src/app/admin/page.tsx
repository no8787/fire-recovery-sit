import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "./login/actions";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

// Sprint 2-1 범위: 로그인/세션/권한 확인이 실제로 동작하는지 보여주는 최소 대시보드.
// 상담 목록·콘텐츠 CRUD 등 실제 관리자 기능은 Sprint 2-2에서 이 페이지 아래에 구현한다.
export default async function AdminHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-2xl font-extrabold text-slate-900">관리자 대시보드</h1>
        <p className="mt-2 text-sm text-slate-500">
          로그인/세션/역할(RBAC) 연동 확인용 화면입니다. 상담 접수 목록, 콘텐츠 관리 등은 Sprint
          2-2에서 이어서 구현합니다.
        </p>

        <div className="mt-8 max-w-md rounded-xl border border-slate-200 p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">이메일</dt>
              <dd className="font-semibold text-slate-900">{profile?.email ?? user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">이름</dt>
              <dd className="font-semibold text-slate-900">{profile?.full_name ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">역할</dt>
              <dd className="font-semibold text-slate-900">{profile?.role ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">활성 상태</dt>
              <dd className="font-semibold text-slate-900">
                {profile?.is_active ? "활성" : "비활성"}
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
