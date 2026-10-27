import Button from "../ui/Button";
import HeroShowcase from "./HeroShowcase";
import { pluralize } from "../../utils/formatters";
import type { HeroProps } from "../../types";

export default function Hero({ products, categoryCount, status }: HeroProps) {
  const hasCatalog = status === "success" && products.length > 0;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1 id="hero-title" className="hero__title">
            Shop online, without the clutter.
          </h1>
          <p className="hero__description">
            Browse the full catalog, see what&rsquo;s in stock, and check out with your own
            account &mdash; all in one straightforward store.
          </p>
          <div className="hero__actions">
            <Button to="/products" size="lg">
              Shop now
            </Button>
            <Button to="/register" variant="secondary" size="lg">
              Create an account
            </Button>
          </div>
          {hasCatalog && (
            <p className="hero__note">
              {pluralize(products.length, "product")} available across{" "}
              {pluralize(categoryCount, "category", "categories")}.
            </p>
          )}
        </div>

        <HeroShowcase products={products} status={status} />
      </div>
    </section>
  );
}
