import { COMPANY } from "@/lib/constants";

// 이미지 업로드 시 캡션/대체텍스트 기본값을 프로젝트 정보로 자동 생성한다.
// 어디까지나 기본값이며 업로드 전/후 모두 사용자가 자유롭게 수정할 수 있다.
//
// 캡션과 대체텍스트는 역할이 다르므로 서로 다른 문구를 만든다.
//   - 캡션    : 화면에 보이는 설명. 지역·공사성격까지 포함해 정보량을 준다.
//   - 대체텍스트: 스크린리더가 읽는 문장. 회사명과 공사명 중심으로 짧게 만든다.
// (예전에는 같은 문자열을 두 필드에 그대로 넣어, 업로드 화면에서 같은 문장이
//  두 줄로 보이고 접근성상으로도 의미가 없었다.)

export function buildDefaultCaption(
  project: { title: string; region: string; projectNature: string },
  index: number,
  total: number
): string {
  const parts = [project.region, project.projectNature].filter(Boolean).join(" ");
  const base = parts ? `${project.title} · ${parts} - 시공 사진` : `${project.title} - 시공 사진`;
  return total > 1 ? `${base} ${index + 1}번` : base;
}

export function buildDefaultAltText(
  project: { title: string },
  index: number,
  total: number
): string {
  const base = `${COMPANY.nameKo} ${project.title} 시공사진`;
  // 여러 장일 때 alt가 전부 같으면 스크린리더에서 구분이 되지 않으므로 번호만 덧붙인다.
  return total > 1 ? `${base} ${index + 1}` : base;
}
