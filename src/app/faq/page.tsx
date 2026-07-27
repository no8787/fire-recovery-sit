import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { faqItems } from "@/lib/mock/faq";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "상담, 보험, 복구 공정 등 자주 묻는 질문과 답변을 확인하세요.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="자주 묻는 질문" />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <FaqAccordion items={faqItems} />
        </Container>
      </section>
    </>
  );
}
