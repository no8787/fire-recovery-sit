import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/contact";
import { createServiceClient } from "@/lib/supabase/service";

// ContactForm.tsx가 제출하는 상담 신청을 실제로 저장한다.
// service_role을 사용하는 이유:
//  1) inquiries INSERT는 익명 사용자에게도 RLS로 허용되어 있지만, INSERT 직후 상담번호(inquiry_no)를
//     돌려주려면 SELECT 권한이 필요한데 방문자는 SELECT가 막혀 있다(RLS 설계상 의도된 제약).
//  2) 첨부파일을 inquiry-files 버킷(비공개)에 올리는 것도 방문자 권한으로는 불가능하다.
// 두 작업을 하나의 신뢰된 서버 경로에서 원자적으로 처리하기 위해 service_role을 사용한다.
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const raw = {
    inquiryType: formData.get("inquiryType")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    companyName: formData.get("companyName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    siteAddress: formData.get("siteAddress")?.toString() ?? "",
    buildingType: formData.get("buildingType")?.toString() ?? "",
    fireDate: formData.get("fireDate")?.toString() ?? "",
    damageDescription: formData.get("damageDescription")?.toString() ?? "",
    hasInsurance: formData.get("hasInsurance")?.toString() ?? "",
    preferredVisitDate: formData.get("preferredVisitDate")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    privacyAgreed: formData.get("privacyAgreed")?.toString() === "true",
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값을 다시 확인해 주세요.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const values = parsed.data;
  const file = formData.get("file");

  const supabase = createServiceClient();

  const { data: inquiry, error: insertError } = await supabase
    .from("inquiries")
    .insert({
      inquiry_type: values.inquiryType,
      name: values.name,
      company_name: values.companyName || null,
      phone: values.phone,
      email: values.email || null,
      site_address: values.siteAddress,
      building_type: values.buildingType,
      fire_date: values.fireDate || null,
      damage_description: values.damageDescription,
      has_insurance: values.hasInsurance,
      preferred_visit_date: values.preferredVisitDate || null,
      message: values.message || null,
      privacy_agreed: values.privacyAgreed,
    })
    .select("id, inquiry_no")
    .single();

  if (insertError || !inquiry) {
    console.error("inquiries insert failed", insertError);
    return NextResponse.json(
      { error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  if (file instanceof File && file.size > 0) {
    const safeName = file.name.replace(/[^\w.\-가-힣]/g, "_");
    const storagePath = `${inquiry.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("inquiry-files")
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("inquiry-files upload failed", uploadError);
      // 접수 자체는 이미 성공했으므로 상담번호는 정상 반환하고, 첨부파일 실패만 로그로 남긴다.
    } else {
      const { error: fileRowError } = await supabase.from("inquiry_files").insert({
        inquiry_id: inquiry.id,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: null,
      });
      if (fileRowError) {
        console.error("inquiry_files insert failed", fileRowError);
      }
    }
  }

  return NextResponse.json({ inquiryNo: inquiry.inquiry_no });
}
