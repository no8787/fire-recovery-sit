export const COMPANY = {
  nameKo: "(주)더가연",
  nameEn: "THE GAYEON",
  affiliate: "제일디자인(JEIL DESIGN)",
  ceo: "김경철",
  address: "인천광역시 서구 서곶로347 KM빌딩 3층",
  addressAlt: "서곶로 345 서광빌딩 1층",
  tel: "032-267-7777",
  fax: "0505-115-4604",
  // 담당자 개인 휴대전화는 지명원에 기재되어 있지 않아 공개 페이지에 노출하지 않습니다.
  email: "gy2677777@naver.com",
  homepages: ["jeildesign.co.kr", "thegy.co.kr"],
  businessScope: [
    "실내건축공사",
    "금속구조·창호·지붕판금공사업",
    "도장·습식방수·석공사업",
    "기계설비공사업",
  ],
  // 인증서 신고확인증 번호는 공개 페이지에 노출하지 않고 명칭만 표기합니다.
  certifications: [
    "여성기업인증",
    "대한전문건설협회(KOSCA)",
    "전문건설공제조합",
    "종합 산업디자인 전문회사(한국디자인진흥원 산업디자인전문회사 신고)",
  ],
} as const;

export const TEL_HREF = `tel:${COMPANY.tel.replace(/-/g, "")}`;

// 내비게이션 순서: 1)화재복구 2)회사소개 3)시공실적 4)화재복구 사례 5)상담신청 6)문의하기
// - 화재복구 → 기존 /services("화재복구 8대 서비스") 재사용
// - 시공실적 → 기존 /portfolio 재사용, 지명원 실제 시공실적 데이터로 교체됨
// - 화재복구 사례 → 신설 /fire-cases (실제 사례 확인 전까지 준비중 상태)
// - 문의하기 → 기존 /faq("자주 묻는 질문") 재사용
export const NAV_LINKS = [
  { href: "/services", label: "화재복구" },
  { href: "/about", label: "회사소개" },
  { href: "/portfolio", label: "시공실적" },
  { href: "/fire-cases", label: "화재복구 사례" },
  { href: "/contact", label: "상담신청" },
  { href: "/faq", label: "문의하기" },
] as const;

export const FOOTER_LINKS = [
  { href: "/process", label: "복구절차" },
  { href: "/guide", label: "화재복구정보" },
  { href: "/privacy", label: "개인정보처리방침" },
] as const;

export const SITE_URL = "https://thegy.co.kr";
