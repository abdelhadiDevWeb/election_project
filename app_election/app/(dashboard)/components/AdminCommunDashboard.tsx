"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Flag, MapPin, Users, Vote, UsersRound } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import StatCard from "./StatCard";
import { BarChartPanel, DonutChartPanel } from "./DashboardCharts";
import { DashboardHeader, DashboardLoading, ScopeBanner } from "./DashboardShell";
import { matchCommune } from "@/lib/dashboard-scope";

export default function AdminCommunDashboard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { communesData, desksData, membersData, candidatesData, centersData, citizensData, isLoading } = useData();

  const communeId = user?.commune_id || "";
  const communeRecord = useMemo(
    () => communesData.find((c) => String(c._id || c.id) === String(communeId)),
    [communesData, communeId]
  );
  const communeName = communeRecord?.name || communeRecord?.name_fr || "—";
  const wilayaName = communeRecord?.wilaya || "—";

  const scopedDesks = useMemo(
    () => desksData.filter((d) => matchCommune(d.commune_id, communeId)),
    [desksData, communeId]
  );
  const scopedCenters = useMemo(
    () => centersData.filter((c) => matchCommune(c.commune_id, communeId)),
    [centersData, communeId]
  );
  const scopedMembers = useMemo(
    () => membersData.filter((m) => matchCommune(m.commune_id, communeId)),
    [membersData, communeId]
  );
  const scopedCandidates = useMemo(
    () => candidatesData.filter((c) => matchCommune(c.commune_id, communeId)),
    [candidatesData, communeId]
  );
  const scopedCitizens = useMemo(
    () => citizensData.filter((c) => matchCommune(c.commune_id, communeId)),
    [citizensData, communeId]
  );

  const desksByCenter = useMemo(() => {
    const map = new Map<string, number>();
    scopedDesks.forEach((d) => {
      const label = String(d.center || language === "ar" ? "مركز" : "Centre");
      map.set(label, (map.get(label) || 0) + 1);
    });
    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [scopedDesks, language]);

  const donutLocal = useMemo(
    () => [
      {
        label: language === "ar" ? "مواطنون" : "Citoyens",
        value: scopedCitizens.length,
        color: "#10b981",
      },
      {
        label: language === "ar" ? "مترشحون" : "Candidats",
        value: scopedCandidates.length,
        color: "#006233",
      },
      {
        label: language === "ar" ? "أعضاء نشطون" : "Membres actifs",
        value: scopedMembers.length,
        color: "#6366f1",
      },
      {
        label: language === "ar" ? "مكاتب التصويت" : "Bureaux",
        value: scopedDesks.length,
        color: "#f59e0b",
      },
    ],
    [language, scopedCandidates.length, scopedMembers.length, scopedDesks.length, scopedCitizens.length]
  );

  if (isLoading) return <DashboardLoading />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <DashboardHeader
        badge={language === "ar" ? "نطاق البلدية" : "Périmètre communal"}
        title={t("dash.title")}
        subtitle={
          language === "ar"
            ? `إحصائيات بلدية ${communeName} — أعضاء نشطون، مكاتب التصويت ومترشحون.`
            : `Statistiques de la commune ${communeName} — membres, bureaux et candidats.`
        }
      />

      <ScopeBanner
        label={language === "ar" ? "البلدية" : "Commune"}
        value={communeName}
        hint={
          language === "ar"
            ? `ولاية ${wilayaName}`
            : `Wilaya : ${wilayaName}`
        }
      />

      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
      >
        <StatCard
          title={language === "ar" ? "مواطنون مسجلون" : "Citoyens enregistrés"}
          value={scopedCitizens.length}
          icon={UsersRound}
          delay={0}
        />
        <StatCard
          title={language === "ar" ? "أعضاء نشطون" : "Membres actifs"}
          value={scopedMembers.length}
          icon={Users}
          delay={1}
        />
        <StatCard
          title={language === "ar" ? "مكاتب التصويت" : "Bureaux de vote"}
          value={scopedDesks.length}
          icon={Vote}
          delay={2}
        />
        <StatCard
          title={language === "ar" ? "المترشحون" : "Candidats"}
          value={scopedCandidates.length}
          icon={Flag}
          delay={3}
        />
        <StatCard
          title={language === "ar" ? "مراكز التصويت" : "Centres de vote"}
          value={scopedCenters.length}
          icon={Building2}
          delay={4}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChartPanel
          title={language === "ar" ? "توزيع محلي" : "Répartition locale"}
          subtitle={communeName}
          data={donutLocal}
        />
        <BarChartPanel
          title={language === "ar" ? "مكاتب التصويت حسب المركز" : "Bureaux par centre"}
          data={desksByCenter}
          emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scopedMembers.length > 0 && (
          <div className="glass rounded-[28px] p-6 border border-white/5 flex flex-col h-full min-h-[250px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <Users size={16} className="text-indigo-500" />
              {language === "ar" ? "الأعضاء النشطون" : "Membres actifs"}
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar flex-1">
              {scopedMembers.slice(0, 12).map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-4 py-2 border-b border-zinc-100 dark:border-white/5 last:border-0"
                >
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">{m.name}</span>
                  <span className="text-[10px] font-black uppercase text-zinc-500">{m.party}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {scopedCitizens.length > 0 && (
          <div className="glass rounded-[28px] p-6 border border-white/5 flex flex-col h-full min-h-[250px]">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
              <UsersRound size={16} className="text-emerald-500" />
              {language === "ar" ? "آخر المواطنين المسجلين" : "Derniers citoyens enregistrés"}
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar flex-1">
              {scopedCitizens.slice(0, 5).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-4 py-2 border-b border-zinc-100 dark:border-white/5 last:border-0"
                >
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white text-sm">{c.full_name}</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {language === "ar" ? `بواسطة ${c.added_by || "الإدارة"}` : `Par ${c.added_by || "Administration"}`}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-500">{c.nin}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <motion.div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 w-fit">
        <MapPin size={16} className="text-algerian-green shrink-0" />
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
          {language === "ar" ? "الولاية" : "Wilaya"} : {wilayaName}
        </span>
      </motion.div>
    </div>
  );
}
