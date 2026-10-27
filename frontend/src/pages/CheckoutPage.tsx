import { useState, type ChangeEvent, type ChangeEventHandler, type FormEvent, type HTMLInputTypeAttribute } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useCart from "../hooks/useCart";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { fetchCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { summarizeCart } from "../utils/cart";
import { getApiErrorMessage } from "../utils/errors";
import CartSummary from "../components/cart/CartSummary";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { CartIcon } from "../components/ui/Icons";
import type { CheckoutFormErrors, CheckoutFormState } from "../types";

const FIELD_ORDER: Array<keyof CheckoutFormState> = ["fullName", "phone", "address", "city", "postalCode"];

function validate(form: CheckoutFormState): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};
  const fullName = form.fullName.trim();
  const phone = form.phone.trim();
  const address = form.address.trim();
  const city = form.city.trim();
  const postalCode = form.postalCode.trim();

  if (!fullName) errors.fullName = "Full name is required.";
  else if (fullName.length < 2) errors.fullName = "Enter your full name.";

  if (!phone) errors.phone = "Phone number is required.";
  else if (!/^[+()\d\s-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!address) errors.address = "Street address is required.";
  else if (address.length < 5) errors.address = "Enter a complete street address.";

  if (!city) errors.city = "City is required.";

  if (!postalCode) errors.postalCode = "Postal code is required.";
  else if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(postalCode)) {
    errors.postalCode = "Enter a valid postal code.";
  }

  return errors;
}

function buildShippingAddress(form: CheckoutFormState): string {
  return [
    form.fullName.trim(),
    `Phone: ${form.phone.trim()}`,
    form.address.trim(),
    `${form.city.trim()} ${form.postalCode.trim()}`,
  ].join("\n");
}

type TextFieldProps = {
  id: string;
  name: keyof CheckoutFormState;
  label: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  maxLength?: number;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

function TextField({
  id,
  name,
  label,
  error,
  multiline = false,
  rows = 3,
  type = "text",
  autoComplete,
  maxLength,
  value,
  onChange,
}: TextFieldProps) {
  const commonProps = {
    id,
    name,
    className: "input",
    autoComplete,
    maxLength,
    value,
    onChange,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {multiline ? <textarea {...commonProps} rows={rows} /> : <input {...commonProps} type={type} />}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  useDocumentTitle("Checkout");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, status, error, reload, setCart } = useCart();

  const [form, setForm] = useState<CheckoutFormState>({
    fullName: user?.name ?? "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [fieldErrors, setFieldErrors] = useState<CheckoutFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const summary = summarizeCart(cart);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !summary.canCheckout) return;

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
      if (firstInvalid) {
        document.getElementById(`checkout-${firstInvalid}`)?.focus();
      }
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const order = await createOrder({ shippingAddress: buildShippingAddress(form) });
      navigate(order?._id ? `/orders/${order._id}` : "/orders", {
        replace: true,
        state: { orderPlaced: true },
      });
    } catch (err) {
      setSubmitError(
        getApiErrorMessage(err, "We couldn't place your order. Please try again."),
      );
      setSubmitting(false);
      fetchCart()
        .then(setCart)
        .catch(() => {});
    }
  }

  let content;
  if (status === "loading") {
    content = <LoadingSpinner label="Preparing checkout…" />;
  } else if (status === "error") {
    content = <ErrorMessage title="Checkout unavailable" message={error} onRetry={reload} />;
  } else if (summary.isEmpty) {
    content = (
      <EmptyState
        icon={<CartIcon size={22} />}
        title="Your cart is empty"
        message="Add something to your cart before checking out."
        actionLabel="Browse products"
        actionTo="/products"
      />
    );
  } else {
    content = (
      <div className="shop-layout">
        <div className="shop-layout__main">
          {summary.issueCount > 0 && (
            <p className="feedback feedback--warning" role="alert">
              Some items in your cart are unavailable or exceed the stock we have.{" "}
              <Link to="/cart" className="text-link">
                Review your cart
              </Link>
            </p>
          )}
          {submitError && (
            <p className="feedback feedback--error" role="alert">
              {submitError}{" "}
              <Link to="/cart" className="text-link">
                Review your cart
              </Link>
            </p>
          )}

          <form id="checkout-form" className="checkout-form card" onSubmit={handleSubmit} noValidate>
            <fieldset className="checkout-form__fieldset" disabled={submitting}>
              <legend className="checkout-form__legend">Shipping address</legend>

              <TextField
                id="checkout-fullName"
                name="fullName"
                label="Full name"
                autoComplete="name"
                maxLength={80}
                value={form.fullName}
                onChange={handleChange}
                error={fieldErrors.fullName}
              />
              <TextField
                id="checkout-phone"
                name="phone"
                type="tel"
                label="Phone number"
                autoComplete="tel"
                maxLength={20}
                value={form.phone}
                onChange={handleChange}
                error={fieldErrors.phone}
              />
              <TextField
                id="checkout-address"
                name="address"
                label="Street address"
                autoComplete="street-address"
                multiline
                rows={3}
                maxLength={200}
                value={form.address}
                onChange={handleChange}
                error={fieldErrors.address}
              />
              <div className="checkout-form__row">
                <TextField
                  id="checkout-city"
                  name="city"
                  label="City"
                  autoComplete="address-level2"
                  maxLength={60}
                  value={form.city}
                  onChange={handleChange}
                  error={fieldErrors.city}
                />
                <TextField
                  id="checkout-postalCode"
                  name="postalCode"
                  label="Postal code"
                  autoComplete="postal-code"
                  maxLength={10}
                  value={form.postalCode}
                  onChange={handleChange}
                  error={fieldErrors.postalCode}
                />
              </div>
            </fieldset>
          </form>
        </div>

        <CartSummary summary={summary} showItems>
          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            block
            disabled={submitting || !summary.canCheckout}
            aria-busy={submitting}
          >
            {submitting ? "Placing order…" : "Place order"}
          </Button>
          <p className="summary__note">No online payment is taken at this step.</p>
          <Link to="/cart" className="text-link summary__link">
            Back to cart
          </Link>
        </CartSummary>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <header className="page__header">
          <h1 className="page__title">Checkout</h1>
          <p className="page__description">Review your cart and confirm your address.</p>
        </header>
        {content}
      </div>
    </section>
  );
}
