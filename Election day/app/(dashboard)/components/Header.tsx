"use client";

import { Bell, Sun, Moon, User, ShieldCheck, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "@/app/context/ThemeContext";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return t("nav.overview");
      case "/votes": return t("nav.votes");
      case "/pv-capture": return t("nav.pvCapture");
      case "/centre-overview": return t("nav.centerView");
      default: return t("dash.title");
    }
  };

  const roleLabel = user?.election_role === "observateur_bureau"
    ? (language === "ar" ? "مراقب المكتب" : "Observateur Bureau")
    : (language === "ar" ? "مراقب المركز" : "Observateur Centre");

  return (
    <header className="h-20 glass sticky top-0 z-30 flex items-center justify-between px-4 lg:px-10 border-b border-white/5 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-2 lg:gap-6">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-0.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-algerian-green animate-pulse" />
            {language === 'ar' ? 'يوم الاقتراع' : 'Jour de Scrutin'}
          </div>
          <h2 className="text-sm lg:text-lg font-black tracking-tight text-zinc-900 dark:text-white truncate max-w-[120px] sm:max-w-xs lg:max-w-none">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <LanguageSwitcher />
        
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-zinc-500 transition-all"
          >
            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-600" />}
          </button>

          <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-zinc-500 relative transition-all">
            <Bell size={18} />
          </button>
        </div>

        <div className="hidden sm:block h-8 w-[1px] bg-zinc-200 dark:bg-white/10 mx-1"></div>

        <div className="flex items-center gap-1 sm:gap-3 group cursor-pointer ps-1 sm:ps-2 relative"
             onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-black text-zinc-900 dark:text-white leading-tight">{user?.full_name || "Observateur"}</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-algerian-green dark:text-algerian-green-light" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                {roleLabel}
              </span>
            </div>
          </div>
          <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-algerian-green to-algerian-green-light flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300 ring-2 ring-offset-2 ring-transparent group-hover:ring-algerian-green/20 dark:ring-offset-black flex-shrink-0">
            <User size={20} strokeWidth={2.5} className="sm:h-[22px] sm:w-[22px]" />
          </div>
          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-zinc-100 dark:border-white/5 mb-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user?.email}</p>
              </div>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await logout();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={14} />
                {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
