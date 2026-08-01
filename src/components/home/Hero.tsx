import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TrustBadgeStrip } from "@/components/home/TrustBadgeStrip";
import { COMPANY } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-950 text-white">
      {/* Premium Overlay: 코너에 은은한 브랜드 그라데이션만 — 과한 장식 없이 톤만 깊게 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_0%,rgba(234,88,12,0.16),transparent_60%)]"
        aria-hidden="true"
      />

      <Container className="relative grid gap-10 py-16 sm:py-20 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-amber-500" aria-hidden="true" />
            화재복구 전문기업
          </p>

          <h1 className="text-[30px] font-extrabold leading-[1.25] tracking-[-0.03em] sm:text-[36px] md:text-[38px] md:leading-[1.25] lg:text-[42px]">
            보험처리부터 원상복구까지
          </h1>

          <p className="mt-3 text-base font-semibold text-slate-300 sm:text-lg">
            {COMPANY.nameKo}
          </p>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-400 sm:text-base">
            현장조사부터 준공까지, 화재복구 전공정을 한 곳에서 통합 관리합니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg">
              화재복구 상담 신청
            </Button>
            <Button
              href="/portfolio"
              size="lg"
              variant="outline"
              className="!border-white/25 !text-white hover:!bg-white/10"
            >
              시공사례 보기
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 sm:aspect-[16/11]">
          <Image
            src="/images/fire-recovery/hero/main-hero-fire-recovery.webp"
            alt="화재 피해 현장을 점검하는 (주)더가연 복구팀"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/60 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>
      </Container>

      <Container className="relative pb-14 sm:pb-16 md:pb-20">
        <TrustBadgeStrip />
      </Container>
    </section>
  );
}
