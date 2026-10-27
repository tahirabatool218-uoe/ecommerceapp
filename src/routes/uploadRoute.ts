import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { uploadProductImage } from "../controllers/uploadController";
import protect from "../middleware/authMiddleware";
import admin from "../middleware/adminMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

// Wraps multer so its errors (bad file type, too large) come back as the
// same { message } JSON shape the rest of the API uses, instead of an
// unhandled exception.
const handleUpload = (req: Request, res: Response, next: NextFunction): void => {
  upload.single("image")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5MB"
          : error.message;
      res.status(400).json({ message });
      return;
    }
    if (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : String(error)
      });
      return;
    }
    next();
  });
};

// Admin-only: uploads a product image to Cloudinary and returns its URL.
router.post("/product-image", protect, admin, handleUpload, uploadProductImage);

export default router;
