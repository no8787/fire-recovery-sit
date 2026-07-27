import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-semibold text-orange-600">404</p>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-sm text-slate-600">
          요청하신 페이지가 삭제되었거나 잘못된 경로입니다.
        </p>
        <Button href="/" size="lg">
          홈으로 이동
        </Button>
      </Container>
    </section>
  );
}
