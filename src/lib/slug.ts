// 제목 -> URL 슬러그 자동 생성. 한글은 국어의 로마자 표기법(RR) 규칙으로 변환하고,
// 한글도 영문/숫자도 아닌 문자만 남는 경우(이모지 등)에는 날짜+랜덤 문자로 대체한다.
// 클라이언트(입력 중 미리보기)와 서버 액션(최종 저장 직전 정규화) 양쪽에서 그대로 재사용한다.

const INITIALS = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s",
  "ss", "", "j", "jj", "ch", "k", "t", "p", "h",
];
const MEDIALS = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa",
  "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
];
const FINALS = [
  "", "g", "kk", "gs", "n", "nj", "nh", "d", "l", "lg",
  "lm", "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s",
  "ss", "ng", "j", "c", "k", "t", "p", "h",
];

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const MEDIAL_COUNT = 21;
const FINAL_COUNT = 28;

function romanizeHangul(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
      const offset = code - HANGUL_BASE;
      const initial = Math.floor(offset / (MEDIAL_COUNT * FINAL_COUNT));
      const medial = Math.floor((offset % (MEDIAL_COUNT * FINAL_COUNT)) / FINAL_COUNT);
      const final = offset % FINAL_COUNT;
      out += INITIALS[initial] + MEDIALS[medial] + FINALS[final];
    } else {
      out += ch;
    }
  }
  return out;
}

function randomSuffix(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6);
  return `${date}-${rand}`;
}

export function slugify(title: string): string {
  const romanized = romanizeHangul(title);
  const slug = romanized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || randomSuffix();
}
