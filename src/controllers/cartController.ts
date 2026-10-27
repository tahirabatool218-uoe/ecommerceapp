import Cart, { CartDocument } from "../models/Cart";
import Product from "../models/Product";
import type { ApiHandler } from "../types/api";
import type {
  AddToCartBody,
  ProductIdParams,
  UpdateCartItemBody
} from "../types/requests";
import { getErrorMessage } from "../utils/errors";

// Get logged-in user's cart
export const getCart: ApiHandler<{ cart: CartDocument }> = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user!.id }).populate(
      "items.product"
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user!.id,
        items: []
      });
    }

    res.status(200).json({
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: getErrorMessage(error)
    });
  }
};

// Add product to cart
export const addToCart: ApiHandler<{ cart: CartDocument }, AddToCartBody> = async (
  req,
  res
) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      res.status(400).json({
        message: "Product ID and quantity are required"
      });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        message: "Product not found"
      });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({
        message: "Insufficient product stock"
      });
      return;
    }

    let cart = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user!.id,
        items: [
          {
            product: product._id,
            quantity
          }
        ]
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
          res.status(400).json({
            message: "Requested quantity exceeds available stock"
          });
          return;
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.status(200).json({
      message: "Product added to cart successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: getErrorMessage(error)
    });
  }
};

// Update product quantity in cart
export const updateCartItem: ApiHandler<
  { cart: CartDocument },
  UpdateCartItemBody,
  ProductIdParams
> = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity) {
      res.status(400).json({
        message: "Quantity is required"
      });
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        message: "Product not found"
      });
      return;
    }

    if (quantity > product.stock) {
      res.status(400).json({
        message: "Requested quantity exceeds available stock"
      });
      return;
    }

    const cart = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      res.status(404).json({
        message: "Cart not found"
      });
      return;
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      res.status(404).json({
        message: "Product not found in cart"
      });
      return;
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Cart item updated successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart item",
      error: getErrorMessage(error)
    });
  }
};

// Remove product from cart
export const removeFromCart: ApiHandler<
  { cart: CartDocument },
  unknown,
  ProductIdParams
> = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      res.status(404).json({
        message: "Cart not found"
      });
      return;
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      res.status(404).json({
        message: "Product not found in cart"
      });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product from cart",
      error: getErrorMessage(error)
    });
  }
};

// Clear cart
export const clearCart: ApiHandler<{ cart: CartDocument }> = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      res.status(404).json({
        message: "Cart not found"
      });
      return;
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
      error: getErrorMessage(error)
    });
  }
};
