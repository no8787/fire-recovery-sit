import type { ConstructionCategorySlug } from "@/lib/types";
import { constructionCategories } from "@/lib/data/construction-categories";
import { constructionRecords } from "@/lib/data/construction-records";
import { constructionShowcases } from "@/lib/data/construction-showcases";

export { constructionCategories, constructionRecords, constructionShowcases };

export function getShowcasesByCategory(category?: ConstructionCategorySlug) {
  if (!category) return constructionShowcases;
  return constructionShowcases.filter((s) => s.categorySlug === category);
}

export function getRecordsByCategory(category?: ConstructionCategorySlug) {
  const records = category
    ? constructionRecords.filter((r) => r.categorySlug === category)
    : constructionRecords;
  return [...records].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month.localeCompare(a.month);
  });
}

export function getCategoryCounts() {
  return constructionCategories.map((cat) => ({
    ...cat,
    total:
      constructionRecords.filter((r) => r.categorySlug === cat.slug).length +
      constructionShowcases.filter((s) => s.categorySlug === cat.slug).length,
  }));
}
