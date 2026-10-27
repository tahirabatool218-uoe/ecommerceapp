import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = HydratedDocument<IProduct>;

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: String,
      default: ""
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
