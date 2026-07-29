import localFont from "next/font/local";
import { Inter } from "next/font/google";

// 지금까지 globals.css가 "Pretendard Variable"을 font-family 문자열로만 참조하고
// 실제로 로드하는 코드가 없어서, 사용자 시스템에 그 폰트가 없으면 그냥 시스템 폰트로
// 대체되고 있었다(투박해 보이는 원인 중 하나). next/font/local로 실제 로드하고
// self-host한다 — 폰트 파일 자체는 pretendard npm 패키지(node_modules)에서 가져오므로
// 저장소에 폰트 파일을 직접 추가하지 않는다.
export const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
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
