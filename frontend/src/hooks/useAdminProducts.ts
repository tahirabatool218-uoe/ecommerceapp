import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types";
import { fetchProducts } from "../services/productService";
import { getErrorMessage, isCancelledRequest } from "../utils/errors";

type AdminProductsState = {
  products: Product[];
  status: "loading" | "success" | "error";
  error: string;
};

/**
 * Loads the product list for the admin products page.
 * Same data source as the public useProducts hook, plus a setProducts
 * escape hatch so add/edit/delete can update the list without a refetch.
 */
export default function useAdminProducts() {
  const [state, setState] = useState<AdminProductsState>({ products: [], status: "loading", error: "" });
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

  const setProducts = useCallback((updater: (prev: Product[]) => Product[]) => {
    setState((prev) => ({ ...prev, products: updater(prev.products) }));
  }, []);

  return { ...state, reload, setProducts };
}
