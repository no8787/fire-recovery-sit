import { Clock, ShieldCheck, Wrench, MapPinned } from "lucide-react";

// Hero 하단에 붙는 신뢰 아이콘 카드 4종(Sprint 3 확정 문구). 신뢰"지표"(숫자 카운트업)
// 섹션과는 다른 요소 — 여기는 "무엇을 보장하는지"를 짧게 보여주는 역할만 한다.
const BADGES = [
  { icon: Clock, label: "24시간 상담 접수" },
  { icon: ShieldCheck, label: "보험처리 지원" },
  { icon: Wrench, label: "원상복구 전문" },
  { icon: MapPinned, label: "전국 대응" },
];

export function TrustBadgeStrip() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {BADGES.map(({ icon: BadgeIcon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3 backdrop-blur-sm sm:px-4 sm:py-3.5"
        >
          <BadgeIcon className="h-4 w-4 shrink-0 text-brand-amber-500" aria-hidden="true" />
          <span className="text-[13px] font-semibold text-white sm:text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
}
