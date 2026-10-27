import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";
import type { IProduct } from "./Product";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Shape of a cart item after `.populate("items.product")`.
export interface IPopulatedCartItem {
  product: HydratedDocument<IProduct> | null;
  quantity: number;
}

export type CartDocument = HydratedDocument<ICart>;

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
