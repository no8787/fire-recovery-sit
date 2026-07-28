"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/supabase/admin-auth";

function backWithError(message: string): never {
  redirect(`/admin/faq?error=${encodeURIComponent(message)}`);
}

function revalidatePublic() {
  revalidatePath("/faq");
  revalidatePath("/admin/faq");
}

export async function createFaqAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();

  const category = formData.get("category")?.toString().trim() || "일반";
  const question = formData.get("question")?.toString().trim() ?? "";
  const answer = formData.get("answer")?.toString().trim() ?? "";
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!question || !answer) {
    backWithError("질문과 답변을 모두 입력해 주세요.");
  }

  const { data, error } = await supabase
    .from("faq_items")
    .insert({
      category,
      question,
      answer,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      status: "published",
    })
    .select("id")
    .single();

  if (error || !data) {
    backWithError(`등록 실패: ${error?.message ?? "알 수 없는 오류"}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "faq.created",
    p_target_table: "faq_items",
    p_target_id: data.id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  redirect("/admin/faq");
}

export async function updateFaqAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  const category = formData.get("category")?.toString().trim() || "일반";
  const question = formData.get("question")?.toString().trim() ?? "";
  const answer = formData.get("answer")?.toString().trim() ?? "";
  const sortOrder = Number(formData.get("sort_order") ?? 0);

  if (!id || !question || !answer) {
    backWithError("질문과 답변을 모두 입력해 주세요.");
  }

  const { error } = await supabase
    .from("faq_items")
    .update({ category, question, answer, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 })
    .eq("id", id);

  if (error) {
    backWithError(`수정 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "faq.updated",
    p_target_table: "faq_items",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  redirect("/admin/faq");
}

export async function toggleFaqPublishAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  const nextStatus = formData.get("next_status")?.toString() === "published" ? "published" : "draft";
  if (!id) backWithError("잘못된 요청입니다.");

  const { error } = await supabase.from("faq_items").update({ status: nextStatus }).eq("id", id);
  if (error) {
    backWithError(`상태 변경 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: nextStatus === "published" ? "faq.published" : "faq.unpublished",
    p_target_table: "faq_items",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
}

export async function deleteFaqAction(formData: FormData) {
  const { supabase, user, profile } = await requireEditor();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) backWithError("잘못된 요청입니다.");

  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) {
    backWithError(`삭제 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "faq.deleted",
    p_target_table: "faq_items",
    p_target_id: id,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePublic();
  redirect("/admin/faq");
}
