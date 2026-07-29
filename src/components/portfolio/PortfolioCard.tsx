import Image from "next/image";
import Link from "next/link";
import { MapPin, Images } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SampleBadge, Badge } from "@/components/ui/Badge";
import type { PortfolioCategory, PortfolioProject } from "@/lib/types";

export function PortfolioCard({
  project,
  categories,
  linkBase = "/portfolio",
}: {
  project: PortfolioProject;
  categories: PortfolioCategory[];
  linkBase?: string;
}) {
  const category = categories.find((c) => c.slug === project.categorySlug);
  const cover = project.thumbnail;
  const hasStages = Boolean(project.images.before || project.images.after);
  const hasGallery = Boolean(project.images.gallery?.length);
  const coverIsRender = project.images.gallery?.[0]?.isRender;
  const coverIsAiExample = project.images.gallery?.[0]?.isAiExample;

  return (
    <Link
      href={`${linkBase}/${project.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <PlaceholderImage
            className="h-full w-full"
            label={coverIsAiExample ? "AI 생성 이미지 준비 중" : category?.label}
          />
        )}
        {project.sample && !coverIsAiExample && (
          <div className="absolute right-3 top-3">
            <SampleBadge />
          </div>
        )}
        {coverIsRender && (
          <div className="absolute right-3 top-3">
            <Badge tone="orange">3D 렌더링</Badge>
          </div>
        )}
        {coverIsAiExample && (
          <div className="absolute right-3 top-3">
            <Badge tone="violet">AI 생성 예시 이미지</Badge>
          </div>
        )}
        {hasStages && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-slate-900/80 px-2 py-1 text-[11px] font-semibold text-white">
            <Images className="h-3.5 w-3.5" aria-hidden="true" />
            복구 전·후 비교
          </div>
        )}
        {!hasStages && hasGallery && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-slate-900/80 px-2 py-1 text-[11px] font-semibold text-white">
            <Images className="h-3.5 w-3.5" aria-hidden="true" />
            시공사진 {project.images.gallery!.length}장
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {category?.label}
        </p>
        <p className="mt-1 line-clamp-1 text-base font-bold text-slate-900 group-hover:text-orange-600">
          {project.title}
        </p>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {project.region} · {project.buildingType}
        </p>
      </div>
    </Link>
  );
}
