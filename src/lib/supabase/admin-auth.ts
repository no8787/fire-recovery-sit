import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/database.types";

// 관리자 화면/서버 액션 공통 인증·인가 헬퍼.
// RLS가 최종 방어선이지만, "화면 메뉴만 숨기고 API는 열려있는" 상태를 막기 위해
// 서버 액션 쪽에서도 항상 이 헬퍼로 역할을 확인한 뒤 DB 작업을 수행한다.
export async function getCurrentStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    redirect("/admin/login?error=forbidden");
  }

  return { supabase, user, profile };
}

export function isEditorOrAbove(role: UserRole) {
  return role === "editor" || role === "admin" || role === "super_admin";
}
export function isCounselorOrAbove(role: UserRole) {
  return role === "counselor" || role === "admin" || role === "super_admin";
}
export function isAdminOrAbove(role: UserRole) {
  return role === "admin" || role === "super_admin";
}

export class ForbiddenError extends Error {
  constructor(message = "이 작업을 수행할 권한이 없습니다.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// 서버 액션 맨 앞에서 호출: 권한이 없으면 RLS까지 가기 전에 즉시 차단한다.
export async function requireEditor() {
  const staff = await getCurrentStaff();
  if (!isEditorOrAbove(staff.profile.role)) {
    throw new ForbiddenError("콘텐츠 관리 권한(editor 이상)이 없습니다.");
  }
  return staff;
}

export async function requireCounselor() {
  const staff = await getCurrentStaff();
  if (!isCounselorOrAbove(staff.profile.role)) {
    throw new ForbiddenError("상담 관리 권한(counselor 이상)이 없습니다.");
  }
  return staff;
}

export async function requireAdmin() {
  const staff = await getCurrentStaff();
  if (!isAdminOrAbove(staff.profile.role)) {
    throw new ForbiddenError("관리자 권한(admin 이상)이 없습니다.");
  }
  return staff;
}
