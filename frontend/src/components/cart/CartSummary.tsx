import { formatPrice } from "../../utils/formatters";
import { getLineTotal } from "../../utils/cart";
import type { CartSummaryResult } from "../../types";

/**
 * Totals card shared by Cart and Checkout. Pass `showItems` to list the
 * lines (Checkout); `children` renders the primary action below the totals.
 */
export default function CartSummary({
  summary,
  showItems = false,
  children,
}: {
  summary: CartSummaryResult;
  showItems?: boolean;
  children?: React.ReactNode;
}) {
  const { items, itemCount, total } = summary;

  return (
    <aside className="summary card" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="summary__title">
        Order summary
      </h2>

      {showItems && (
        <ul className="summary__items">
          {items
            .filter((item) => item.product)
            .map((item) => (
              <li key={item._id ?? item.product?._id ?? "missing-id"} className="summary__item">
                <span className="summary__item-name">
                  {item.product?.name}
                  <span className="summary__item-qty"> &times; {item.quantity}</span>
                </span>
                <span>{formatPrice(getLineTotal(item.product?.price, item.quantity))}</span>
              </li>
            ))}
        </ul>
      )}

      <dl className="summary__rows">
        <div className="summary__row">
          <dt>Items ({itemCount})</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
        <div className="summary__row summary__row--total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {children}
    </aside>
  );
}
