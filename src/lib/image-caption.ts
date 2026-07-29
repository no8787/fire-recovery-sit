// 이미지 업로드 시 캡션/대체텍스트 기본값을 프로젝트 정보로 자동 생성한다.
// 어디까지나 기본값이며 업로드 전/후 모두 사용자가 자유롭게 수정할 수 있다.
export function buildDefaultCaption(
  project: { title: string; region: string; projectNature: string },
  index: number,
  total: number
): string {
  const parts = [project.region, project.projectNature].filter(Boolean).join(" ");
  const base = parts ? `${project.title} · ${parts} - 시공 사진` : `${project.title} - 시공 사진`;
  return total > 1 ? `${base} ${index + 1}번` : base;
}
