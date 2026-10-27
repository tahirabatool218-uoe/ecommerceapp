import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { ButtonProps } from "../../types";

/**
 * Renders a router <Link> when `to` is provided, otherwise a <button>.
 * variant: primary | secondary | ghost | light    size: sm | md | lg
 */
export default function Button({
  to,
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size !== "md" && `btn--${size}`,
    block && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
