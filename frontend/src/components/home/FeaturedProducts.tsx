import SectionHeading from "../ui/SectionHeading";
import ErrorMessage from "../ui/ErrorMessage";
import EmptyState from "../ui/EmptyState";
import ProductGrid, { ProductGridSkeleton } from "../product/ProductGrid";
import { sortNewestFirst } from "../../utils/products";
import type { Product } from "../../types";

const FEATURED_COUNT = 4;

interface FeaturedProductsProps {
  products: Product[];
  status: "loading" | "success" | "error";
  error: string;
  onRetry: () => void;
}

export default function FeaturedProducts({ products, status, error, onRetry }: FeaturedProductsProps) {
  let content;

  if (status === "loading") {
    content = <ProductGridSkeleton count={FEATURED_COUNT} />;
  } else if (status === "error") {
    content = <ErrorMessage title="Products unavailable" message={error} onRetry={onRetry} />;
  } else if (products.length === 0) {
    content = (
      <EmptyState
        title="No products yet"
        message="Products will appear here as soon as they are added to the store."
      />
    );
  } else {
    content = <ProductGrid products={sortNewestFirst(products).slice(0, FEATURED_COUNT)} />;
  }

  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container">
        <SectionHeading
          id="featured-title"
          title="Featured products"
          description="The newest additions to the catalog."
          actionLabel={status === "success" && products.length > 0 ? "View all products" : undefined}
          actionTo="/products"
        />
        {content}
      </div>
    </section>
  );
}
