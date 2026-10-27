import type { ApiResponse, Cart } from "../types";
import api from "./api";

export type CartRequestOptions = { signal?: AbortSignal };

// Every cart endpoint answers with { cart } (items[].product is populated,
// except DELETE /cart which returns the emptied cart).
const unwrapCart = (data: ApiResponse<{ cart: Cart | null }>): Cart | null => data.cart ?? null;

// GET /cart -> { cart: { items: [...] } }
export async function fetchCart({ signal }: CartRequestOptions = {}): Promise<Cart | null> {
  const { data } = await api.get<ApiResponse<{ cart: Cart | null }>>("/cart", { signal });
  return unwrapCart(data);
}

// POST /cart { productId, quantity } -> { message, cart }
// The backend adds `quantity` to any existing line and enforces stock.
export async function addToCart({ productId, quantity }: { productId: string; quantity: number }): Promise<Cart | null> {
  const { data } = await api.post<ApiResponse<{ cart: Cart | null }>>("/cart", { productId, quantity });
  return unwrapCart(data);
}

// PUT /cart/:productId { quantity } -> { message, cart }  (sets the quantity)
export async function updateCartItem(productId: string, quantity: number): Promise<Cart | null> {
  const { data } = await api.put<ApiResponse<{ cart: Cart | null }>>(`/cart/${encodeURIComponent(productId)}`, { quantity });
  return unwrapCart(data);
}

// DELETE /cart/:productId -> { message, cart }
export async function removeCartItem(productId: string): Promise<Cart | null> {
  const { data } = await api.delete<ApiResponse<{ cart: Cart | null }>>(`/cart/${encodeURIComponent(productId)}`);
  return unwrapCart(data);
}

// DELETE /cart -> { message, cart }
export async function clearCart(): Promise<Cart | null> {
  const { data } = await api.delete<ApiResponse<{ cart: Cart | null }>>("/cart");
  return unwrapCart(data);
}
