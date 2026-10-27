import type { ApiResponse, RegisterCredentials, User, AuthCredentials } from "../types";
import api from "./api";

export type AuthRequestPayload = AuthCredentials | RegisterCredentials;

// POST /auth/register -> { user, token }
export async function registerRequest({ name, email, password }: RegisterCredentials): Promise<{ user: User; token: string }> {
  const { data } = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/register", { name, email, password });
  return { user: data.user, token: data.token };
}

// POST /auth/login -> { user, token }
export async function loginRequest({ email, password }: AuthCredentials): Promise<{ user: User; token: string }> {
  const { data } = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/login", { email, password });
  return { user: data.user, token: data.token };
}
