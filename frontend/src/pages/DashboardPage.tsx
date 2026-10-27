import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import useCart from "../hooks/useCart";
import useMyOrders from "../hooks/useMyOrders";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { CartIcon, ClipboardListIcon, ReceiptIcon, ShoppingCartIcon } from "../components/ui/Icons";
import { formatPrice } from "../utils/formatters";
import type { Order } from "../types";

function formatDate(value?: string) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })
    : "";
}

function statusBadgeClass(status: string) {
  const key = (status || "").toLowerCase();
  if (key === "delivered") return "badge badge--in";
  if (key === "cancelled") return "badge badge--out";
  return "badge badge--low";
}

export default function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();
  const { cart, status: cartStatus, error: cartError, reload: reloadCart } = useCart();
  const { orders, status: ordersStatus, error: ordersError, reload: reloadOrders } = useMyOrders();

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const recentOrders = orders.slice(0, 5);

  return (
    <section className="page page--dashboard">
      <div className="container">
        <div className="page__header">
          <h1 className="page__title">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
          <p className="page__description">Here&rsquo;s a quick look at your cart and recent orders.</p>
        </div>

        <div className="dashboard-grid">
          <div className="card dashboard-card">
            <div className="dashboard-card__header">
              <span className="state__icon">
                <CartIcon size={20} />
              </span>
              <h2 className="dashboard-card__title">Your cart</h2>
            </div>

            {cartStatus === "loading" && <LoadingSpinner label="Loading your cart…" />}
            {cartStatus === "error" && <ErrorMessage message={cartError} onRetry={reloadCart} />}
            {cartStatus === "success" && cartItemCount === 0 && (
              <EmptyState
                compact
                title="Your cart is empty"
                message="Browse products to add something to your cart."
                actionLabel="Browse products"
                actionTo="/products"
                icon={<ShoppingCartIcon size={26} />}
              />
            )}
            {cartStatus === "success" && cartItemCount > 0 && (
              <>
                <p className="dashboard-card__stat">
                  {cartItemCount} {cartItemCount === 1 ? "item" : "items"} in your cart
                </p>
                <Button to="/cart" variant="secondary" size="sm">
                  View cart
                </Button>
              </>
            )}
          </div>

          <div className="card dashboard-card">
            <div className="dashboard-card__header">
              <span className="state__icon">
                <ReceiptIcon size={20} />
              </span>
              <h2 className="dashboard-card__title">Recent orders</h2>
            </div>

            {ordersStatus === "loading" && <LoadingSpinner label="Loading your orders…" />}
            {ordersStatus === "error" && <ErrorMessage message={ordersError} onRetry={reloadOrders} />}
            {ordersStatus === "success" && recentOrders.length === 0 && (
              <EmptyState
                compact
                title="No orders yet"
                message="Your recent orders will show up here."
                actionLabel="Browse products"
                actionTo="/products"
                icon={<ClipboardListIcon size={26} />}
              />
            )}
            {ordersStatus === "success" && recentOrders.length > 0 && (
              <>
                <ul className="dashboard-orders">
                  {recentOrders.map((order: Order) => (
                    <li key={order._id ?? Math.random().toString(36).slice(2)} className="dashboard-orders__item">
                      <div className="dashboard-orders__info">
                        <p className="dashboard-orders__id">Order #{(order._id ?? "").slice(-6).toUpperCase()}</p>
                        <p className="dashboard-orders__date">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={statusBadgeClass(order.status)}>{order.status}</span>
                      <span className="dashboard-orders__total">{formatPrice(order.totalAmount)}</span>
                    </li>
                  ))}
                </ul>
                <Button to="/orders" variant="secondary" size="sm">
                  View all orders
                </Button>
              </>
            )}
          </div>

          <div className="card dashboard-card dashboard-card--actions">
            <h2 className="dashboard-card__title">Quick actions</h2>
            <div className="dashboard-actions">
              <Button to="/products" variant="secondary">
                Browse products
              </Button>
              <Button to="/cart" variant="secondary">
                Go to cart
              </Button>
              <Button to="/orders" variant="secondary">
                My orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
