import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { getFeaturedProjects } from "@/lib/mock/portfolio";

export function FeaturedPortfolio() {
  const projects = getFeaturedProjects(6);

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
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
