import Button from "./Button";
import { AlertIcon } from "./Icons";
import type { ErrorMessageProps } from "../../types";

export default function ErrorMessage({ title = "Something went wrong", message, onRetry }: ErrorMessageProps) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon">
        <AlertIcon size={22} />
      </span>
      <div>
        <h3 className="state__title">{title}</h3>
        {message && <p className="state__message">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
