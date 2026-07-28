import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const EMAIL = process.env.QA_ADMIN_EMAIL ?? "1588-1077@hanmail.net";
const PASSWORD = process.env.QA_ADMIN_PASSWORD;
if (!PASSWORD) {
  console.error("QA_ADMIN_PASSWORD 환경변수가 필요합니다. scripts/reset-admin-pw.mjs로 임시 비밀번호를 발급한 뒤 지정하세요.");
  process.exit(1);
}
const SHOT_DIR =
  "C:/Users/ADMINI~1/AppData/Local/Temp/claude/c--Users-Administrator-Documents-fire-recovery-site/ea56e546-2608-4abd-a086-4b735473681b/scratchpad/qa-screens";

let shotIndex = 0;
async function shot(page, name) {
  shotIndex += 1;
  const path = `${SHOT_DIR}/${String(shotIndex).padStart(2, "0")}-${name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`  [screenshot] ${path}`);
}

function log(step, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} | ${step}${detail ? " | " + detail : ""}`);
  if (!ok) throw new Error(`STOP at: ${step} ${detail}`);
}

// Next.js 서버 액션(form action={fn})은 redirect() 호출 시 하드 네비게이션이 아니라
// 클라이언트 라우터를 통한 소프트 패치(RSC payload 교체)로 처리되는 경우가 많다.
// POST 응답 자체는 즉시 끝나도 화면(DOM)이 갱신되기까지 수백 ms의 별도 텀이 생길 수 있어,
// "네트워크가 idle해졌다" != "화면에 새 내용이 반영됐다" 이다.
// 그래서 모든 검증은 단발성 read가 아니라, 기대하는 상태가 나타날 때까지 짧은 간격으로
// 폴링(poll)하는 방식으로 통일한다.
async function pollUntil(fn, timeoutMs = 25000, intervalMs = 150) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await fn();
    if (last) return last;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return last;
}

async function expectBodyIncludes(page, text, timeoutMs = 25000) {
  let body = "";
  const found = await pollUntil(async () => {
    body = await page.textContent("body");
    return body.includes(text);
  }, timeoutMs);
  return { ok: !!found, body };
}

async function expectInputValue(locator, expected, timeoutMs = 25000) {
  let value = "";
  const found = await pollUntil(async () => {
    value = await locator.inputValue();
    return value === expected;
  }, timeoutMs);
  return { ok: !!found, value };
}

async function expectLocatorCount(locator, predicate, timeoutMs = 25000) {
  let count = 0;
  const found = await pollUntil(async () => {
    count = await locator.count();
    return predicate(count);
  }, timeoutMs);
  return { ok: !!found, count };
}

// 서버 액션은 현재 페이지 URL로 POST 후 redirect()로 응답한다.
// Turbopack의 최초 컴파일 지연(수 초) 때문에 click() 직후 고정 타임아웃으로는
// 신뢰할 수 없어, "현재 URL로의 POST" 응답을 정확히 기다린다.
// (화면 갱신 확인은 이후 각 expect* 헬퍼가 폴링으로 담당한다.)
async function submitAndWait(page, clickable) {
  const targetUrl = page.url();
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.request().method() === "POST" && r.url() === targetUrl, {
      timeout: 30000,
    }),
    typeof clickable === "string" ? page.click(clickable) : clickable.click(),
  ]);
  await resp.finished();
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  return resp;
}

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("pageerror", (e) => console.log("  [pageerror]", e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("  [console.error]", msg.text());
});

