"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChartDatum } from "@/lib/dashboard-scope";

const PALETTE = [
  "#006233",
  "#008c5a",
  "#10b981",
  "#34d399",
  "#6366f1",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
];

export function BarChartPanel({
  title,
  subtitle,
  data,
  className,
  emptyLabel = "—",
}: {
  title: string;
  subtitle?: string;
  data: ChartDatum[];
  className?: string;
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className={cn("glass rounded-[28px] p-6 border border-white/5 space-y-5", className)}>
      <motion.div>
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
        )}
      </motion.div>
      {data.length === 0 ? (
        <p className="text-sm text-zinc-500 font-medium py-8 text-center">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {data.map((d, i) => (
            <div key={`${d.label}-${i}`} className="space-y-1">
              <div className="flex justify-between gap-2 text-[11px] font-bold">
                <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[70%]" title={d.label}>
                  {d.label}
                </span>
                <span className="text-algerian-green tabular-nums">{d.value}</span>
              </div>
              <motion.div className="h-2.5 w-full bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.value / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: d.color || PALETTE[i % PALETTE.length] }}
                />
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DonutChartPanel({
  title,
  subtitle,
  data,
  className,
  emptyLabel = "—",
}: {
  title: string;
  subtitle?: string;
  data: ChartDatum[];
  className?: string;
  emptyLabel?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = 140;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments =
    total > 0
      ? data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * circumference;
          const seg = {
            ...d,
            dash,
            offset: -offset,
            color: d.color || PALETTE[i % PALETTE.length],
            pct: Math.round(pct * 100),
          };
          offset += dash;
          return seg;
        })
      : [];

  return (
    <div className={cn("glass rounded-[28px] p-6 border border-white/5", className)}>
      <motion.div className="mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{subtitle}</p>
        )}
      </motion.div>
      {total === 0 ? (
        <p className="text-sm text-zinc-500 font-medium py-12 text-center">{emptyLabel}</p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                className="text-zinc-100 dark:text-white/10"
              />
              {segments.map((s, i) => (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="butt"
                />
              ))}
            </svg>
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-zinc-900 dark:text-white tabular-nums">{total}</span>
              <span className="text-[9px] font-black uppercase text-zinc-500">Total</span>
            </motion.div>
          </div>
          <ul className="flex-1 space-y-2 min-w-0 w-full">
            {segments.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="font-bold text-zinc-700 dark:text-zinc-300 truncate">{s.label}</span>
                </span>
                <span className="font-black text-zinc-500 tabular-nums shrink-0">
                  {s.value} ({s.pct}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
