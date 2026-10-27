import { getAvailability } from "../../utils/formatters";

interface AvailabilityBadgeProps {
  stock: number | string;
}

export default function AvailabilityBadge({ stock }: AvailabilityBadgeProps) {
  const { key, label } = getAvailability(stock);
  return <span className={`badge badge--${key}`}>{label}</span>;
}
