import { PhoneCall, MessageCircle, ClipboardEdit } from "lucide-react";
import { TEL_HREF, KAKAO_HREF } from "@/lib/constants";

export function MobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <a
        href={TEL_HREF}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-slate-900 py-3 text-[11px] font-bold text-white active:bg-slate-800"
      >
        <PhoneCall className="h-4 w-4" aria-hidden="true" />
        전화상담
      </a>
      <a
        href={KAKAO_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-[#FEE500] py-3 text-[11px] font-bold text-[#191600] active:bg-[#f5dc00]"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        카카오상담
      </a>
      <a
        href="/contact"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-orange-600 py-3 text-[11px] font-bold text-white active:bg-orange-700"
      >
        <ClipboardEdit className="h-4 w-4" aria-hidden="true" />
        상담신청
      </a>
    </div>
  );
}
