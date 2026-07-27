"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트. anon key만 사용하며,
// 모든 접근은 RLS 정책(profiles/is_staff 등)의 통제를 받는다.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
