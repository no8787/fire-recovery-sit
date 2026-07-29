import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { guidePosts } from "@/lib/mock/guide";
import { getSbProjects } from "@/lib/supabase/public-queries";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/process",
  "/portfolio",
  "/fire-cases",
  "/guide",
  "/faq",
  "/contact",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const [portfolioProjects, fireRecoveryCases] = await Promise.all([
    getSbProjects("construction"),
    getSbProjects("fire_case"),
  ]);

  // 사진 없는 텍스트 전용 시공실적은 상세페이지가 없으므로(portfolio/[slug]의
  // generateStaticParams와 동일 기준) sitemap에서도 제외한다.
  const portfolioEntries: MetadataRoute.Sitemap = portfolioProjects
    .filter((project) => (project.images.gallery?.length ?? 0) > 0)
    .map((project) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      lastModified: new Date(),
    }));

  const fireCaseEntries: MetadataRoute.Sitemap = fireRecoveryCases.map((project) => ({
    url: `${SITE_URL}/fire-cases/${project.slug}`,
    lastModified: new Date(),
  }));

  const guideEntries: MetadataRoute.Sitemap = guidePosts.map((post) => ({
    url: `${SITE_URL}/guide/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticEntries, ...portfolioEntries, ...fireCaseEntries, ...guideEntries];
}
