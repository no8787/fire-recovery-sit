import type { PortfolioProject } from "@/lib/types";

// "화재복구 과정 예시" — /fire-cases 준비중 페이지 하단에 보여주는 절차 설명용 콘텐츠.
//
// 중요: 이 파일은 실제 시공사례가 아니다.
// - 실제 projects/project_images(Supabase) 및 src/lib/mock/portfolio.ts와 완전히 분리되어 있으며
//   서로 절대 섞이지 않는다.
// - 가상의 고객명·주소·공사명·공사기간·금액·발주처를 만들지 않는다(region/period는 "예시" 같은
//   중립적 값만 사용).
// - 모든 이미지는 AI로 생성한 예시 이미지이며, 카드/상세 화면 모두에 "AI 생성 예시 이미지" 배지가
//   자동으로 노출된다(gallery photo의 isAiExample: true, PortfolioCard/BeforeAfter가 처리).
// - 실제 AI 이미지 파일이 아직 없어 src를 빈 문자열로 두었다. 이미지가 준비되면
//   public/images/fire-examples/<slug>/<0~4>.jpg 로 넣고 아래 src만 채우면 된다
//   (컴포넌트가 빈 슬롯은 PlaceholderImage로, 채워지면 실제 이미지로 자동 렌더링한다).
//
// TODO(오픈 전 필수): 실제 화재복구 시공사례가 확보되면 이 예시 콘텐츠는 삭제하거나,
// 최소한 실제 사례 아래로 내려서 절대 실제 사례처럼 보이지 않게 할 것.

function exampleStages(labels: string[]) {
  return labels.map((label, i) => ({
    src: "", // TODO: public/images/fire-examples/{slug}/{i}.jpg 준비되면 경로 채우기
    isAiExample: true as const,
    caption: `STEP ${i + 1} · ${label}`,
  }));
}

const example1Stages = [
  "화재 직후",
  "철거 및 잔존물 제거",
  "그을음·냄새 제거",
  "설비 및 마감 복구",
  "복구 완료",
];

const example2Stages = [
  "화재 직후",
  "안전조치 및 현장조사",
  "철거 및 폐기물 처리",
  "전기·설비 복구",
  "인테리어 복구 완료",
];

export const fireRecoveryExamples: PortfolioProject[] = [
  {
    id: "fe-1",
    slug: "housing-kitchen-process-example",
    title: "주택 주방 화재복구 과정 (예시)",
    categorySlug: "housing",
    region: "예시 상황",
    buildingType: "주택",
    damageType: "화재",
    period: "예시",
    scope: example1Stages,
    description:
      "화재복구가 어떤 순서로 진행되는지 이해를 돕기 위해 만든 예시입니다. 실제 현장이 아니며 AI로 생성한 예시 이미지로 절차를 설명합니다.",
    thumbnail: null,
    images: { gallery: exampleStages(example1Stages) },
    featured: false,
    sample: true,
  },
  {
    id: "fe-2",
    slug: "commercial-fire-process-example",
    title: "상가 화재복구 과정 (예시)",
    categorySlug: "commercial",
    region: "예시 상황",
    buildingType: "상가",
    damageType: "화재",
    period: "예시",
    scope: example2Stages,
    description:
      "상가 화재 발생 시 일반적인 복구 절차를 이해를 돕기 위해 구성한 예시입니다. 실제 현장이 아니며 AI로 생성한 예시 이미지로 절차를 설명합니다.",
    thumbnail: null,
    images: { gallery: exampleStages(example2Stages) },
    featured: false,
    sample: true,
  },
];

export function getFireRecoveryExampleBySlug(slug: string) {
  return fireRecoveryExamples.find((e) => e.slug === slug);
}
