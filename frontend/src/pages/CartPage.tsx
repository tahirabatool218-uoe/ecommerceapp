import { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";
import { summarizeCart } from "../utils/cart";
import { getApiErrorMessage } from "../utils/errors";
import { pluralize } from "../utils/formatters";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { CartIcon } from "../components/ui/Icons";
import type { Cart } from "../types";

export default function CartPage() {
  useDocumentTitle("Your cart");
  const { cart, status, error, reload, setCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [confirmingClear, setConfirmingClear] = useState(false);

  const summary = summarizeCart(cart);

  async function runAction(
    action: () => Promise<Cart | null>,
    failureMessage: string,
  ) {
    setBusy(true);
    setActionError("");
    try {
      const nextCart = await action();
      setCart(nextCart);
    } catch (err) {
      setActionError(getApiErrorMessage(err, failureMessage));
      fetchCart()
        .then(setCart)
        .catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  const handleQuantityChange = (productId: string, quantity: number) =>
    runAction(() => updateCartItem(productId, quantity), "Couldn't update the quantity. Please try again.");

  const handleRemove = (productId: string) =>
    runAction(() => removeCartItem(productId), "Couldn't remove this item. Please try again.");

  const handleClear = () => {
    setConfirmingClear(false);
    return runAction(() => clearCart(), "Couldn't clear your cart. Please try again.");
  };

  let content;
  if (status === "loading") {
    content = <LoadingSpinner label="Loading your cart…" />;
  } else if (status === "error") {
    content = <ErrorMessage title="Cart unavailable" message={error} onRetry={reload} />;
  } else if (summary.isEmpty) {
    content = (
      <>
        {actionError && (
          <p className="feedback feedback--error" role="alert">
            {actionError}
          </p>
        )}
        <EmptyState
          icon={<CartIcon size={22} />}
          title="Your cart is empty"
          message="Browse the catalog and add something you like."
          actionLabel="Browse products"
          actionTo="/products"
        />
      </>
    );
  } else {
    content = (
      <div className="shop-layout">
        <div className="shop-layout__main">
          {actionError && (
            <p className="feedback feedback--error" role="alert">
              {actionError}
            </p>
          )}
          {summary.issueCount > 0 && (
            <p className="feedback feedback--warning" role="note">
              {summary.issueCount === 1
                ? "One item needs your attention before you can check out."
                : `${summary.issueCount} items need your attention before you can check out.`}
            </p>
          )}

          <ul className="cart-list card" aria-busy={busy}>
            {summary.items.map((item, index) => (
              <CartItem
                key={item._id ?? item.product?._id ?? index}
                item={item}
                disabled={busy}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </ul>

          <div className="cart-toolbar">
            <Link to="/products" className="text-link">
              Continue shopping
            </Link>

            {confirmingClear ? (
              <div className="cart-toolbar__confirm" role="group" aria-label="Confirm clearing your cart">
                <span>Remove everything from your cart?</span>
                <Button variant="secondary" size="sm" onClick={handleClear} disabled={busy}>
                  Yes, clear cart
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmingClear(false)}>
                  Keep items
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmingClear(true)} disabled={busy}>
                Clear cart
              </Button>
            )}
          </div>
        </div>

        <CartSummary summary={summary}>
          {summary.canCheckout && !busy ? (
            <Button to="/checkout" size="lg" block>
              Proceed to checkout
            </Button>
          ) : (
            <Button size="lg" block disabled>
              Proceed to checkout
            </Button>
          )}
        </CartSummary>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <header className="page__header">
          <h1 className="page__title">Your cart</h1>
          {status === "success" && !summary.isEmpty && (
            <p className="page__description">{pluralize(summary.itemCount, "item")} ready to order.</p>
          )}
        </header>
        {content}
      </div>
    </section>
  );
}
