import { useCallback, useEffect, useState } from "react";
import { fetchOrderById } from "../services/orderService";
import { getErrorMessage, isCancelledRequest, isForbiddenError, isNotFoundError } from "../utils/errors";
import { isValidProductId } from "../utils/products";
import type { Order } from "../types";

type OrderHookResult = {
  order: Order | null;
  status: "loading" | "success" | "not-found" | "error";
  error: string;
  reload: () => void;
};

type OrderRequestState = {
  id: string;
  order: Order | null;
  status: "success" | "not-found" | "error";
  error: string;
};

/**
 * Loads a single order belonging to the logged-in user.
 * status: "loading" | "success" | "not-found" | "error"
 *
 * Mirrors useProduct: only settled results are stored (tagged with their id)
 * and "loading" is derived, so a stale order is never shown for a new id.
 * A 403 is reported as "not-found" so other users' order ids aren't confirmed.
 */
export default function useOrder(id: string | undefined): OrderHookResult {
  const [result, setResult] = useState<OrderRequestState | null>(null);
  const [attempt, setAttempt] = useState(0);

  const isInvalidId = !id || !isValidProductId(id);

  useEffect(() => {
    if (isInvalidId || !id) return undefined;

    const controller = new AbortController();

    fetchOrderById(id, { signal: controller.signal })
      .then((order) =>
        setResult(
          order
            ? { id, order, status: "success", error: "" }
            : { id, order: null, status: "not-found", error: "" },
        ),
      )
      .catch((error: unknown) => {
        if (isCancelledRequest(error)) return;
        if (isNotFoundError(error) || isForbiddenError(error)) {
          setResult({ id, order: null, status: "not-found", error: "" });
          return;
        }
        setResult({
          id,
          order: null,
          status: "error",
          error: getErrorMessage(error, "Unable to load this order. Please try again."),
        });
      });

    return () => controller.abort();
  }, [id, attempt, isInvalidId]);

  const reload = useCallback(() => {
    setResult(null);
    setAttempt((n) => n + 1);
  }, []);

  if (isInvalidId || !id) {
    return { order: null, status: "not-found", error: "", reload };
  }
  if (result?.id !== id) {
    return { order: null, status: "loading", error: "", reload };
  }
  return { order: result.order, status: result.status, error: result.error, reload };
}
