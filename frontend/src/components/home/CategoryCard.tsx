import { Link } from "react-router-dom";
import { ChevronRightIcon, TagIcon } from "../ui/Icons";
import { pluralize } from "../../utils/formatters";

interface CategoryCardProps {
  name: string;
  count: number;
}

export default function CategoryCard({ name, count }: CategoryCardProps) {
  return (
    <Link to={`/products?category=${encodeURIComponent(name)}`} className="category-card">
      <span className="category-card__icon">
        <TagIcon size={20} />
      </span>
      <span className="category-card__text">
        <span className="category-card__name">{name}</span>
        <span className="category-card__count">{pluralize(count, "product")}</span>
      </span>
      <ChevronRightIcon size={18} className="category-card__chevron" />
    </Link>
  );
}
