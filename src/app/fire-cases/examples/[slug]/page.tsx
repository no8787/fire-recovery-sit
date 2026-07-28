import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BeforeAfter } from "@/components/portfolio/BeforeAfter";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { fireCaseCategories } from "@/lib/data/fire-recovery-cases";
import { fireRecoveryExamples, getFireRecoveryExampleBySlug } from "@/lib/data/fire-recovery-examples";

// "화재복구 과정 예시" 상세페이지. fireRecoveryExamples는 실제 사례가 아닌 AI 생성 예시 콘텐츠이며
// Supabase projects/project_images, src/lib/mock/portfolio.ts와는 완전히 분리되어 있다.
export function generateStaticParams() {
  return fireRecoveryExamples.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getFireRecoveryExampleBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function FireRecoveryExampleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getFireRecoveryExampleBySlug(slug);
  if (!project) notFound();

  const category = fireCaseCategories.find((c) => c.slug === project.categorySlug);
  const related = fireRecoveryExamples.filter((p) => p.id !== project.id);

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-900 py-12 text-white sm:py-16">
        <Container>
          <Link
            href="/fire-cases"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            화재복구 사례 목록
          </Link>
          <p className="text-sm font-semibold text-orange-400">
            화재복구 과정 예시 · {category?.label}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl md:text-4xl">
            {project.title}
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div
            role="note"
            className="mb-8 flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3.5 text-sm text-violet-900"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden="true" />
            <p>
              아래 이미지는 화재복구 절차의 이해를 돕기 위한 AI 생성 예시 이미지이며,
              (주)더가연의 실제 시공사례가 아닙니다.
            </p>
          </div>

          <BeforeAfter images={project.images} />

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-slate-900">과정 설명</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{project.description}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">진행 단계</h2>
              <ul className="mt-3 space-y-2">
                {project.scope.map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-8 text-center">
            <p className="text-lg font-bold text-slate-900">
              실제 화재 피해를 입으셨다면 지금 상담해 보세요
            </p>
            <Button href="/contact" size="lg">
              상담 신청하기
            </Button>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-bold text-slate-900">다른 예시 보기</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PortfolioCard
                    key={p.id}
                    project={p}
                    categories={fireCaseCategories}
                    linkBase="/fire-cases/examples"
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
