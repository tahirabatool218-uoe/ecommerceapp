import { useState } from "react";
import type { PasswordInputProps } from "../../types";
import { EyeIcon, EyeOffIcon } from "./Icons";

/**
 * Password field with a show/hide toggle icon inside the input.
 * Wraps the existing `.input` styling — no new visual system, just an
 * absolutely-positioned icon button and enough right padding to clear it.
 */
export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  autoComplete = "current-password",
  ariaInvalid,
  ariaDescribedBy,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field__input-wrap">
      <input
        id={id}
        name={name}
        className="input input--with-icon"
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      <button
        type="button"
        className="field__visibility-toggle"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  );
}
