import type { ServiceItem } from "@/lib/types";

// mock 데이터 — 서비스 구성은 지시서 기준 실제 항목, 세부 설명 문구는 예시(SAMPLE) 톤으로 작성
export const services: ServiceItem[] = [
  {
    id: "site-survey",
    title: "현장조사",
    description:
      "화재 발생 직후 현장을 방문해 피해 범위와 구조 안전성을 확인하고 복구 방향을 진단합니다.",
    icon: "Search",
  },
  {
    id: "demolition-waste",
    title: "철거·폐기물 처리",
    description:
      "손상된 마감재·구조물을 안전하게 철거하고 폐기물을 규정에 맞게 처리합니다.",
    icon: "HardHat",
  },
  {
    id: "soot-odor",
    title: "그을음·냄새 제거",
    description:
      "전문 약품과 장비로 그을음을 제거하고 잔류 냄새까지 관리해 재입주 환경을 만듭니다.",
    icon: "Wind",
  },
  {
    id: "water-damage",
    title: "소방수·침수 복구",
    description:
      "진화 과정에서 발생한 소방수 침수 피해를 건조·방수 처리해 2차 피해를 방지합니다.",
    icon: "Droplets",
  },
  {
    id: "electric-facility",
    title: "전기·설비·소방 복구",
    description:
      "전기배선, 기계설비, 소방시설을 점검하고 안전 기준에 맞춰 복구·재시공합니다.",
    icon: "Zap",
  },
  {
    id: "interior-construction",
    title: "건축·인테리어 복구",
    description:
      "구조 보강부터 마감 인테리어까지 원상 또는 개선된 상태로 복구 시공합니다.",
    icon: "Building2",
  },
  {
    id: "insurance-support",
    title: "보험자료 지원",
    description:
      "손해사정 및 보험 청구에 필요한 피해 기록·사진·서류 작성을 지원합니다.",
    icon: "FileText",
  },
  {
    id: "emergency-response",
    title: "공장·상가 긴급복구",
    description:
      "영업·가동 중단 손실을 최소화하기 위한 공장·상가 대상 긴급 복구를 진행합니다.",
    icon: "AlarmClockCheck",
  },
];
