import { useCallback, useEffect, useState } from "react";
import type { Order } from "../types";
import { fetchMyOrders } from "../services/orderService";
import { getErrorMessage, isCancelledRequest } from "../utils/errors";

type MyOrdersState = {
  orders: Order[];
  status: "loading" | "success" | "error";
  error: string;
};

/** Loads the logged-in user's orders. Returns { orders, status, error, reload }. */
export default function useMyOrders() {
  const [state, setState] = useState<MyOrdersState>({ orders: [], status: "loading", error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchMyOrders({ signal: controller.signal })
      .then((orders) => setState({ orders, status: "success", error: "" }))
      .catch((error: unknown) => {
        if (isCancelledRequest(error)) return;
        setState({
          orders: [],
          status: "error",
          error: getErrorMessage(error, "Unable to load your orders. Please try again."),
        });
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, status: "loading", error: "" }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}
