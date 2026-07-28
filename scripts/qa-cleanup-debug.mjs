// QA 테스트 중 생성된 더미 데이터만 정리한다. 실제 운영 데이터(seed, 실사용자 입력)는
// 아래 접두사/고정값에 절대 매칭되지 않으므로 삭제되지 않는다:
//   - project_categories.slug LIKE 'qa-test-%' / 'qa-debug-%'
//   - projects.slug LIKE 'qa-test-project-%'
//   - posts.slug LIKE 'qa-test-post-%'
//   - faq_items.question LIKE 'QA 테스트 질문%'
//   - inquiries.name = 'QA테스트문의자' (자동화 스크립트가 /contact로 실제 접수한 테스트 문의)
// 삭제 전 대상 목록(id/slug/title)을 먼저 출력하고, 그 뒤에만 delete를 실행한다.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function previewAndDelete(label, table, selectCols, filterFn, idCol = "id") {
  let query = admin.from(table).select(selectCols);
  query = filterFn(query);
  const { data, error } = await query;
  if (error) {
    console.log(`[${label}] 조회 실패:`, error.message);
    return;
  }
  console.log(`\n[${label}] 삭제 대상 (${data.length}건):`);
  data.forEach((row) => console.log("  ", JSON.stringify(row)));
  if (data.length === 0) return;

  const ids = data.map((row) => row[idCol]);
  let delQuery = admin.from(table).delete().in(idCol, ids);
  const { data: deleted, error: delError } = await delQuery.select(selectCols);
  console.log(`[${label}] 삭제 결과:`, delError ? delError.message : `${deleted.length}건 삭제됨`);
}

// project_images는 projects cascade delete로 함께 제거되지만, Storage 파일은 별도 정리 필요
const { data: qaProjects } = await admin
  .from("projects")
  .select("id, slug, title, project_images(storage_path)")
  .ilike("slug", "qa-test-project-%");

console.log(`\n[projects] 삭제 대상 (${(qaProjects ?? []).length}건):`);
(qaProjects ?? []).forEach((p) => console.log("  ", JSON.stringify({ id: p.id, slug: p.slug, title: p.title })));

for (const p of qaProjects ?? []) {
  const paths = (p.project_images ?? []).map((i) => i.storage_path);
  if (paths.length) {
    const { error: rmError } = await admin.storage.from("project-images").remove(paths);
    console.log(`  storage 정리(${p.slug}):`, rmError ? rmError.message : `${paths.length}개 파일 삭제됨`);
  }
}

if ((qaProjects ?? []).length > 0) {
  const { data: deletedProjects, error: projError } = await admin
    .from("projects")
    .delete()
    .in(
      "id",
      qaProjects.map((p) => p.id)
    )
    .select("id, slug");
  console.log("[projects] 삭제 결과:", projError ? projError.message : `${deletedProjects.length}건 삭제됨`);
}

await previewAndDelete("project_categories", "project_categories", "id, slug, label", (q) =>
  q.or("slug.ilike.qa-debug-%,slug.ilike.qa-test-%")
);

await previewAndDelete("posts", "posts", "id, slug, title", (q) => q.ilike("slug", "qa-test-post-%"));

await previewAndDelete("faq_items", "faq_items", "id, question", (q) => q.ilike("question", "QA 테스트 질문%"));

await previewAndDelete("inquiries", "inquiries", "id, inquiry_no, name", (q) => q.eq("name", "QA테스트문의자"));

console.log("\n정리 완료.");
