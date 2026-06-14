"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "pvp_theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyResolvedTheme(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  const resolve = useCallback((mode: ThemeMode): "light" | "dark" => {
    if (mode === "system") return getSystemTheme();
    return mode;
  }, []);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, mode);
      }
      const resolved = resolve(mode);
      setResolvedTheme(resolved);
      applyResolvedTheme(resolved);
    },
    [resolve]
  );

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || "system";
    const valid: ThemeMode[] = ["light", "dark", "system"];
    const mode = valid.includes(stored as ThemeMode) ? (stored as ThemeMode) : "system";
    setThemeState(mode);
    const resolved = resolve(mode);
    setResolvedTheme(resolved);
    applyResolvedTheme(resolved);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") {
        const next = getSystemTheme();
        setResolvedTheme(next);
        applyResolvedTheme(next);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [resolve]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
