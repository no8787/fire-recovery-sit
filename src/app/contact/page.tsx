import type { Metadata } from "next";
import { Phone, Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { COMPANY, TEL_HREF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "상담 신청",
  description: "화재복구 상담을 신청하고 신속하게 안내받으세요.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="상담 신청"
        title="화재복구 상담을 신청해 주세요"
        description="접수하신 내용은 담당자가 확인 후 빠르게 연락드립니다."
      />

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <ContactForm />

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Phone className="h-4 w-4 text-orange-600" aria-hidden="true" />
                긴급 전화상담
              </p>
              <a href={TEL_HREF} className="mt-1 block text-lg font-extrabold text-orange-600">
                {COMPANY.tel}
              </a>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock className="h-4 w-4 text-orange-600" aria-hidden="true" />
                상담 안내
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                접수 후 영업일 기준 1~2일 이내 담당자가 연락드립니다. 긴급한 경우 전화로
                먼저 연락 주세요.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MapPin className="h-4 w-4 text-orange-600" aria-hidden="true" />
                오시는 길
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {COMPANY.address}
                <br />({COMPANY.addressAlt})
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
