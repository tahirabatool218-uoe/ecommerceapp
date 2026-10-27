import { useMemo, type ReactNode } from "react";
import type { Order, OrderStatus } from "../../types";
import { ORDER_STATUS_OPTIONS } from "../../types";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useAdminProducts from "../../hooks/useAdminProducts";
import useAdminOrders from "../../hooks/useAdminOrders";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Button from "../../components/ui/Button";
import {
  BoxIcon,
  CartIcon,
  ClockIcon,
  LoaderIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "../../components/ui/Icons";

const STATUS_LIST = ORDER_STATUS_OPTIONS;

// One meaningful icon per order status, instead of reusing a single glyph.
const STATUS_ICONS: Record<OrderStatus, typeof ClockIcon> = {
  Pending: ClockIcon,
  Processing: LoaderIcon,
  Shipped: TruckIcon,
  Delivered: CheckCircleIcon,
  Cancelled: XCircleIcon,
};

function countByStatus(orders: Order[]): Record<OrderStatus, number> {
  const counts = Object.fromEntries(STATUS_LIST.map((status) => [status, 0])) as Record<OrderStatus, number>;
  for (const order of orders) {
    if (counts[order.status] !== undefined) {
      counts[order.status] += 1;
    }
  }
  return counts;
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="card admin-stat">
      <span className="admin-stat__icon">{icon}</span>
      <div>
        <p className="admin-stat__value">{value}</p>
        <p className="admin-stat__label">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  useDocumentTitle("Admin Dashboard");
  const { products, status: productsStatus, error: productsError, reload: reloadProducts } =
    useAdminProducts();
  const { orders, status: ordersStatus, error: ordersError, reload: reloadOrders } =
    useAdminOrders();

  const statusCounts = useMemo(() => countByStatus(orders), [orders]);

  const loading = productsStatus === "loading" || ordersStatus === "loading";
  const anyError = productsStatus === "error" || ordersStatus === "error";

  return (
    <section className="page">
      <div className="container">
        <header className="page__header admin-header">
          <div>
            <h1 className="page__title">Admin dashboard</h1>
            <p className="page__description">An overview of your catalog and orders.</p>
          </div>
          <div className="admin-header__actions">
            <Button to="/admin/products" variant="secondary" size="sm">
              Manage products
            </Button>
            <Button to="/admin/orders" variant="secondary" size="sm">
              Manage orders
            </Button>
          </div>
        </header>

        {loading && <LoadingSpinner label="Loading dashboard…" />}

        {!loading && anyError && (
          <ErrorMessage
            title="Dashboard unavailable"
            message={productsError || ordersError}
            onRetry={() => {
              reloadProducts();
              reloadOrders();
            }}
          />
        )}

        {!loading && !anyError && (
          <>
            <div className="admin-stats-grid">
              <StatCard label="Total products" value={products.length} icon={<BoxIcon size={20} />} />
              <StatCard label="Total orders" value={orders.length} icon={<CartIcon size={20} />} />
              {STATUS_LIST.map((status) => {
                const StatusIcon = STATUS_ICONS[status];
                return (
                  <StatCard
                    key={status}
                    label={status}
                    value={statusCounts[status]}
                    icon={<StatusIcon size={20} />}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
