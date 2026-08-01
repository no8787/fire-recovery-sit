import type { Metadata } from "next";
import { Building2, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMPANY, TEL_HREF } from "@/lib/constants";
import { CERTIFICATIONS, CERTIFICATION_CATEGORY_LABELS, type Certification } from "@/lib/data/certifications";

const CERTIFICATION_CATEGORY_ORDER: Certification["category"][] = [
  "license",
  "association",
  "certification",
  "insurance",
  "capability",
];

export const metadata: Metadata = {
  title: "회사소개",
  description: `${COMPANY.nameKo}의 회사 정보, 사업분야, 인증 현황을 소개합니다.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="회사소개"
        title={`${COMPANY.nameKo} (${COMPANY.nameEn})`}
        description={`${COMPANY.affiliate}와 함께, 실내건축부터 설비까지 다분야 시공 역량을 바탕으로 화재복구를 통합 지원합니다.`}
      />

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="회사 정보" title="기본 정보" />
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">대표자</dt>
                <dd className="text-slate-800">{COMPANY.ceo}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">관계사</dt>
                <dd className="text-slate-800">{COMPANY.affiliate}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">주소</dt>
                <dd className="text-slate-800">
                  {COMPANY.address}
                  <br />
                  <span className="text-slate-500">({COMPANY.addressAlt})</span>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">연락처</dt>
                <dd className="text-slate-800">
                  Tel {COMPANY.tel} / Fax {COMPANY.fax}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">이메일</dt>
                <dd className="text-slate-800">{COMPANY.email}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-slate-500">홈페이지</dt>
                <dd className="text-slate-800">{COMPANY.homepages.join(" · ")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-2 text-slate-900">
              <MapPin className="h-5 w-5 text-orange-600" aria-hidden="true" />
              <p className="font-bold">오시는 길</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {COMPANY.address}
              <br />({COMPANY.addressAlt})
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <Phone className="h-4 w-4 text-orange-600" aria-hidden="true" />
              <a href={TEL_HREF} className="font-semibold hover:text-orange-600">
                {COMPANY.tel}
              </a>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <Mail className="h-4 w-4 text-orange-600" aria-hidden="true" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-orange-600">
                {COMPANY.email}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="사업분야" title="다분야 통합 시공 역량" align="center" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANY.businessScope.map((scope) => (
              <div
                key={scope}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
              >
                <Building2 className="h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-800">{scope}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            ※ 명함 기준 등록 사업분야이며, 화재복구는 위 시공 역량을 바탕으로 통합 제공하는
            서비스입니다.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="인증·면허"
            title="보유 인증 및 협회 가입"
            description="공사지명원(2025-10-14) 기준으로 확인된 등록·면허·인증 현황입니다."
            align="center"
          />
          <div className="mt-10 space-y-10">
            {CERTIFICATION_CATEGORY_ORDER.map((category) => {
              const items = CERTIFICATIONS.filter((c) => c.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">
                    {CERTIFICATION_CATEGORY_LABELS[category]}
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-start gap-3 rounded-lg border border-slate-200 p-4"
                      >
                        <ShieldCheck
                          className="mt-0.5 h-5 w-5 shrink-0 text-orange-600"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{cert.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{cert.issuer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
