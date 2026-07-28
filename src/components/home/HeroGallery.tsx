"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface HeroGallerySlide {
  src: string;
  caption: string;
}

// 실제 화재복구 시공사진은 아직 없어(지명원 상 실적 없음) 지명원에 실제로 수록된
// 시공실적 사진을 그대로 사용한다. "화재 피해 전/후"로 오인되지 않도록 캡션에
// 항상 실제 공사 내용을 정확히 표기한다(예: "학교 시설 개선 시공").
export function HeroGallery({ slides }: { slides: HeroGallerySlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 sm:aspect-[16/11]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.caption}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-4 sm:p-5">
            <p className="text-xs font-semibold text-white sm:text-sm">{slide.caption}</p>
          </div>
        </div>
      ))}

      <div className="absolute right-3 top-3 rounded-full bg-slate-950/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
        실제 시공사진
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`${i + 1}번째 사진 보기`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
