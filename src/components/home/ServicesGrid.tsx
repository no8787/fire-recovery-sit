import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { FadeUp } from "@/components/ui/FadeUp";
import { services } from "@/lib/mock/services";

export function ServicesGrid() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="주요 서비스"
          title="화재복구 8대 서비스"
          description="현장조사부터 보험자료 지원까지, 필요한 공정을 통합 관리합니다."
          align="center"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <FadeUp key={service.id} delay={(i % 4) * 80}>
              <div className="h-full rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon name={service.icon} className="h-5 w-5" />
                </div>
                <p className="mt-4 text-base font-bold text-slate-900">{service.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
