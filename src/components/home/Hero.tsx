import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroGallery, type HeroGallerySlide } from "@/components/home/HeroGallery";
import { TrustBadgeStrip } from "@/components/home/TrustBadgeStrip";
import { COMPANY } from "@/lib/constants";
import { getSbFeaturedProjects } from "@/lib/supabase/public-queries";

// Hero 우측 갤러리는 지명원에 실제로 수록된 시공사진(대표 시공실적)을 사용한다.
// 화재복구 자체 시공사례는 아직 없으므로(지명원 상 실적 없음), "화재 피해 전/후"로
// 오인되지 않도록 캡션에는 항상 실제 공사 내용만 정확히 표기한다.
async function getHeroSlides(): Promise<HeroGallerySlide[]> {
  const featured = await getSbFeaturedProjects("construction", 6);
  return featured.map((p) => ({
    src: p.thumbnail ?? "",
    caption: `${p.title} · ${p.period}`,
  }));
}

export async function Hero() {
  const slides = (await getHeroSlides()).filter((s) => s.src);

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
            24시간 상담 접수
          </p>

          <h1 className="text-[30px] font-extrabold leading-[1.25] tracking-[-0.03em] sm:text-[36px] md:text-[38px] md:leading-[1.25] lg:text-[42px]">
            보험처리부터 원상복구까지
          </h1>

          <p className="mt-3 text-base font-semibold text-slate-300 sm:text-lg">
            화재복구 전문기업 {COMPANY.nameKo}
          </p>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-400 sm:text-base">
            현장조사부터 준공까지, 화재복구 전공정을 한 곳에서 통합 관리합니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg">
              긴급상담 신청
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

        <HeroGallery slides={slides} />
      </Container>

      <Container className="relative pb-14 sm:pb-16 md:pb-20">
        <TrustBadgeStrip />
      </Container>
    </section>
  );
}
