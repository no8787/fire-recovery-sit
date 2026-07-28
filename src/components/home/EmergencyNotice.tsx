import { Zap, Camera, Users, ClipboardCheck, AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";

const STEPS = [
  {
    icon: Zap,
    title: "전기·가스 차단",
    description: "2차 사고 예방을 위해 안전이 확인되기 전까지 임의로 재출입하지 마세요.",
  },
  {
    icon: Camera,
    title: "현장 사진·영상 촬영",
    description: "복구·보험 처리를 위해 피해 상태를 사진과 영상으로 남겨두세요.",
  },
  {
    icon: Users,
    title: "전문가·보험사 상담",
    description: "보험사와 전문 복구업체에 함께 연락해 대응 절차를 안내받으세요.",
  },
  {
    icon: ClipboardCheck,
    title: "현장 방문 조사",
    description: "전문 인력이 방문해 피해 범위를 진단하고 복구 계획을 안내합니다.",
  },
];

export function EmergencyNotice() {
  return (
    <section className="bg-amber-50 py-14 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="긴급 상황 행동 가이드"
          title="화재 발생 직후, 이 순서로 대응하세요"
          align="center"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {STEPS.map(({ icon: StepIcon, title, description }, i) => (
            <FadeUp key={title} delay={i * 100} className="relative">
              <div className="h-full rounded-xl border border-amber-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <StepIcon className="h-5 w-5 text-amber-600" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="absolute right-[-18px] top-1/2 hidden h-px w-9 -translate-y-1/2 bg-amber-300 lg:block"
                  aria-hidden="true"
                />
              )}
            </FadeUp>
          ))}
        </div>

        <FadeUp
          delay={STEPS.length * 100}
          className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-amber-200 bg-white/60 p-5 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <p className="flex items-center gap-2 text-sm text-slate-700">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            피해 물품은 보험 조사가 끝나기 전까지 임의로 폐기하거나 이동하지 마세요.
          </p>
          <Button href="/contact" size="md">
            지금 현장조사 신청
          </Button>
        </FadeUp>
      </Container>
    </section>
  );
}
