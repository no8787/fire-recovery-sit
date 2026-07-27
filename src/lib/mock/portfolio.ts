import type { BuildingType, DamageType, PortfolioCategory, PortfolioProject } from "@/lib/types";
import { constructionCategories } from "@/lib/data/construction-categories";
import { constructionShowcases } from "@/lib/data/construction-showcases";

// 이 파일은 "시공실적"(/portfolio) 페이지가 사용하는 실제 데이터입니다.
// 출처: docs/지명원_더가연(2025-10-14).pdf "III. 포트폴리오"에 실제로 게재된 27개 시공사례.
// 과거 이 파일에 있던 화재복구 SAMPLE 8건(주방 화재, 남동구 상가 화재 등 가상의 사례)은
// 지명원 어디에도 근거가 없어 전량 제거했습니다. 화재복구 실제 사례는 /fire-cases(준비중)를 참고하세요.

export const portfolioCategories: PortfolioCategory[] = constructionCategories;

const CATEGORY_TO_BUILDING_TYPE: Record<PortfolioProject["categorySlug"], BuildingType> = {
  public: "공공시설",
  hospital: "병원",
  school: "학교",
  welfare: "복지시설",
  lh: "공공시설",
  "urban-corp": "공공시설",
  military: "군시설",
  commercial: "상가",
  housing: "주택",
  factory: "공장",
  office: "사무실",
  odor: "기타",
  demolition: "기타",
};

function toDamageType(projectType: string): DamageType {
  if (projectType.includes("설계") || projectType.includes("제안")) return "설계 제안";
  if (projectType.includes("리모델링")) return "리모델링";
  if (
    projectType.includes("조성") ||
    projectType.includes("설치") ||
    projectType.includes("구축") ||
    projectType.includes("신설")
  ) {
    return "신축·조성";
  }
  return "실내인테리어";
}

// showcase 이미지 경로(/images/construction/<slug>/N.jpg)에서 slug를 그대로 프로젝트 slug로 사용합니다.
function slugFromPhotoPath(src: string) {
  return src.split("/")[3];
}

const FEATURED_SLUGS = new Set([
  "incheon-medical-tourism", // 공공기관
  "hwajeong-bom-clinic", // 병원
  "munhak-high-school", // 학교
  "dahamkke-5", // 복지시설
  "unit5378-mess-hall", // 군부대
  "cheongna-huiraegaek", // 상업시설
]);

export const portfolioProjects: PortfolioProject[] = constructionShowcases.map((s) => {
  const slug = slugFromPhotoPath(s.photos[0].src);
  const hasRender = s.photos.some((p) => p.isRender);
  const damageType = toDamageType(s.projectType);

  return {
    id: s.id,
    slug,
    title: s.title,
    categorySlug: s.categorySlug,
    region: s.client,
    buildingType: CATEGORY_TO_BUILDING_TYPE[s.categorySlug],
    damageType,
    period: s.period,
    scope: [s.projectType],
    description: hasRender
      ? `${s.period} ${s.client} ${s.projectType}. 지명원 포트폴리오에 실린 3D 렌더링(설계 제안) 이미지이며, 실제 준공 시공사진이 아닙니다.`
      : `${s.period} ${s.client} 발주로 진행된 시공 사례입니다(${s.projectType}). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.`,
    thumbnail: s.photos[0]?.src ?? null,
    images: {
      gallery: s.photos.map((p) => ({ src: p.src, isRender: p.isRender })),
    },
    featured: FEATURED_SLUGS.has(slug),
    sample: false,
  };
});

export function getFeaturedProjects(limit = 6) {
  return portfolioProjects.filter((p) => p.featured).slice(0, limit);
}

export function getProjectBySlug(slug: string) {
  return portfolioProjects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category?: string) {
  if (!category) return portfolioProjects;
  return portfolioProjects.filter((p) => p.categorySlug === category);
}
