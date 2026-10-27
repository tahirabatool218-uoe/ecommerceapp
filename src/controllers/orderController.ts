import Order, { isOrderStatus, OrderDocument } from "../models/Order";
import Cart, { IPopulatedCartItem } from "../models/Cart";
import Product from "../models/Product";
import type { ApiHandler } from "../types/api";
import type {
  CreateOrderBody,
  IdParams,
  UpdateOrderStatusBody
} from "../types/requests";
import { getErrorMessage } from "../utils/errors";

// Create order from cart
export const createOrder: ApiHandler<
  { order: OrderDocument },
  CreateOrderBody
> = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      res.status(400).json({
        message: "Shipping address is required"
      });
      return;
    }

    const cart = await Cart.findOne({ user: req.user!.id }).populate<{
      items: IPopulatedCartItem[];
    }>("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        message: "Cart is empty"
      });
      return;
    }

    for (const item of cart.items) {
      if (!item.product) {
        res.status(404).json({
          message: "Product not found"
        });
        return;
      }

      if (item.quantity > item.product.stock) {
        res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`
        });
        return;
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product!._id,
      name: item.product!.name,
      price: item.product!.price,
      quantity: item.quantity
    }));

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user!.id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product!._id, {
        $inc: {
          stock: -item.quantity
        }
      });
    }

    cart.items = [];
    await cart.save();

    await order.populate("items.product");

    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: getErrorMessage(error)
    });
  }
};

// Get logged-in user's orders
export const getMyOrders: ApiHandler<{
  count: number;
  orders: OrderDocument[];
}> = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user!.id
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: getErrorMessage(error)
    });
  }
};

// Get single order
export const getOrderById: ApiHandler<
  { order: OrderDocument },
  unknown,
  IdParams
> = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      res.status(404).json({
        message: "Order not found"
      });
      return;
    }

    if (
      order.user.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      res.status(403).json({
        message: "Access denied"
      });
      return;
    }

    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: getErrorMessage(error)
    });
  }
};

// Get all orders (Admin)
export const getAllOrders: ApiHandler<{
  count: number;
  orders: OrderDocument[];
}> = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: getErrorMessage(error)
    });
  }
};

// Update order status (Admin)
export const updateOrderStatus: ApiHandler<
  { order: OrderDocument },
  UpdateOrderStatusBody,
  IdParams
> = async (req, res) => {
  try {
    const { status } = req.body;

    if (!isOrderStatus(status)) {
      res.status(400).json({
        message: "Invalid order status"
      });
      return;
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        message: "Order not found"
      });
      return;
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: getErrorMessage(error)
    });
  }
};

// Delete order (Admin)
export const deleteOrder: ApiHandler<{}, unknown, IdParams> = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        message: "Order not found"
      });
      return;
    }

    // Restore product stock before deleting the order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity
        }
      });
    }

    await order.deleteOne();

    res.status(200).json({
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
      error: getErrorMessage(error)
    });
  }
};
