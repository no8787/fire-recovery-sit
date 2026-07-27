// 정적 TS 데이터(src/lib/mock/portfolio.ts, src/lib/data/construction-*.ts, fire-recovery-cases.ts)를
// supabase/migrations/20260727000900_seed_projects.sql 로 변환하는 1회성 생성 스크립트.
// 실행: npx tsx scripts/generate-seed.ts
//
// 이 스크립트 자체는 앱 런타임에 포함되지 않으며, 데이터 소스가 바뀌면 다시 실행해 시드를 재생성한다.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { constructionCategories } from "../src/lib/data/construction-categories";
import { constructionRecords } from "../src/lib/data/construction-records";
import { portfolioProjects } from "../src/lib/mock/portfolio";
import { fireCaseCategories } from "../src/lib/data/fire-recovery-cases";
import type { PortfolioCategorySlug, BuildingType, DamageType } from "../src/lib/types";

function sqlStr(value: string | null | undefined): string {
  if (value === null || value === undefined) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlArray(values: string[]): string {
  if (values.length === 0) return "'{}'::text[]";
  return `ARRAY[${values.map((v) => sqlStr(v)).join(", ")}]::text[]`;
}

function sqlBool(value: boolean): string {
  return value ? "true" : "false";
}

const CATEGORY_TO_BUILDING_TYPE: Record<PortfolioCategorySlug, BuildingType> = {
  public: "공공시설",
  hospital: "병원",
  school: "학교",
  welfare: "복지시설",
  lh: "공공시설",
  "urban-corp": "공공시설",
  military: "군시설",
  commercial: "상가",
  housing: "주택",
  factory: "공장",
  office: "사무실",
  odor: "기타",
  demolition: "기타",
};

function toProjectNature(projectName: string): DamageType {
  if (projectName.includes("설계") || projectName.includes("제안")) return "설계 제안";
  if (projectName.includes("리모델링")) return "리모델링";
  if (
    projectName.includes("조성") ||
    projectName.includes("설치") ||
    projectName.includes("구축") ||
    projectName.includes("신설")
  ) {
    return "신축·조성";
  }
  return "실내인테리어";
}

const lines: string[] = [];
lines.push("-- ============================================================================");
lines.push("-- 0009. 시드 데이터: 정적 TS 파일 → project_categories / projects / project_images");
lines.push("-- scripts/generate-seed.ts 로 자동 생성됨. 데이터 소스가 바뀌면 스크립트를 다시 실행해 재생성할 것.");
lines.push("-- 전량 지명원(공사지명원, 2025-10-14) 기재 내용 기반이며, on conflict do nothing으로 재실행해도 안전하다.");
lines.push("-- ============================================================================");
lines.push("");

// ---------------------------------------------------------------------------
// 1) project_categories (construction 8개 + fire_case 7개)
// ---------------------------------------------------------------------------
lines.push("-- 1) 시공실적 카테고리 (kind=construction)");
constructionCategories.forEach((cat, i) => {
  lines.push(
    `insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', ${sqlStr(
      cat.slug
    )}, ${sqlStr(cat.label)}, ${sqlStr(cat.description)}, ${i}) on conflict (kind, slug) do nothing;`
  );
});
lines.push("");
lines.push("-- 2) 화재복구 사례 카테고리 (kind=fire_case, 사례 데이터는 아직 없음 - 분류만 준비)");
fireCaseCategories.forEach((cat, i) => {
  lines.push(
    `insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', ${sqlStr(
      cat.slug
    )}, ${sqlStr(cat.label)}, null, ${i}) on conflict (kind, slug) do nothing;`
  );
});
lines.push("");

// ---------------------------------------------------------------------------
// 2) projects — 사진 보유 27건 (portfolioProjects, kind=construction)
// ---------------------------------------------------------------------------
lines.push("-- 3) 시공실적 - 실제 시공사진 보유 " + portfolioProjects.length + "건 (지명원 III.포트폴리오)");
for (const p of portfolioProjects) {
  lines.push(
    `insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', ${sqlStr(p.slug)}, ${sqlStr(p.title)},
  (select id from public.project_categories where kind = 'construction' and slug = ${sqlStr(p.categorySlug)}),
  ${sqlStr(p.region)}, ${sqlStr(p.buildingType)}, ${sqlStr(p.damageType)}, ${sqlStr(p.period)},
  ${sqlArray(p.scope)}, ${sqlStr(p.description)}, ${sqlStr(p.thumbnail)}, ${sqlBool(p.featured)}, ${sqlBool(p.sample)}, 'published'
on conflict (slug) do nothing;`
  );
  const gallery = p.images.gallery ?? [];
  gallery.forEach((photo, idx) => {
    lines.push(
      `insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, ${sqlStr(photo.src)}, null, ${sqlBool(Boolean(photo.isRender))}, ${idx}
from public.projects where slug = ${sqlStr(p.slug)}
on conflict (project_id, storage_path) do nothing;`
    );
  });
}
lines.push("");

// ---------------------------------------------------------------------------
// 3) projects — 텍스트만 있는 173건 (constructionRecords, kind=construction, 사진 없음)
// ---------------------------------------------------------------------------
lines.push(
  "-- 4) 시공실적 - 사진 없는 텍스트 실적 " + constructionRecords.length + "건 (지명원 4.공사실적 표, id를 slug로 사용)"
);
for (const r of constructionRecords) {
  const period = `${r.year}.${r.month}`;
  const description = `${period} ${r.client} 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.`;
  lines.push(
    `insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', ${sqlStr(r.id)}, ${sqlStr(r.projectName)},
  (select id from public.project_categories where kind = 'construction' and slug = ${sqlStr(r.categorySlug)}),
  ${sqlStr(r.client)}, ${sqlStr(CATEGORY_TO_BUILDING_TYPE[r.categorySlug])}, ${sqlStr(toProjectNature(r.projectName))}, ${sqlStr(period)},
  ${sqlArray([r.projectName])}, ${sqlStr(description)}, null, false, false, 'published'
on conflict (slug) do nothing;`
  );
}
lines.push("");
lines.push(
  "-- 화재복구 사례(kind=fire_case)는 src/lib/data/fire-recovery-cases.ts가 현재 빈 배열이라 시드할 데이터가 없습니다."
);
lines.push("-- 실제 사례가 생기면 scripts/generate-seed.ts를 다시 실행해 이 파일을 재생성하세요.");
lines.push("");

const outPath = join(__dirname, "..", "supabase", "migrations", "20260727000900_seed_projects.sql");
writeFileSync(outPath, lines.join("\n") + "\n", "utf-8");
console.log(`Seed written: ${outPath}`);
console.log(`- project_categories: ${constructionCategories.length} construction + ${fireCaseCategories.length} fire_case`);
console.log(`- projects with photos: ${portfolioProjects.length}`);
console.log(`- projects text-only: ${constructionRecords.length}`);
console.log(
  `- total project_images: ${portfolioProjects.reduce((sum, p) => sum + (p.images.gallery?.length ?? 0), 0)}`
);
