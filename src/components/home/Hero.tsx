import { PhoneCall, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FireRecoveryIllustration } from "@/components/ui/FireRecoveryIllustration";
import { COMPANY, TEL_HREF } from "@/lib/constants";

export function Hero() {
  return (
    <section className="border-b border-slate-200 bg-slate-900 text-white">
      <Container className="grid gap-10 py-16 sm:py-20 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-slate-200">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {COMPANY.nameKo} 화재복구 전문
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            화재 발생부터
            <br />
            완전한 복구까지
          </h1>
          <p className="mt-5 max-w-lg text-base text-slate-300 sm:text-lg">
            현장조사부터 준공까지, 화재복구 전공정을 한 곳에서 통합 관리합니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              긴급상담 신청
            </Button>
            <Button
              href="/fire-cases"
              variant="outline"
              size="lg"
              className="!border-white/30 !text-white hover:!bg-white/10"
            >
              복구사례 보기
            </Button>
            <Button
              href={TEL_HREF}
              variant="ghost"
              size="lg"
              className="hidden !text-white hover:!bg-white/10 md:inline-flex"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              {COMPANY.tel}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <FireRecoveryIllustration className="h-40 w-full sm:h-48" />
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {[
              { label: "전공정 통합관리", desc: "조사부터 준공까지 한 번에" },
              { label: "손해사정사 협업", desc: "보험 처리 지원" },
              { label: "소방·전기 협업", desc: "안전 기준 준수 복구" },
              { label: "주택~공장 대응", desc: "규모별 맞춤 대응" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5"
              >
                <p className="text-sm font-bold text-white sm:text-base">{item.label}</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
