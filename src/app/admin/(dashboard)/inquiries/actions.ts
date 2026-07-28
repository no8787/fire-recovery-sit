"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireCounselor } from "@/lib/supabase/admin-auth";
import type { InquiryStatusDb } from "@/lib/supabase/database.types";

const VALID_STATUSES: InquiryStatusDb[] = [
  "new",
  "in_progress",
  "visited",
  "quoted",
  "completed",
  "closed",
];

function backWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function updateInquiryStatusAction(formData: FormData) {
  const { supabase, user, profile } = await requireCounselor();
  const id = formData.get("id")?.toString() ?? "";
  const status = formData.get("status")?.toString() as InquiryStatusDb;

  if (!id || !VALID_STATUSES.includes(status)) {
    backWithError("/admin/inquiries", "잘못된 요청입니다.");
  }

  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) {
    backWithError(`/admin/inquiries/${id}`, `상태 변경 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "inquiry.status_changed",
    p_target_table: "inquiries",
    p_target_id: id,
    p_metadata: { status, actor_email: user.email, actor_role: profile.role },
  });

  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/inquiries");
  redirect(`/admin/inquiries/${id}?saved=1`);
}

export async function assignInquiryAction(formData: FormData) {
  const { supabase, user, profile } = await requireCounselor();
  const id = formData.get("id")?.toString() ?? "";
  const assignedTo = formData.get("assigned_to")?.toString() || null;
  if (!id) backWithError("/admin/inquiries", "잘못된 요청입니다.");

  const { error } = await supabase.from("inquiries").update({ assigned_to: assignedTo }).eq("id", id);
  if (error) {
    backWithError(`/admin/inquiries/${id}`, `담당자 배정 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "inquiry.assigned",
    p_target_table: "inquiries",
    p_target_id: id,
    p_metadata: { assigned_to: assignedTo, actor_email: user.email, actor_role: profile.role },
  });

  revalidatePath(`/admin/inquiries/${id}`);
  redirect(`/admin/inquiries/${id}?saved=1`);
}

export async function addInquiryNoteAction(formData: FormData) {
  const { supabase, user, profile } = await requireCounselor();
  const inquiryId = formData.get("inquiry_id")?.toString() ?? "";
  const note = formData.get("note")?.toString().trim() ?? "";
  if (!inquiryId || !note) {
    backWithError(`/admin/inquiries/${inquiryId}`, "메모 내용을 입력해 주세요.");
  }

  const { error } = await supabase.from("inquiry_notes").insert({
    inquiry_id: inquiryId,
    author_id: user.id,
    note,
  });

  if (error) {
    backWithError(`/admin/inquiries/${inquiryId}`, `메모 저장 실패: ${error.message}`);
  }

  await supabase.rpc("log_activity", {
    p_action: "inquiry.note_added",
    p_target_table: "inquiries",
    p_target_id: inquiryId,
    p_metadata: { actor_email: user.email, actor_role: profile.role },
  });

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  redirect(`/admin/inquiries/${inquiryId}?saved=1`);
}
