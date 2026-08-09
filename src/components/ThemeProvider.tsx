"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system" | "amoled" | "auto";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("growzok-theme") as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "system" || stored === "amoled" || stored === "auto") {
      setThemeState(stored);
    } else {
      setThemeState("system");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    let dark = false;

    if (theme === "system") {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else if (theme === "auto") {
      // Sunrise/sunset schedule: light 06:00–20:00, dark otherwise
      const hour = new Date().getHours();
      dark = hour < 6 || hour >= 20;
    } else {
      dark = theme === "dark" || theme === "amoled";
    }

    setIsDark(dark);

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // AMOLED pitch black: set data attribute so CSS variables can override backgrounds
    if (theme === "amoled") {
      root.setAttribute("data-theme", "amoled");
    } else {
      root.removeAttribute("data-theme");
    }

    localStorage.setItem("growzok-theme", theme);
  }, [theme, mounted]);

  // Listen to system theme changes when theme === 'system'
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const dark = e.matches;
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  // Auto sunrise/sunset scheduling — re-evaluates every minute when theme === 'auto'
  useEffect(() => {
    if (!mounted || theme !== "auto") return;

    const evaluate = () => {
      const hour = new Date().getHours();
      const dark = hour < 6 || hour >= 20;
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    evaluate();
    const timer = setInterval(evaluate, 60_000); // check every minute
    return () => clearInterval(timer);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
