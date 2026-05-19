"use client";

import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";
import { useSocket } from "@/lib/hooks/useSocket";

export function DashboardLoading() {
  return (
    <div className="space-y-12 pb-20 animate-pulse">
      <motion.div className="space-y-3">
        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-10 w-96 max-w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl" />
        ))}
      </div>
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    </div>
  );
}

export function DashboardHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle: string;
}) {
  const { language } = useLanguage();
  const { isConnected } = useSocket();

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-w-0 w-full flex-1 space-y-2"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-algerian-green/10 border border-algerian-green/20 w-fit">
          <Zap size={12} className="text-algerian-green" />
          <span className="text-[10px] font-black uppercase tracking-widest text-algerian-green">
            {badge}
          </span>
        </div>
        <h1 className="w-full text-3xl font-black text-zinc-900 dark:text-white font-plus-jakarta md:text-4xl">
          {title}
        </h1>
        <p className="w-full max-w-full text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex shrink-0 items-center gap-4 self-start rounded-2xl border border-zinc-200 bg-white p-2 dark:border-white/5 dark:bg-zinc-900/50"
      >
        <div className="px-6 py-3 border-r border-zinc-100 dark:border-white/5">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
            {language === "ar" ? "الحالة" : "Statut"}
          </p>
          <motion.div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              )}
            />
            <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
              {isConnected
                ? language === "ar"
                  ? "متزامن"
                  : "Synchronisé"
                : language === "ar"
                  ? "غير متصل"
                  : "Offline"}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export function ScopeBanner({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-zinc-900 dark:text-white">{value}</p>
      {hint && (
        <p className="mt-1 w-full max-w-full text-xs font-medium leading-relaxed text-zinc-500">{hint}</p>
      )}
    </motion.div>
  );
}