try {
  // -------------------------------------------------------------------
  // 0. 로그인
  // -------------------------------------------------------------------
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await shot(page, "login-page");
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await Promise.all([page.waitForURL(`${BASE}/admin`, { timeout: 15000 }), page.click('button[type="submit"]')]);
  log("로그인 -> /admin 이동", page.url() === `${BASE}/admin`);
  await shot(page, "dashboard");

  // -------------------------------------------------------------------
  // 1. Dashboard 확인
  // -------------------------------------------------------------------
  const dashboardText = await page.textContent("body");
  log("Dashboard: 이메일 표시", dashboardText.includes(EMAIL));
  log("Dashboard: role 표시", dashboardText.includes("super_admin"));
  log("Dashboard: 로그아웃 버튼", (await page.locator('button:has-text("로그아웃")').count()) > 0);

  // -------------------------------------------------------------------
  // 2. project_categories: 등록 -> 수정 -> 참조중 삭제 차단 -> 미참조 삭제 성공
  // -------------------------------------------------------------------
  await page.goto(`${BASE}/admin/categories`, { waitUntil: "networkidle" });
  await shot(page, "categories-list");

  const catSlug = "qa-test-" + Date.now();
  await page.fill('input[name="slug"]', catSlug);
  await page.fill('input[name="label"]', "QA테스트카테고리");
  await submitAndWait(page, 'form button[type="submit"]:has-text("등록")');
  let r = await expectBodyIncludes(page, catSlug);
  await shot(page, "categories-after-create");
  log("카테고리 등록 확인", r.ok);

  // 수정: 라벨 변경 (input value는 textContent에 없으므로 inputValue()로 확인)
  const row = page.locator(`tr:has-text("${catSlug}")`);
  await row.locator('input[name="label"]').fill("QA테스트카테고리(수정됨)");
  await submitAndWait(page, row.locator('button:has-text("저장")'));
  let iv = await expectInputValue(row.locator('input[name="label"]'), "QA테스트카테고리(수정됨)");
  log("카테고리 수정 확인", iv.ok, `실제값=${iv.value}`);
  await shot(page, "categories-after-update");

  // 참조 중 삭제 차단: "public"(공공기관, 시공실적) 카테고리는 다수 프로젝트가 참조 중이므로 삭제 시도 시 차단되어야 함
  const publicRow = page.locator('tr:has-text("public")').first();
  await submitAndWait(page, publicRow.locator('button:has-text("삭제")'));
  r = await pollUntil(async () => {
    const t = await page.textContent("body");
    return t.includes("삭제할 수 없습니다") || t.includes("시공사례가") ? { ok: true } : null;
  }).then((v) => v ?? { ok: false });
  await shot(page, "categories-delete-blocked");
  log("참조 중 카테고리 삭제 차단 확인", r.ok);

  // 미참조 카테고리(QA 테스트 카테고리) 삭제는 성공해야 함
  const qaCatRow = page.locator(`tr:has-text("${catSlug}")`);
  await submitAndWait(page, qaCatRow.locator('button:has-text("삭제")'));
  const gone = await pollUntil(async () => (await qaCatRow.count()) === 0);
  await shot(page, "categories-after-delete-unreferenced");
  log("미참조 카테고리 삭제 성공 확인", !!gone);

  // -------------------------------------------------------------------
  // 3. projects: 등록 -> 목록 반영 -> 상세 -> 수정 -> 공개/비공개 -> 정렬순서
  // -------------------------------------------------------------------
  await page.goto(`${BASE}/admin/projects/new`, { waitUntil: "networkidle" });
  await shot(page, "project-new-form");

  const projectSlug = "qa-test-project-" + Date.now();
  await page.selectOption('select[name="kind"]', "construction");
  await page.fill('input[name="slug"]', projectSlug);
  const catOptionValue = await page
    .locator('select[name="category_id"] option', { hasText: "공공기관" })
    .first()
    .getAttribute("value");
  await page.selectOption('select[name="category_id"]', catOptionValue);
  await page.fill('input[name="title"]', "QA 테스트 시공사례");
  await page.fill('input[name="region"]', "테스트 지역");
  await page.fill('input[name="building_type"]', "테스트 건물");
  await page.fill('input[name="period"]', "2026.01");
  await page.fill('input[name="project_nature"]', "실내인테리어");
  await page.fill('textarea[name="scope"]', "QA 테스트 항목1\nQA 테스트 항목2");
  await page.fill('textarea[name="description"]', "자동화 QA 검증용으로 생성한 테스트 시공사례입니다.");
  await submitAndWait(page, 'button:has-text("등록하고 이미지 추가하기")');
  await page.waitForURL(/\/admin\/projects\/[0-9a-f-]{20,}/, { timeout: 15000 });
  const projectEditUrl = page.url();
  const projectId = projectEditUrl.split("/").pop().split("?")[0];
  log("projects 등록 -> 상세페이지 리다이렉트", /\/admin\/projects\/[0-9a-f-]+/.test(projectEditUrl));
  await shot(page, "project-detail-after-create");

  await page.goto(`${BASE}/admin/projects`, { waitUntil: "networkidle" });
  r = await expectBodyIncludes(page, "QA 테스트 시공사례");
  log("projects 목록에 새 항목 반영", r.ok);
  await shot(page, "projects-list-with-new-item");

  // 상세 재방문 -> 수정 (제목/정렬순서 변경)
  await page.goto(`${BASE}/admin/projects/${projectId}`, { waitUntil: "networkidle" });
  await page.fill('input[name="title"]', "QA 테스트 시공사례(수정됨)");
  await page.fill('input[name="sort_order"]', "77");
  await submitAndWait(page, 'button:has-text("저장")');
  const savedMsg = await expectBodyIncludes(page, "저장되었습니다");
  iv = await expectInputValue(page.locator('input[name="title"]'), "QA 테스트 시공사례(수정됨)");
  log("projects 수정(제목/정렬순서) 확인", savedMsg.ok && iv.ok, `저장메시지=${savedMsg.ok} 제목값=${iv.value}`);
  await shot(page, "project-after-update");

  // 목록에서 정렬순서 반영 확인 + 공개/비공개 토글
  await page.goto(`${BASE}/admin/projects`, { waitUntil: "networkidle" });
  const projectRow = page.locator(`tr:has-text("QA 테스트 시공사례(수정됨)")`);
  const sortReflected = await pollUntil(async () => (await projectRow.textContent()).includes("77"));
  log("목록에 정렬순서(77) 반영", !!sortReflected);
  await submitAndWait(page, projectRow.locator('button:has-text("비공개 전환")'));
  const unpublished = await pollUntil(async () => (await projectRow.textContent()).includes("비공개"));
  await shot(page, "project-unpublished");
  log("공개->비공개 전환 확인", !!unpublished);

  // -------------------------------------------------------------------
  // 4. project_images: 업로드 -> 대표이미지 지정 -> alt/caption 저장 -> 삭제
  // -------------------------------------------------------------------
  await page.goto(`${BASE}/admin/projects/${projectId}`, { waitUntil: "networkidle" });
  const testImagePath =
    "c:/Users/Administrator/Documents/fire-recovery-site/public/images/construction/hwajeong-bom-clinic/0.jpg";
  await page.setInputFiles('input[name="file"]', testImagePath);
  await page.fill('input[name="caption"]', "QA 테스트 캡션");
  await page.fill('input[name="alt_text"]', "QA 테스트 대체텍스트");
  await submitAndWait(page, 'button:has-text("업로드")');
  const uploadedImg = page.locator('img[alt="QA 테스트 대체텍스트"]');
  let cnt = await expectLocatorCount(uploadedImg, (c) => c > 0);
  await shot(page, "project-image-uploaded");
  log("이미지 업로드 확인(썸네일 렌더링, caption/alt 저장)", cnt.ok, `count=${cnt.count}`);

  await submitAndWait(page, 'button:has-text("대표로 지정")');
  const thumbSet = await expectBodyIncludes(page, "대표 이미지");
  await shot(page, "project-image-thumbnail-set");
  log("대표 이미지 지정 확인", thumbSet.ok);

  // 삭제 (confirm dialog 자동 승인)
  page.once("dialog", (d) => d.accept());
  await submitAndWait(page, 'button:has-text("삭제")');
  cnt = await expectLocatorCount(uploadedImg, (c) => c === 0);
  await shot(page, "project-image-deleted");
  log("이미지 삭제 후 목록에서 제거", cnt.ok, `count=${cnt.count}`);

  console.log("\n=== PART1 (categories/projects/project_images) 검증 완료 ===\n");

  // -------------------------------------------------------------------
  // 5. inquiries: 공개 폼으로 실제 상담 접수 -> 관리자에서 목록/상세/상태변경/유지 확인
  // -------------------------------------------------------------------
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
  await shot(page, "contact-form");

  const inquiryName = "QA테스트문의자";
  const inquiryPhone = "010-1234-5678";
  await page.locator('label:has-text("일반상담")').click();
  await page.fill("#name", inquiryName);
  await page.fill("#phone", inquiryPhone);
  await page.fill("#email", "qa-test@example.com");
  await page.fill("#siteAddress", "테스트 주소 123");
  await page.selectOption("#buildingType", "기타");
  await page.fill("#damageDescription", "자동화 QA 검증용으로 생성한 피해 내용입니다.");
  await page.locator('label:has-text("확인필요")').click();
  await page.fill("#message", "자동화 QA 검증용 문의입니다.");
  await page.locator('input[type="checkbox"]').check();

  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes("/api/inquiries") && resp.request().method() === "POST", {
      timeout: 30000,
    }),
    page.click('button[type="submit"]'),
  ]);
  r = await expectBodyIncludes(page, "접수되었습니다");
  await shot(page, "contact-form-submitted");
  log("공개 상담신청 접수 확인", r.ok || r.body.includes("FIRE-"));

  await page.goto(`${BASE}/admin/inquiries`, { waitUntil: "networkidle" });
  r = await expectBodyIncludes(page, inquiryName);
  await shot(page, "inquiries-list");
  log("관리자 상담문의 목록에 반영", r.ok);

  const inquiryRow = page.locator("tr", { hasText: inquiryName }).first();
  const inquiryDetailHref = await inquiryRow.locator("a").first().getAttribute("href");
  await page.goto(`${BASE}${inquiryDetailHref}`, { waitUntil: "networkidle" });
  await shot(page, "inquiry-detail");
  const detailBody = await page.textContent("body");
  log("상담문의 상세 진입 확인", detailBody.includes(inquiryName) && detailBody.includes(inquiryPhone));

  // 상태 변경
  await page.locator('select[name="status"]').selectOption("in_progress");
  await submitAndWait(page, page.locator('form:has(select[name="status"]) button[type="submit"]'));
  iv = await expectInputValue(page.locator('select[name="status"]'), "in_progress");
  await shot(page, "inquiry-status-changed");
  log("상담상태 변경 확인", iv.ok, `실제값=${iv.value}`);

  // 새로고침 후 유지 확인
  await page.reload({ waitUntil: "networkidle" });
  const statusValueAfterReload = await page.locator('select[name="status"]').inputValue();
  log("상담상태 변경 후 새로고침 시 유지", statusValueAfterReload === "in_progress", `실제값=${statusValueAfterReload}`);
  await shot(page, "inquiry-status-persisted");

  // 내부 메모 추가
  const noteBox = page.locator('textarea[name="note"]');
  if ((await noteBox.count()) > 0) {
    await noteBox.fill("QA 자동화 검증 메모입니다.");
    await submitAndWait(page, page.locator('form:has(textarea[name="note"]) button[type="submit"]'));
    r = await expectBodyIncludes(page, "QA 자동화 검증 메모입니다.");
    await shot(page, "inquiry-note-added");
    log("내부 메모 등록 확인", r.ok);
  }

  console.log("\n=== PART2 (inquiries) 검증 완료 ===\n");

  // -------------------------------------------------------------------
  // 6. posts: 등록 -> 공개 -> 수정 -> 비공개 -> 삭제
  // -------------------------------------------------------------------
  await page.goto(`${BASE}/admin/posts`, { waitUntil: "networkidle" });
  await shot(page, "posts-list");

  await page.goto(`${BASE}/admin/posts/new`, { waitUntil: "networkidle" });
  await shot(page, "post-new-form");
  const postSlug = "qa-test-post-" + Date.now();
  await page.fill('input[name="slug"]', postSlug);
  await page.fill('input[name="title"]', "QA 테스트 게시글");
  await page.fill('textarea[name="content"]', "자동화 QA 검증용으로 생성한 게시글 본문입니다.");
  await page.locator('input[type="radio"][name="status"][value="published"]').check();
  // 페이지 상단 admin 레이아웃의 "로그아웃" 버튼도 button[type="submit"]이라 스코프 없이
  // 쓰면 잘못된 버튼(로그아웃)이 클릭될 수 있다 — 반드시 본문 폼으로 스코프한다.
  await submitAndWait(page, 'form:has(textarea[name="content"]) button[type="submit"]');
  r = await expectBodyIncludes(page, "QA 테스트 게시글");
  await shot(page, "post-after-create");
  log("게시글 등록 확인", r.ok);

  const postRow = page.locator(`tr:has-text("QA 테스트 게시글")`).first();
  const postHref = await postRow.locator("a").first().getAttribute("href");
  await page.goto(`${BASE}${postHref}`, { waitUntil: "networkidle" });
  await page.fill('input[name="title"]', "QA 테스트 게시글(수정됨)");
  await submitAndWait(page, 'form:has(textarea[name="content"]) button[type="submit"]');
  iv = await expectInputValue(page.locator('input[name="title"]'), "QA 테스트 게시글(수정됨)");
  log("게시글 수정 확인", iv.ok, `실제값=${iv.value}`);
  await shot(page, "post-after-update");

  await page.goto(`${BASE}/admin/posts`, { waitUntil: "networkidle" });
  const finalPostRow = page.locator(`tr:has-text("QA 테스트 게시글(수정됨)")`);
  await submitAndWait(page, finalPostRow.locator('button:has-text("비공개 전환")'));
  const postUnpub = await pollUntil(async () => (await finalPostRow.textContent()).includes("비공개"));
  await shot(page, "post-unpublished");
  log("게시글 비공개 전환 확인", !!postUnpub);

  page.once("dialog", (d) => d.accept());
  await submitAndWait(page, finalPostRow.locator('button:has-text("삭제")'));
  const postGone = await pollUntil(async () => (await finalPostRow.count()) === 0);
  await shot(page, "post-deleted");
  log("게시글 삭제 확인", !!postGone);

  console.log("\n=== PART3 (posts) 검증 완료 ===\n");

  // -------------------------------------------------------------------
  // 7. faq_items: 등록 -> 정렬 -> 수정 -> 공개여부 -> 삭제
  // -------------------------------------------------------------------
  await page.goto(`${BASE}/admin/faq`, { waitUntil: "networkidle" });
  await shot(page, "faq-list");

  const faqQuestion = "QA 테스트 질문 " + Date.now();
  const faqCreateForm = page.locator("form", { has: page.locator('button:has-text("등록")') });
  await faqCreateForm.locator('input[name="question"]').fill(faqQuestion);
  await faqCreateForm.locator('textarea[name="answer"]').fill("QA 자동화 검증용 답변입니다.");
  await submitAndWait(page, faqCreateForm.locator('button:has-text("등록")'));
  r = await expectBodyIncludes(page, faqQuestion);
  await shot(page, "faq-after-create");
  log("FAQ 등록 확인", r.ok);

  const faqQuestionInput = page.locator(`input[name="question"][value="${faqQuestion}"]`);
  const faqRow = faqQuestionInput.locator('xpath=ancestor::div[contains(@class,"rounded-xl")][1]');

  await faqRow.locator('input[name="sort_order"]').fill("99");
  await submitAndWait(page, faqRow.locator('button:has-text("저장")'));
  iv = await expectInputValue(faqRow.locator('input[name="sort_order"]'), "99");
  await shot(page, "faq-after-reorder");
  log("FAQ 정렬순서 변경 확인", iv.ok, `실제값=${iv.value}`);

  await faqRow.locator('textarea[name="answer"]').fill("QA 자동화 검증용 답변입니다(수정됨).");
  await submitAndWait(page, faqRow.locator('button:has-text("저장")'));
  r = await pollUntil(async () => {
    const t = await faqRow.textContent();
    return t.includes("QA 자동화 검증용 답변입니다(수정됨).");
  }).then((v) => ({ ok: !!v }));
  log("FAQ 수정 확인", r.ok);
  await shot(page, "faq-after-update");

  await submitAndWait(page, faqRow.locator('button:has-text("비공개 전환")'));
  const faqUnpub = await pollUntil(async () => (await faqRow.textContent()).includes("비공개"));
  await shot(page, "faq-unpublished");
  log("FAQ 비공개 전환 확인", !!faqUnpub);

  page.once("dialog", (d) => d.accept());
  await submitAndWait(page, faqRow.locator('button:has-text("삭제")'));
  const faqGone = await pollUntil(async () => (await faqRow.count()) === 0);
  await shot(page, "faq-deleted");
  log("FAQ 삭제 확인", !!faqGone);

  console.log("\n=== PART4 (faq_items) 검증 완료 ===\n");
} catch (err) {
  console.error("\n!!! QA 중단:", err.message);
  await shot(page, "FAILURE-STATE");
  await browser.close();
  process.exit(1);
}

await browser.close();
console.log("ALL QA STEPS DONE OK");
