import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";

export const metadata: Metadata = {
  title: "복구 진행 절차",
  description: "상담부터 준공·사후관리까지, 화재복구 7단계 진행 절차를 안내합니다.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="복구 절차"
        title="상담부터 준공까지, 7단계 프로세스"
        description="접수부터 사후관리까지 전 과정을 기록하며 투명하게 진행합니다."
      />

      <section className="py-14 sm:py-16">
        <Container>
          <ProcessTimeline />

          <div className="mt-12 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-8 text-center">
            <p className="text-lg font-bold text-slate-900">
              복구 절차가 궁금하시면 지금 상담을 신청해 보세요
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
