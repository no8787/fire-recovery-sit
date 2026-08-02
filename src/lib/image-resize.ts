// 업로드 전 브라우저에서 이미지를 줄여 전송량을 낮춘다.
// 요즘 휴대폰 사진은 장당 3~5MB인데 사이트에 필요한 해상도는 그보다 훨씬 작다.
// 원본을 그대로 올리면 업로드가 느리고 서버 5MB 제한에도 쉽게 걸린다.
//
// 주의: 서버(actions.ts)는 "확장자와 MIME이 일치"할 것을 요구하므로,
// WebP로 변환하면 파일명 확장자도 반드시 .webp로 바꿔서 보내야 한다.

const MAX_EDGE = 1600;
const WEBP_QUALITY = 0.8;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 읽을 수 없습니다."));
    };
    img.src = url;
  });
}

function replaceExtension(name: string, ext: string): string {
  const base = name.replace(/\.[^./\\]+$/, "");
  return `${base || "image"}.${ext}`;
}

/**
 * 긴 변을 MAX_EDGE 이하로 줄이고 WebP로 변환한다(비율 유지).
 * 변환에 실패하거나 오히려 용량이 커지면 원본 File을 그대로 돌려준다.
 */
export async function resizeImageForUpload(file: File): Promise<File> {
  // 브라우저 API가 없는 환경(SSR 등)에서는 손대지 않는다.
  if (typeof window === "undefined" || typeof document === "undefined") return file;

  try {
    const img = await loadImage(file);
    const { width, height } = img;
    if (!width || !height) return file;

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
    );
    // toBlob이 null이거나(미지원) 변환 결과가 원본보다 크면 원본을 쓴다.
    if (!blob || blob.size === 0 || blob.size >= file.size) return file;

    return new File([blob], replaceExtension(file.name, "webp"), {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch {
    // 어떤 이유로든 실패하면 업로드 자체를 막지 않고 원본으로 진행한다.
    return file;
  }
}
