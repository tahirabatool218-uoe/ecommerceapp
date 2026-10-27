import { Link } from "react-router-dom";
import ProductImage from "../product/ProductImage";
import Button from "../ui/Button";
import QuantityStepper from "../ui/QuantityStepper";
import { formatPrice } from "../../utils/formatters";
import { getItemIssue, getLineTotal } from "../../utils/cart";
import type { CartItemProps } from "../../types";

/** One line of the cart. Handles products that were deleted or ran out of stock. */
export default function CartItem({ item, disabled, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const issue = getItemIssue(item);

  // The API populates a deleted product as null, so there's no id to act on;
  // the user can still clear the cart from the toolbar.
  if (!product) {
    return (
      <li className="cart-item cart-item--unavailable">
        <div className="cart-item__media">
          <ProductImage alt="Unavailable product" />
        </div>
        <div className="cart-item__info">
          <p className="cart-item__name">Unavailable product</p>
          <p className="cart-item__issue" role="note">
            {issue?.message}
          </p>
        </div>
      </li>
    );
  }

  const stock = Number(product.stock) || 0;

  return (
    <li className={`cart-item${issue ? " cart-item--issue" : ""}`}>
      <div className="cart-item__media">
        <ProductImage src={product.image} alt={product.name} />
      </div>

      <div className="cart-item__info">
        <Link to={`/products/${product._id}`} className="cart-item__name">
          {product.name}
        </Link>
        <p className="cart-item__price">{formatPrice(product.price)} each</p>
        {issue && (
          <p className="cart-item__issue" role="note">
            {issue.message}
          </p>
        )}
      </div>

      <p className="cart-item__total" aria-label={`Line total ${formatPrice(getLineTotal(product.price, quantity))}`}>
        {formatPrice(getLineTotal(product.price, quantity))}
      </p>

      <div className="cart-item__controls">
        <QuantityStepper
          value={quantity}
          max={stock}
          disabled={disabled || stock <= 0}
          label={`Quantity of ${product.name}`}
          onChange={(next) => onQuantityChange(product._id ?? "", next)}
        />
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => onRemove(product._id ?? "")}
          aria-label={`Remove ${product.name} from cart`}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}
