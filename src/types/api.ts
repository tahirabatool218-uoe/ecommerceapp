import type { Request, Response } from "express";

/**
 * Successful response body: an optional `message` plus whatever payload `T`
 * the endpoint returns (e.g. `{ product }`, `{ count, products }`).
 */
export type ApiResponse<T extends object = {}> = { message?: string } & T;

/** Error response body used by every endpoint (`{ message }` / `{ message, error }`). */
export interface ApiError {
  message: string;
  error?: string;
}

/** Any body an endpoint may send: its success payload `T` or an error. */
export type ApiResult<T extends object = {}> = ApiResponse<T> | ApiError;

/**
 * Express handler whose response payload (`TData`), request body (`TBody`)
 * and route params (`TParams`) are all declared in one place.
 *
 *   export const getProductById: ApiHandler<{ product: ProductDocument }, unknown, IdParams> = ...
 */
export type ApiHandler<
  TData extends object = {},
  TBody = unknown,
  TParams = Request["params"]
> = (
  req: Request<TParams, ApiResult<TData>, TBody>,
  res: Response<ApiResult<TData>>
) => Promise<void>;
