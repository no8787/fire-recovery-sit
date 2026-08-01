import { HelpCircle, Wind, Droplets, FileWarning, Split } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/FadeUp";

// 해결책(다음 섹션의 복구 프로세스·솔루션)을 말하기 전에 고객이 처한 상황을
// 먼저 짚어주는 섹션. 공포를 조장하지 않고 담백하게, 확인 가능한 사실 범위에서만.
const PROBLEMS = [
  {
    icon: HelpCircle,
    title: "어디부터 손대야 할지 막막함",
    description: "철거부터 복구까지 무엇을 먼저 해야 할지 판단이 서지 않습니다.",
  },
  {
    icon: Wind,
    title: "쉽게 빠지지 않는 그을음과 냄새",
    description: "일반 청소로는 벽·천장에 남은 그을음과 냄새가 제거되지 않습니다.",
  },
  {
    icon: Droplets,
    title: "소방수로 인한 2차 피해",
    description: "진화 과정에서 스며든 물기가 방치되면 곰팡이·부식으로 이어집니다.",
  },
  {
    icon: FileWarning,
    title: "복잡한 보험 처리 절차",
    description: "피해 기록, 견적, 서류 준비까지 처음 겪으면 절차가 낯설고 복잡합니다.",
  },
  {
    icon: Split,
    title: "제각각인 업체, 안 되는 조율",
    description: "철거·복구·전기·보험 담당이 따로 놀면 일정과 책임 소재가 불분명해집니다.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="화재 피해, 이런 점이 막막하셨을 겁니다"
          title="복구를 시작하기 전, 가장 먼저 부딪히는 문제들"
          align="center"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROBLEMS.map(({ icon: ProblemIcon, title, description }, i) => (
            <FadeUp key={title} delay={i * 80}>
              <div className="h-full rounded-xl border border-slate-200 bg-brand-warm-white p-5">
                <ProblemIcon className="h-5 w-5 text-brand-orange-600" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-brand-charcoal">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
