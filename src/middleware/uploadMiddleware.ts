import type { Request } from "express";
import multer from "multer";
import type { FileFilterCallback } from "multer";

// Files are held in memory only, long enough to stream to Cloudinary, and
// are never written to disk or saved to MongoDB.
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES: string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1
  }
});

export default upload;
