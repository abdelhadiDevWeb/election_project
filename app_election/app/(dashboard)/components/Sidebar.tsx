"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Flag, 
  CheckCircle, 
  Calendar,
  ShieldCheck,
  Search,
  Settings,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navigationGroups = [
  {
    title: "Principal",
    items: [
      { name: "Tableau de Bord", href: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "Administration",
    items: [
      { name: "Gestion des Accès", href: "/gestion-acces", icon: Users },
      { name: "Infrastructure", href: "/infrastructure", icon: MapPin },
    ]
  },
  {
    title: "Opérations Électorales",
    items: [
      { name: "Entités Politiques", href: "/entites-politiques", icon: Flag },
      { name: "Validation PV", href: "/validation", icon: CheckCircle },
      { name: "Planification Jour-J", href: "/roles-election", icon: Calendar },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col sidebar-glass fixed left-0 top-0 z-40 p-4">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-algerian-green flex items-center justify-center text-white shadow-xl shadow-algerian-green/20 glow-emerald">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-algerian-green dark:text-white leading-none">ANIE</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Algérie</span>
          </div>
        </div>
      </div>

      {/* Command Search */}
      <div className="px-4 mb-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-algerian-green transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full h-10 pl-10 pr-4 bg-zinc-100/50 dark:bg-white/5 border-none rounded-xl text-xs font-medium focus:ring-1 focus:ring-algerian-green/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-white/10 text-[10px] font-bold text-zinc-400">
            ⌘K
          </div>
        </div>
      </div>
      
      {/* Navigation Groups */}
      <nav className="flex-1 space-y-8 px-2 overflow-y-auto custom-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 dark:text-zinc-500">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
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
                        className="absolute inset-0 bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-xl shadow-sm z-[-1]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 shrink-0 transition-all duration-300",
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
                      <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-zinc-400" size={14} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto px-2 pt-6 border-t border-zinc-100 dark:border-white/5 space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all">
          <Settings size={18} />
          <span>Paramètres</span>
        </Link>
        <Link href="/help" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all">
          <HelpCircle size={18} />
          <span>Aide & Support</span>
        </Link>
      </div>
    </div>
  );
}
