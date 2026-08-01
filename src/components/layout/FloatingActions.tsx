"use client";

import { useEffect, useState } from "react";
import { PhoneCall, MessageCircle, ArrowUp } from "lucide-react";
import { COMPANY, TEL_HREF, KAKAO_HREF } from "@/lib/constants";

// 모든 페이지 우측 하단에 항상 노출되는 상담 위젯(전화+카카오) + TOP 버튼.
// 모바일 하단바(MobileCTA)와 겹치지 않도록 모바일에서는 하단 여백을 더 준다.
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-20 z-30 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6 md:bottom-6">
      {showTop && (
        <button
          type="button"
          aria-label="맨 위로 이동"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <div className="w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <a
          href={TEL_HREF}
          className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] text-slate-500">{COMPANY.nameKo}</span>
            <span className="block truncate text-sm font-extrabold text-slate-900">
              {COMPANY.tel}
            </span>
          </span>
        </a>
        <a
          href={KAKAO_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#FEE500] px-4 py-3 text-sm font-bold text-[#191600] transition-colors hover:bg-[#f5dc00]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          24시간 채팅상담
        </a>
      </div>
    </div>
  );
}
