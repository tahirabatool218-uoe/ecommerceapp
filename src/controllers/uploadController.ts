import type { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import getCloudinary from "../config/cloudinary";
import type { ApiHandler } from "../types/api";
import { getErrorMessage } from "../utils/errors";

// Streams the in-memory buffer multer gave us straight to Cloudinary — the
// image binary is never written to disk or saved in MongoDB.
const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
  const cloudinary = getCloudinary();

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Empty response from Cloudinary"));
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

// POST /api/upload/product-image (Admin) — accepts a single "image" file
// and returns the Cloudinary-hosted URL to save on the product.
export const uploadProductImage: ApiHandler<{ url: string }> = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "No image file provided"
      });
      return;
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url
    });
  } catch (error) {
    res.status(500).json({
      message: "Image upload failed",
      error: getErrorMessage(error)
    });
  }
};
