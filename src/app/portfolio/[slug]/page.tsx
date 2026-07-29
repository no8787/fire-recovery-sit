import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Flame, Wrench, CalendarDays, ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SampleBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BeforeAfter } from "@/components/portfolio/BeforeAfter";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { getSbCategories, getSbProjects, getSbProjectBySlug } from "@/lib/supabase/public-queries";

export async function generateStaticParams() {
  const projects = await getSbProjects("construction");
  // 사진이 있는 시공사례만 상세페이지를 생성한다(텍스트만 있는 실적은 목록의 표에만 노출).
  return projects.filter((p) => (p.images.gallery?.length ?? 0) > 0).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getSbProjectBySlug(slug, "construction");
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getSbProjectBySlug(slug, "construction");
  if (!project) notFound();

  const [portfolioCategories, allProjects] = await Promise.all([
    getSbCategories("construction"),
    getSbProjects("construction"),
  ]);
  const category = portfolioCategories.find((c) => c.slug === project.categorySlug);
  const related = allProjects
    .filter((p) => p.categorySlug === project.categorySlug && p.id !== project.id)
    .slice(0, 3);
  const isFireDamage = ["화재", "그을음·냄새", "소방수·침수", "전기·설비", "복합피해"].includes(
    project.damageType
  );
  const DamageIcon = isFireDamage ? Flame : Wrench;

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-900 py-12 text-white sm:py-16">
        <Container>
          <Link
            href="/portfolio"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            시공실적 목록
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-orange-400">{category?.label}</span>
            {project.sample && <SampleBadge />}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl md:text-4xl">
            {project.title}
          </h1>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-orange-400" aria-hidden="true" />
              {project.region}
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-orange-400" aria-hidden="true" />
              {project.buildingType}
            </div>
            <div className="flex items-center gap-1.5">
              <DamageIcon className="h-4 w-4 text-orange-400" aria-hidden="true" />
              {project.damageType}
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-orange-400" aria-hidden="true" />
              {project.period}
            </div>
          </dl>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <BeforeAfter images={project.images} />

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-slate-900">공사 개요</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {project.description}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">공사 범위</h2>
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
              비슷한 공간의 시공을 계획 중이라면 지금 상담해 보세요
            </p>
            <Button href="/contact" size="lg">
              상담 신청하기
            </Button>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-bold text-slate-900">같은 분류의 다른 시공실적</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PortfolioCard key={p.id} project={p} categories={portfolioCategories} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
