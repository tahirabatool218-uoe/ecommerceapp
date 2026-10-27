import Product, { ProductDocument } from "../models/Product";
import type { ApiHandler } from "../types/api";
import type { IdParams, ProductBody } from "../types/requests";
import { getErrorMessage } from "../utils/errors";

export const createProduct: ApiHandler<
  { product: ProductDocument },
  ProductBody
> = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      res.status(400).json({
        message: "Name, description, price, category and stock are required"
      });
      return;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      createdBy: req.user!.id
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: getErrorMessage(error)
    });
  }
};

export const getProducts: ApiHandler<{
  count: number;
  products: ProductDocument[];
}> = async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "name email");

    res.status(200).json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: getErrorMessage(error)
    });
  }
};

export const getProductById: ApiHandler<
  { product: ProductDocument },
  unknown,
  IdParams
> = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!product) {
      res.status(404).json({
        message: "Product not found"
      });
      return;
    }

    res.status(200).json({
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: getErrorMessage(error)
    });
  }
};

export const updateProduct: ApiHandler<
  { product: ProductDocument },
  ProductBody,
  IdParams
> = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Product not found"
      });
      return;
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.image = image ?? product.image;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: getErrorMessage(error)
    });
  }
};

export const deleteProduct: ApiHandler<{}, unknown, IdParams> = async (
  req,
  res
) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        message: "Product not found"
      });
      return;
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: getErrorMessage(error)
    });
  }
};
