import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types";
import { fetchProducts } from "../services/productService";
import { getErrorMessage, isCancelledRequest } from "../utils/errors";

type ProductsState = {
  products: Product[];
  status: "loading" | "success" | "error";
  error: string;
};

/** Loads the product list. Returns { products, status, error, reload }. */
export default function useProducts() {
  const [state, setState] = useState<ProductsState>({ products: [], status: "loading", error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal })
      .then((products) => setState({ products, status: "success", error: "" }))
      .catch((error: unknown) => {
        if (isCancelledRequest(error)) return;
        setState({
          products: [],
          status: "error",
          error: getErrorMessage(error, "Unable to load products. Please try again."),
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
