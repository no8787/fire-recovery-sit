import { Fragment } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import type { PortfolioImageSet } from "@/lib/types";

const STAGES: {
  key: "before" | "during" | "after";
  label: string;
  tagBg: string;
  barColor: string;
}[] = [
  { key: "before", label: "복구 전", tagBg: "bg-slate-700", barColor: "bg-slate-400" },
  { key: "during", label: "복구 중", tagBg: "bg-slate-600", barColor: "bg-slate-500" },
  { key: "after", label: "복구 후", tagBg: "bg-emerald-700", barColor: "bg-emerald-600" },
];

// 화재복구 사례처럼 전/중/후 단계 구분이 있는 경우에만 3단계 비교 UI를 쓰고,
// 시공실적처럼 단계 구분 없는 실제 시공사진 여러 장은 단순 갤러리로 보여준다.
export function BeforeAfter({ images }: { images: PortfolioImageSet }) {
  if (images.gallery && images.gallery.length > 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <p className="mb-4 text-sm font-bold text-slate-900 sm:mb-5">시공사진</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.gallery.map((photo, index) => (
            <div key={photo.src} className="relative overflow-hidden rounded-xl shadow-sm">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={photo.src}
                  alt={`시공사진 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              {photo.isRender && (
                <span className="absolute left-2 top-2">
                  <Badge tone="orange">3D 렌더링 (실제 시공사진 아님)</Badge>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <p className="mb-4 text-sm font-bold text-slate-900 sm:mb-5">복구 전 · 중 · 후 비교</p>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-3">
        {STAGES.map(({ key, label, tagBg, barColor }, index) => {
          const src = images[key];
          return (
            <Fragment key={key}>
              <div>
                <div className={`h-1 rounded-full ${barColor}`} />
                <div className="relative mt-2 overflow-hidden rounded-xl shadow-sm">
                  {src ? (
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={src} alt={label} fill className="object-cover" />
                    </div>
                  ) : (
                    <PlaceholderImage
                      label={`${label} 이미지 준비 중`}
                      className="aspect-[4/3] w-full"
                    />
                  )}
                  <span
                    className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[11px] font-bold text-white ${tagBg}`}
                  >
                    {label}
                  </span>
                </div>
              </div>
              {index < STAGES.length - 1 && (
                <ArrowRight
                  className="mx-auto hidden h-5 w-5 shrink-0 text-slate-300 sm:block"
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
