import { Hero } from "@/components/home/Hero";
import { StatsSection } from "@/components/home/StatsSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { EmergencyNotice } from "@/components/home/EmergencyNotice";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";
import { FeaturedPortfolio } from "@/components/home/FeaturedPortfolio";
import { Strengths } from "@/components/home/Strengths";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ProblemSection />
      <ProcessSteps />
      <EmergencyNotice />
      <ServicesGrid />

      <FeaturedPortfolio />

      <section className="py-10">
        <Container>
          <FadeUp className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
            <p className="text-sm font-bold text-slate-900">화재복구 실제 시공사례는 준비 중입니다</p>
            <p className="max-w-xl text-xs leading-relaxed text-slate-500">
              위 시공실적은 화재복구가 아닌 일반 시공 경험입니다. 검증된 화재복구 사례가 확인되는
              대로 사진과 함께 공개하겠습니다.
            </p>
            <Button href="/fire-cases" variant="outline" size="md">
              화재복구 사례 페이지 보기
            </Button>
          </FadeUp>
        </Container>
      </section>

      <Strengths />
      <ContactCTA />
    </>
  );
}
