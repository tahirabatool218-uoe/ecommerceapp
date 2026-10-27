import { Link, useParams } from "react-router-dom";
import useProduct from "../hooks/useProduct";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { formatPrice, getAvailability, pluralize } from "../utils/formatters";
import ProductImage from "../components/product/ProductImage";
import AvailabilityBadge from "../components/product/AvailabilityBadge";
import AddToCartForm from "../components/product/AddToCartForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";
import { ChevronRightIcon, SearchIcon } from "../components/ui/Icons";

function Breadcrumb({ current }: { current?: string }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/products">Products</Link>
      {current && (
        <>
          <ChevronRightIcon size={14} />
          <span aria-current="page">{current}</span>
        </>
      )}
    </nav>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product, status, error, reload } = useProduct(id);

  useDocumentTitle(product?.name ?? "Product");

  if (status === "loading") {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <LoadingSpinner label="Loading product…" />
        </div>
      </section>
    );
  }

  if (status === "not-found") {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <EmptyState
            icon={<SearchIcon size={22} />}
            title="Product not found"
            message="This product doesn't exist or is no longer available."
            actionLabel="Browse products"
            actionTo="/products"
          />
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <ErrorMessage title="Product unavailable" message={error} onRetry={reload} />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page">
        <div className="container">
          <Breadcrumb />
          <EmptyState
            icon={<SearchIcon size={22} />}
            title="Product not found"
            message="This product doesn't exist or is no longer available."
            actionLabel="Browse products"
            actionTo="/products"
          />
        </div>
      </section>
    );
  }

  const { name, description, category, price, stock, image } = product;
  const isOutOfStock = getAvailability(stock).key === "out";

  return (
    <section className="page">
      <div className="container">
        <Breadcrumb current={name} />

        <article className="details">
          <div className="details__media">
            <ProductImage src={image} alt={name} />
          </div>

          <div className="details__info">
            <Link to={`/products?category=${encodeURIComponent(category)}`} className="details__category">
              {category}
            </Link>
            <h1 className="details__name">{name}</h1>
            <p className="details__price">{formatPrice(price)}</p>

            <div className="details__availability">
              <AvailabilityBadge stock={stock} />
              {!isOutOfStock && (
                <span className="details__stock">{pluralize(Number(stock), "unit")} available</span>
              )}
            </div>

            <p className="details__description">{description}</p>

            <div className="details__actions">
              <AddToCartForm key={product._id} product={product} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
