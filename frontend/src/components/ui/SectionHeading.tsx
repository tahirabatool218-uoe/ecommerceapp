import { Link } from "react-router-dom";
import type { SectionHeadingProps } from "../../types";

export default function SectionHeading({
  id,
  title,
  description,
  actionLabel,
  actionTo,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading${align === "center" ? " section-heading--center" : ""}`}>
      <div className="section-heading__text">
        <h2 id={id} className="section-heading__title">
          {title}
        </h2>
        {description && <p className="section-heading__description">{description}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="text-link">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
