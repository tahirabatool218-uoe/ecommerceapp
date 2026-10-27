import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { deriveCategories, filterByCategory } from "../utils/products";
import { pluralize } from "../utils/formatters";
import ProductGrid, { ProductGridSkeleton } from "../components/product/ProductGrid";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category") ?? "";
  const { products, status, error, reload } = useProducts();

  const categories = useMemo(() => deriveCategories(products), [products]);
  // Resolve the URL value to a real category so casing always matches the data.
  const activeCategory = categories.find(
    (c) => c.name.toLowerCase() === requestedCategory.trim().toLowerCase(),
  );
  const visibleProducts = useMemo(
    () => filterByCategory(products, activeCategory?.name ?? requestedCategory),
    [products, activeCategory, requestedCategory],
  );

  useDocumentTitle(activeCategory ? activeCategory.name : "Products");

  let content;
  if (status === "loading") {
    content = <ProductGridSkeleton count={8} />;
  } else if (status === "error") {
    content = <ErrorMessage title="Products unavailable" message={error} onRetry={reload} />;
  } else if (products.length === 0) {
    content = (
      <EmptyState
        title="No products yet"
        message="The catalog is empty right now. Check back soon."
        actionLabel="Back to home"
        actionTo="/"
      />
    );
  } else if (visibleProducts.length === 0) {
    content = (
      <EmptyState
        title="No products in this category"
        message="We couldn't find any products for that category."
        actionLabel="View all products"
        actionTo="/products"
      />
    );
  } else {
    content = (
      <>
        <p className="results-count" aria-live="polite">
          Showing {pluralize(visibleProducts.length, "product")}
          {activeCategory ? ` in ${activeCategory.name}` : ""}
        </p>
        <ProductGrid products={visibleProducts} />
      </>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <header className="page__header">
          <h1 className="page__title">{activeCategory ? activeCategory.name : "All products"}</h1>
          <p className="page__description">Browse everything currently in the catalog.</p>
        </header>

        {status === "success" && categories.length > 0 && (
          <nav className="chips" aria-label="Filter by category">
            <Link
              to="/products"
              className="chip"
              aria-current={!activeCategory ? "page" : undefined}
            >
              All
            </Link>
            {categories.map(({ name, count }) => (
              <Link
                key={name}
                to={`/products?category=${encodeURIComponent(name)}`}
                className="chip"
                aria-current={activeCategory?.name === name ? "page" : undefined}
              >
                {name}
                <span className="chip__count">{count}</span>
              </Link>
            ))}
          </nav>
        )}

        {content}
      </div>
    </section>
  );
}
