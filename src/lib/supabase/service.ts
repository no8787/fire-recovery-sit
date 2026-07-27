import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// service_role 키를 사용하는 특권 클라이언트. RLS를 완전히 우회하므로
// 반드시 서버 전용 코드(Route Handler 등)에서만 만들어야 한다.
// "server-only" import가 있어 실수로 클라이언트 컴포넌트에서 import하면 빌드 타임에 에러가 난다.
// 상담 첨부파일 업로드(inquiry-files 버킷 쓰기)처럼 방문자 세션으로는 RLS가 막는 작업에만 사용한다.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.");
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
