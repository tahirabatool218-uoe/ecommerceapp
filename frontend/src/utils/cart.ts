import type { Cart, CartItem, CartSummaryResult, Product } from "../types";

/** Safe accessor: the cart (or its items) may be null before/after the API call. */
export function getCartItems(cart: Cart | null | undefined): CartItem[] {
  return Array.isArray(cart?.items) ? cart.items : [];
}

/**
 * Returns why a cart line can't currently be ordered, or null if it's fine.
 * - unavailable: the product was deleted (the API populates it as null)
 * - out:         the product has no stock left
 * - stock:       the requested quantity exceeds what's left
 */
export function getItemIssue(item: CartItem): { key: "unavailable" | "out" | "stock"; message: string } | null {
  const product = item?.product;
  if (!product || typeof product !== "object") {
    return { key: "unavailable", message: "This product is no longer available." };
  }
  const stock = Number(product.stock);
  if (!Number.isFinite(stock) || stock <= 0) {
    return { key: "out", message: "This product is out of stock." };
  }
  if (item.quantity > stock) {
    return {
      key: "stock",
      message: `Only ${stock} left in stock. Lower the quantity to continue.`,
    };
  }
  return null;
}

export function getLineTotal(price: number | string | undefined, quantity: number): number {
  return Math.round(Number(price) * Number(quantity) * 100) / 100;
}

/** Totals are derived client-side; the API returns raw cart lines only. */
export function summarizeCart(cart: Cart | null): CartSummaryResult {
  const items = getCartItems(cart);
  let itemCount = 0;
  let total = 0;
  let issueCount = 0;

  for (const item of items) {
    if (getItemIssue(item)) issueCount += 1;
    if (item.product) {
      itemCount += Number(item.quantity) || 0;
      total += getLineTotal(item.product.price, item.quantity);
    }
  }

  return {
    items,
    itemCount,
    total: Math.round(total * 100) / 100,
    issueCount,
    isEmpty: items.length === 0,
    canCheckout: items.length > 0 && issueCount === 0,
  };
}
