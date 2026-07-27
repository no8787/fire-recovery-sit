import type { GuidePost } from "@/lib/types";

// SAMPLE 데이터 — 실제 콘텐츠는 관리자 페이지(Sprint 2)에서 작성·교체합니다.
export const guidePosts: GuidePost[] = [
  {
    id: "g1",
    slug: "fire-damage-first-response",
    title: "화재 발생 직후, 가장 먼저 해야 할 대응",
    excerpt: "화재 진압 직후 안전 확보와 피해 기록 방법을 정리했습니다.",
    category: "초기대응",
    publishedAt: "2025-06-01",
    sample: true,
    content: [
      "SAMPLE 콘텐츠입니다. 화재 진압 직후에는 현장에 임의로 재출입하지 말고 소방·안전 담당자의 안전 확인을 기다려야 합니다.",
      "피해 물품을 임의로 폐기하거나 이동하기 전에 사진·영상으로 피해 상태를 충분히 기록해 두는 것이 중요합니다.",
      "보험사와 전문 복구업체에 동시에 연락해 초기 대응 절차를 안내받으시기 바랍니다.",
    ],
  },
  {
    id: "g2",
    slug: "insurance-claim-checklist",
    title: "화재보험 청구 전 확인해야 할 체크리스트",
    excerpt: "보험 청구 과정에서 필요한 서류와 자료를 안내합니다.",
    category: "보험",
    publishedAt: "2025-06-15",
    sample: true,
    content: [
      "SAMPLE 콘텐츠입니다. 보험 청구를 위해서는 피해 현장 사진, 피해 물품 목록, 화재 원인 관련 서류가 필요합니다.",
      "손해사정사와의 협업을 통해 청구 절차를 체계적으로 준비하는 것이 도움이 됩니다.",
    ],
  },
  {
    id: "g3",
    slug: "soot-odor-removal-basics",
    title: "그을음·냄새 제거, 셀프 청소로 충분할까?",
    excerpt: "전문 탈취·세척이 필요한 상황을 구분하는 방법을 안내합니다.",
    category: "복구공정",
    publishedAt: "2025-07-01",
    sample: true,
    content: [
      "SAMPLE 콘텐츠입니다. 표면적인 그을음은 일부 제거가 가능하지만, 내부 자재에 스며든 냄새는 전문 장비가 필요한 경우가 많습니다.",
      "환기 시스템, 단열재 등에 냄새가 남아있는지 전문가의 점검을 받는 것을 권장합니다.",
    ],
  },
  {
    id: "g4",
    slug: "factory-fire-business-continuity",
    title: "공장 화재 이후 가동 재개까지, 무엇을 준비해야 하나",
    excerpt: "공장·상가의 영업 손실을 줄이기 위한 긴급복구 접근법입니다.",
    category: "공장·상가",
    publishedAt: "2025-07-10",
    sample: true,
    content: [
      "SAMPLE 콘텐츠입니다. 공장 화재 이후에는 설비 손상 범위 파악과 가동 재개 우선순위 설정이 중요합니다.",
      "전기·설비 전문 인력과의 협업을 통해 단계적 복구 일정을 수립하면 손실을 최소화할 수 있습니다.",
    ],
  },
];

export function getGuidePostBySlug(slug: string) {
  return guidePosts.find((p) => p.slug === slug);
}
