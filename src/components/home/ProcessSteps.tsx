import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";

// Sprint3_2단계_지시서.md 0항: 화재복구 프로세스를 "고객 여정" 기준이 아니라
// 공정 기준 5단계로 표시한다. 준비된 AI 이미지가 공정 기준으로 제작되어 있고,
// 실제 공정을 보여주는 편이 전문성 전달에 유리하기 때문. 이 섹션이 페이지에서
// 유일한 "타임라인"이다 — 다른 곳에 번호가 이어진 단계 UI를 추가하지 않는다.
const STEPS = [
  {
    step: "STEP 01",
    title: "현장진단",
    description: "피해 범위와 구조 안전성을 확인하고 복구 방향을 진단합니다.",
    image: "/images/fire-recovery/ai/fire-inspection-ai.webp",
    alt: "화재 현장을 점검하는 (주)더가연 복구팀",
  },
  {
    step: "STEP 02",
    title: "안전철거",
    description: "손상된 마감재·구조물을 안전 기준에 맞춰 철거합니다.",
    image: "/images/fire-recovery/ai/safe-demolition-ai.webp",
    alt: "화재 피해 잔해를 안전하게 철거하는 작업자",
  },
  {
    step: "STEP 03",
    title: "건조·세척",
    description: "소방수로 남은 습기를 완전히 건조하고 그을음을 세척합니다.",
    image: "/images/fire-recovery/ai/structural-drying-ai.webp",
    alt: "산업용 송풍기로 현장을 건조하는 모습",
  },
  {
    step: "STEP 04",
    title: "원상복구",
    description: "구조·전기·설비를 안전 기준에 맞춰 원상 복구합니다.",
    image: "/images/fire-recovery/ai/reconstruction-work-ai.webp",
    alt: "벽체와 마감재를 복구 시공하는 작업자",
  },
  {
    step: "STEP 05",
    title: "최종점검",
    description: "복구 결과를 최종 점검한 뒤 안심하고 입주하실 수 있도록 인도합니다.",
    image: "/images/fire-recovery/ai/final-quality-check-ai.webp",
    alt: "복구가 끝난 현장을 최종 점검하는 담당자",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="복구 프로세스"
          title="화재복구 5단계"
          description="현장진단부터 최종점검까지, 전 과정을 (주)더가연이 통합 관리합니다."
          align="center"
        />

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {STEPS.map((s, i) => (
            <li key={s.step}>
              <FadeUp delay={i * 80}>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw"
                  />
                  {i < STEPS.length - 1 && (
                    <ChevronRight
                      className="absolute -right-[15px] top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-slate-300 lg:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-3 text-xs font-extrabold tracking-wide text-brand-orange-600">
                  {s.step}
                </p>
                <p className="mt-0.5 text-base font-bold text-brand-charcoal">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted">{s.description}</p>
              </FadeUp>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <Button href="/portfolio" variant="outline" size="md">
            실제 복구 사례 보기
          </Button>
        </div>
      </Container>
    </section>
  );
}
