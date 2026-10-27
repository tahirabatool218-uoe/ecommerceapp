import type { User } from "../types";

// Centralized localStorage access for the auth token/user so the Axios
// instance and AuthContext always agree on where this data lives.
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function parseStoredUser(value: unknown): User | null {
  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Record<string, unknown>;
  const id = typeof candidate.id === "string" ? candidate.id : candidate._id;
  if (
    typeof id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    (candidate.role !== "admin" && candidate.role !== "user")
  ) {
    return null;
  }

  return {
    id,
    name: candidate.name,
    email: candidate.email,
    role: candidate.role,
  };
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    return parseStoredUser(parsed);
  } catch {
    return null;
  }
}

export function setAuthStorage(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
