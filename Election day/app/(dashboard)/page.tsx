"use client";

import { motion } from "framer-motion";
import { Vote, Camera, Building2, Users, ClipboardCheck, MapPin, BarChart3 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { isBureau, isCentre } from "@/lib/auth-user";
import { useQuery } from "@/lib/hooks/useApi";
import Link from "next/link";
import type { ICenter, IDesk, IResultDesk } from "@/lib/types";

export default function DashboardHome() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  if (isBureau(user)) return <BureauHome />;
  if (isCentre(user)) return <CentreHome />;
  return null;
}

// ── Bureau Home ──────────────────────────────────────────────────
function BureauHome() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const { data: deskData } = useQuery<IDesk>(
    user?.desk_id ? `/desks/${user.desk_id}` : null
  );
  const { data: centerData } = useQuery<ICenter>(
    user?.center_id ? `/centers/${user.center_id}` : null
  );
  const { data: myResults } = useQuery<IResultDesk[]>(
    "/results/desk",
    { owner: user?.id, limit: 100 }
  );

  const desk = (deskData as any)?.data ?? deskData;
  const center = (centerData as any)?.data ?? centerData;
  const results = Array.isArray(myResults) ? myResults : (myResults as any)?.data || [];
  const submittedCount = results.length;

  const stats = [
    {
      label: language === "ar" ? "المكتب المعيّن" : "Bureau Assigné",
      value: desk ? `N°${desk.desk_number}` : "—",
      icon: ClipboardCheck,
      color: "text-emerald-500",
    },
    {
      label: language === "ar" ? "المركز" : "Centre",
      value: center?.name || "—",
      icon: MapPin,
      color: "text-blue-500",
    },
    {
      label: language === "ar" ? "نتائج مرسلة" : "Résultats Soumis",
      value: submittedCount,
      icon: BarChart3,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <Vote size={12} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
            {language === "ar" ? "مراقب المكتب" : "Observateur Bureau"}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta">
          {t("nav.overview")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-none">
          {language === "ar"
            ? "مرحباً بك في واجهة المراقبة. يمكنك إدخال الأصوات وتصوير محضر الفرز."
            : "Bienvenue sur votre interface d'observation. Saisissez les votes et photographiez le procès-verbal."}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass dark:bg-white/5 rounded-2xl border-white/10 flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-none">{stat.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/votes">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="p-8 glass dark:bg-white/5 rounded-3xl border border-white/10 cursor-pointer group hover:border-emerald-500/30 transition-all"
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
              <Vote size={28} />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
              {language === "ar" ? "إدخال الأصوات" : "Saisir les Votes"}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {language === "ar"
                ? "عرض الأحزاب والمرشحين وإدخال عدد الأصوات لكل مرشح"
                : "Voir les partis et candidats, saisir le nombre de votes pour chaque candidat"}
            </p>
          </motion.div>
        </Link>

        <Link href="/pv-capture">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="p-8 glass dark:bg-white/5 rounded-3xl border border-white/10 cursor-pointer group hover:border-blue-500/30 transition-all"
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
              <Camera size={28} />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
              {language === "ar" ? "صورة المحضر" : "Photo du PV"}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {language === "ar"
                ? "التقاط صورة لمحضر الفرز وإرسالها إلى النظام المركزي"
                : "Photographier le procès-verbal de dépouillement et l'envoyer au système central"}
            </p>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

// ── Centre Home ──────────────────────────────────────────────────
function CentreHome() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const { data: centerData } = useQuery<ICenter>(
    user?.center_id ? `/centers/${user.center_id}` : null
  );
  const { data: desksRaw } = useQuery<IDesk[]>(
    "/desks",
    { center: user?.center_id, limit: 500 }
  );

  const center = (centerData as any)?.data ?? centerData;
  const desks: IDesk[] = Array.isArray(desksRaw) ? desksRaw : (desksRaw as any)?.data || [];

  const maleDesks = desks.filter((d) => d.type === "male").length;
  const femaleDesks = desks.filter((d) => d.type === "female").length;
  const totalDesks = desks.length;

  const stats = [
    {
      label: language === "ar" ? "إجمالي المكاتب" : "Total Bureaux",
      value: totalDesks || center?.number_of_desks || 0,
      icon: Building2,
      color: "text-emerald-500",
    },
    {
      label: language === "ar" ? "مكاتب الذكور" : "Bureaux Hommes",
      value: maleDesks,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: language === "ar" ? "مكاتب الإناث" : "Bureaux Femmes",
      value: femaleDesks,
      icon: Users,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
          <Building2 size={12} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
            {language === "ar" ? "مراقب المركز" : "Observateur Centre"}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta">
          {center?.name || t("nav.overview")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-none">
          {language === "ar"
            ? "نظرة عامة على مركز التصويت الخاص بك: عدد المكاتب والنتائج حسب الأحزاب."
            : "Vue d'ensemble de votre centre de vote : nombre de bureaux et résultats par parti."}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass dark:bg-white/5 rounded-2xl border-white/10 flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white leading-none">{stat.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" strokeWidth={2.5} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action */}
      <Link href="/centre-overview">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="p-8 glass dark:bg-white/5 rounded-3xl border border-white/10 cursor-pointer group hover:border-blue-500/30 transition-all"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
            <BarChart3 size={28} />
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">
            {language === "ar" ? "النتائج حسب الحزب" : "Résultats par Parti"}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {language === "ar"
              ? "عرض الأصوات المجمعة لكل حزب ومرشح في مركزك"
              : "Voir les votes agrégés par parti et candidat dans votre centre"}
          </p>
        </motion.div>
      </Link>
    </div>
  );
}
