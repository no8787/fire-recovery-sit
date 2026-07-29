import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// 공개 페이지(/portfolio, /fire-cases 등)는 방문자별 세션이 필요 없고 RLS의
// "published만 공개" 정책만으로 충분하다. cookies()를 쓰는 @/lib/supabase/server의
// createClient()를 여기서 쓰면, generateStaticParams로 정적 생성되는 페이지가
// 런타임에 "static to dynamic" 에러로 500을 낸다(정적 페이지 안에서 쿠키를 읽으려 하기 때문).
// 그래서 쿠키에 전혀 의존하지 않는 별도의 anon 클라이언트를 둔다.
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
