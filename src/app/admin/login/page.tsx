import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  missing: "이메일과 비밀번호를 모두 입력해 주세요.",
  invalid: "이메일 또는 비밀번호가 올바르지 않습니다.",
  forbidden: "비활성화된 계정이거나 접근 권한이 없습니다. 관리자에게 문의해 주세요.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const { error, redirectTo } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] ?? "로그인에 실패했습니다." : null;

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-sm">
        <h1 className="text-xl font-extrabold text-slate-900">관리자 로그인</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          (주)더가연 화재복구 홈페이지 관리자 전용 페이지입니다.
        </p>

        <form action={loginAction} className="mt-8 space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo ?? "/admin"} />
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-800">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-slate-800"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-medium text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full">
            로그인
          </Button>
        </form>
      </Container>
    </section>
  );
}
