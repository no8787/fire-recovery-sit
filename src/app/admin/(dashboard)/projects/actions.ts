"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/supabase/admin-auth";
import { resolveUniqueSlug } from "@/lib/supabase/slug-dedupe";
import { revalidateProjectsPublic as revalidatePublic } from "@/lib/revalidate-public";
import type { ProjectKind, ImageStage } from "@/lib/supabase/database.types";

const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function backWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function parseScope(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProjectAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();

  const kind = formData.get("kind")?.toString() as ProjectKind;
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const title = formData.get("title")?.toString().trim() ?? "";
  const categoryId = formData.get("category_id")?.toString() ?? "";
  const region = formData.get("region")?.toString().trim() ?? "";
  const buildingType = formData.get("building_type")?.toString().trim() ?? "";
  const projectNature = formData.get("project_nature")?.toString().trim() ?? "";
  const period = formData.get("period")?.toString().trim() ?? "";
  const scope = parseScope(formData.get("scope")?.toString() ?? "");
  const description = formData.get("description")?.toString().trim() ?? "";
  const isFeatured = formData.get("is_featured") === "on";
  const status = formData.get("status")?.toString() === "published" ? "published" : "draft";

  if (
    !title ||
    !categoryId ||
    !region ||
    !buildingType ||
    !projectNature ||
    !period ||
    !description
  ) {
    backWithError("/admin/projects/new", "필수 항목을 모두 입력해 주세요.");
  }

  const uniqueSlug = await resolveUniqueSlug(supabase, "projects", slug, title);

  const { data, error } = await supabase
    .from("projects")
    .insert({
      kind,
      slug: uniqueSlug,
      title,
      category_id: categoryId,
      region,
      building_type: buildingType,
      project_nature: projectNature,
      period,
      scope,
      description,
      thumbnail_url: null,
      is_featured: isFeatured,
      is_sample: false,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    backWithError("/admin/projects/new", `등록 실패: ${error?.message ?? "알 수 없는 오류"}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "project.created",
    p_target_table: "projects",
    p_target_id: data.id,
    p_metadata: { slug: uniqueSlug, actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProjectAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) backWithError("/admin/projects", "잘못된 요청입니다.");

  const title = formData.get("title")?.toString().trim() ?? "";
  const categoryId = formData.get("category_id")?.toString() ?? "";
  const region = formData.get("region")?.toString().trim() ?? "";
  const buildingType = formData.get("building_type")?.toString().trim() ?? "";
  const projectNature = formData.get("project_nature")?.toString().trim() ?? "";
  const period = formData.get("period")?.toString().trim() ?? "";
  const scope = parseScope(formData.get("scope")?.toString() ?? "");
  const description = formData.get("description")?.toString().trim() ?? "";
  const isFeatured = formData.get("is_featured") === "on";
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!title || !categoryId || !region || !buildingType || !projectNature || !period || !description) {
    backWithError(`/admin/projects/${id}`, "필수 항목을 모두 입력해 주세요.");
  }

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      category_id: categoryId,
      region,
      building_type: buildingType,
      project_nature: projectNature,
      period,
      scope,
      description,
      is_featured: isFeatured,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq("id", id);

  if (error) {
    backWithError(`/admin/projects/${id}`, `수정 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "project.updated",
    p_target_table: "projects",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}?saved=1`);
}

export async function togglePublishAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  const nextStatus = formData.get("next_status")?.toString() === "published" ? "published" : "draft";
  if (!id) backWithError("/admin/projects", "잘못된 요청입니다.");

  const { error } = await supabase
    .from("projects")
    .update({
      status: nextStatus,
      published_at: nextStatus === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    backWithError("/admin/projects", `상태 변경 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: nextStatus === "published" ? "project.published" : "project.unpublished",
    p_target_table: "projects",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
}

export async function deleteProjectAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) backWithError("/admin/projects", "잘못된 요청입니다.");

  // Storage 파일은 DB cascade로 자동 삭제되지 않으므로 먼저 정리한다.
  const { data: images } = await supabase
    .from("project_images")
    .select("storage_path")
    .eq("project_id", id);

  if (images && images.length > 0) {
    await supabase.storage.from("project-images").remove(images.map((i) => i.storage_path));
  }

  // project_images 행은 projects FK의 on delete cascade로 함께 삭제된다.
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    backWithError("/admin/projects", `삭제 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "project.deleted",
    p_target_table: "projects",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

// ---------------------------------------------------------------------------
// 이미지 업로드/관리
// ---------------------------------------------------------------------------

export type UploadImageResult =
  | { ok: true }
  | { ok: false; error: string };

// 업로드 시작 전 1회 호출해서 현재 이미지 개수(= 새 이미지의 시작 sort_order)를 받아간다.
// 예전에는 업로드 1장마다 count 쿼리를 돌렸는데, 병렬 업로드로 바꾸면 여러 요청이 같은
// count 값을 읽어 sort_order가 겹친다. 시작값을 한 번만 받고 클라이언트가 인덱스를
// 더해 쓰면 쿼리도 줄고 순서 충돌도 없다.
export async function prepareImageUploadAction(
  projectId: string
): Promise<{ ok: true; startSortOrder: number } | { ok: false; error: string }> {
  const { supabase } = await requireEditor();
  if (!projectId) return { ok: false, error: "잘못된 요청입니다." };

  const { count, error } = await supabase
    .from("project_images")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (error) return { ok: false, error: `이미지 정보 조회 실패: ${error.message}` };
  return { ok: true, startSortOrder: count ?? 0 };
}

// 업로드가 전부 끝난 뒤 1회 호출한다.
// 예전에는 장마다 revalidatePublic() + revalidatePath()가 돌아서, 10장이면 재검증만
// 40회가 발생했다. 실제로 필요한 건 "전부 끝난 뒤 한 번"이므로 여기로 분리했다.
export async function finalizeImageUploadsAction(projectId: string): Promise<void> {
  await requireEditor();
  if (!projectId) return;
  revalidatePublic();
  revalidatePath(`/admin/projects/${projectId}`);
}

// 여러 장을 병렬(동시 개수 제한) 업로드하는 클라이언트 컴포넌트(MultiImageUpload)에서
// 직접 호출한다. 폼 제출이 아니라 이벤트 핸들러에서 호출하므로 redirect()를 쓰지 않고
// 결과를 반환값으로 돌려준다 — 파일 하나가 실패해도 나머지 업로드를 계속 진행하기 위함이다.
//
// 재검증은 여기서 하지 않는다(finalizeImageUploadsAction에서 일괄 처리).
// 단, requireEditor()는 요청마다 반드시 유지한다 — 서버 액션은 각각 독립 요청이라
// 여기서 인증을 빼면 인증 없이 호출 가능한 업로드 엔드포인트가 되어버린다.
export async function uploadProjectImageAction(formData: FormData): Promise<UploadImageResult> {
  const { supabase, user, profile } = await requireEditor();
  const projectId = formData.get("project_id")?.toString() ?? "";
  const file = formData.get("file");
  const stage = (formData.get("stage")?.toString() || null) as ImageStage | null;
  const caption = formData.get("caption")?.toString().trim() || null;
  const altText = formData.get("alt_text")?.toString().trim() || null;

  if (!projectId) return { ok: false, error: "잘못된 요청입니다." };
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "업로드할 이미지 파일이 없습니다." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mimeExt = ALLOWED_IMAGE_MIME[file.type];

  if (!mimeExt || !ALLOWED_EXTENSIONS.has(ext) || mimeExt !== (ext === "jpeg" ? "jpg" : ext)) {
    return {
      ok: false,
      error: "jpg, jpeg, png, webp 형식만 업로드할 수 있습니다(확장자와 파일 형식이 일치해야 합니다).",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "이미지 용량은 5MB 이하만 업로드할 수 있습니다." };
  }

  const safeExt = mimeExt;
  const storagePath = `${projectId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;

  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { ok: false, error: `업로드 실패: ${uploadError.message}` };
  }

  // 클라이언트가 prepareImageUploadAction으로 받은 시작값 + 인덱스를 넘겨준다.
  // 값이 없으면(구버전 호출 등) 그때만 count 쿼리로 보정한다.
  const rawSortOrder = Number(formData.get("sort_order"));
  let sortOrder: number;
  if (Number.isFinite(rawSortOrder) && rawSortOrder >= 0) {
    sortOrder = rawSortOrder;
  } else {
    const { count } = await supabase
      .from("project_images")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId);
    sortOrder = count ?? 0;
  }

  const { error: insertError } = await supabase.from("project_images").insert({
    project_id: projectId,
    storage_path: storagePath,
    stage,
    is_render: false,
    sort_order: sortOrder,
    caption,
    alt_text: altText,
  });

  if (insertError) {
    // DB 저장 실패 시 방금 올린 Storage 파일을 정리해 고아 파일을 남기지 않는다.
    await supabase.storage.from("project-images").remove([storagePath]);
    return { ok: false, error: `이미지 정보 저장 실패: ${insertError.message}` };
  }

  await supabase.rpc("log_activity", {
    p_action: "project_image.uploaded",
    p_target_table: "project_images",
    p_target_id: projectId,
    p_metadata: { storage_path: storagePath, actor_email: user.email, actor_role: profile.role },
  });

  // 재검증은 전체 업로드가 끝난 뒤 finalizeImageUploadsAction에서 1회만 수행한다.
  return { ok: true };
}

