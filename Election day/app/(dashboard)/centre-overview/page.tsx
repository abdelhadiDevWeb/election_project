"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Calendar,
  Layers,
  MapPin,
  ClipboardList,
  BadgeAlert,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useData } from "../context/DataContext";
import StatCard from "../components/StatCard";

export default function CentreOverviewPage() {
  const { language } = useLanguage();
  const { myCenter, centerDesks, centerStats, loadingCenter } = useData();

  if (loadingCenter) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            {language === "ar" ? "جاري التحميل…" : "Chargement…"}
          </span>
        </div>
      </div>
    );
  }

  if (!myCenter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 glass rounded-3xl border border-zinc-200 dark:border-white/10">
        <BadgeAlert className="w-12 h-12 text-zinc-400 mb-4" />
        <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">
          {language === "ar" ? "مركز غير محدد" : "Aucun centre assigné"}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm">
          {language === "ar"
            ? "لم يتم العثور على معلومات المركز الانتخابي المرتبط بحسابك."
            : "Aucune information de centre n'a pu être trouvée pour votre compte."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <Building2 size={12} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
            {language === "ar" ? "معلومات المركز" : "Aperçu du Centre"}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta">
          {myCenter.name}
        </h1>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-zinc-500 uppercase tracking-wider items-center">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-zinc-400" />
            {myCenter.address || (language === "ar" ? "الجزائر" : "Algérie")}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="flex items-center gap-1">
            <Layers size={14} className="text-zinc-400" />
            {language === "ar" ? "مكاتب التصويت" : "Bureaux associés"}
          </span>
        </div>
      </motion.div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={language === "ar" ? "إجمالي المكاتب" : "Total Bureaux"}
          value={centerStats?.totalDesks ?? 0}
          icon={Building2}
          delay={1}
        />
        <StatCard
          title={language === "ar" ? "مكاتب رجال" : "Bureaux Hommes"}
          value={centerStats?.maleDesksCount ?? 0}
          icon={Building2}
          delay={2}
          className="border-emerald-500/10"
        />
        <StatCard
          title={language === "ar" ? "مكاتب نساء" : "Bureaux Femmes"}
          value={centerStats?.femaleDesksCount ?? 0}
          icon={Building2}
          delay={3}
          className="border-rose-500/10"
        />
      </div>

      {/* Bureaux List Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white font-plus-jakarta flex items-center gap-2">
              <ClipboardList size={20} className="text-emerald-500" />
              {language === "ar" ? "قائمة مكاتب التصويت" : "Liste des Bureaux de Vote"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {language === "ar"
                ? "مكاتب التصويت التابعة لمركزك والتوزيع الجغرافي للناخبين"
                : "Bureaux de vote rattachés à votre centre et répartition par genre."}
            </p>
          </div>
        </div>

        {centerDesks.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-sm font-bold glass rounded-3xl border border-zinc-200 dark:border-white/10">
            {language === "ar" ? "لا توجد مكاتب مسجلة" : "Aucun bureau enregistré pour ce centre."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {centerDesks.map((desk, idx) => {
              const isMale = desk.type === "male";
              return (
                <motion.div
                  key={desk.id || desk._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="glass dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl p-5 space-y-4 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-sm">
                        {desk.desk_number}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                          {language === "ar" ? `مكتب رقم ${desk.desk_number}` : `Bureau N° ${desk.desk_number}`}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          {language === "ar" ? "مكتب تصويت" : "Bureau de scrutin"}
                        </p>
                      </div>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                      isMale 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}>
                      {isMale ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {language === "ar" ? "رجال" : "Hommes"}
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {language === "ar" ? "نساء" : "Femmes"}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-bold flex items-center gap-1">
                      <Users size={14} className="text-zinc-400" />
                      {language === "ar" ? "الهيئة الناخبة" : "Votants inscrits"}
                    </span>
                    <span className="font-black text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/5">
                      {desk.total_voters?.toLocaleString() || 0}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
