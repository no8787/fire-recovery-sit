import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "이용약관",
  description: `${COMPANY.nameKo} 홈페이지 이용조건`,
};

// 이 사이트는 회사소개·시공실적 안내와 온라인 상담 접수만 제공하는 사이트입니다.
// 회원가입, 온라인 결제, 배송, 환불 등의 기능이 없어 관련 조항은 두지 않았습니다.
const sections = [
  {
    title: "제1조 (목적)",
    body: `이 이용조건은 ${COMPANY.nameKo}(이하 "회사")가 운영하는 홈페이지(이하 "사이트")를 통해 제공하는 정보 및 온라인 상담 접수 서비스 이용과 관련하여 회사와 이용자의 권리·의무 및 책임사항을 정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (사이트 제공 서비스)",
    body: "회사는 사이트를 통해 회사 소개, 시공실적, 화재복구 관련 정보 제공, 온라인 상담 신청 접수 서비스를 제공합니다. 사이트는 회원가입이나 결제 없이 누구나 상담을 신청할 수 있는 구조로 운영됩니다.",
  },
  {
    title: "제3조 (게시물 및 콘텐츠 이용)",
    body: "사이트에 게시된 회사 소개, 시공실적, 화재복구 정보 등 콘텐츠는 이용자에게 정보 제공을 목적으로 제공되며, 회사는 게시된 정보의 최신성·정확성을 유지하기 위해 노력하나 이를 완전히 보증하지는 않습니다.",
  },
  {
    title: "제4조 (금지행위)",
    body: [
      "이용자는 사이트 이용과 관련하여 아래 행위를 해서는 안 됩니다.",
      "- 상담 신청 시 허위 정보를 기재하는 행위",
      "- 사이트의 콘텐츠(시공사진, 문구, 디자인 등)를 회사의 사전 동의 없이 복제·배포·전송·상업적으로 이용하는 행위",
      "- 사이트의 정상적인 운영을 방해하는 행위(과도한 요청 전송, 해킹 시도 등)",
      "- 관계 법령을 위반하는 행위",
    ],
  },
  {
    title: "제5조 (외부 링크)",
    body: "사이트는 이용자의 편의를 위해 카카오톡 채널 등 외부 서비스로 연결되는 링크를 제공할 수 있습니다. 외부 링크를 통해 연결된 서비스는 회사가 아닌 해당 서비스 운영자의 정책에 따라 운영되며, 회사는 외부 서비스에서 발생하는 사항에 대해 책임을 지지 않습니다.",
  },
  {
    title: "제6조 (책임 제한)",
    body: "회사는 천재지변, 정전, 통신장애 등 회사의 귀책사유가 없는 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다. 이용자가 상담 신청 시 부정확한 정보를 제공하여 발생하는 문제에 대해서도 회사는 책임을 지지 않습니다.",
  },
  {
    title: "제7조 (지식재산권)",
    body: "사이트에 게시된 콘텐츠(시공사진, 문구, 디자인 등)에 대한 저작권은 회사에 귀속되며, 사전 동의 없이 무단으로 복제·배포·전송할 수 없습니다.",
  },
  {
    title: "제8조 (이용조건의 변경)",
    body: "회사는 필요한 경우 이 이용조건을 변경할 수 있으며, 변경 시 시행일 7일 전부터 사이트를 통해 공지합니다. 변경된 이용조건은 공지한 시행일부터 효력이 발생합니다.",
  },
  {
    title: "제9조 (준거법과 분쟁처리)",
    body: `이 이용조건은 대한민국 법령에 따라 규율되고 해석됩니다. 사이트 이용과 관련하여 분쟁이 발생할 경우 회사와 이용자는 상호 협의하여 해결하며, 협의가 이루어지지 않을 경우 회사의 본점 소재지를 관할하는 법원을 관할 법원으로 합니다.`,
  },
  {
    title: "제10조 (문의처)",
    body: `${COMPANY.nameKo} 대표 ${COMPANY.ceo} / 사업자등록번호 ${COMPANY.businessRegistrationNo} / Tel ${COMPANY.tel} / Email ${COMPANY.email}`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="이용약관" title="이용약관" />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl space-y-8">
          <p className="text-sm leading-relaxed text-slate-600">
            이 이용조건은 회사소개·시공실적 안내 및 온라인 상담 접수만 제공하는 현재 사이트
            구조를 기준으로 작성했습니다. 회원가입, 온라인 결제, 배송, 환불 등 사이트에 없는
            기능에 관한 조항은 포함하지 않았습니다.
          </p>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
              <div className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">
                {Array.isArray(section.body) ? (
                  section.body.map((line) => <p key={line}>{line}</p>)
                ) : (
                  <p>{section.body}</p>
                )}
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-400">시행일: 2026년 7월 28일</p>
        </Container>
      </section>
    </>
  );
}
