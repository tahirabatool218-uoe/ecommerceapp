/** Newest products first, based on the backend's createdAt timestamp. */
import type { Product, ProductCategorySummary } from "../types";

export function sortNewestFirst(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
  );
}

/**
 * Derives unique categories (with product counts) from loaded products.
 * There is no dedicated categories endpoint, so nothing is invented here.
 * Categories are grouped case-insensitively and sorted alphabetically.
 */
export function deriveCategories(products: Product[]): ProductCategorySummary[] {
  const byKey = new Map<string, ProductCategorySummary>();

  for (const product of products) {
    const name = product.category?.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    const entry = byKey.get(key);
    if (entry) {
      entry.count += 1;
    } else {
      byKey.set(key, { name, count: 1 });
    }
  }

  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function filterByCategory(products: Product[], category: string): Product[] {
  if (!category) return products;
  const key = category.trim().toLowerCase();
  return products.filter((p) => p.category?.trim().toLowerCase() === key);
}

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

export function isValidProductId(id: string | null | undefined): boolean {
  return typeof id === "string" && OBJECT_ID_PATTERN.test(id);
}
