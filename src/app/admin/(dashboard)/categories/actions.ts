"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/supabase/admin-auth";
import type { ProjectKind } from "@/lib/supabase/database.types";

function backWithError(message: string): never {
  redirect(`/admin/categories?error=${encodeURIComponent(message)}`);
}

function revalidatePublicPages() {
  revalidatePath("/portfolio");
  revalidatePath("/fire-cases");
  revalidatePath("/admin/categories");
}

export async function createCategoryAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();

  const kind = formData.get("kind")?.toString() as ProjectKind;
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const label = formData.get("label")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!slug || !label || (kind !== "construction" && kind !== "fire_case")) {
    backWithError("카테고리 값을 다시 확인해 주세요.");
  }

  const { error } = await supabase.from("project_categories").insert({
    kind,
    slug,
    label,
    description,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  });

  if (error) {
    backWithError(`등록 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "category.created",
    p_target_table: "project_categories",
    p_target_id: null,
    p_metadata: { slug, kind, actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublicPages();
  redirect("/admin/categories");
}

export async function updateCategoryAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();

  const id = formData.get("id")?.toString() ?? "";
  const label = formData.get("label")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!id || !label) {
    backWithError("카테고리 값을 다시 확인해 주세요.");
  }

  const { error } = await supabase
    .from("project_categories")
    .update({ label, description, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 })
    .eq("id", id);

  if (error) {
    backWithError(`수정 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "category.updated",
    p_target_table: "project_categories",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublicPages();
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) backWithError("잘못된 요청입니다.");

  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    backWithError(
      `이 카테고리를 사용 중인 시공사례가 ${count}건 있어 삭제할 수 없습니다. 먼저 해당 사례들의 카테고리를 변경해 주세요.`
    );
  }

  const { error } = await supabase.from("project_categories").delete().eq("id", id);
  if (error) {
    backWithError(`삭제 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "category.deleted",
    p_target_table: "project_categories",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublicPages();
  redirect("/admin/categories");
}
