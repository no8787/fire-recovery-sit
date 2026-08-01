import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { FadeUp } from "@/components/ui/FadeUp";
import { TRUST_STATS, TRUST_CREDENTIALS } from "@/lib/constants";

// 지명원(공사지명원, 2025-10-14)에서 실제로 확인되는 수치만 사용한다.
// 화재복구 자체 시공사례가 아직 없어 "누적 복구현장"·"고객만족도" 같은 검증 불가능한
// 수치는 넣지 않고, 실제 시공실적·경력·인증·인력으로 대체했다.
export function StatsSection() {
  return (
    <section className="border-y border-white/10 bg-brand-navy-900 py-12 sm:py-14">
      <Container>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {TRUST_STATS.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 80} className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">
                <Counter value={stat.value} />
                <span className="text-brand-amber-500">{stat.suffix}</span>
              </p>
              <p className="mt-1.5 text-xs font-semibold text-slate-400 sm:text-sm">
                {stat.label}
              </p>
            </FadeUp>
          ))}
        </div>

        <div className="mt-10 grid gap-2.5 border-t border-white/10 pt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {TRUST_CREDENTIALS.map((item, i) => (
            <FadeUp
              key={item.title}
              delay={i * 80}
              className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
            >
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber-500" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-semibold leading-snug text-white sm:text-sm">
                  {item.title}
                </p>
                {item.detail && (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{item.detail}</p>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
