import type { ApiResponse, Product, ProductMutationInput } from "../types";
import api from "./api";

export type ProductRequestOptions = { signal?: AbortSignal };

// GET /products -> { count, products: [...] }
export async function fetchProducts({ signal }: ProductRequestOptions = {}): Promise<Product[]> {
  const { data } = await api.get<ApiResponse<{ count: number; products: Product[] }>>("/products", { signal });
  return Array.isArray(data?.products) ? data.products : [];
}

// GET /products/:id -> { product: {...} }
export async function fetchProductById(id: string, { signal }: ProductRequestOptions = {}): Promise<Product | null> {
  const { data } = await api.get<ApiResponse<{ product: Product }>>(`/products/${encodeURIComponent(id)}`, { signal });
  return data?.product ?? null;
}

// POST /products (Admin) -> { message, product }
export async function createProduct(payload: ProductMutationInput): Promise<Product | null> {
  const { data } = await api.post<ApiResponse<{ product: Product }>>("/products", payload);
  return data?.product ?? null;
}

// PUT /products/:id (Admin) -> { message, product }
export async function updateProduct(id: string, payload: ProductMutationInput): Promise<Product | null> {
  const { data } = await api.put<ApiResponse<{ product: Product }>>(`/products/${encodeURIComponent(id)}`, payload);
  return data?.product ?? null;
}

// DELETE /products/:id (Admin) -> { message }
export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${encodeURIComponent(id)}`);
}
