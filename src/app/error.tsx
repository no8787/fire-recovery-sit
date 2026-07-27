"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24">
      <Container className="flex flex-col items-center gap-4 text-center">
        <AlertTriangle className="h-10 w-10 text-slate-400" aria-hidden="true" />
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          일시적인 오류가 발생했습니다
        </h1>
        <p className="text-sm text-slate-600">
          잠시 후 다시 시도해 주세요. 문제가 계속되면 전화로 문의해 주세요.
        </p>
        <div className="flex gap-3">
          <Button onClick={reset} size="lg">
            다시 시도
          </Button>
          <Button href="/" variant="outline" size="lg">
            홈으로 이동
          </Button>
        </div>
      </Container>
    </section>
  );
}
