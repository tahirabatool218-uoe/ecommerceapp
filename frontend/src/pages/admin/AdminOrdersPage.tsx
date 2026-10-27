import { useState, type ChangeEvent } from "react";
import type { Order, OrderStatus } from "../../types";
import { ORDER_STATUS_OPTIONS } from "../../types";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useAdminOrders from "../../hooks/useAdminOrders";
import { updateOrderStatus } from "../../services/orderService";
import { getApiErrorMessage } from "../../utils/errors";
import { formatPrice, pluralize } from "../../utils/formatters";
import { formatOrderDate, shortOrderId } from "../../utils/orders";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import { ReceiptIcon } from "../../components/ui/Icons";

const STATUS_OPTIONS = ORDER_STATUS_OPTIONS;

interface OrderRowProps {
  order: Order;
  onStatusChange: (orderId: string, nextStatus: OrderStatus) => void;
}

function OrderRow({ order, onStatusChange }: OrderRowProps) {
  const [updating, setUpdating] = useState(false);
  const [rowError, setRowError] = useState("");
  const items = Array.isArray(order.items) ? order.items : [];

  async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value as OrderStatus;
    if (nextStatus === order.status) return;

    setRowError("");
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(order._id, nextStatus);
      onStatusChange(order._id, updated?.status ?? nextStatus);
    } catch (err) {
      setRowError(getApiErrorMessage(err, "Couldn't update the order status. Please try again."));
    } finally {
      setUpdating(false);
    }
  }

  return (
    <tr>
      <td data-label="Order">
        <span className="admin-table__name">{shortOrderId(order._id)}</span>
        <p className="admin-table__meta">{formatOrderDate(order.createdAt, { withTime: true })}</p>
      </td>
      <td data-label="Customer">
        {order.user?.name || "—"}
        <p className="admin-table__meta">{order.user?.email || ""}</p>
      </td>
      <td data-label="Items">{pluralize(items.length, "item")}</td>
      <td data-label="Total">{formatPrice(order.totalAmount)}</td>
      <td data-label="Status">
        <div className="admin-order-status">
          <select
            className="input admin-order-status__select"
            value={order.status}
            onChange={handleChange}
            disabled={updating}
            aria-label={`Update status for order ${shortOrderId(order._id)}`}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <OrderStatusBadge status={order.status} />
        </div>
        {rowError && (
          <p className="field__error" role="alert">
            {rowError}
          </p>
        )}
      </td>
    </tr>
  );
}

export default function AdminOrdersPage() {
  useDocumentTitle("Manage orders");
  const { orders, status, error, reload, setOrders } = useAdminOrders();

  function handleStatusChange(orderId: string, nextStatus: OrderStatus): void {
    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? { ...order, status: nextStatus } : order)),
    );
  }

  let content;
  if (status === "loading") {
    content = <LoadingSpinner label="Loading orders…" />;
  } else if (status === "error") {
    content = <ErrorMessage title="Orders unavailable" message={error} onRetry={reload} />;
  } else if (orders.length === 0) {
    content = (
      <EmptyState
        icon={<ReceiptIcon size={22} />}
        title="No orders yet"
        message="Orders placed by customers will show up here."
      />
    );
  } else {
    content = (
      <div className="card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Customer</th>
              <th scope="col">Items</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <header className="page__header">
          <h1 className="page__title">Orders</h1>
          <p className="page__description">
            {status === "success" ? pluralize(orders.length, "order") : "Review and update customer orders."}
          </p>
        </header>
        {content}
      </div>
    </section>
  );
}
