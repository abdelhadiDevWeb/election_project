"use client";

import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="h-20 glass sticky top-0 z-30 flex items-center justify-between px-8 border-b border-algerian-green/10">
      <div className="flex items-center gap-4">
        {/* Search removed to avoid confusion with table-specific search */}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
        >
          {isDark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-indigo-600" />}
        </button>

        <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-algerian-red border-2 border-white dark:border-zinc-900"></span>
        </button>

        <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-zinc-700 dark:text-white">Admin Central</span>
            <span className="text-[10px] text-algerian-green dark:text-algerian-green-light font-medium uppercase tracking-wider">Super Admin</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-algerian-green to-algerian-green-light flex items-center justify-center text-white shadow-md">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
