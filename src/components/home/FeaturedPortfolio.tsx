import Image from "next/image";
import { MapPin, CalendarDays, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { getSbCategories, getSbFeaturedProjects } from "@/lib/supabase/public-queries";

// 대표 시공사례 1건을 큰 실사진과 함께 강조하고, 나머지는 아래 그리드로 보여준다.
// 화재복구가 아닌 실제 시공실적 데이터(Supabase projects, kind=construction, is_featured=true)를 사용한다.
export async function FeaturedPortfolio() {
  const [categories, featured] = await Promise.all([
    getSbCategories("construction"),
    getSbFeaturedProjects("construction", 6),
  ]);
  const [lead, ...rest] = featured;
  if (!lead) return null;

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="시공실적"
            title="지명원 기준 대표 시공실적"
            description="화재복구가 아닌 일반 시공실적입니다. 실내건축·금속창호·도장습식방수·기계설비 등 다분야 시공 경험을 확인하세요."
          />
          <Button href="/portfolio" variant="outline">
            전체 시공실적 보기
          </Button>
        </div>

        <FadeUp className="mt-10">
          <a
            href={`/portfolio/${lead.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto">
              {lead.thumbnail ? (
                <Image
                  src={lead.thumbnail}
                  alt={lead.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              ) : (
                <div className="h-full w-full bg-slate-100" />
              )}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                대표 시공사례
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                {lead.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{lead.description}</p>

              <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 text-sm sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-slate-400">지역</dt>
                    <dd className="font-semibold text-slate-800">{lead.region}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-slate-400">공사기간</dt>
                    <dd className="font-semibold text-slate-800">{lead.period}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-slate-400">공사내용</dt>
                    <dd className="font-semibold text-slate-800">{lead.scope.join(", ")}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </a>
        </FadeUp>

        {rest.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, i) => (
              <FadeUp key={project.id} delay={i * 80}>
                <PortfolioCard project={project} categories={categories} />
              </FadeUp>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
