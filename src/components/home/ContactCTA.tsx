import { PhoneCall, MessageCircle, ClipboardEdit } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { COMPANY, TEL_HREF, KAKAO_HREF } from "@/lib/constants";

const OPTIONS = [
  {
    href: "/contact",
    icon: ClipboardEdit,
    title: "30초 상담 신청",
    description: "간단한 정보만 입력하면 바로 접수됩니다",
    className: "bg-white text-orange-700 hover:bg-orange-50",
  },
  {
    href: TEL_HREF,
    icon: PhoneCall,
    title: "전화 상담",
    description: COMPANY.tel,
    className: "bg-slate-900 text-white hover:bg-slate-800",
  },
  {
    href: KAKAO_HREF,
    icon: MessageCircle,
    title: "카카오톡 상담",
    description: "채팅으로 바로 문의하기",
    className: "bg-[#FEE500] text-[#191600] hover:bg-[#f5dc00]",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

export function ContactCTA() {
  return (
    <section className="bg-orange-600 py-14 text-white sm:py-16">
      <Container className="flex flex-col items-center gap-6 text-center">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            지금 바로 화재복구 상담을 신청하세요
          </h2>
          <p className="mt-3 max-w-xl text-sm text-orange-50 sm:text-base">
            현장조사부터 복구 완료까지, {COMPANY.nameKo}가 처음부터 끝까지 함께합니다.
          </p>
        </div>

        <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
          {OPTIONS.map(({ href, icon: OptionIcon, title, description, className, target, rel }) => (
            <a
              key={title}
              href={href}
              target={target}
              rel={rel}
              className={`flex flex-col items-center gap-1.5 rounded-xl px-4 py-5 font-semibold shadow-sm transition-colors ${className}`}
            >
              <OptionIcon className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm">{title}</span>
              <span className="text-xs font-normal opacity-80">{description}</span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
