"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/supabase/admin-auth";

function backWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function revalidatePublic() {
  revalidatePath("/guide");
}

export async function createPostAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();

  const slug = formData.get("slug")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString().trim() || "guide";
  const title = formData.get("title")?.toString().trim() ?? "";
  const excerpt = formData.get("excerpt")?.toString().trim() || null;
  const content = formData.get("content")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString() === "published" ? "published" : "draft";

  if (!slug || !title || !content) {
    backWithError("/admin/posts/new", "슬러그, 제목, 본문은 필수입니다.");
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      slug,
      category,
      title,
      excerpt,
      content,
      status,
      author_id: user.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    backWithError("/admin/posts/new", `등록 실패: ${error?.message ?? "알 수 없는 오류"}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "post.created",
    p_target_table: "posts",
    p_target_id: data.id,
    p_metadata: { slug, actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePostAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) backWithError("/admin/posts", "잘못된 요청입니다.");

  const category = formData.get("category")?.toString().trim() || "guide";
  const title = formData.get("title")?.toString().trim() ?? "";
  const excerpt = formData.get("excerpt")?.toString().trim() || null;
  const content = formData.get("content")?.toString().trim() ?? "";

  if (!title || !content) {
    backWithError(`/admin/posts/${id}`, "제목과 본문은 필수입니다.");
  }

  const { error } = await supabase
    .from("posts")
    .update({ category, title, excerpt, content })
    .eq("id", id);

  if (error) {
    backWithError(`/admin/posts/${id}`, `수정 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "post.updated",
    p_target_table: "posts",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath(`/admin/posts/${id}`);
  redirect(`/admin/posts/${id}?saved=1`);
}

export async function togglePostPublishAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  const nextStatus = formData.get("next_status")?.toString() === "published" ? "published" : "draft";
  if (!id) backWithError("/admin/posts", "잘못된 요청입니다.");

  const { error } = await supabase
    .from("posts")
    .update({ status: nextStatus, published_at: nextStatus === "published" ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) {
    backWithError("/admin/posts", `상태 변경 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: nextStatus === "published" ? "post.published" : "post.unpublished",
    p_target_table: "posts",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) backWithError("/admin/posts", "잘못된 요청입니다.");

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    backWithError("/admin/posts", `삭제 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "post.deleted",
    p_target_table: "posts",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
