// Public, build-time frontend configuration. Never place secrets here.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Shopfront";

export const CURRENCY = import.meta.env.VITE_CURRENCY || "PKR";

// Stock at or below this count is shown as "low stock".
export const LOW_STOCK_THRESHOLD = 5;