export async function deleteProjectImageAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const imageId = formData.get("image_id")?.toString() ?? "";
  const projectId = formData.get("project_id")?.toString() ?? "";
  const storagePath = formData.get("storage_path")?.toString() ?? "";
  if (!imageId || !projectId || !storagePath) backWithError("/admin/projects", "잘못된 요청입니다.");

  const { error: deleteRowError } = await supabase.from("project_images").delete().eq("id", imageId);
  if (deleteRowError) {
    backWithError(`/admin/projects/${projectId}`, `이미지 삭제 실패: ${deleteRowError.message}`);
  }

  // DB 행 삭제가 성공한 뒤에만 Storage 파일을 지워 DB/Storage 일관성을 지킨다.
  await supabase.storage.from("project-images").remove([storagePath]);

  // 대표 이미지였다면 썸네일 참조도 정리한다.
  const { data: project } = await supabase
    .from("projects")
    .select("thumbnail_url")
    .eq("id", projectId)
    .maybeSingle();
  if (project?.thumbnail_url?.includes(storagePath)) {
    await supabase.from("projects").update({ thumbnail_url: null }).eq("id", projectId);
  }

  await supabase.rpc("log_activity", {
    p_action: "project_image.deleted",
    p_target_table: "project_images",
    p_target_id: projectId,
    p_metadata: { storage_path: storagePath, actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function setThumbnailAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const projectId = formData.get("project_id")?.toString() ?? "";
  const publicUrl = formData.get("public_url")?.toString() ?? "";
  if (!projectId || !publicUrl) backWithError("/admin/projects", "잘못된 요청입니다.");

  const { error } = await supabase
    .from("projects")
    .update({ thumbnail_url: publicUrl })
    .eq("id", projectId);

  if (error) {
    backWithError(`/admin/projects/${projectId}`, `대표 이미지 지정 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "project.thumbnail_set",
    p_target_table: "projects",
    p_target_id: projectId,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function updateImageSortAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const imageId = formData.get("image_id")?.toString() ?? "";
  const projectId = formData.get("project_id")?.toString() ?? "";
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const stage = (formData.get("stage")?.toString() || null) as ImageStage | null;
  const caption = formData.get("caption")?.toString().trim() || null;
  const altText = formData.get("alt_text")?.toString().trim() || null;
  if (!imageId || !projectId) backWithError("/admin/projects", "잘못된 요청입니다.");

  const { error } = await supabase
    .from("project_images")
    .update({ sort_order: Number.isFinite(sortOrder) ? sortOrder : 0, stage, caption, alt_text: altText })
    .eq("id", imageId);

  if (error) {
    backWithError(`/admin/projects/${projectId}`, `이미지 정보 수정 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "project_image.updated",
    p_target_table: "project_images",
    p_target_id: projectId,
    p_metadata: { image_id: imageId, actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath(`/admin/projects/${projectId}`);
}
