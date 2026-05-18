"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { Languages } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10">
      <button
        onClick={() => setLanguage("fr")}
        className={cn(
          "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
          language === "fr"
            ? "bg-white dark:bg-white text-zinc-900 dark:text-black shadow-sm"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        )}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage("ar")}
        className={cn(
          "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all font-plus-jakarta",
          language === "ar"
            ? "bg-white dark:bg-white text-zinc-900 dark:text-black shadow-sm"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        )}
      >
        AR
      </button>
    </div>
  );
}
