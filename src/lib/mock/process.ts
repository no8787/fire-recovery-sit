import type { ProcessStep } from "@/lib/types";

export const processSteps: ProcessStep[] = [
  { step: 1, title: "상담", description: "전화·온라인 상담으로 피해 상황을 접수하고 대응 방향을 안내합니다." },
  { step: 2, title: "현장조사", description: "전문 인력이 현장을 방문해 피해 범위와 구조 상태를 점검합니다." },
  { step: 3, title: "피해분석", description: "구조·전기·설비 등 영역별 피해를 분석해 복구 계획을 수립합니다." },
  { step: 4, title: "견적협의", description: "분석 결과를 바탕으로 공정별 견적을 안내하고 협의합니다." },
  { step: 5, title: "철거·세척", description: "손상 자재 철거와 그을음·오염 세척으로 복구 기반을 만듭니다." },
  { step: 6, title: "복구공사", description: "전기·설비·건축·인테리어 공정을 통합 관리하며 복구를 진행합니다." },
  { step: 7, title: "준공·사후관리", description: "준공 점검 후 인도하며, 이후 하자·문의 사항을 사후관리합니다." },
];
