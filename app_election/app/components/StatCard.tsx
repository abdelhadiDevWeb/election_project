"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass rounded-2xl p-6 flex items-start justify-between shadow-sm hover:shadow-md transition-all duration-300", className)}
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-bold px-1.5 py-0.5 rounded-md",
              trend.isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-algerian-red/10 text-algerian-red"
            )}>
              {trend.isPositive ? "+" : "-"}{trend.value}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Depuis 2021</span>
          </div>
        )}
      </div>

      <div className="h-12 w-12 rounded-xl bg-algerian-green/10 flex items-center justify-center text-algerian-green">
        <Icon size={24} />
      </div>
    </motion.div>
  );
}
