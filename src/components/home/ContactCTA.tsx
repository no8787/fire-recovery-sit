import { PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { COMPANY, TEL_HREF } from "@/lib/constants";

export function ContactCTA() {
  return (
    <section className="bg-orange-600 py-14 text-white sm:py-16">
      <Container className="flex flex-col items-center gap-5 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          지금 바로 화재복구 상담을 신청하세요
        </h2>
        <p className="max-w-xl text-sm text-orange-50 sm:text-base">
          현장조사부터 복구 완료까지, {COMPANY.nameKo}가 처음부터 끝까지 함께합니다.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            href="/contact"
            size="lg"
            className="!bg-white !text-orange-700 hover:!bg-orange-50"
          >
            상담 신청하기
          </Button>
          <Button
            href={TEL_HREF}
            size="lg"
            variant="outline"
            className="!border-white/60 !text-white hover:!bg-white/10"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            {COMPANY.tel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
