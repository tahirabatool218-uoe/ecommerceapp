import Button from "./Button";
import { BoxIcon } from "./Icons";
import type { EmptyStateProps } from "../../types";

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
  icon = <BoxIcon size={22} />,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={`state${compact ? " state--compact" : ""}`}>
      <span className="state__icon">{icon}</span>
      <div>
        <h3 className="state__title">{title}</h3>
        {message && <p className="state__message">{message}</p>}
      </div>
      {actionLabel && actionTo && (
        <Button to={actionTo} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
