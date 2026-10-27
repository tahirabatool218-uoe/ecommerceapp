import { CURRENCY, LOW_STOCK_THRESHOLD } from "../config";
import type { Product, ProductCategorySummary } from "../types";

const priceFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number | string | undefined): string {
  const amount = Number(value);
  return Number.isFinite(amount) ? priceFormatter.format(amount) : "";
}

/** Maps a stock count to a display status used by badges and copy. */
export function getAvailability(stock: number | string): { key: "out" | "low" | "in"; label: string } {
  const count = Number(stock);
  if (!Number.isFinite(count) || count <= 0) {
    return { key: "out", label: "Out of stock" };
  }
  if (count <= LOW_STOCK_THRESHOLD) {
    return { key: "low", label: `Only ${count} left` };
  }
  return { key: "in", label: "In stock" };
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function summarizeProductCategories(products: Product[]): ProductCategorySummary[] {
  return products.reduce<ProductCategorySummary[]>((acc, product) => {
    const category = product.category?.trim();
    if (!category) return acc;
    const existing = acc.find((entry) => entry.name.toLowerCase() === category.toLowerCase());
    if (existing) {
      existing.count += 1;
      return acc;
    }
    acc.push({ name: category, count: 1 });
    return acc;
  }, []);
}
