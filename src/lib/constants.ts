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
  // 사업자등록번호/건설업 등록번호는 지명원(공사지명원, 2025-10-14) 표지에 실제 기재된 값입니다.
  // 통신판매업 등 관련 법령상 사업자등록번호는 공개 표기가 통상적이라 앞서 진행한 개인정보(휴대전화 등)
  // 마스킹과는 별개로 Footer에 노출합니다.
  businessRegistrationNo: "593-87-01254",
  constructionLicenseNo: "인천서구2019-01-01 (실내건축공사업)",
  foundedYear: 2019,
} as const;

export const TEL_HREF = `tel:${COMPANY.tel.replace(/-/g, "")}`;

// 카카오톡 채널 1:1 상담 링크. NEXT_PUBLIC_KAKAO_CHAT_URL(.env.local)로 관리한다.
// 값이 비면 Hero/Footer/MobileCTA/FloatingActions의 카카오 버튼이 전화 상담으로
// 자동 대체되어(깨진 링크 방지) 안전하게 동작한다.
export const KAKAO_CHANNEL_URL = process.env.NEXT_PUBLIC_KAKAO_CHAT_URL ?? "";
export const KAKAO_HREF = KAKAO_CHANNEL_URL || TEL_HREF;

// 신뢰 지표 섹션에 쓰는 수치. 지명원(2025-10-14)에서 확인 가능한 실제 값만 사용합니다.
// (화재복구 자체 시공사례가 아직 없어 "복구현장 수"·"고객만족도" 같은 미확인 수치는 넣지 않았습니다.)
export const TRUST_STATS = [
  { label: "실제 시공실적", value: 200, suffix: "건+" },
  { label: "설립 이후 시공 경력", value: new Date().getFullYear() - COMPANY.foundedYear, suffix: "년" },
  { label: "보유 면허·인증", value: 8, suffix: "종" },
  { label: "전문 시공 인력", value: 13, suffix: "명" },
] as const;

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
  { href: "/terms", label: "이용약관" },
] as const;

export const SITE_URL = "https://thegy.co.kr";
