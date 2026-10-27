import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthContextValue, AuthCredentials, RegisterCredentials, User } from "../types";
import { loginRequest, registerRequest } from "../services/authService";
import { clearAuthStorage, getStoredUser, getToken, setAuthStorage } from "../utils/authStorage";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): { token: string | null; user: User | null } {
  const token = getToken();
  const user = getStoredUser();
  return token && user ? { token, user } : { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ token, user }, setAuth] = useState<{ token: string | null; user: User | null }>(readStoredAuth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleUnauthorized() {
      clearAuthStorage();
      setAuth({ token: null, user: null });
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async ({ email, password }: AuthCredentials): Promise<User> => {
    setLoading(true);
    try {
      const { user: loggedInUser, token: newToken } = await loginRequest({ email, password });
      setAuthStorage(newToken, loggedInUser);
      setAuth({ token: newToken, user: loggedInUser });
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }: RegisterCredentials): Promise<User> => {
    setLoading(true);
    try {
      const { user: newUser, token: newToken } = await registerRequest({ name, email, password });
      setAuthStorage(newToken, newUser);
      setAuth({ token: newToken, user: newUser });
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
