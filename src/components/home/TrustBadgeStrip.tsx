import { Clock, MapPinned, Handshake, ClipboardCheck } from "lucide-react";

const BADGES = [
  { icon: Clock, label: "24시간 긴급출동" },
  { icon: MapPinned, label: "전국 대응" },
  { icon: Handshake, label: "보험사 협업" },
  { icon: ClipboardCheck, label: "무료 현장조사" },
];

export function TrustBadgeStrip() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {BADGES.map(({ icon: BadgeIcon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2 px-4 py-4 text-center"
          >
            <BadgeIcon className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
