import type { FaqItem } from "@/lib/types";

export const faqItems: FaqItem[] = [
  {
    id: "f1",
    category: "상담",
    question: "화재 발생 직후 바로 상담이 가능한가요?",
    answer:
      "네, 전화 또는 온라인 상담 신청을 통해 24시간 내 초기 상담이 가능합니다. 긴급한 경우 대표번호로 바로 연락 주세요.",
  },
  {
    id: "f2",
    category: "상담",
    question: "현장 방문 견적은 유료인가요?",
    answer: "현장조사 및 초기 견적 상담은 무료로 진행합니다.",
  },
  {
    id: "f3",
    category: "보험",
    question: "보험 처리 관련 서류 작성도 도와주나요?",
    answer:
      "손해사정사와 협업해 피해 기록, 사진 자료 등 보험 청구에 필요한 자료 준비를 지원합니다.",
  },
  {
    id: "f4",
    category: "공정",
    question: "복구 공사 기간은 얼마나 걸리나요?",
    answer:
      "피해 규모와 범위에 따라 다르며, 현장조사 후 정확한 예상 기간을 안내해 드립니다.",
  },
  {
    id: "f5",
    category: "공정",
    question: "그을음과 냄새만 제거하는 것도 가능한가요?",
    answer: "네, 철거·복구 공사 없이 그을음·냄새 제거만 별도로 진행할 수 있습니다.",
  },
  {
    id: "f6",
    category: "대상",
    question: "주택 외에 상가나 공장도 복구가 가능한가요?",
    answer: "주택, 아파트, 상가, 공장·창고, 사무실, 공공시설까지 규모에 맞춰 대응합니다.",
  },
];
