"use client";

import { Bell, Search, User, Sun, Moon, Activity, Globe, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const { electionScope, setElectionScope } = useData();

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

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Tableau de Bord Central";
      case "/gestion-acces": return "Gestion des Accès & Sécurité";
      case "/infrastructure": return "Infrastructure Électorale";
      case "/entites-politiques": return "Entités Politiques & Candidats";
      case "/validation": return "Validation des Procès-Verbaux";
      case "/roles-election": return "Planification du Personnel";
      default: return "Console de Gestion ANIE";
    }
  };

  return (
    <header className="h-20 glass sticky top-0 z-30 flex items-center justify-between px-10 border-b border-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-0.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-algerian-green animate-pulse" />
            Système Actif
          </div>
          <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
            {getPageTitle()}
          </h2>
        </div>

        <div className="h-8 w-[1px] bg-zinc-200 dark:bg-white/10 mx-2"></div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-algerian-green/5 dark:bg-white/5 border border-algerian-green/10 dark:border-white/10">
            <Activity size={14} className="text-algerian-green dark:text-algerian-green-light" />
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Phase: <span className="text-algerian-green dark:text-white">Candidatures</span></span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10 ml-2">
            {(['national', 'wilaya', 'commun'] as const).map((scope) => (
              <button
                key={scope}
                onClick={() => setElectionScope(scope)}
                className={cn(
                  "px-4 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all relative",
                  electionScope === scope 
                    ? "bg-white dark:bg-white/10 text-algerian-green dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5" 
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-zinc-500 transition-all shadow-sm"
          >
            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-600" />}
          </button>

          <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-zinc-500 relative transition-all shadow-sm">
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-algerian-red border-2 border-white dark:border-[#09090b] shadow-sm animate-pulse"></span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-zinc-200 dark:bg-white/10 mx-1"></div>

        <div className="flex items-center gap-3 group cursor-pointer pl-2">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-zinc-900 dark:text-white leading-tight">Admin Central</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-algerian-green dark:text-algerian-green-light" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Opérations</span>
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-algerian-green to-algerian-green-light flex items-center justify-center text-white shadow-xl shadow-algerian-green/20 group-hover:scale-105 transition-transform duration-300 ring-2 ring-offset-2 ring-transparent group-hover:ring-algerian-green/20 dark:ring-offset-black">
            <User size={22} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </header>
  );
}
