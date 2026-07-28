import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FireRecoveryIllustration } from "@/components/ui/FireRecoveryIllustration";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { fireCaseCategories, getFireCasesByCategory } from "@/lib/data/fire-recovery-cases";
import { fireRecoveryExamples } from "@/lib/data/fire-recovery-examples";

export const metadata: Metadata = {
  title: "화재복구 사례",
  description: "화재복구 실제 시공사례를 준비 중입니다.",
};

export default async function FireCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const cases = getFireCasesByCategory(category);

  return (
    <>
      <PageHero
        eyebrow="화재복구 사례"
        title="화재복구 실제 시공사례"
        description="건물 유형과 피해 유형별 화재복구 사례를 준비하고 있습니다. 확인된 사례부터 순차적으로 공개합니다."
      />

      <section className="py-14 sm:py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/fire-cases"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !category
                  ? "bg-orange-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              전체
            </Link>
            {fireCaseCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/fire-cases?category=${cat.slug}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  category === cat.slug
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {cases.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((project) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  categories={fireCaseCategories}
                  linkBase="/fire-cases"
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <FireRecoveryIllustration className="h-40 w-40" />
              <div>
                <p className="text-lg font-bold text-slate-900">
                  화재복구 시공사례를 준비하고 있습니다
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  현재 공개할 수 있는 검증된 화재복구 시공사례가 없습니다. 실제 사례가 확인되는
                  대로 사진과 함께 업데이트하겠습니다. 그동안의 실내건축·금속창호·도장습식방수·
                  기계설비 시공 경험은 시공실적 페이지에서 확인하실 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="/portfolio" variant="outline">
                  시공실적 보기
                </Button>
                <Button href="/contact">지금 상담하기</Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14 sm:py-16">
        <Container>
          <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
            화재복구 과정 예시
          </p>
          <h2 className="mt-1.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
            화재복구는 이런 순서로 진행됩니다
          </h2>

          <div
            role="note"
            className="mt-5 flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3.5 text-sm text-violet-900"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden="true" />
            <p>
              아래 이미지는 화재복구 절차의 이해를 돕기 위한 AI 생성 예시 이미지이며,
              (주)더가연의 실제 시공사례가 아닙니다.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fireRecoveryExamples.map((project) => (
              <PortfolioCard
                key={project.id}
                project={project}
                categories={fireCaseCategories}
                linkBase="/fire-cases/examples"
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
