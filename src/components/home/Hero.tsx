import { PhoneCall, MessageCircle, ShieldCheck, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroGallery, type HeroGallerySlide } from "@/components/home/HeroGallery";
import { TrustBadgeStrip } from "@/components/home/TrustBadgeStrip";
import { COMPANY, TEL_HREF, KAKAO_HREF } from "@/lib/constants";
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
    <section className="border-b border-slate-200 bg-slate-900 text-white">
      <Container className="grid gap-10 py-14 sm:py-20 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-slate-200">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {COMPANY.nameKo} 화재복구 전문
          </p>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            화재 발생부터
            <br />
            완전한 복구까지
          </h1>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-orange-300 sm:text-base">
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              24시간 긴급출동
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              보험사 협업
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              무료 현장조사
            </li>
          </ul>

          <p className="mt-4 max-w-lg text-base text-slate-300 sm:text-lg">
            현장조사부터 준공까지, 화재복구 전공정을 한 곳에서 통합 관리합니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg">
              긴급상담 신청
            </Button>
            <Button
              href={TEL_HREF}
              size="lg"
              variant="outline"
              className="!border-white/30 !text-white hover:!bg-white/10"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              전화 즉시연결
            </Button>
            <Button
              href={KAKAO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="!bg-[#FEE500] !text-[#191600] hover:!bg-[#f5dc00]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              카카오톡 상담
            </Button>
          </div>
          <Button
            href="/fire-cases"
            variant="ghost"
            size="md"
            className="mt-3 !text-slate-300 hover:!bg-white/10"
          >
            복구사례 보기 →
          </Button>
        </div>

        <HeroGallery slides={slides} />
      </Container>

      <TrustBadgeStrip />
    </section>
  );
}
