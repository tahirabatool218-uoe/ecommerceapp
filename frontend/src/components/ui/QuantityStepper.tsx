/**
 * Compact − / + quantity control. Values are always integers within
 * [min, max], so invalid quantities can't be typed in.
 */
import type { QuantityStepperProps } from "../../types";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  label = "Quantity",
}: QuantityStepperProps) {
  const hasMax = typeof max === "number";
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && (!hasMax || value < max);

  function decrease() {
    const next = hasMax ? Math.min(value - 1, max) : value - 1;
    onChange(Math.max(min, next));
  }

  return (
    <div className="qty" role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        aria-label="Decrease quantity"
        onClick={decrease}
        disabled={!canDecrease}
      >
        &minus;
      </button>
      <output className="qty__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="qty__btn"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={!canIncrease}
      >
        +
      </button>
    </div>
  );
}
