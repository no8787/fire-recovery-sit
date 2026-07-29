import "server-only";
import { slugify } from "@/lib/slug";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// 제목에서 자동 생성했거나 사용자가 직접 고친 슬러그를 받아, 정규화(slugify)하고
// DB에 이미 있는 값이면 뒤에 -2, -3 ... 을 붙여 겹치지 않는 값을 반환한다.
export async function resolveUniqueSlug(
  supabase: SupabaseServerClient,
  table: "projects" | "posts",
  rawSlug: string,
  titleFallback: string
): Promise<string> {
  const base = slugify(rawSlug.trim() || titleFallback);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const { data } = await supabase.from(table).select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
