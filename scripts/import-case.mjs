/**
 * 현장 원본 사진 폴더 하나를 기존 fire_case 프로젝트에 등록한다.
 *
 *   node scripts/import-case.mjs <폴더명> [--dry]
 *   예) node scripts/import-case.mjs case-001-restaurant
 *
 * 폴더 규약 (imports/<폴더명>/manifest.json)
 *   {
 *     "projectSlug": "등록할 기존 projects.slug",
 *     "thumbnail":   "대표사진 파일명(선택)",
 *     "adminNote":   "관리자용 메모(선택, DB에 저장하지 않고 로그로만 남김)",
 *     "images": [
 *       { "file": "원본파일명", "caption": "...", "alt": "...", "isRender": false, "stage": null }
 *     ]
 *   }
 *
 * 동작
 *   - EXIF 회전 보정 → 긴 변 MAX_EDGE 이하 → WebP(품질 QUALITY) 변환
 *   - 기존 Storage 버킷(project-images)에 <projectId>/ 아래로 업로드
 *   - project_images에 manifest 순서대로 sort_order 0..n 부여해 삽입
 *   - isRender=true는 "계획안(실제 시공사진 아님)"으로 구분되는 기존 is_render 컬럼에 저장
 *   - thumbnail이 지정되면 projects.thumbnail_url을 해당 이미지 공개 URL로 갱신
 *
 * 새 버킷·새 테이블·새 마이그레이션을 만들지 않는다. 원본 파일은 절대 삭제하지 않는다.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import path from "path";
import sharp from "sharp";

const MAX_EDGE = 1600;
const QUALITY = 80;
const BUCKET = "project-images";

const folder = process.argv[2];
const dryRun = process.argv.includes("--dry");
if (!folder) {
  console.error("사용법: node scripts/import-case.mjs <폴더명> [--dry]");
  process.exit(1);
}

const caseDir = path.join("imports", folder);
const manifestPath = path.join(caseDir, "manifest.json");
if (!existsSync(manifestPath)) {
  console.error(`manifest.json이 없습니다: ${manifestPath}`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

const env = {};
for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// 1) 대상 프로젝트 확인 (없으면 중단 — 이 스크립트는 프로젝트를 새로 만들지 않는다)
const { data: project, error: pErr } = await supabase
  .from("projects")
  .select("id, slug, title, kind")
  .eq("slug", manifest.projectSlug)
  .maybeSingle();

if (pErr || !project) {
  console.error(`projects.slug='${manifest.projectSlug}' 를 찾을 수 없습니다.`, pErr ?? "");
  process.exit(1);
}
console.log(`대상 프로젝트: [${project.kind}] ${project.title} (${project.slug})`);
if (manifest.adminNote) console.log(`관리자 메모: ${manifest.adminNote}`);

// 2) 이미 이미지가 붙어 있으면 중복 등록을 막는다
const { count: existing } = await supabase
  .from("project_images")
  .select("id", { count: "exact", head: true })
  .eq("project_id", project.id);
if (existing && existing > 0) {
  console.error(`이미 이미지 ${existing}건이 등록되어 있습니다. 중복 방지를 위해 중단합니다.`);
  console.error("다시 넣으려면 기존 이미지를 먼저 정리하세요.");
  process.exit(1);
}

// 3) 변환 → 업로드 → DB 삽입
let uploaded = 0;
const results = [];
for (const [i, item] of manifest.images.entries()) {
  const src = path.join(caseDir, item.file);
  if (!existsSync(src)) {
    console.error(`  [${i}] 원본 없음, 건너뜀: ${item.file}`);
    continue;
  }

  const buf = await sharp(src)
    .rotate() // EXIF 방향 보정
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  const meta = await sharp(buf).metadata();
  // 저장 파일명은 원본명을 쓰지 않고 순번으로만 만든다(원본 파일명이 URL로 새지 않게).
  const objectName = `${String(i + 1).padStart(2, "0")}-${item.isRender ? "plan" : "site"}.webp`;
  const storagePath = `${project.id}/${objectName}`;

  if (dryRun) {
    console.log(`  [dry] ${item.file} -> ${storagePath} (${meta.width}x${meta.height}, ${(buf.length / 1024).toFixed(0)}KB)`);
    results.push({ storagePath, ...item });
    continue;
  }

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buf, { contentType: "image/webp", upsert: true });
  if (upErr) {
    console.error(`  [${i}] 업로드 실패: ${item.file} — ${upErr.message}`);
    continue;
  }

  const { error: insErr } = await supabase.from("project_images").insert({
    project_id: project.id,
    storage_path: storagePath,
    stage: item.stage ?? null,
    is_render: Boolean(item.isRender),
    sort_order: i,
    caption: item.caption ?? null,
    alt_text: item.alt ?? null,
  });
  if (insErr) {
    console.error(`  [${i}] DB 삽입 실패: ${item.file} — ${insErr.message}`);
    await supabase.storage.from(BUCKET).remove([storagePath]);
    continue;
  }

  uploaded++;
  results.push({ storagePath, ...item });
  console.log(`  [${i + 1}/${manifest.images.length}] ${item.file} -> ${objectName} (${meta.width}x${meta.height}, ${(buf.length / 1024).toFixed(0)}KB)${item.isRender ? " [계획안]" : ""}`);
}

// 4) 대표사진 지정
if (!dryRun && manifest.thumbnail) {
  const thumbIdx = manifest.images.findIndex((it) => it.file === manifest.thumbnail);
  if (thumbIdx < 0) {
    console.error(`thumbnail '${manifest.thumbnail}' 이 images 목록에 없습니다. 대표사진 미설정.`);
  } else {
    const thumbPath = results.find((r) => r.file === manifest.thumbnail)?.storagePath;
    if (thumbPath) {
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(thumbPath);
      const { error: thErr } = await supabase
        .from("projects")
        .update({ thumbnail_url: pub.publicUrl })
        .eq("id", project.id);
      if (thErr) console.error("대표사진 설정 실패:", thErr.message);
      else console.log(`대표사진 설정: ${thumbPath}`);
    }
  }
}

console.log(`\n완료: ${dryRun ? "(dry-run) " : ""}${uploaded}/${manifest.images.length}건 등록`);
