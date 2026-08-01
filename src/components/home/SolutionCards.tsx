import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/FadeUp";

// Sprint3_이미지적용_지시서.md: 이미지 중심 카드, 이미지가 카드 면적의 절반 이상.
// "보험 절차 지원" 카드는 보상 금액·지급 보장을 암시하지 않고 절차 지원 사실까지만.
const SOLUTIONS = [
  {
    title: "그을음 제거",
    description: "전문 장비와 약품으로 벽·천장에 남은 그을음과 냄새를 제거합니다.",
    image: "/images/fire-recovery/ai/soot-removal-ai.webp",
    alt: "그을음이 남은 벽면을 전문 장비로 제거하는 작업자",
  },
  {
    title: "소방수 건조",
    description: "진화 과정에서 스며든 습기를 산업용 장비로 완전히 건조합니다.",
    image: "/images/fire-recovery/ai/structural-drying-ai.webp",
    alt: "산업용 송풍기로 현장을 건조하는 모습",
  },
  {
    title: "전기·설비 점검",
    description: "전기배선과 설비를 점검하고 안전 기준에 맞춰 복구합니다.",
    image: "/images/fire-recovery/ai/electrical-system-check-ai.webp",
    alt: "분전반 전기 설비를 점검하는 작업자",
  },
  {
    title: "보험 절차 지원",
    description: "피해 기록과 서류 준비를 함께 진행해 보험 처리를 지원합니다.",
    image: "/images/fire-recovery/ai/insurance-document-support-ai.webp",
    alt: "고객과 화재 복구 진행 보고서를 검토하는 담당자",
  },
];

export function SolutionCards() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="전문 솔루션"
          title="화재복구 전문 솔루션"
          description="현장에서 가장 자주 필요한 전문 서비스를 직접 수행합니다."
          align="center"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <FadeUp key={s.title} delay={i * 80}>
              <div className="group h-full overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-base font-bold text-brand-charcoal">{s.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{s.description}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
