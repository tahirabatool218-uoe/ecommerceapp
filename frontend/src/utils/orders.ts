/** Short, human-friendly order reference, e.g. "#4F2A9C". */
export function shortOrderId(id: string | number | undefined): string {
  return `#${String(id ?? "").slice(-6).toUpperCase()}`;
}

export function formatOrderDate(value: string | Date | undefined, { withTime = false }: { withTime?: boolean } = {}): string {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  const options: Intl.DateTimeFormatOptions = withTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleString("en-PK", options);
}

/** Same status → badge mapping the dashboard already uses. */
export function orderStatusBadgeClass(status: string | null | undefined): string {
  const key = (status || "").toLowerCase();
  if (key === "delivered") return "badge badge--in";
  if (key === "cancelled") return "badge badge--out";
  return "badge badge--low";
}
