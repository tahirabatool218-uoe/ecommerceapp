// Request bodies and route params. Body fields are optional because the
// controllers validate their presence at runtime (same checks as before).
// These are `type` aliases (not interfaces) so they stay assignable to
// Express' string-indexed params type.

export type RegisterBody = { name?: string; email?: string; password?: string };
export type LoginBody = { email?: string; password?: string };

export type ProductBody = {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image?: string;
};

export type AddToCartBody = { productId?: string; quantity?: number };
export type UpdateCartItemBody = { quantity?: number };

export type CreateOrderBody = { shippingAddress?: string };
export type UpdateOrderStatusBody = { status?: string };

export type IdParams = { id: string };
export type ProductIdParams = { productId: string };
