import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { FadeUp } from "@/components/ui/FadeUp";
import { TRUST_STATS } from "@/lib/constants";

// 지명원(공사지명원, 2025-10-14)에서 실제로 확인되는 수치만 사용한다.
// 화재복구 자체 시공사례가 아직 없어 "누적 복구현장"·"고객만족도" 같은 검증 불가능한
// 수치는 넣지 않고, 실제 시공실적·경력·인증·인력으로 대체했다.
export function StatsSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-900 py-12 sm:py-14">
      <Container>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {TRUST_STATS.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 80} className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">
                <Counter value={stat.value} />
                <span className="text-orange-400">{stat.suffix}</span>
              </p>
              <p className="mt-1.5 text-xs font-semibold text-slate-400 sm:text-sm">
                {stat.label}
              </p>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
