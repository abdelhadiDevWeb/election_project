"use client";

import { Bell, Search, User, Sun, Moon, Activity, Globe, ShieldCheck, Menu, LogOut, MailOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { useNotifications } from "@/lib/hooks/useNotifications";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "@/app/context/ThemeContext";
import { useSocket } from "@/lib/hooks/useSocket";
import { useSettings } from "@/lib/hooks/useSettings";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const router = useRouter();
  const { electionScope, setElectionScope } = useData();
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const { data: notifications, refetch: refetchNotifications } = useNotifications({ limit: 10 });
  const { events } = useSocket({ playSound: true });
  const notifs = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notifs.filter((n: any) => !n.is_read).length;
  
  const { data: settingsRes, updateSettingsAsync, isUpdating } = useSettings();
  const isElectionDayOpen = settingsRes?.is_election_day_open || false;

  useEffect(() => {
    if (events.length > 0) {
      refetchNotifications();
    }
  }, [events, refetchNotifications]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return t("nav.overview");
      case "/gestion-acces": return t("nav.access");
      case "/infrastructure": return t("nav.infrastructure");
      case "/entites-politiques": return t("nav.entities");
      case "/validation": return t("nav.validation");
      case "/roles-election": return t("nav.roles");
      case "/citoyens": return t("nav.citizens");
      case "/mes-citoyens": return t("nav.myCitizens");
      case "/settings": return t("nav.settings");
      default: return t("dash.title");
    }
  };

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
          <h2 className="text-sm lg:text-lg font-black tracking-tight text-zinc-900 dark:text-white truncate max-w-[120px] sm:max-w-xs lg:max-w-none">
            {getPageTitle()}
          </h2>
        </div>

        <div className="hidden lg:block h-8 w-[1px] bg-zinc-200 dark:bg-white/10 mx-2"></div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10 ms-2">
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
                {t(`dash.scope.${scope}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-8">
        {user?.role === "super_admin" && (
          <div className="hidden lg:flex items-center gap-3 bg-zinc-100 dark:bg-white/5 pl-3 pr-1 py-1 rounded-xl border border-zinc-200 dark:border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {language === "ar" ? "وصول يوم الانتخابات" : "Accès Élection"}
            </span>
            <button
              onClick={() => updateSettingsAsync(!isElectionDayOpen)}
              disabled={isUpdating}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50",
                isElectionDayOpen ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  isElectionDayOpen ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        )}

        <LanguageSwitcher />
        
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-zinc-500 transition-all"
          >
            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-600" />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-zinc-500 relative transition-all"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-algerian-red border-2 border-white dark:border-[#09090b] text-[8px] font-black text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-white/5 mb-1 flex justify-between items-center">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{language === "ar" ? "الإشعارات" : "Notifications"}</p>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {notifs.length === 0 ? (
                    <div className="p-4 text-center text-sm text-zinc-500">
                      {language === "ar" ? "لا توجد إشعارات" : "Aucune notification"}
                    </div>
                  ) : (
                    notifs.map((notif: any, index: number) => (
                      <button 
                        key={notif._id || notif.id || index} 
                        onClick={() => {
                          setShowNotifications(false);
                          router.push(`/notifications?id=${notif._id || notif.id}`);
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border-b border-zinc-50 dark:border-white/5 last:border-0 transition-colors flex gap-3",
                          !notif.is_read ? "bg-algerian-green/5 hover:bg-algerian-green/10" : "hover:bg-zinc-50 dark:hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          notif.type === "reclamation" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {notif.type === "reclamation" ? <Activity size={14} /> : <MailOpen size={14} />}
                        </div>
                        <div className="flex-1 min-w-0 relative">
                          {!notif.is_read && (
                            <div className="absolute -right-1 top-1.5 w-1.5 h-1.5 rounded-full bg-algerian-green" />
                          )}
                          <p className={cn(
                            "text-xs truncate pr-3",
                            !notif.is_read ? "font-black text-algerian-green" : "font-bold text-zinc-900 dark:text-white"
                          )}>
                            {notif.title}
                          </p>
                          <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">{notif.body}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-white/5">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      router.push('/notifications');
                    }}
                    className="w-full text-center py-2 text-xs font-bold text-algerian-green hover:text-algerian-green-light transition-colors"
                  >
                    {language === "ar" ? "عرض كل الإشعارات" : "Voir toutes les notifications"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:block h-8 w-[1px] bg-zinc-200 dark:bg-white/10 mx-1"></div>

        <div className="flex items-center gap-1 sm:gap-3 group cursor-pointer ps-1 sm:ps-2 relative"
             onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-black text-zinc-900 dark:text-white leading-tight">
              {user?.role === 'super_admin' ? 'Super Admin' : (user?.full_name || t("user.admin_central"))}
            </span>
            {user?.role !== 'super_admin' && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={10} className="text-algerian-green dark:text-algerian-green-light" />
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                  {user?.role === 'admin_wilaya' ? 'Admin Wilaya'
                    : user?.role === 'admin_commun' ? 'Admin Commun'
                    : user?.role || (language === 'ar' ? 'العمليات' : 'Opérations')}
                </span>
              </div>
            )}
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
