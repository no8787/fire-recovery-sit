import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FireRecoveryIllustration } from "@/components/ui/FireRecoveryIllustration";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { fireCaseCategories, getFireCasesByCategory } from "@/lib/data/fire-recovery-cases";

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
    </>
  );
}
