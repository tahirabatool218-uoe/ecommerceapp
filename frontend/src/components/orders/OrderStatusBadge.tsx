import type { OrderStatus } from "../../types";
import { orderStatusBadgeClass } from "../../utils/orders";

interface OrderStatusBadgeProps {
  status?: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <span className={orderStatusBadgeClass(status ?? "Pending")}>{status || "Pending"}</span>;
}
