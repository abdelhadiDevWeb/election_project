"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UsersRound, Target, ArrowUpRight, TrendingUp, MapPin, Building2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useQuery } from "@/lib/hooks/useApi";
import type { IWilaya, ICommune } from "@/lib/types";
import { cn } from "@/lib/utils";

function geoName(doc: IWilaya | ICommune | null | undefined, language: string): string {
  if (!doc) return "—";
  if (language === "ar") return doc.name_ar || doc.name_fr || "—";
  return doc.name_fr || doc.name_ar || "—";
}

function parseGoal(goal?: string): number {
  if (!goal) return 0;
  const n = parseInt(goal.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export default function MemberDashboard() {
  const { user } = useAuth();
  const { memberWilaya, memberCommune } = useData();
  const { language, t, dir } = useLanguage();

  const { data: citizensRaw, isLoading } = useQuery<Record<string, unknown>[]>(
    user?.role === "member_actif" ? "/citizens" : null,
    { limit: 5000, sortBy: "createdAt", sortOrder: "desc" },
    [user?.id]
  );

  const citizens = citizensRaw || [];
  const enrolled = citizens.length;
  const wilayaLabel = geoName(memberWilaya, language);
  const communeLabel = geoName(memberCommune, language);
  const goalTarget = parseGoal(user?.goal);
  const remaining = goalTarget > 0 ? Math.max(0, goalTarget - enrolled) : 0;
  const progressPct =
    goalTarget > 0 ? Math.min(100, Math.round((enrolled / goalTarget) * 100)) : enrolled > 0 ? 100 : 0;
  const recentCitizens = citizens.slice(0, 5);

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <motion.div
        initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full min-w-0 space-y-2"
      >
        <div className="flex w-fit items-center gap-2 rounded-full border border-algerian-green/20 bg-algerian-green/10 px-3 py-1">
          <Target size={12} className="text-algerian-green" />
          <span className="text-[10px] font-black uppercase tracking-widest text-algerian-green">
            {language === "ar" ? "مساحة العضو النشط" : "Espace Membre Actif"}
          </span>
        </div>
        <h1 className="w-full text-3xl font-black text-zinc-900 dark:text-white font-plus-jakarta md:text-4xl">
          {language === "ar" ? `مرحباً، ${user?.full_name}` : `Bonjour, ${user?.full_name}`}
        </h1>
        <p className="w-full text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t("dash.subtitle")}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
            <MapPin size={16} className="shrink-0 text-algerian-green" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                {language === "ar" ? "الولاية" : "Wilaya"}
              </p>
              <p className="text-sm font-black text-zinc-900 dark:text-white">{wilayaLabel}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
            <Building2 size={16} className="shrink-0 text-indigo-500" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                {language === "ar" ? "البلدية" : "Commune"}
              </p>
              <p className="text-sm font-black text-zinc-900 dark:text-white">{communeLabel}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass space-y-2 rounded-[28px] border border-white/5 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {language === "ar" ? "الهدف" : "Objectif"}
          </p>
          <p className="text-4xl font-black tabular-nums text-zinc-900 dark:text-white">
            {goalTarget > 0 ? goalTarget : "—"}
          </p>
          {user?.goal && goalTarget === 0 && (
            <p className="text-xs font-medium text-zinc-500">{user.goal}</p>
          )}
        </div>
        <div className="glass space-y-2 rounded-[28px] border border-emerald-500/20 bg-emerald-500/5 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            {language === "ar" ? "المواطنون المسجلون" : "Citoyens enregistrés"}
          </p>
          <p className="text-4xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">{enrolled}</p>
        </div>
        <div className="glass space-y-2 rounded-[28px] border border-amber-500/20 bg-amber-500/5 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            {language === "ar" ? "المتبقي للهدف" : "Reste à atteindre"}
          </p>
          <p className="text-4xl font-black tabular-nums text-amber-600 dark:text-amber-400">
            {goalTarget > 0 ? remaining : "—"}
          </p>
        </div>
      </div>

      <div className="glass space-y-6 rounded-[32px] border border-white/5 p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black text-zinc-900 dark:text-white">
              <TrendingUp size={22} className="text-algerian-green" />
              {language === "ar" ? "تقدم الهدف" : "Progression vers l'objectif"}
            </h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
              {goalTarget > 0
                ? language === "ar"
                  ? `${enrolled} / ${goalTarget} مواطن`
                  : `${enrolled} / ${goalTarget} citoyens`
                : language === "ar"
                  ? `${enrolled} مواطن مسجل`
                  : `${enrolled} citoyen(s) enregistré(s)`}
            </p>
          </div>
          <span className="text-3xl font-black tabular-nums text-algerian-green">{progressPct}%</span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              progressPct >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-algerian-green to-emerald-400"
            )}
          />
        </div>

        {goalTarget > 0 && remaining === 0 && (
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {language === "ar" ? "تم تحقيق الهدف!" : "Objectif atteint !"}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/mes-citoyens"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-algerian-green px-6 text-[11px] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
        >
          <UsersRound size={18} />
          {language === "ar" ? "إدارة مواطني" : "Gérer mes citoyens"}
          <ArrowUpRight size={16} className={cn(dir === "rtl" && "rotate-180")} />
        </Link>
      </div>

      {!isLoading && recentCitizens.length > 0 && (
        <div className="glass rounded-[28px] border border-white/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500">
            <UsersRound size={16} />
            {language === "ar" ? "آخر المواطنين" : "Derniers citoyens"}
          </h3>
          <ul className="space-y-3">
            {recentCitizens.map((c) => (
              <li
                key={String(c._id || c.id)}
                className="flex items-center justify-between gap-4 border-b border-zinc-100 py-2 last:border-0 dark:border-white/5"
              >
                <span className="font-bold text-zinc-900 dark:text-white">{String(c.full_name || "")}</span>
                <span className="text-end text-[10px] font-black uppercase text-zinc-500">{String(c.nin || "")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
