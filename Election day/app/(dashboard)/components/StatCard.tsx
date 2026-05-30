"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

function Counter({ value }: { value: number | string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof value !== "number") return;
    
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        node.textContent = Math.floor(value).toLocaleString();
      },
    });

    return () => controls.stop();
  }, [value]);

  if (typeof value !== "number") return <span>{value}</span>;
  return <span ref={nodeRef}>0</span>;
}

export default function StatCard({ title, value, icon: Icon, trend, className, delay = 0 }: StatCardProps) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={cn(
        "relative glass rounded-[24px] p-6 flex flex-col justify-between overflow-hidden group transition-all duration-500",
        "border-white/5 bg-zinc-900/50 hover:bg-zinc-900/80",
        className
      )}
    >
      {/* Background Glow Effect */}
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-algerian-green/5 blur-3xl group-hover:bg-algerian-green/10 transition-all duration-500 rounded-full" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
              <Counter value={value} />
            </h3>
            {typeof value === "number" && (
              <span className="text-[10px] font-bold text-zinc-500 ms-1">{t("common.units")}</span>
            )}
          </div>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-algerian-green dark:text-algerian-green-light group-hover:scale-110 transition-transform duration-500">
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-between">
        {trend && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase",
              trend.isPositive 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                : "bg-algerian-red/10 text-algerian-red border border-algerian-red/20"
            )}>
              {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value}
            </div>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{t("common.variation") || "Variation"}</span>
          </div>
        )}
        
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-5 rounded-full border-2 border-white dark:border-[#09090b] bg-zinc-800 flex items-center justify-center overflow-hidden">
               <div className="h-full w-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Bottom Light */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-algerian-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
