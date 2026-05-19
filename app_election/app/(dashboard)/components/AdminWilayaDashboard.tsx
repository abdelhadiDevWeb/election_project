"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Flag, MapPin, Users, Vote, UsersRound } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAggregateByWilaya } from "@/lib/hooks/useResults";
import StatCard from "./StatCard";
import { BarChartPanel, DonutChartPanel } from "./DashboardCharts";
import { DashboardHeader, DashboardLoading, ScopeBanner } from "./DashboardShell";
import { countByCommune, matchWilaya, topChartSeries } from "@/lib/dashboard-scope";

export default function AdminWilayaDashboard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const {
    wilayasData,
    communesData,
    desksData,
    membersData,
    candidatesData,
    centersData,
    citizensData,
    isLoading,
  } = useData();
  const { data: aggregateWilaya } = useAggregateByWilaya(user?.wilaya_id ?? null);

  const wilayaId = user?.wilaya_id || "";
  const wilayaName =
    wilayasData[0]?.name || wilayasData[0]?.name_fr || (language === "ar" ? "ولايتك" : "Votre wilaya");

  const scopedDesks = useMemo(
    () => desksData.filter((d) => matchWilaya(d.wilaya_id, wilayaId)),
    [desksData, wilayaId]
  );
  const scopedMembers = useMemo(
    () => membersData.filter((m) => matchWilaya(m.wilaya_id, wilayaId)),
    [membersData, wilayaId]
  );
  const scopedCenters = useMemo(
    () => centersData.filter((c) => matchWilaya(c.wilaya_id, wilayaId)),
    [centersData, wilayaId]
  );
  const scopedCandidates = useMemo(
    () => candidatesData.filter((c) => matchWilaya(c.wilaya_id, wilayaId)),
    [candidatesData, wilayaId]
  );
  const scopedCitizens = useMemo(
    () => citizensData.filter((c) => matchWilaya(c.wilaya_id, wilayaId)),
    [citizensData, wilayaId]
  );

  const candidatsByCommune = useMemo(
    () => topChartSeries(countByCommune(communesData, scopedCandidates, "candidates")),
    [communesData, scopedCandidates]
  );
  const desksByCommune = useMemo(
    () => topChartSeries(countByCommune(communesData, scopedDesks, "desks")),
    [communesData, scopedDesks]
  );
  const membersByCommune = useMemo(
    () => topChartSeries(countByCommune(communesData, scopedMembers, "members")),
    [communesData, scopedMembers]
  );
  const citizensByCommune = useMemo(
    () => topChartSeries(countByCommune(communesData, scopedCitizens, "members")),
    [communesData, scopedCitizens]
  );

  const donutElectoral = useMemo(
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

  const participationRate = aggregateWilaya?.total_voters
    ? (
        ((aggregateWilaya.total_voters -
          (aggregateWilaya.total_white || 0) -
          (aggregateWilaya.total_null || 0)) /
          aggregateWilaya.total_voters) *
        100
      ).toFixed(1)
    : null;

  if (isLoading) return <DashboardLoading />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <DashboardHeader
        badge={language === "ar" ? "نطاق الولاية" : "Périmètre wilaya"}
        title={t("dash.title")}
        subtitle={
          language === "ar"
            ? `إحصائيات ولاية ${wilayaName} — بلديات، مكاتب التصويت، أعضاء ومترشحون.`
            : `Statistiques de la wilaya ${wilayaName} — communes, bureaux de vote, membres et candidats.`
        }
      />

      <ScopeBanner
        label={language === "ar" ? "الولاية" : "Wilaya"}
        value={wilayaName}
        hint={
          language === "ar"
            ? `${communesData.length} بلدية · ${scopedDesks.length} مكتب`
            : `${communesData.length} communes · ${scopedDesks.length} bureaux de vote`
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
          title={language === "ar" ? "البلديات" : "Communes"}
          value={communesData.length}
          icon={Building2}
          delay={1}
        />
        <StatCard
          title={language === "ar" ? "مكاتب التصويت" : "Bureaux de vote"}
          value={scopedDesks.length}
          icon={Vote}
          delay={2}
        />
        <StatCard
          title={language === "ar" ? "أعضاء نشطون" : "Membres actifs"}
          value={scopedMembers.length}
          icon={Users}
          delay={3}
        />
        <StatCard
          title={language === "ar" ? "المترشحون" : "Candidats"}
          value={scopedCandidates.length}
          icon={Flag}
          delay={4}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartPanel
          title={language === "ar" ? "المواطنون حسب البلدية" : "Citoyens par commune"}
          subtitle={language === "ar" ? "توزيع المواطنين" : "Répartition des citoyens"}
          data={citizensByCommune}
          emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
        />
        <BarChartPanel
          title={language === "ar" ? "المترشحون حسب البلدية" : "Candidats par commune"}
          subtitle={language === "ar" ? "أعلى البلديات" : "Top communes"}
          data={candidatsByCommune}
          emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChartPanel
          title={language === "ar" ? "توزيع الموارد" : "Répartition des effectifs"}
          subtitle={language === "ar" ? "في الولاية" : "Dans la wilaya"}
          data={donutElectoral}
        />
        <BarChartPanel
          title={language === "ar" ? "مكاتب التصويت حسب البلدية" : "Bureaux par commune"}
          data={desksByCommune}
          emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartPanel
          title={language === "ar" ? "الأعضاء النشطون حسب البلدية" : "Membres actifs par commune"}
          data={membersByCommune}
          emptyLabel={language === "ar" ? "لا توجد بيانات" : "Aucune donnée"}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
          <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col justify-center min-h-[110px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <MapPin size={12} className="text-zinc-500" />
              {language === "ar" ? "مراكز التصويت" : "Centres de vote"}
            </p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white mt-2 tabular-nums">
              {scopedCenters.length}
            </p>
          </div>
          {participationRate != null && (
            <div className="glass rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-center min-h-[110px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {language === "ar" ? "مشاركة الولاية (نتائج)" : "Participation wilaya (résultats)"}
              </p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{participationRate}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
