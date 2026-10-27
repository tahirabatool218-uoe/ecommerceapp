import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addToCart } from "../../services/cartService";
import type { Product } from "../../types";
import { getApiErrorMessage } from "../../utils/errors";
import Button from "../ui/Button";
import QuantityStepper from "../ui/QuantityStepper";

/**
 * Quantity picker + "Add to cart" for the product details page.
 * Guests are sent to /login and returned to this product afterwards.
 */
export default function AddToCartForm({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const stock = Number(product.stock) || 0;
  const [quantity, setQuantity] = useState(1);
  const [request, setRequest] = useState({ status: "idle" as "idle" | "loading" | "success" | "error", message: "" });

  if (stock <= 0) {
    return (
      <Button size="lg" block disabled>
        Out of stock
      </Button>
    );
  }

  const selected = Math.min(quantity, stock);
  const isLoading = request.status === "loading";

  function handleQuantityChange(next: number) {
    setQuantity(next);
    setRequest({ status: "idle", message: "" });
  }

  async function handleAdd() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setRequest({ status: "loading", message: "" });
    try {
      await addToCart({ productId: product._id ?? "", quantity: selected });
      setRequest({
        status: "success",
        message: selected === 1 ? "Added to your cart." : `Added ${selected} to your cart.`,
      });
    } catch (error) {
      setRequest({
        status: "error",
        message: getApiErrorMessage(error, "Couldn't add this item to your cart. Please try again."),
      });
    }
  }

  return (
    <div className="add-to-cart">
      <div className="add-to-cart__quantity">
        <span className="field__label">Quantity</span>
        <QuantityStepper
          value={selected}
          max={stock}
          onChange={handleQuantityChange}
          disabled={isLoading}
        />
      </div>

      <Button size="lg" block onClick={handleAdd} disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? "Adding…" : "Add to cart"}
      </Button>

      {request.status === "success" && (
        <p className="feedback feedback--success" role="status">
          <span>{request.message}</span>
          <Link to="/cart" className="text-link">
            View cart
          </Link>
        </p>
      )}
      {request.status === "error" && (
        <p className="feedback feedback--error" role="alert">
          {request.message}
        </p>
      )}
      {!isAuthenticated && request.status === "idle" && (
        <p className="details__note">You&rsquo;ll be asked to log in before adding to your cart.</p>
      )}
    </div>
  );
}
