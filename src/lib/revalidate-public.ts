import "server-only";
import { revalidatePath } from "next/cache";

// 각 도메인 데이터가 실제로 렌더링되는 "공개" 경로를 여기 한 곳에서만 정확히
// 나열한다. 이전에는 도메인별 actions.ts 4곳에 revalidatePublic()이 각자
// 중복 정의되어 있었는데, projects/categories 쪽에 "/"(홈)가 빠져 있어서
// 관리자에서 프로젝트의 "대표 노출(is_featured)"을 꺼도 홈 화면 "대표
// 시공실적" 섹션(FeaturedPortfolio)이 재배포 전까지 예전 상태로 고정되어
// 보이는 버그가 있었다 — 홈(/)이 완전 정적 페이지라 재검증 안 하면 절대
// 안 바뀐다. 새 도메인을 추가하거나 공개 페이지 구성을 바꿀 때는 아래
// 목록도 함께 업데이트할 것.

export function revalidateProjectsPublic() {
  // projects는 홈(FeaturedPortfolio), /portfolio, /fire-cases 세 곳 모두에서
  // 노출된다 — 셋 중 하나라도 빠지면 그 페이지만 조용히 안 바뀐다.
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/fire-cases");
}

export function revalidateCategoriesPublic() {
  // 카테고리는 projects와 동일하게 홈/포트폴리오/화재복구사례에서
  // 필터·라벨로 쓰인다. 관리자 목록 화면도 함께 갱신한다(기존 동작 유지).
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/fire-cases");
  revalidatePath("/admin/categories");
}

export function revalidateFaqPublic() {
  // 주의: /faq는 아직 Supabase가 아니라 src/lib/mock/faq.ts(mock 데이터)를
  // 그대로 쓰고 있어서, 지금은 이 호출이 공개 화면에 실질적인 영향이 없다.
  // /faq가 실제 DB로 연결되는 순간부터 의미가 생기도록 남겨둔다.
  revalidatePath("/faq");
  revalidatePath("/admin/faq");
}

export function revalidatePostsPublic() {
  // 주의: /guide도 아직 src/lib/mock/guide.ts(mock 데이터) 기반이라 마찬가지로
  // 지금 당장은 공개 화면에 실질적인 영향이 없다.
  revalidatePath("/guide");
}
