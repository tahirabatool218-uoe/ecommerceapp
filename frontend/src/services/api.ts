import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken } from "../utils/authStorage";

// Single shared Axios instance. Attaches the auth token (when present) and
// broadcasts a window event on 401 so AuthContext can clear stale sessions.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
