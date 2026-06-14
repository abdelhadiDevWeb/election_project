"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ThemeContextType {
  resolvedTheme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("pvp_theme") as "light" | "dark" | null;
    const initial = stored || "dark";
    setResolvedTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const setTheme = (theme: "light" | "dark") => {
    setResolvedTheme(theme);
    localStorage.setItem("pvp_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
