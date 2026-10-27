import { MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "../../context/ThemeContext";
import type { ThemeToggleProps } from "../../types";

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle${className ? ` ${className}` : ""}`}
      onClick={toggleTheme}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
      {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  );
}
