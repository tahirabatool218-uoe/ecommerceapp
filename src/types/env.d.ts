declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URI?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
  }
}
