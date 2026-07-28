import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${COMPANY.nameKo} 개인정보처리방침`,
};

interface Section {
  title: string;
  body: string[];
  // 코드/설정을 확인해도 사실관계를 단정할 수 없는 항목. 운영자가 실제 계약·인프라 설정을
  // 확인해 채워야 하며, 확인 전까지 "없음"/"동의함" 등으로 임의 확정하지 않는다.
  todo?: string[];
}

const sections: Section[] = [
  {
    title: "1. 개인정보 처리 목적",
    body: [
      "(주)더가연(이하 \"회사\")은 홈페이지 상담 신청(/contact) 접수를 통해 아래 목적으로 개인정보를 처리합니다.",
      "- 화재복구 상담 접수 및 담당자 배정·대응",
      "- 현장방문 일정 조율 및 피해 현황 확인, 견적 협의",
      "- 문의·불만 처리 등 민원 대응",
    ],
  },
  {
    title: "2. 처리하는 개인정보 항목",
    body: [
      "상담 신청 시 아래 항목을 수집합니다(홈페이지 상담폼 필드 기준으로 확인된 항목입니다).",
      "- 필수: 이름, 연락처(전화번호), 현장 주소, 건물 유형, 피해 내용, 보험 가입 여부",
      "- 선택: 업체명, 이메일, 화재 발생일, 현장 방문 희망일, 문의 내용, 첨부파일(현장 사진 등 이미지·PDF, 최대 10MB)",
    ],
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    body: [
      "회사는 개인정보 처리 목적이 달성된 후에는 해당 정보를 지체 없이 파기하는 것을 원칙으로 합니다.",
      "관계 법령에서 별도의 보존 기간을 정하는 경우에는 그 기간 동안 보관합니다.",
    ],
    todo: [
      "상담 데이터의 구체적인 보유 기간(예: 상담 종료 후 O개월/O년)이 사내에 정책으로 확정되어 있지 않습니다. 운영자가 실제 보유기간 정책을 정한 뒤 이 조항에 구체적 기간을 명시해야 합니다.",
    ],
  },
  {
    title: "4. 개인정보의 파기 절차 및 방법",
    body: [
      "보유 기간 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 파기합니다.",
      "전자적 파일 형태로 저장된 개인정보는 복구·재생이 불가능한 방법으로 영구 삭제합니다.",
      "종이 문서에 기록·저장된 개인정보는 분쇄하거나 소각하여 파기합니다.",
    ],
  },
  {
    title: "5. 정보주체의 권리와 행사 방법",
    body: [
      "이용자는 회사에 대해 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.",
      "권리 행사는 아래 6항의 연락처로 전화 또는 이메일을 통해 요청할 수 있으며, 회사는 관계 법령에 따라 지체 없이 조치합니다.",
    ],
  },
  {
    title: "6. 개인정보 보호책임자 및 담당 연락처",
    body: [
      `${COMPANY.nameKo} 개인정보 보호책임자: 대표 ${COMPANY.ceo}`,
      `Tel ${COMPANY.tel} / Email ${COMPANY.email}`,
      `사업자등록번호 ${COMPANY.businessRegistrationNo} / 주소 ${COMPANY.address}`,
    ],
  },
  {
    title: "7. 개인정보의 안전성 확보조치",
    body: [
      "회사는 아래와 같은 기술적 조치를 적용하고 있습니다(코드·설정 검토로 확인된 사항입니다).",
      "- 상담 데이터는 행 단위 접근제어(Row Level Security)가 적용된 데이터베이스에 저장되며, 상담 담당 직원 이상 권한을 가진 계정만 조회할 수 있습니다.",
      "- 관리자 페이지는 로그인 인증과 접근 제어(미들웨어)를 거쳐야 접근할 수 있습니다.",
      "- 첨부파일(현장 사진 등)은 비공개 저장소에 저장되며 담당 직원만 접근할 수 있습니다.",
      "- 데이터베이스에 전체 접근 가능한 관리 키는 서버 측에만 보관되며 이용자의 브라우저로 전달되지 않습니다.",
    ],
    todo: [
      "관리자 계정 비밀번호 정책, 접근 권한 부여·회수 절차, 정기 점검 주기 등 운영 절차 문서화가 되어 있지 않다면 운영자가 별도로 수립해야 합니다.",
    ],
  },
  {
    title: "8. 제3자 제공 현황",
    body: [
      "회사는 이용자의 동의 없이 개인정보를 외부 제3자에게 제공하지 않는 것을 원칙으로 하며, 현재 별도의 제3자 제공 절차를 운영하고 있지 않습니다.",
      "다만 법령에 근거가 있는 경우 예외적으로 제공될 수 있습니다.",
    ],
    todo: [
      "위 내용은 홈페이지 코드·설정 기준으로 확인한 것이며, 회사의 다른 업무(오프라인 계약, 보험사 연계 등)에서 개인정보가 제3자에게 제공되는 절차가 별도로 있다면 운영자가 이 조항에 구체적으로 반영해야 합니다.",
    ],
  },
  {
    title: "9. 개인정보 처리업무의 위탁",
    body: [
      "회사는 상담 데이터의 저장·관리를 위해 클라우드 데이터베이스·파일저장 서비스(Supabase Inc.)를 이용하고 있습니다. 이는 개인정보 처리위탁에 해당할 수 있습니다.",
    ],
    todo: [
      "위탁받는 자(Supabase Inc.)와의 정식 데이터처리계약(DPA) 체결 여부, 위탁 업무의 정확한 범위, 그 밖에 실제 이용 중인 호스팅·이메일 등 외부 서비스가 있는지(현재 코드 기준으로는 확인되지 않음)를 운영자가 확인해 이 조항에 구체적으로 명시해야 합니다.",
    ],
  },
  {
    title: "10. 개인정보의 국외 이전",
    body: [
      "이 홈페이지는 해외 클라우드 서비스(Supabase)를 이용하고 있어, 프로젝트 설정에 따라 개인정보가 국외 서버에 저장·처리될 가능성이 있습니다.",
    ],
    todo: [
      "실제 데이터가 저장되는 서버 소재 국가를 Supabase 프로젝트 설정에서 확인한 뒤, 이전되는 국가, 이전 일시 및 방법, 이전받는 자의 명칭과 이용 목적·보유기간 등 「개인정보 보호법」상 국외이전 고지 요건을 구체적으로 반영해야 합니다. 확인 전까지 국외이전이 \"없다\"고 단정하지 않습니다.",
    ],
  },
  {
    title: "11. 자동으로 수집되는 정보 및 쿠키",
    body: [
      "이 홈페이지 자체 코드는 별도의 분석·광고 쿠키를 사용하지 않으며, 방문자 행태를 추적하는 스크립트(예: 광고·분석 태그)를 사용하지 않습니다(코드 검토로 확인).",
      "관리자(직원) 로그인 시에는 인증 상태 유지를 위한 필수 쿠키가 발급되며, 이는 일반 방문자에게는 적용되지 않습니다.",
    ],
    todo: [
      "호스팅·인프라 사업자가 자체적으로 남기는 접속 로그(IP, 접속일시 등)의 구체적인 보관 기간과 처리방침은 운영자가 실제 이용 중인 호스팅사(예: Vercel 등)의 정책을 확인해 반영해야 합니다.",
    ],
  },
  {
    title: "12. 개인정보처리방침의 시행일 및 변경 고지",
    body: [
      "이 개인정보처리방침은 시행일부터 적용됩니다.",
      "내용의 추가·삭제 및 수정이 있을 경우 변경사항 시행 7일 전부터 홈페이지를 통해 공지합니다.",
    ],
  },
];

export default function PrivacyPage() {
  const openTodoCount = sections.reduce((sum, s) => sum + (s.todo?.length ?? 0), 0);

  return (
    <>
      <PageHero eyebrow="개인정보처리방침" title="개인정보처리방침" />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl space-y-8">
          <p className="text-sm leading-relaxed text-slate-600">
            {COMPANY.nameKo}(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요시하며, 「개인정보
            보호법」 등 관련 법령을 준수하고자 합니다. 이 방침은 실제 홈페이지 코드와 설정을
            검토해 확인된 사실을 바탕으로 작성했습니다. 노란색으로 표시된 항목은 아직 확인되지
            않아 운영자가 추가로 확정해야 하는 내용입니다.
          </p>

          {openTodoCount > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-bold">운영자 확인이 필요한 항목이 {openTodoCount}건 있습니다.</p>
              <p className="mt-1 text-amber-800">
                아래 각 조항의 노란 박스를 확인하고, 실제 정책·계약 내용을 확정한 뒤 문구를
                채워주세요. 확정 전까지 이 방침은 최종본이 아닙니다.
              </p>
            </div>
          )}

          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
              <div className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
                {section.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {section.todo && (
                <div className="mt-2 space-y-1.5 rounded-lg border border-amber-300 bg-amber-50 p-3">
                  {section.todo.map((line) => (
                    <p key={line} className="text-xs leading-relaxed text-amber-900">
                      <span className="font-bold">운영자 확인 필요 — </span>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          <p className="text-xs text-slate-400">시행일: 2026년 7월 28일</p>
        </Container>
      </section>
    </>
  );
}
