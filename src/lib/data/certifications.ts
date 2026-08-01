export interface Certification {
  id: string;
  name: string;
  issuer: string;
  category: "license" | "association" | "certification" | "insurance" | "capability";
  imageSrc: string | null;
}

// 지명원(공사지명원, 2025-10-14) PDF 및 앞선 서류 조사에서 실제로 확인된 항목만 사용한다.
// 유효기간·발급일·등록번호·문서번호는 넣지 않는다(v1.0은 텍스트 표기만, 이미지 게시는 v1.1).
// 확인되지 않은 명칭·발급기관·날짜는 임의로 만들지 않는다 — 불확실한 항목은 아래 TODO 참고.
export const CERTIFICATIONS: Certification[] = [
  // 전문건설 등록·면허
  {
    id: "construction-license-interior",
    name: "건설업등록증 (실내건축공사업)",
    issuer: "인천광역시 서구청",
    category: "license",
    imageSrc: null,
  },
  {
    id: "construction-license-metal",
    name: "건설업등록증 (금속구조물·창호·온실공사업)",
    issuer: "인천광역시 서구청",
    category: "license",
    imageSrc: null,
  },
  {
    id: "construction-license-painting",
    name: "건설업등록증 (도장·습식·방수·석공사업)",
    issuer: "인천광역시 서구청",
    category: "license",
    imageSrc: null,
  },
  {
    id: "construction-license-mechanical",
    name: "건설업등록증 (기계설비공사업)",
    issuer: "인천광역시 서구청",
    category: "license",
    imageSrc: null,
  },
  {
    id: "outdoor-ad-license",
    name: "옥외광고사업 등록증",
    issuer: "인천광역시 서구청장",
    category: "license",
    imageSrc: null,
  },
  {
    id: "printing-license",
    name: "인쇄사 신고필증",
    issuer: "인천광역시 서구청장",
    category: "license",
    imageSrc: null,
  },
  {
    id: "publishing-license",
    name: "출판사 신고확인증",
    issuer: "인천광역시 서구청장",
    category: "license",
    imageSrc: null,
  },
  {
    id: "asbestos-removal-license",
    name: "석면해체·제거업 등록증",
    issuer: "중부지방고용노동청 인천북부지청장",
    category: "license",
    imageSrc: null,
  },

  // 시공·협회·보증
  {
    id: "capability-ranking-kosca",
    name: "시공능력순위확인서 (실내건축·금속창호지붕·도장습식방수석)",
    issuer: "대한전문건설협회 인천광역시회",
    category: "association",
    imageSrc: null,
  },
  {
    id: "capability-ranking-mechanical",
    name: "시공능력순위확인서 (기계설비가스공사업)",
    issuer: "대한기계설비건설협회",
    category: "association",
    imageSrc: null,
  },
  {
    id: "kosca-membership",
    name: "대한전문건설협회(KOSCA) 인천광역시회 가입",
    issuer: "대한전문건설협회 인천광역시회",
    category: "association",
    imageSrc: null,
  },
  {
    id: "specialty-guarantee-coop",
    name: "전문건설공제조합 가입",
    issuer: "전문건설공제조합",
    category: "association",
    imageSrc: null,
  },

  // 기업 인증
  {
    id: "sme-confirmation",
    name: "중소기업확인서 (소기업·소상공인)",
    issuer: "중소벤처기업부",
    category: "certification",
    imageSrc: null,
  },
  {
    id: "women-owned-business",
    name: "여성기업확인서",
    issuer: "인천지방중소벤처기업청",
    category: "certification",
    imageSrc: null,
  },
  {
    id: "mainbiz",
    name: "메인비즈(경영혁신형 중소기업) 확인서",
    issuer: "중소벤처기업부",
    category: "certification",
    imageSrc: null,
  },
  {
    id: "design-specialist",
    name: "산업디자인전문회사 신고확인증",
    issuer: "한국디자인진흥원(KIDP)",
    category: "certification",
    imageSrc: null,
  },
  {
    id: "rnd-department",
    name: "연구개발전담부서 인정서",
    issuer: "한국산업기술진흥협회",
    category: "certification",
    imageSrc: null,
  },

  // 보험·안전 — 서류 원본은 지명원 PDF에 없으나 실제 가입 확인됨(보험사명 비공개)
  {
    id: "severe-accident-insurance",
    name: "중대재해 배상책임보험",
    issuer: "가입 확인(보험사명 비공개)",
    category: "insurance",
    imageSrc: null,
  },
  {
    id: "liability-insurance",
    name: "영업배상책임보험",
    issuer: "가입 확인(보험사명 비공개)",
    category: "insurance",
    imageSrc: null,
  },

  // 인력·수행역량
  {
    id: "technical-workforce",
    name: "기술인력 11명 보유",
    issuer: "자격증 등록 현황 기준",
    category: "capability",
    imageSrc: null,
  },
];

export const CERTIFICATION_CATEGORY_LABELS: Record<Certification["category"], string> = {
  license: "전문건설 등록·면허",
  association: "시공·협회·보증",
  certification: "기업 인증",
  insurance: "보험·안전",
  capability: "인력·수행역량",
};
