import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { formatPrice } from "../../utils/formatters";
import AvailabilityBadge from "./AvailabilityBadge";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { _id, name, category, price, stock, image } = product;

  return (
    <article className="product-card">
      <div className="product-card__media">
        <ProductImage src={image} alt={name} />
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{category}</p>
        <h3 className="product-card__name">{name}</h3>
        <div className="product-card__meta">
          <p className="product-card__price">{formatPrice(price)}</p>
          <AvailabilityBadge stock={stock} />
        </div>
      </div>

      <div className="product-card__footer">
        <Link
          to={`/products/${_id}`}
          className="btn btn--secondary btn--sm btn--block product-card__action"
          aria-label={`View details for ${name}`}
        >
          View details
        </Link>
      </div>
    </article>
  );
}
