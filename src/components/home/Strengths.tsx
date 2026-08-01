import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { strengths } from "@/lib/mock/strengths";
import {
  Layers,
  HardHat,
  Handshake,
  Network,
  ClipboardList,
  Clock,
  Building2,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Layers,
  HardHat,
  Handshake,
  Network,
  ClipboardList,
  Clock,
  Building2,
};

export function Strengths() {
  return (
    <section className="bg-slate-900 py-16 text-white sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="회사의 강점"
          title="처음부터 끝까지, 책임지고 복구합니다"
          description="자격과 협업 체계를 바탕으로 한 곳에서 전 과정을 관리합니다."
          align="center"
          tone="dark"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/10">
            <Image
              src="/images/fire-recovery/extra/equipment-operation-team.webp"
              alt="복구 장비를 함께 운용하는 (주)더가연 현장팀"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/10">
            <Image
              src="/images/fire-recovery/extra/field-cleanup-team.webp"
              alt="화재 현장을 함께 정리하는 (주)더가연 현장팀"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((item) => {
            const StrengthIcon = ICONS[item.icon] ?? Layers;
            return (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <StrengthIcon className="h-6 w-6 text-slate-300" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
