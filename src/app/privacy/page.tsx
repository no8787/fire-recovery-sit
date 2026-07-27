import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${COMPANY.nameKo} 개인정보처리방침`,
};

const sections = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: "상담 신청 시 이름, 연락처, 이메일, 현장 주소, 업체명(선택), 첨부파일 등을 수집합니다.",
  },
  {
    title: "2. 개인정보의 수집 및 이용 목적",
    body: "화재복구 상담 및 현장방문 일정 안내, 견적 협의, 고객 문의 응대를 위해 개인정보를 이용합니다.",
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    body: "상담 목적 달성 후 관련 법령에 따른 보존 기간 동안 보관하며, 이후 지체 없이 파기합니다.",
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: "이용자의 동의 없이 개인정보를 외부에 제공하지 않으며, 법령에 근거가 있는 경우에 한해 제공될 수 있습니다.",
  },
  {
    title: "5. 이용자의 권리",
    body: "이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.",
  },
  {
    title: "6. 개인정보 보호책임자",
    body: `${COMPANY.nameKo} 대표 ${COMPANY.ceo} / Tel ${COMPANY.tel} / Email ${COMPANY.email}`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="개인정보처리방침" title="개인정보처리방침" />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>
            </div>
          ))}
          <p className="text-xs text-slate-400">시행일: SAMPLE (관리자 페이지 연동 후 확정)</p>
        </Container>
      </section>
    </>
  );
}
