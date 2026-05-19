"use client";

import { useMemo } from "react";
import {
  Users,
  MapPin,
  Vote,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
  Activity,
  Globe,
  Database,
  Building2,
} from "lucide-react";
import StatCard from "./StatCard";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";
import { useSocket } from "@/lib/hooks/useSocket";
import { useAggregateNational } from "@/lib/hooks/useResults";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { DashboardHeader, DashboardLoading } from "./DashboardShell";
import { BarChartPanel, DonutChartPanel } from "./DashboardCharts";
import { countByWilaya, topChartSeries } from "@/lib/dashboard-scope";

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function SuperAdminDashboard() {
  const {
    wilayasData,
    communesData,
    centersData,
    desksData,
    candidatesData,
    membersData,
    observersData,
    isLoading,
  } = useData();
  const { t, language, dir } = useLanguage();
  const { isConnected, events: socketEvents } = useSocket();
  const { data: aggregateData } = useAggregateNational();
  const { data: notificationsRaw } = useNotifications({ limit: 5 });

  const recentActivity =
    socketEvents.length > 0
      ? socketEvents.slice(0, 4).map((ev) => ({
          id: ev.id,
          type: ev.type,
          title: ev.title,
          bureau: ev.detail || "",
          location: ev.location || "",
          time: ev.time,
        }))
      : notificationsRaw && Array.isArray(notificationsRaw)
        ? notificationsRaw.slice(0, 4).map((n: { _id?: string; id?: string; type?: string; title?: string; body?: string; createdAt?: string }) => ({
            id: n._id || n.id,
            type: n.type === "alert" ? "warning" : "success",
            title: n.title,
            bureau: n.body || "",
            location: "",
            time: formatTimeAgo(new Date(n.createdAt || Date.now())),
          }))
        : [
            {
              id: "1",
              type: "info",
              title: language === "ar" ? "في انتظار البيانات المباشرة..." : "Awaiting live data...",
              bureau: language === "ar" ? "النظام متصل" : "System Connected",
              location: "",
              time: "—",
            },
          ];

  const nationalRate = aggregateData?.total_voters
    ? (
        ((aggregateData.total_voters -
          (aggregateData.total_white || 0) -
          (aggregateData.total_null || 0)) /
          aggregateData.total_voters) *
        100
      ).toFixed(1)
    : "0.0";
  const totalValidated =
    aggregateData?.results?.reduce((sum: number, r: { total_votes: number }) => sum + r.total_votes, 0) || 0;
  const totalDisputes = aggregateData?.total_null || 0;
  const totalPending = aggregateData?.total_white || 0;

  const communesByWilayaChart = useMemo(
    () => topChartSeries(countByWilaya(wilayasData, communesData), 10),
    [wilayasData, communesData]
  );
  const desksByWilayaChart = useMemo(
    () => topChartSeries(countByWilaya(wilayasData, desksData), 10),
    [wilayasData, desksData]
  );
  const candidatesByWilayaChart = useMemo(
    () => topChartSeries(countByWilaya(wilayasData, candidatesData), 10),
    [wilayasData, candidatesData]
  );
  const membersByWilayaChart = useMemo(
    () => topChartSeries(countByWilaya(wilayasData, membersData), 10),
    [wilayasData, membersData]
  );
  const centersByWilayaChart = useMemo(
    () => topChartSeries(countByWilaya(wilayasData, centersData), 10),
    [wilayasData, centersData]
  );

  const infrastructureDonut = useMemo(
    () => [
      {
        label: language === "ar" ? "ولايات" : "Wilayas",
        value: wilayasData.length,
        color: "#006233",
      },
      {
        label: language === "ar" ? "بلديات" : "Communes",
        value: communesData.length,
        color: "#10b981",
      },
      {
        label: language === "ar" ? "مراكز" : "Centres",
        value: centersData.length,
        color: "#6366f1",
      },
      {
        label: language === "ar" ? "مكاتب" : "Bureaux",
        value: desksData.length,
        color: "#f59e0b",
      },
      {
        label: language === "ar" ? "مترشحون" : "Candidats",
        value: candidatesData.length,
        color: "#8b5cf6",
      },
    ],
    [language, wilayasData.length, communesData.length, centersData.length, desksData.length, candidatesData.length]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (isLoading) return <DashboardLoading />;

  return (
    <motion.div className="w-full min-w-0 space-y-10 pb-20">
      <DashboardHeader badge={t("dash.badge")} title={t("dash.title")} subtitle={t("dash.subtitle")} />

      {/* Communes — compact summary (no embedded chart) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex w-full flex-col gap-4 rounded-[28px] border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between md:p-8"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-algerian-green text-white">
            <Building2 size={28} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {language === "ar" ? "البلديات الوطنية" : "Communes nationales"}
            </p>
            <p className="mt-1 text-4xl font-black tabular-nums text-zinc-900 dark:text-white">{communesData.length}</p>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              {language === "ar"
                ? `موزعة على ${wilayasData.length} ولاية`
                : `Réparties sur ${wilayasData.length} wilayas`}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        <StatCard
          title={language === "ar" ? "إجمالي الولايات" : "Total Wilayas"}
          value={wilayasData.length}
          icon={Globe}
          trend={{ value: "100%", isPositive: true }}
          delay={0}
        />
        <StatCard title={t("dash.kpi.desks")} value={desksData.length} icon={Vote} delay={1} />
        <StatCard
          title={language === "ar" ? "الموظفين النشطين" : "Personnel Actif"}
          value={observersData.length + membersData.length}
          icon={Users}
          delay={2}
        />
        <StatCard
          title={language === "ar" ? "المترشحين المسجلين" : "Candidats Inscrits"}
          value={candidatesData.length}
          icon={Flag}
          delay={3}
        />
      </motion.div>

      {/* National statistics — charts */}
      <section className="w-full space-y-4">
        <div className="w-full">
          <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
            {language === "ar" ? "إحصائيات وطنية" : "Statistiques nationales"}
          </h2>
          <p className="mt-1 w-full text-sm font-medium text-zinc-500">
            {language === "ar"
              ? "توزيع البلديات والبنية التحتية والموارد حسب الولايات"
              : "Répartition des communes, de l'infrastructure et des effectifs par wilaya"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarChartPanel
            title={language === "ar" ? "البلديات حسب الولاية" : "Communes par wilaya"}
            subtitle={language === "ar" ? "أعلى الولايات" : "Top wilayas"}
            data={communesByWilayaChart}
            emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
          />
          <DonutChartPanel
            title={language === "ar" ? "البنية التحتية الوطنية" : "Infrastructure nationale"}
            subtitle={language === "ar" ? "نظرة شاملة" : "Vue d'ensemble"}
            data={infrastructureDonut}
            emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarChartPanel
            title={language === "ar" ? "مكاتب التصويت حسب الولاية" : "Bureaux par wilaya"}
            subtitle={language === "ar" ? "أعلى الولايات" : "Top wilayas"}
            data={desksByWilayaChart}
            emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
          />
          <BarChartPanel
            title={language === "ar" ? "المترشحون حسب الولاية" : "Candidats par wilaya"}
            subtitle={language === "ar" ? "أعلى الولايات" : "Top wilayas"}
            data={candidatesByWilayaChart}
            emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarChartPanel
            title={language === "ar" ? "مراكز التصويت حسب الولاية" : "Centres par wilaya"}
            subtitle={language === "ar" ? "أعلى الولايات" : "Top wilayas"}
            data={centersByWilayaChart}
            emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
          />
          <BarChartPanel
            title={language === "ar" ? "الأعضاء النشطون حسب الولاية" : "Membres actifs par wilaya"}
            subtitle={language === "ar" ? "أعلى الولايات" : "Top wilayas"}
            data={membersByWilayaChart}
            emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass relative overflow-hidden rounded-[32px] border-white/5 p-8 lg:col-span-8"
        >
          <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-algerian-green/5 blur-[120px]" />
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  {language === "ar" ? "تقدم عملية المصادقة" : "Progression de la Validation"}
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {language === "ar" ? "مراقبة محاضر النتائج (PV)" : "Surveillance des Procès-Verbaux (PV)"}
                </p>
              </div>
              <button
                type="button"
                className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-algerian-green px-4 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-algerian-green-dark"
              >
                {language === "ar" ? "فتح لوحة التحكم" : "Ouvrir Console"}
                <ArrowUpRight size={16} className={cn(language === "ar" && "rotate-[270deg]")} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <motion.div className="flex flex-col">
                  <span className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    {language === "ar" ? "المعدل الوطني" : "Taux National"}
                  </span>
                  <span className="text-5xl font-black tracking-tighter text-algerian-green dark:text-white">
                    {nationalRate}
                    <span className="text-2xl">%</span>
                  </span>
                </motion.div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${nationalRate}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-algerian-green to-algerian-green-light"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-2">
                {[
                  {
                    label: language === "ar" ? "تمت المصادقة" : "Validés",
                    value: totalValidated.toLocaleString(),
                    color: "text-emerald-500",
                    icon: CheckCircle2,
                  },
                  {
                    label: language === "ar" ? "نزاعات" : "Litiges",
                    value: totalDisputes.toLocaleString(),
                    color: "text-algerian-red",
                    icon: AlertCircle,
                  },
                  {
                    label: language === "ar" ? "في الانتظار" : "Attente",
                    value: totalPending.toLocaleString(),
                    color: "text-amber-500",
                    icon: Clock,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="glass flex flex-col items-center justify-center rounded-2xl border-white/5 p-4 text-center dark:bg-white/5"
                  >
                    <item.icon size={20} className={cn("mb-2 opacity-50", item.color)} />
                    <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {item.label}
                    </span>
                    <span className={cn("text-lg font-black tracking-tight", item.color)}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              <div className="glass flex items-center justify-between rounded-2xl border-white/5 p-6 dark:bg-white/5">
                <div className="flex items-center gap-4">
                  <Database size={24} className="text-zinc-400" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {language === "ar" ? "سلامة البيانات" : "Intégrité des Données"}
                    </p>
                    <p className="text-xl font-black text-zinc-900 dark:text-white">99.98%</p>
                  </div>
                </div>
              </div>
              <div className="glass flex items-center justify-between rounded-2xl border-white/5 p-6 dark:bg-white/5">
                <div className="flex items-center gap-4">
                  <Activity size={24} className="text-zinc-400" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {language === "ar" ? "حمولة النظام" : "Charge Système"}
                    </p>
                    <p className="text-xl font-black text-zinc-900 dark:text-white">24ms</p>
                  </div>
                </div>
                <motion.div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isConnected ? "animate-ping bg-emerald-500" : "bg-zinc-400"
                  )}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass flex flex-col rounded-[32px] border-white/5 p-8 lg:col-span-4"
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{t("dash.recent.title")}</h2>
            <span
              className={cn(
                "rounded-lg border px-2 py-1 text-[10px] font-bold",
                isConnected
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                  : "bg-zinc-50 text-zinc-500 dark:bg-white/5"
              )}
            >
              {language === "ar" ? "مباشر" : "LIVE"}
            </span>
          </div>
          <div className="relative flex-1 space-y-8">
            <div
              className={cn(
                "absolute top-2 bottom-2 w-[2px] bg-zinc-100 dark:bg-white/5",
                dir === "rtl" ? "right-[9px]" : "left-[9px]"
              )}
            />
            {recentActivity.map((activity) => (
              <motion.div key={activity.id} className="relative z-10 flex gap-4 pl-6">
                <motion.div
                  className={cn(
                    "absolute top-1 h-3 w-3 rounded-full border-2 border-white dark:border-[#09090b]",
                    dir === "rtl" ? "right-0" : "left-0",
                    activity.type === "success"
                      ? "bg-emerald-500"
                      : activity.type === "warning"
                        ? "bg-algerian-red"
                        : "bg-blue-500"
                  )}
                />
                <div>
                  <p className="text-[13px] font-black text-zinc-900 dark:text-white">{activity.title}</p>
                  <p className="text-[11px] font-bold uppercase text-zinc-500">{activity.bureau}</p>
                  {activity.location && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-zinc-400">
                      <MapPin size={10} /> {activity.location}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
