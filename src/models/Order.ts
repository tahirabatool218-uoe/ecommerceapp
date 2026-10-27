import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  ORDER_STATUSES.some((status) => status === value);

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        name: {
          type: String,
          required: true
        },

        price: {
          type: Number,
          required: true,
          min: 0
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    shippingAddress: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
