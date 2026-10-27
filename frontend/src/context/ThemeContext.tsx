import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ThemeContextValue, ThemeName } from "../types";

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";
const THEMES: ThemeName[] = ["light", "dark"];

function getStoredTheme(): ThemeName {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && THEMES.includes(stored as ThemeName) ? (stored as ThemeName) : "light";
  } catch {
    return "light";
  }
}

function readInitialTheme(): ThemeName {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr && THEMES.includes(attr as ThemeName)) return attr as ThemeName;
  }
  return getStoredTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // non-fatal
    }
  }, [theme]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY && event.newValue && THEMES.includes(event.newValue as ThemeName)) {
        setTheme(event.newValue as ThemeName);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, isDark: theme === "dark", toggleTheme, setTheme }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
