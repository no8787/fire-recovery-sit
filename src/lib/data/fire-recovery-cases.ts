import type { PortfolioCategory, PortfolioProject } from "@/lib/types";

// "화재복구 사례" 페이지(/fire-cases) 전용 데이터입니다.
// 지명원(공사지명원, 2025-10-14) 어디에도 실제 화재복구 시공사례가 없어 현재는 빈 배열입니다.
// 가짜 후기·가짜 시공사진·가짜 고객 후기를 만들어 채우지 않습니다.
// 실제 화재복구 프로젝트가 발생하면 portfolioProjects(src/lib/mock/portfolio.ts)와 동일한
// PortfolioProject 형태로 이 배열에 추가하면, PortfolioCard/BeforeAfter/[slug] 페이지가
// 코드 수정 없이 그대로 렌더링합니다.
export const fireCaseCategories: PortfolioCategory[] = [
  { slug: "housing", label: "주택·아파트" },
  { slug: "commercial", label: "상가" },
  { slug: "factory", label: "공장·창고" },
  { slug: "office", label: "사무실" },
  { slug: "public", label: "공공시설" },
  { slug: "odor", label: "그을음·냄새제거" },
  { slug: "demolition", label: "철거·폐기물처리" },
];

export const fireRecoveryCases: PortfolioProject[] = [];

export function getFeaturedFireCases(limit = 6) {
  return fireRecoveryCases.filter((p) => p.featured).slice(0, limit);
}

export function getFireCaseBySlug(slug: string) {
  return fireRecoveryCases.find((p) => p.slug === slug);
}

export function getFireCasesByCategory(category?: string) {
  if (!category) return fireRecoveryCases;
  return fireRecoveryCases.filter((p) => p.categorySlug === category);
}
