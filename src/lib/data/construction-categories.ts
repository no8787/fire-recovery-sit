import type { ConstructionCategory } from "@/lib/types";

// 지명원(공사지명원, 2025-10-14 발급) "4. 공사실적" / "III. 포트폴리오" 기준 8개 분류
export const constructionCategories: ConstructionCategory[] = [
  { slug: "public", label: "공공기관", description: "구청·행정복지센터·시설공단·고용센터·관광공사 등" },
  { slug: "hospital", label: "병원", description: "적십자병원·한방병원·요양병원 등" },
  { slug: "school", label: "학교", description: "초·중·고등학교 및 대학 캠퍼스" },
  { slug: "welfare", label: "복지시설", description: "주간보호센터·복지관·장애인쉼터·어린이집·돌봄센터 등" },
  { slug: "lh", label: "LH", description: "한국토지주택공사 관련 실적" },
  { slug: "urban-corp", label: "도시공사", description: "서울주택도시공사·인천도시공사 등" },
  { slug: "military", label: "군부대", description: "OO부대·보병사단·해군·해양경찰청·소방서 등" },
  { slug: "commercial", label: "상업시설", description: "개인·법인 의뢰 상업 인테리어" },
];
