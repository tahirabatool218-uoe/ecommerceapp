import type { ApiResponse, Order, OrderStatus } from "../types";
import api from "./api";

export type OrderRequestOptions = { signal?: AbortSignal };

// GET /orders/my-orders -> { count, orders: [...] }
export async function fetchMyOrders({ signal }: OrderRequestOptions = {}): Promise<Order[]> {
  const { data } = await api.get<ApiResponse<{ count: number; orders: Order[] }>>("/orders/my-orders", { signal });
  return Array.isArray(data?.orders) ? data.orders : [];
}

// GET /orders/:id -> { order }
export async function fetchOrderById(id: string, { signal }: OrderRequestOptions = {}): Promise<Order | null> {
  const { data } = await api.get<ApiResponse<{ order: Order }>>(`/orders/${encodeURIComponent(id)}`, { signal });
  return data?.order ?? null;
}

// POST /orders { shippingAddress } -> { message, order }
// The order is built server-side from the user's cart, which is then emptied.
export async function createOrder({ shippingAddress }: { shippingAddress: string }): Promise<Order | null> {
  const { data } = await api.post<ApiResponse<{ order: Order }>>("/orders", { shippingAddress });
  return data?.order ?? null;
}

// GET /orders (Admin) -> { count, orders: [...] }
export async function fetchAllOrders({ signal }: OrderRequestOptions = {}): Promise<Order[]> {
  const { data } = await api.get<ApiResponse<{ count: number; orders: Order[] }>>("/orders", { signal });
  return Array.isArray(data?.orders) ? data.orders : [];
}

// PUT /orders/:id/status (Admin) -> { message, order }
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const { data } = await api.put<ApiResponse<{ order: Order }>>(`/orders/${encodeURIComponent(id)}/status`, { status });
  return data?.order ?? null;
}
