import axios, { type AxiosError } from "axios";

export type AppError = Error | AxiosError | unknown;

/**
 * Converts any thrown value into a message that is safe to show to a user.
 * Raw Axios / network / server error text is never exposed.
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error) && !error.response) {
    return "Can't reach the server. Check your connection and try again.";
  }
  return fallback;
}

/**
 * Like getErrorMessage, but also surfaces the backend's own `message` for
 * user-actionable client errors (e.g. "Insufficient product stock",
 * "Cart is empty"). Server errors (5xx) and auth failures (401) never leak
 * their text — they fall back to the supplied friendly message.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    const message = typeof data?.message === "string" ? data.message.trim() : "";
    if (message && status >= 400 && status < 500 && status !== 401) {
      return message;
    }
  }
  return getErrorMessage(error, fallback);
}

export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export function isForbiddenError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403;
}

export function isCancelledRequest(error: unknown): boolean {
  return axios.isCancel(error);
}
