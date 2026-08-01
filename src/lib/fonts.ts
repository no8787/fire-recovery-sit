import localFont from "next/font/local";
import { Inter } from "next/font/google";

// 지금까지 globals.css가 "Pretendard Variable"을 font-family 문자열로만 참조하고
// 실제로 로드하는 코드가 없어서, 사용자 시스템에 그 폰트가 없으면 그냥 시스템 폰트로
// 대체되고 있었다(투박해 보이는 원인 중 하나). next/font/local로 실제 로드하고
// self-host한다.
//
// 원본 Variable 폰트(node_modules/pretendard, 약 2MB)는 모든 현대 한글 음절
// 11,172자를 포함한다. next/font/local은 next/font/google과 달리 자동 서브셋을
// 지원하지 않으므로, KS X 1001(EUC-KR) 상용한글 2,350자 + 코드베이스에서 실제
// 쓰는 기호(·×—※→★「」) + 통화/타이포 안전 여유분만 fonttools pyftsubset으로
// 미리 추출해 src/fonts/에 커밋해뒀다(약 450KB, ~78% 감소).
// 이 2,350자 밖의 희귀 음절이 향후 관리자 입력 콘텐츠에 나오면 font-family
// 폴백(시스템 고딕)으로만 그려진다 — 크래시 아님, 해당 글자만 살짝 다르게 보임.
export const pretendard = localFont({
  src: "../fonts/PretendardVariable-subset.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

// 영문·숫자 전용. 한글 본문과 섞일 때 이질감이 크지 않도록 제한적으로만 쓴다.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
