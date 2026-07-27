import { PhoneCall, MessageSquareText } from "lucide-react";
import { TEL_HREF } from "@/lib/constants";

export function MobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <a
        href={TEL_HREF}
        className="flex flex-1 items-center justify-center gap-2 bg-slate-900 py-4 text-sm font-bold text-white active:bg-slate-800"
      >
        <PhoneCall className="h-4 w-4" aria-hidden="true" />
        전화상담
      </a>
      <a
        href="/contact"
        className="flex flex-1 items-center justify-center gap-2 bg-orange-600 py-4 text-sm font-bold text-white active:bg-orange-700"
      >
        <MessageSquareText className="h-4 w-4" aria-hidden="true" />
        긴급상담 신청
      </a>
    </div>
  );
}
