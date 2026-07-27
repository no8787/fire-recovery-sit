import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { guidePosts, getGuidePostBySlug } from "@/lib/mock/guide";

export function generateStaticParams() {
  return guidePosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getGuidePostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getGuidePostBySlug(slug);
  if (!post) notFound();

  return (
    <section className="py-14 sm:py-16">
      <Container className="max-w-3xl">
        <Link
          href="/guide"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          화재복구 정보 목록
        </Link>

        <div className="flex items-center gap-2">
          <Badge>{post.category}</Badge>
          <span className="text-xs text-slate-400">{post.publishedAt}</span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {post.title}
        </h1>

        <div className="mt-8 space-y-4">
          {post.content.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-slate-700 sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-8 text-center">
          <p className="text-lg font-bold text-slate-900">
            더 궁금한 점이 있다면 상담을 신청해 보세요
          </p>
          <Button href="/contact" size="lg">
            상담 신청하기
          </Button>
        </div>
      </Container>
    </section>
  );
}
