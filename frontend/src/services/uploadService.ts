import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken } from "../utils/authStorage";

export type UploadProductImageOptions = { signal?: AbortSignal };

// Deliberately NOT using the shared `api` instance from ./api: its default
// "Content-Type: application/json" header makes axios stringify FormData
// instead of sending it as multipart, which would break the file upload.
// The JWT is still attached by hand, so this still goes through the same
// auth as every other admin request.
export async function uploadProductImage(file: File, { signal }: UploadProductImageOptions = {}): Promise<string | null> {
  const formData = new FormData();
  formData.append("image", file);

  const token = getToken();

  try {
    const { data } = await axios.post<{ url?: string }>(`${API_BASE_URL}/upload/product-image`, formData, {
      signal,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data?.url ?? null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    throw error;
  }
}
