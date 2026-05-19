"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Flag,
  CheckCircle,
  Calendar,
  Search,
  Settings,
  ChevronRight,
  LogOut,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { AlgeriaMapIcon } from "./AlgeriaMapIcon";
import { useMemo, useState } from "react";

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, dir, language } = useLanguage();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setIsOpen?.(false);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigationGroups = useMemo(() => {
    if (user?.role === "member_actif") {
      return [
        {
          title: language === "ar" ? "الرئيسية" : "Principal",
          items: [
            { name: t("nav.overview"), href: "/", icon: LayoutDashboard },
            { name: language === "ar" ? "مواطني" : "Mes Citoyens", href: "/mes-citoyens", icon: UsersRound },
          ],
        },
      ];
    }
    return [
      {
        title: language === "ar" ? "الرئيسية" : "Principal",
        items: [{ name: t("nav.overview"), href: "/", icon: LayoutDashboard }],
      },
      {
        title: language === "ar" ? "الإدارة" : "Administration",
        items: [
          { name: t("nav.access"), href: "/gestion-acces", icon: Users },
          { name: t("nav.infrastructure"), href: "/infrastructure", icon: MapPin },
          { name: t("nav.citizens"), href: "/citoyens", icon: UsersRound },
        ],
      },
      {
        title: language === "ar" ? "العمليات الانتخابية" : "Opérations Électorales",
        items: [
          user?.role !== "admin_commun" && { name: t("nav.entities"), href: "/entites-politiques", icon: Flag },
          { name: t("nav.validation"), href: "/validation", icon: CheckCircle },
          { name: t("nav.roles"), href: "/roles-election", icon: Calendar },
        ].filter(Boolean) as { name: string; href: string; icon: any }[],
      },
    ];
  }, [user?.role, language, t]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen?.(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "flex h-full w-72 flex-col sidebar-glass fixed top-0 z-50 p-4 transition-transform duration-300",
        dir === 'rtl' 
          ? `right-0 border-l border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}` 
          : `left-0 border-r border-white/5 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
      )}>
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 mb-6 mt-1">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-algerian-green flex items-center justify-center text-white glow-emerald">
            <AlgeriaMapIcon className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-black tracking-tighter text-algerian-green dark:text-white leading-none">ANIE</span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold">{language === 'ar' ? 'الجزائر' : 'Algérie'}</span>
          </div>
        </div>
      </div>

      {/* Command Search */}
      <div className="px-4 mb-8">
        <div className="relative group">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-algerian-green transition-colors" size={16} />
          <input 
            type="text" 
            placeholder={t("common.search")} 
            className={cn(
              "w-full h-10 pr-4 bg-zinc-100/50 dark:bg-white/5 border-none rounded-xl text-xs font-medium focus:ring-1 focus:ring-algerian-green/50 transition-all",
              dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'
            )}
          />
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-white/10 text-[10px] font-bold text-zinc-400",
            dir === 'rtl' ? 'left-3' : 'right-3'
          )}>
            ⌘K
          </div>
        </div>
      </div>
      
      {/* Navigation Groups */}
      <nav className="flex-1 space-y-8 px-2 overflow-y-auto custom-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <div className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 dark:text-zinc-500">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen?.(false)}
                      className={cn(
                        "group relative flex items-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300",
                        isActive
                          ? "text-algerian-green dark:text-white"
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-xl z-[-1]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-300",
                        dir === 'rtl' ? 'ml-3' : 'mr-3',
                        isActive 
                          ? "text-algerian-green dark:text-algerian-green-light scale-110" 
                          : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                      )}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="h-1.5 w-1.5 rounded-full bg-algerian-green dark:bg-algerian-green-light glow-emerald"
                      />
                    )}
                    {!isActive && (
                      <ChevronRight className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all text-zinc-400",
                        dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                      )} size={14} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-1 border-t border-zinc-100 px-2 pt-4 dark:border-white/5">
        <Link
          href="/settings"
          onClick={() => setIsOpen?.(false)}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-300",
            pathname === "/settings"
              ? "bg-zinc-100 text-algerian-green dark:bg-white/10 dark:text-white"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-white"
          )}
        >
          <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
            <Settings
              size={17}
              className={cn(
                "transition-colors",
                pathname === "/settings"
                  ? "text-algerian-green"
                  : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              )}
            />
          </motion.div>
          <span>{t("nav.settings")}</span>
        </Link>

        <motion.button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-300",
            "text-red-600 hover:bg-red-50/50 hover:text-red-700 dark:text-red-400/90 dark:hover:bg-red-500/10 dark:hover:text-red-300",
            isLoggingOut && "pointer-events-none opacity-50"
          )}
        >
          <motion.span
            className="flex shrink-0 items-center justify-center transition-transform"
            animate={isLoggingOut ? { x: [0, 3, 0] } : {}}
            whileHover={
              isLoggingOut
                ? undefined
                : {
                    x: dir === "rtl" ? -2 : 2,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }
            }
            transition={isLoggingOut ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : undefined}
          >
            <LogOut size={17} className="text-red-500 dark:text-red-400" />
          </motion.span>
          <span className="flex-1 text-start">
            {isLoggingOut
              ? language === "ar"
                ? "جاري الخروج..."
                : "Déconnexion..."
              : t("nav.logout")}
          </span>
        </motion.button>
      </div>
    </div>
    </>
  );
}
