"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Flag, MapPin, Users, Vote } from "lucide-react";
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
  const { communesData, desksData, membersData, candidatesData, centersData, isLoading } = useData();

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
        label: language === "ar" ? "مترشحون" : "Candidats",
        value: candidatesData.length,
        color: "#006233",
      },
      {
        label: language === "ar" ? "أعضاء نشطون" : "Membres actifs",
        value: membersData.length,
        color: "#6366f1",
      },
      {
        label: language === "ar" ? "مكاتب التصويت" : "Bureaux",
        value: scopedDesks.length,
        color: "#f59e0b",
      },
    ],
    [language, candidatesData.length, membersData.length, scopedDesks.length]
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <StatCard
          title={language === "ar" ? "أعضاء نشطون" : "Membres actifs"}
          value={membersData.length}
          icon={Users}
          delay={0}
        />
        <StatCard
          title={language === "ar" ? "مكاتب التصويت" : "Bureaux de vote"}
          value={scopedDesks.length}
          icon={Vote}
          delay={1}
        />
        <StatCard
          title={language === "ar" ? "المترشحون" : "Candidats"}
          value={candidatesData.length}
          icon={Flag}
          delay={2}
        />
        <StatCard
          title={language === "ar" ? "مراكز التصويت" : "Centres de vote"}
          value={scopedCenters.length}
          icon={Building2}
          delay={3}
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

      {membersData.length > 0 && (
        <div className="glass rounded-[28px] p-6 border border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
            <Users size={16} />
            {language === "ar" ? "الأعضاء النشطون" : "Membres actifs"}
          </h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {membersData.slice(0, 12).map((m) => (
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

      <motion.div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 w-fit">
        <MapPin size={16} className="text-algerian-green shrink-0" />
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
          {language === "ar" ? "الولاية" : "Wilaya"} : {wilayaName}
        </span>
      </motion.div>
    </div>
  );
}
