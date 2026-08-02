# v1.1 TODO

v1.0(`v1.0.0`, 커밋 `3a8d9d8`) 마감 시점 기준 이월 항목.

우선순위 기준
- **P0** — 사실관계 오류·오해 소지. 공개 상태로 두면 안 되는 항목
- **P1** — 콘텐츠 공백. 홍보 효과에 직접 영향
- **P2** — 개선·운영 편의

---

## P0 — 사실관계 정리 (최우선)

### 1. 제일디자인·인쇄·출판·옥외광고 표기 제거
현재 사이트에 화재복구와 무관한 사업 영역이 노출되어 있다. 화재복구 전문기업
포지셔닝을 흐리므로 정리 대상.

- `src/lib/constants.ts` → `COMPANY.affiliate` ("제일디자인(JEIL DESIGN)")
  — `/about` PageHero 설명문과 회사 기본정보에 노출 중
- `src/lib/data/certifications.ts` → 인쇄사 신고필증 / 출판사 신고확인증 / 옥외광고사업 등록증
  (석면해체·제거업은 화재복구와 연관되므로 유지 검토)
- `COMPANY.homepages`의 `jeildesign.co.kr` 노출 여부 확인 (Footer)

> 실제로 보유한 면허를 지우는 것이므로 **대표님 확인 후 진행**할 것.

### 2. 주소 통일
`src/lib/constants.ts`에 주소가 두 개 등록되어 있고 `/about`에 나란히 노출된다.

- `address`: "인천광역시 서구 서곶로347 KM빌딩 3층"
- `addressAlt`: "서곶로 345 서광빌딩 1층"

지명원 서류상 주소는 "인천 서구 서곶로 347 301호(연희동, 케이엠빌딩)".
현재 실제 사무실 기준으로 하나만 남기고 통일 필요. **대표님 확인 필요.**

---

## P1 — 콘텐츠 공백 채우기

### 3. `imports/case-001-restaurant` 실제 화재복구 사례 등록
현재 `fire_case` 프로젝트는 1건뿐이고 사진이 없다. 화재복구 전문기업을 표방하면서
정작 화재복구 실적이 비어 있는 상태.

- 원본 111장 → 선별(10~15장 권장) → 리사이즈(긴 변 1600px) → WebP 변환
- **상호 비공개**: 익명 슬러그 사용(예: `case-001-restaurant`), 간판·상호가 찍힌 사진 제외
- `stage` 필드(`before`/`during`/`after`)를 채우면 Before/After 레이아웃이 자동 동작
- 게시용 파일은 `public/images/` 아래 배치 (원본 `imports/`는 계속 git 제외 유지)

### 4. `/fire-cases` 이미지 채우기
`src/lib/data/fire-recovery-examples.ts`의 예시 2건이 `src: ""` 상태다.
`public/images/fire-examples/`에 파일 3개가 있으나 코드에 연결되어 있지 않다.
연결하거나, 3번의 실제 사례가 등록되면 예시 콘텐츠 자체를 정리하는 방향 검토.

### 5. 포트폴리오 추가 등록
지명원 외 최신 시공실적 추가. 사진 보유 27건 → 확대 시 `/portfolio` 카드 노출이 늘어난다.

### 6. 인증서 이미지 게시
- **완료분 7종** (`public/images/certifications/`, 마스킹 완료, 현재 코드 미참조)
  시공능력순위확인서 2종, 중소기업확인서, 여성기업확인서, 메인비즈,
  연구개발전담부서 인정서, 산업디자인전문회사 신고확인증
- **미완성분**: 각종면허 4종(옥외광고/인쇄/출판/석면해체) — 1페이지에 4개가 모여 있어 분할·마스킹 필요
- **문서 없음**: 건설업등록증 4종은 지명원 PDF에 개별 스캔본이 없다(회사개요 표에만 기재)
- **게시 제외**: 사업자등록증, 법인등기부등본, 기업신용평가등급(BB-), 기술자 자격현황표(직원 실명 11명)

`src/lib/data/certifications.ts`의 `imageSrc`에 경로를 넣으면 되도록 구조를 잡아뒀다.
`/about` 인증 섹션에 이미지 카드 + 라이트박스 확대를 추가하는 작업이 남는다.

> 마스킹 필수: 발급번호·문서번호·유효기간·QR·법인등록번호.
> 좌표 기반 자동 마스킹은 시행착오가 많았으므로 **이미지 편집기로 수동 처리 권장.**

### 7. 복구 후 예상 디자인 섹션
화재 피해 고객에게 "복구 후 이렇게 됩니다"를 보여주는 섹션. 신규 기획 필요.

---

## P2 — 개선·운영

### 8. `thegy.co.kr` 도메인 연결
현재 프로덕션은 `fire-recovery-sit.vercel.app`.
`src/lib/constants.ts`의 `SITE_URL`이 이미 `https://thegy.co.kr`로 되어 있어
**sitemap·OG 이미지 URL이 실제 도메인과 불일치한다.** 도메인 연결 시 함께 정합성 확인.

### 9. sitemap / robots / 파비콘 / OG 확인
- `sitemap.xml`, `robots.txt`: 생성됨. 8번 도메인 이슈와 함께 URL 정합성 재확인
- **파비콘: 교체 필요 (확인됨)** — `src/app/favicon.ico`가 `729e664`(Initial commit from
  Create Next App)에 들어온 **Next.js 기본 파비콘 그대로**다. 회사 로고로 교체할 것
- **OG 이미지: 커스텀 구현 완료** — `src/app/opengraph-image.tsx`에서 브랜드 네이비 배경 +
  회사 정보로 1200×630 이미지를 동적 생성한다. 다만 8번(도메인)이 정리되기 전까지는
  `metadataBase`가 실제 도메인과 달라 소셜 공유 시 이미지 로드 실패 가능 → 도메인 연결 후 실측 필요

### 10. 이미지 업로드 속도 개선
관리자 다중 업로드가 느리다는 보고. 현재 `MultiImageUpload`가 파일을 **순차 업로드**하고
파일당 서버 액션을 왕복한다. 개선 방향: 병렬 업로드(동시 2~3개) 또는 클라이언트 사전 리사이즈.
(원인 추정 단계이며 실제 프로파일링은 미수행)

### 11. 미사용 파일 정리
현재 어디서도 import되지 않는 파일:
- `src/components/home/HeroGallery.tsx` (Hero가 단일 이미지로 바뀌며 미사용)
- `src/components/home/ProcessFlow.tsx` (5단계 타임라인으로 대체됨)
- `src/components/home/ServicesGrid.tsx` (전문 솔루션 카드로 대체됨)
- `src/components/process/ProcessTimeline.tsx` — **`/process` 페이지에서 사용 중이므로 삭제 금지**
- `public/images/fire-recovery/ai/painting-finishing-ai.webp` (매칭되는 자리 없음)

삭제 전 `grep -rn "<파일명>" src/`로 참조 여부 재확인할 것.

### 12. 홈 문구 정합성 재확인
`src/lib/mock/` 아래 데이터(`services.ts`, `strengths.ts`, `faq.ts`)가 아직 mock 파일이다.
`/faq`, `/guide`는 Supabase가 아니라 이 mock을 그대로 쓰고 있다.
관리자 FAQ CRUD는 동작하지만 공개 `/faq`에는 반영되지 않는 상태 — 연결 여부 결정 필요.
