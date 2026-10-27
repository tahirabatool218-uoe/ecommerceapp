import { Link } from "react-router-dom";
import ProductImage from "../product/ProductImage";
import { BagIcon, BoxIcon, TagIcon } from "../ui/Icons";
import { formatPrice } from "../../utils/formatters";
import { sortNewestFirst } from "../../utils/products";
import type { HeroShowcaseProps, Product } from "../../types";

const PLACEHOLDER_ICONS = [BagIcon, TagIcon, BoxIcon];
const TILE_COUNT = 3;

/**
 * Visual area for the hero. Uses real product photos when the catalog has
 * them and falls back to quiet placeholder tiles otherwise (loading, error,
 * or an empty catalog), so the hero never looks broken.
 */
export default function HeroShowcase({ products, status }: HeroShowcaseProps) {
  const withImages = sortNewestFirst(products).filter((p: Product) => p.image);
  const showcase = (status === "success" ? withImages : []).slice(0, TILE_COUNT);

  return (
    <div className="showcase" aria-label="Product highlights">
      {Array.from({ length: TILE_COUNT }, (_, index) => {
        const product = showcase[index];
        const tileClass = `showcase__tile showcase__tile--${index + 1}`;

        if (!product) {
          const PlaceholderIcon = PLACEHOLDER_ICONS[index];
          return (
            <div key={`placeholder-${index}`} className={`${tileClass} showcase__tile--placeholder`} aria-hidden="true">
              <PlaceholderIcon size={36} />
            </div>
          );
        }

        return (
          <Link key={product._id} to={`/products/${product._id}`} className={tileClass}>
            <ProductImage src={product.image} alt={product.name} />
            <span className="showcase__caption">
              <span className="showcase__name">{product.name}</span>
              <span className="showcase__price">{formatPrice(product.price)}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
