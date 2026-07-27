import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/mock/services";

export const metadata: Metadata = {
  title: "화재복구 서비스",
  description: "현장조사부터 보험자료 지원까지, 화재복구 8대 서비스를 소개합니다.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="서비스"
        title="화재복구 8대 서비스"
        description="현장조사부터 철거, 그을음·냄새제거, 전기·설비 복구, 건축·인테리어, 보험자료 지원까지 전공정을 통합 관리합니다."
      />

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="flex gap-4 rounded-xl border border-slate-200 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon name={service.icon} className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{service.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-8 text-center">
            <p className="text-lg font-bold text-slate-900">
              어떤 서비스가 필요한지 잘 모르시겠다면 먼저 상담해 보세요
            </p>
            <Button href="/contact" size="lg">
              상담 신청하기
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
