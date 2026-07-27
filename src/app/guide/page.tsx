import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { guidePosts } from "@/lib/mock/guide";

export const metadata: Metadata = {
  title: "화재복구 정보",
  description: "화재 발생 시 초기 대응, 보험 청구, 복구 공정 등 유용한 정보를 안내합니다.",
};

export default function GuidePage() {
  return (
    <>
      <PageHero
        eyebrow="화재복구 정보"
        title="알아두면 도움이 되는 화재복구 정보"
        description="초기 대응부터 보험 청구, 복구 공정까지 실질적인 정보를 정리했습니다."
      />

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {guidePosts.map((post) => (
              <Link
                key={post.id}
                href={`/guide/${post.slug}`}
                className="block rounded-xl border border-slate-200 p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Badge>{post.category}</Badge>
                  <span className="text-xs text-slate-400">{post.publishedAt}</span>
                </div>
                <p className="mt-3 text-lg font-bold text-slate-900">{post.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
