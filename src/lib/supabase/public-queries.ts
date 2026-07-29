import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  PortfolioProject,
  PortfolioCategory,
  BuildingType,
  DamageType,
  PortfolioCategorySlug,
} from "@/lib/types";
import type { ProjectKind } from "@/lib/supabase/database.types";

// 공개 페이지(/portfolio, /fire-cases)가 Supabase를 직접 조회할 때 쓰는 어댑터.
// 정적 TS 데이터(src/lib/mock/portfolio.ts 등)와 정확히 같은 PortfolioProject/PortfolioCategory
// 모양으로 매핑해서 반환하므로, 페이지·PortfolioCard·BeforeAfter는 수정할 필요가 없다.
//
// 조회 실패(또는 아직 마이그레이션 미적용) 시에는 예외를 던지지 않고 빈 배열을 반환한다.
// 절대로 정적 mock 데이터로 폴백하지 않는다 — 실패는 "빈 상태"로만 나타나야 한다.

interface ProjectImageRow {
  storage_path: string;
  is_render: boolean;
  caption: string | null;
  sort_order: number;
}

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  region: string;
  building_type: string;
  project_nature: string;
  period: string;
  scope: string[];
  description: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_sample: boolean;
  project_categories: { slug: string } | { slug: string }[] | null;
  project_images: ProjectImageRow[] | null;
}

function toPublicUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string
): string {
  return supabase.storage.from("project-images").getPublicUrl(path).data.publicUrl;
}

function mapRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  row: ProjectRow
): PortfolioProject {
  const categoryRel = Array.isArray(row.project_categories)
    ? row.project_categories[0]
    : row.project_categories;
  const images = [...(row.project_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    categorySlug: (categoryRel?.slug ?? "public") as PortfolioCategorySlug,
    region: row.region,
    buildingType: row.building_type as BuildingType,
    damageType: row.project_nature as DamageType,
    period: row.period,
    scope: row.scope,
    description: row.description,
    thumbnail: row.thumbnail_url,
    images: {
      gallery: images.map((img) => ({
        src: toPublicUrl(supabase, img.storage_path),
        isRender: img.is_render,
        caption: img.caption ?? undefined,
      })),
    },
    featured: row.is_featured,
    sample: row.is_sample,
  };
}

const PROJECT_SELECT =
  "id, slug, title, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, project_categories(slug), project_images(storage_path, is_render, caption, sort_order)";

export async function getSbCategories(kind: ProjectKind): Promise<PortfolioCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_categories")
      .select("slug, label")
      .eq("kind", kind)
      .order("sort_order");
    if (error || !data) return [];
    return data.map((c) => ({ slug: c.slug as PortfolioCategorySlug, label: c.label }));
  } catch {
    return [];
  }
}

export async function getSbProjects(
  kind: ProjectKind,
  categorySlug?: string
): Promise<PortfolioProject[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("kind", kind)
      .eq("status", "published")
      .order("sort_order")
      .order("created_at", { ascending: false });

    if (categorySlug) {
      query = query.eq("project_categories.slug", categorySlug);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    const rows = data as unknown as ProjectRow[];
    const filtered = categorySlug
      ? rows.filter((r) => {
          const rel = Array.isArray(r.project_categories) ? r.project_categories[0] : r.project_categories;
          return rel?.slug === categorySlug;
        })
      : rows;

    return filtered.map((row) => mapRow(supabase, row));
  } catch {
    return [];
  }
}

export async function getSbFeaturedProjects(kind: ProjectKind, limit = 6): Promise<PortfolioProject[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("kind", kind)
      .eq("status", "published")
      .eq("is_featured", true)
      .order("sort_order")
      .limit(limit);
    if (error || !data) return [];
    return (data as unknown as ProjectRow[]).map((row) => mapRow(supabase, row));
  } catch {
    return [];
  }
}

export async function getSbProjectBySlug(
  slug: string,
  kind?: ProjectKind
): Promise<PortfolioProject | null> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("slug", slug)
      .eq("status", "published");
    if (kind) query = query.eq("kind", kind);

    const { data, error } = await query.maybeSingle();
    if (error || !data) return null;
    return mapRow(supabase, data as unknown as ProjectRow);
  } catch {
    return null;
  }
}
