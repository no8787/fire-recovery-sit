// project_images.storage_path 값을 실제로 렌더링 가능한 src로 바꾼다.
//
// storage_path에는 두 종류의 값이 섞여 있다.
//   1) 정적 파일 경로  : "/images/construction/<slug>/0.jpg"  (초기 시드 데이터)
//   2) Storage 오브젝트 키: "<projectId>/<timestamp>-<rand>.webp" (관리자 업로드)
// 1번을 getPublicUrl()에 넣으면 존재하지 않는 Storage URL이 만들어져 이미지가 깨진다.
//
// 공개 페이지와 관리자 화면이 같은 규칙을 쓰도록 이 파일 한 곳에서만 정의한다.
// (관리자 상세 화면이 이 분기를 쓰지 않고 getPublicUrl()을 무조건 호출해서
//  시드 이미지 27건이 전부 깨져 보이던 버그가 있었다.)
//
// 쿠키 기반 서버 클라이언트와 쿠키 없는 public 클라이언트 양쪽에서 호출하므로
// 특정 클라이언트 타입에 묶지 않고 필요한 부분만 구조적으로 받는다.
interface StorageUrlBuilder {
  storage: {
    from: (bucket: string) => {
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
}

export function resolveImageSrc(supabase: StorageUrlBuilder, path: string): string {
  if (path.startsWith("/") || path.startsWith("images/")) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  return supabase.storage.from("project-images").getPublicUrl(path).data.publicUrl;
}
