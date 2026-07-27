import { HardHat, Wrench, Droplets, Flame } from "lucide-react";

// 실제 화재복구 시공사진이 아직 없어(지명원 상 실적 없음) 아이콘 기반 추상 일러스트로 대체합니다.
// 특정 건물·인물·브랜드를 특정할 수 없는 추상 이미지입니다.
// TODO: 실제 화재복구 시공사진이 준비되는 대로 이 일러스트를 교체할 것.
export function FireRecoveryIllustration({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={-40 + i * 20}
            y1="220"
            x2={40 + i * 20}
            y2="-20"
            stroke="currentColor"
            className="text-slate-500"
            strokeWidth="6"
          />
        ))}
      </svg>
      <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/20 text-orange-400">
            <Flame className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-200">
            <HardHat className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-200">
            <Wrench className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-200">
            <Droplets className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
        <p className="text-xs font-semibold tracking-wide text-slate-400">
          현장조사 · 철거 · 그을음제거 · 전기설비 · 인테리어 복구
        </p>
      </div>
    </div>
  );
}
