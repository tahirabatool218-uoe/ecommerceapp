import { Link } from "react-router-dom";
import type { Order, OrderItem } from "../types";
import useMyOrders from "../hooks/useMyOrders";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { formatPrice, pluralize } from "../utils/formatters";
import { formatOrderDate, shortOrderId } from "../utils/orders";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import { ReceiptIcon } from "../components/ui/Icons";

const PREVIEW_LIMIT = 3;

function OrderCard({ order }: { order: Order }) {
  const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
  const hidden = items.length - PREVIEW_LIMIT;

  return (
    <article className="order-card card">
      <header className="order-card__header">
        <div>
          <h2 className="order-card__id">Order {shortOrderId(order._id)}</h2>
          <p className="order-card__date">Placed {formatOrderDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <ul className="order-card__items" aria-label="Items in this order">
        {items.slice(0, PREVIEW_LIMIT).map((item) => (
          <li key={item._id ?? `${item.product?._id ?? item.name}`}>
            <span className="order-card__item-name">{item.name}</span>
            <span className="order-card__item-qty">&times; {item.quantity}</span>
          </li>
        ))}
        {hidden > 0 && <li className="order-card__more">+ {pluralize(hidden, "more item")}</li>}
      </ul>

      <footer className="order-card__footer">
        <p className="order-card__total">
          <span>Total</span>
          <strong>{formatPrice(order.totalAmount)}</strong>
        </p>
        <Link
          to={`/orders/${order._id}`}
          className="btn btn--secondary btn--sm"
          aria-label={`View details for order ${shortOrderId(order._id)}`}
        >
          View details
        </Link>
      </footer>
    </article>
  );
}

export default function OrdersPage() {
  useDocumentTitle("My orders");
  const { orders, status, error, reload } = useMyOrders();

  let content;
  if (status === "loading") {
    content = <LoadingSpinner label="Loading your orders…" />;
  } else if (status === "error") {
    content = <ErrorMessage title="Orders unavailable" message={error} onRetry={reload} />;
  } else if (orders.length === 0) {
    content = (
      <EmptyState
        icon={<ReceiptIcon size={22} />}
        title="No orders yet"
        message="Once you place an order, it will show up here."
        actionLabel="Browse products"
        actionTo="/products"
      />
    );
  } else {
    content = (
      <>
        <p className="results-count" aria-live="polite">
          {pluralize(orders.length, "order")}, newest first
        </p>
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id ?? `order-${order.createdAt ?? Math.random()}`}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <header className="page__header">
          <h1 className="page__title">My orders</h1>
          <p className="page__description">Track everything you&rsquo;ve ordered.</p>
        </header>
        {content}
      </div>
    </section>
  );
}
