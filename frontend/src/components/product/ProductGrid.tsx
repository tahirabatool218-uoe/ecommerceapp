import type { Product } from "../../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="product-card__media skeleton" />
      <div className="product-card__body">
        <span className="skeleton skeleton--line skeleton--short" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line skeleton--short" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading products…</span>
      <div className="product-grid">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="product-grid">
      {products.map((product) => (
        <li key={product._id ?? product.name}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
