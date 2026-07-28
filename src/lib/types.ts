export type InquiryType =
  | "긴급화재복구"
  | "일반상담"
  | "현장방문"
  | "협력문의";

export type BuildingType =
  | "주택"
  | "아파트"
  | "상가"
  | "공장"
  | "창고"
  | "사무실"
  | "공공시설"
  | "학교"
  | "병원"
  | "복지시설"
  | "군시설"
  | "기타";

// 피해유형(화재복구 사례용) + 공사유형(시공실적용)을 함께 표현한다.
// 화재복구 사례가 채워지기 전까지는 시공실적 쪽 값(실내인테리어 등)만 실제로 쓰인다.
export type DamageType =
  | "화재"
  | "그을음·냄새"
  | "소방수·침수"
  | "전기·설비"
  | "복합피해"
  | "실내인테리어"
  | "리모델링"
  | "신축·조성"
  | "설계 제안";

// 시공실적 (지명원 PDF "4. 공사실적" / "III. 포트폴리오" 기반 실제 자료)
export type ConstructionCategorySlug =
  | "public"
  | "hospital"
  | "school"
  | "welfare"
  | "lh"
  | "urban-corp"
  | "military"
  | "commercial";

export interface ConstructionCategory {
  slug: ConstructionCategorySlug;
  label: string;
  description: string;
}

// 지명원 "4. 공사실적" 표에 실린 텍스트 실적 (공사명·발주자명·시기만 기재, 금액 등은 미기재)
export interface ConstructionRecord {
  id: string;
  categorySlug: ConstructionCategorySlug;
  year: number;
  month: string;
  projectName: string;
  client: string;
}

export interface ConstructionPhoto {
  src: string;
  isRender?: boolean; // true = 3D 렌더링/설계 제안 이미지 (실사진 아님)
}

// 지명원 "III. 포트폴리오"에 실제 사진이 수록된 항목
export interface ConstructionShowcase {
  id: string;
  categorySlug: ConstructionCategorySlug;
  title: string;
  client: string;
  period: string;
  projectType: string;
  photos: ConstructionPhoto[];
}

// /portfolio(시공실적), /fire-cases(화재복구 사례) 두 라우트가 공유하는 카드/상세페이지 데이터 형태.
// PortfolioCard·BeforeAfter·[slug] 상세페이지는 이 타입 하나로 두 데이터 소스를 그대로 렌더링한다.
export type PortfolioCategorySlug =
  | ConstructionCategorySlug
  | "housing"
  | "factory"
  | "office"
  | "odor"
  | "demolition";

export interface PortfolioCategory {
  slug: PortfolioCategorySlug;
  label: string;
}

export interface PortfolioImageSet {
  before?: string;
  during?: string;
  after?: string;
  // 3단계(전/중/후) 구분이 없는 실제 시공실적 사진들. 있으면 BeforeAfter가 단순 갤러리로 렌더링한다.
  // caption: 갤러리 사진별 단계 설명(예: "STEP 1 · 화재 직후"). isAiExample: true면 실제 시공사진이
  // 아니라 화재복구 절차 이해를 돕기 위한 AI 생성 예시 이미지임을 뱃지로 표시한다.
  // src가 빈 문자열이면 아직 이미지 파일이 없다는 뜻이며 PlaceholderImage로 대체 표시된다
  // (자리만 먼저 만들고, 실제 파일이 준비되면 경로만 채우면 되는 구조).
  gallery?: { src: string; isRender?: boolean; isAiExample?: boolean; caption?: string }[];
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  categorySlug: PortfolioCategorySlug;
  region: string;
  buildingType: BuildingType;
  damageType: DamageType;
  period: string;
  scope: string[];
  description: string;
  thumbnail: string | null;
  images: PortfolioImageSet;
  featured: boolean;
  sample: boolean; // true일 때만 카드/상세페이지에 SAMPLE 뱃지 노출
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface StrengthItem {
  title: string;
  description: string;
  icon: string;
}

export interface GuidePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  publishedAt: string;
  sample: true;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactFormValues {
  inquiryType: InquiryType;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  siteAddress: string;
  buildingType: BuildingType;
  fireDate?: string;
  damageDescription: string;
  hasInsurance: "yes" | "no" | "unknown";
  preferredVisitDate?: string;
  message?: string;
  privacyAgreed: boolean;
}
