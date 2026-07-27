import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// 서버 컴포넌트/라우트 핸들러에서 사용하는 Supabase 클라이언트. 로그인 세션 쿠키를 그대로
// 전달하므로 anon key를 쓰더라도 RLS 상에서는 "로그인한 그 사용자"로 동작한다(관리자 화면용).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서 호출되면 쿠키를 쓸 수 없다.
            // 세션 갱신은 middleware.ts가 담당하므로 여기서는 무시해도 안전하다.
          }
        },
      },
    }
  );
}
