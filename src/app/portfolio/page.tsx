import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { portfolioCategories, getProjectsByCategory } from "@/lib/mock/portfolio";
import { getRecordsByCategory } from "@/lib/data/construction";
import type { ConstructionCategorySlug } from "@/lib/types";

export const metadata: Metadata = {
  title: "시공실적",
  description:
    "공공기관·병원·학교·복지시설·LH·도시공사·군부대·상업시설 등 (주)더가연의 실제 시공실적을 확인하세요.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const projects = getProjectsByCategory(category);
  const textRecords = getRecordsByCategory(category as ConstructionCategorySlug | undefined);

  return (
    <>
      <PageHero
        eyebrow="시공실적"
        title="지명원 기준 실제 시공실적"
        description="공사지명원(2025-10-14)에 기재된 실제 공사명·발주자명·시기만 담았습니다. 화재복구가 아닌 일반 리모델링·유지보수·신축 인테리어 실적입니다."
      />

      <section className="py-14 sm:py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/portfolio"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !category
                  ? "bg-orange-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              전체
            </Link>
            {portfolioCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/portfolio?category=${cat.slug}`}
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

          {projects.length > 0 ? (
            <>
              <p className="mt-8 text-sm font-bold text-slate-900">
                시공사진 보유 사례 ({projects.length}건)
              </p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <PortfolioCard key={project.id} project={project} />
                ))}
              </div>
            </>
          ) : (
            <p className="mt-16 text-center text-sm text-slate-500">
              해당 카테고리의 시공사진 보유 사례가 아직 없습니다.
            </p>
          )}

          {textRecords.length > 0 && (
            <div className="mt-16">
              <p className="text-sm font-bold text-slate-900">
                전체 시공실적 목록 ({textRecords.length}건)
              </p>
              <p className="mt-1 text-xs text-slate-500">
                지명원 표에 사진이 없는 실적으로, 공사명·발주자명·시기만 기재되어 있습니다.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                    <tr>
                      <th className="px-4 py-3">시기</th>
                      <th className="px-4 py-3">공사명</th>
                      <th className="px-4 py-3">발주자명</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {textRecords.map((rec) => (
                      <tr key={rec.id}>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {rec.year}.{rec.month}
                        </td>
                        <td className="px-4 py-3 text-slate-800">{rec.projectName}</td>
                        <td className="px-4 py-3 text-slate-600">{rec.client}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
