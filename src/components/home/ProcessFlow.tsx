import { Hammer, Wind, Wrench, PaintRoller, KeyRound, type LucideIcon } from "lucide-react";
import { FadeUp } from "@/components/ui/FadeUp";

interface FlowStep {
  labelEn: string;
  labelKo: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    labelEn: "DISMANTLE",
    labelKo: "철거",
    description: "손상된 마감재·구조물을 안전 기준에 맞춰 철거합니다.",
    icon: Hammer,
    accent: "from-slate-700 to-slate-900",
  },
  {
    labelEn: "DRYING",
    labelKo: "건조",
    description: "소방수·누수로 남은 습기를 완전히 건조해 2차 피해를 막습니다.",
    icon: Wind,
    accent: "from-sky-700 to-slate-900",
  },
  {
    labelEn: "RESTORE",
    labelKo: "복원",
    description: "구조·전기·설비를 안전 기준에 맞춰 원상 복원합니다.",
    icon: Wrench,
    accent: "from-amber-700 to-slate-900",
  },
  {
    labelEn: "PAINT",
    labelKo: "도장",
    description: "마감 도장과 인테리어로 깨끗한 상태로 마무리합니다.",
    icon: PaintRoller,
    accent: "from-orange-600 to-slate-900",
  },
  {
    labelEn: "MOVE-IN",
    labelKo: "입주",
    description: "최종 점검을 마치고 안심하고 입주하실 수 있도록 인도합니다.",
    icon: KeyRound,
    accent: "from-emerald-700 to-slate-900",
  },
];

// 화재복구 진행순서를 사진(아이콘 일러스트) + 영문 라벨 + 한글 설명이 나란히 놓이는
// 카드 레이아웃으로 보여준다. 실제 단계별 시공사진이 아직 없어(지명원 상 화재복구 실적 없음)
// 임시로 아이콘 기반 일러스트를 사용했다. TODO: 단계별 실제/연출 사진이 준비되면 이 자리에 교체.
export function ProcessFlow() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {FLOW_STEPS.map((step, i) => (
        <FadeUp key={step.labelEn} delay={i * 90}>
          <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div
              className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${step.accent}`}
            >
              <step.icon className="h-10 w-10 text-white/90" aria-hidden="true" />
              <span className="absolute left-2 top-2 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-white/80">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="p-4">
              <p className="text-xs font-extrabold tracking-wide text-orange-600">
                {step.labelEn}
              </p>
              <p className="mt-0.5 text-base font-bold text-slate-900">{step.labelKo}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{step.description}</p>
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
