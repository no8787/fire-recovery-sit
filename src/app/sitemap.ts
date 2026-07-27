import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { portfolioProjects } from "@/lib/mock/portfolio";
import { guidePosts } from "@/lib/mock/guide";
import { fireRecoveryCases } from "@/lib/data/fire-recovery-cases";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const portfolioEntries: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
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
