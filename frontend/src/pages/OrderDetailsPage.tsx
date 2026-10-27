import { Link, useLocation, useParams } from "react-router-dom";
import useOrder from "../hooks/useOrder";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getLineTotal } from "../utils/cart";
import { formatPrice } from "../utils/formatters";
import { formatOrderDate, shortOrderId } from "../utils/orders";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import ProductImage from "../components/product/ProductImage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import { ChevronRightIcon, ReceiptIcon } from "../components/ui/Icons";

function Breadcrumb({ current }: { current?: string }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/orders">My orders</Link>
      {current && (
        <>
          <ChevronRightIcon size={14} />
          <span aria-current="page">{current}</span>
        </>
      )}
    </nav>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { order, status, error, reload } = useOrder(id);

  useDocumentTitle(order ? `Order ${shortOrderId(order._id)}` : "Order");

  if (status === "loading") {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <LoadingSpinner label="Loading order…" />
        </div>
      </section>
    );
  }

  if (status === "not-found") {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <EmptyState
            icon={<ReceiptIcon size={22} />}
            title="Order not found"
            message="This order doesn't exist or isn't on your account."
            actionLabel="Back to my orders"
            actionTo="/orders"
          />
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <ErrorMessage title="Order unavailable" message={error} onRetry={reload} />
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <EmptyState
            icon={<ReceiptIcon size={22} />}
            title="Order not found"
            message="This order doesn't exist or isn't on your account."
            actionLabel="Back to my orders"
            actionTo="/orders"
          />
        </div>
      </section>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const justPlaced = location.state?.orderPlaced === true;

  return (
    <section className="page">
      <div className="container">
        <Breadcrumb current={`Order ${shortOrderId(order._id)}`} />

        {justPlaced && (
          <p className="feedback feedback--success" role="status">
            Thank you! Your order has been placed.
          </p>
        )}

        <header className="page__header order-header">
          <div>
            <h1 className="page__title">Order {shortOrderId(order._id)}</h1>
            <p className="page__description">Placed {formatOrderDate(order.createdAt, { withTime: true })}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </header>

        <div className="shop-layout">
          <section className="card order-items" aria-labelledby="order-items-title">
            <h2 id="order-items-title" className="order-panel__title">
              Items
            </h2>
            <ul className="order-items__list">
              {items.map((item) => (
                <li key={item._id ?? `${item.product?._id ?? item.name}`} className="order-line">
                  <div className="order-line__media">
                    <ProductImage src={item.product?.image} alt={item.name} />
                  </div>
                  <div className="order-line__info">
                    {item.product?._id ? (
                      <Link to={`/products/${item.product._id}`} className="order-line__name">
                        {item.name}
                      </Link>
                    ) : (
                      <p className="order-line__name">{item.name}</p>
                    )}
                    <p className="order-line__detail">
                      {item.quantity} &times; {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="order-line__total">{formatPrice(getLineTotal(item.price, item.quantity))}</p>
                </li>
              ))}
            </ul>
          </section>

          <aside className="summary card" aria-labelledby="order-info-title">
            <h2 id="order-info-title" className="summary__title">
              Order details
            </h2>
            <dl className="order-meta">
              <div>
                <dt>Order ID</dt>
                <dd className="order-meta__id">{order._id}</dd>
              </div>
              <div>
                <dt>Date placed</dt>
                <dd>{formatOrderDate(order.createdAt, { withTime: true })}</dd>
              </div>
              <div>
                <dt>Shipping address</dt>
                <dd className="order-meta__address">{order.shippingAddress}</dd>
              </div>
            </dl>
            <dl className="summary__rows">
              <div className="summary__row summary__row--total">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalAmount)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
