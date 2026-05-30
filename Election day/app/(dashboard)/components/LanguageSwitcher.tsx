"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
      className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-zinc-500 transition-all"
      title={language === "fr" ? "العربية" : "Français"}
    >
      <Globe size={18} />
    </button>
  );
}
