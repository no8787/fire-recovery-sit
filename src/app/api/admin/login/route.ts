import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 폼 기반 로그인은 src/app/admin/login/actions.ts(Server Action)가 처리한다.
// 이 라우트는 JSON으로 로그인해야 하는 경우(예: 향후 별도 관리자 앱)를 위한 동일 로직의 API 버전이다.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "이메일과 비밀번호를 모두 입력해 주세요." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "비활성화된 계정이거나 접근 권한이 없습니다." },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, role: profile.role });
}
