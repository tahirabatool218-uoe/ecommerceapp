import { v2 as cloudinary } from "cloudinary";

// server.ts imports its route modules before calling dotenv.config(),
// so configuring Cloudinary at import-time would read empty env vars.
// Configuring lazily (called from the controller right before use)
// guarantees dotenv has already run.
const configureCloudinary = (): typeof cloudinary => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  return cloudinary;
};

export default configureCloudinary;
