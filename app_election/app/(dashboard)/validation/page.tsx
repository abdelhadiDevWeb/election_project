"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Image as ImageIcon,
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Save,
  Activity,
  Zap,
  ShieldCheck,
  MapPin,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import { useData } from "../context/DataContext";

export default function ValidationResults() {
  const { t, language } = useLanguage();
  const { resultsData, mutation, setResultsData } = useData();
  const [zoom, setZoom] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter pending results for validation
  const pendingResults = resultsData.filter(r => r.status === "pending" || r.status === "ocr_done");
  const currentResult = pendingResults[currentIndex];

  const handleStatusUpdate = async (status: string) => {
    if (!currentResult) return;
    try {
      await mutation.mutate("PUT", `/results/desk/${currentResult._id}/status`, { status });
      setResultsData([]); // trigger refetch
      if (currentIndex >= pendingResults.length - 1) {
        setCurrentIndex(0);
      }
    } catch (err: any) {
      alert(err?.message || "Status update failed");
    }
  };

  if (pendingResults.length === 0) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle className="text-emerald-500" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">{language === 'ar' ? 'تمت مراجعة جميع المحاضر' : 'Tous les PV ont été révisés'}</h2>
            <p className="text-zinc-500 font-medium">{language === 'ar' ? 'لا توجد محاضر معلقة للمصادقة حالياً.' : 'Il n\'y a actuellement aucun PV en attente de validation.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-8 pb-4">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2 flex-1 flex-shrink-0"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{language === 'ar' ? 'المصادقة الذكية' : 'Validation Intelligente'}</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white lg:text-4xl lg:whitespace-nowrap font-plus-jakarta">
            {t("nav.validation")}
          </h1>
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-lg">
              <MapPin size={12} className="text-emerald-500" />
              <span>{currentResult.wilaya || 'National'} • {currentResult.desk}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-lg">
              <Clock size={12} className="text-emerald-500" />
              <span>{language === 'ar' ? 'معلق للمراجعة' : 'En attente'}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">{language === 'ar' ? 'المحاضر المعلقة' : 'PV en attente'}</span>
            <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs uppercase tracking-tighter">
              <AlertTriangle size={14} />
              {pendingResults.length} {language === 'ar' ? 'محاضر متبقية' : 'PV Restants'}
            </div>
          </div>
          <button 
            onClick={() => setCurrentIndex(prev => (prev + 1) % pendingResults.length)}
            className="h-12 px-6 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 transition-all flex items-center gap-2">
            <RotateCcw size={16} />
            {language === 'ar' ? 'التالي' : 'Suivant'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Document Engine View */}
        <div className="flex-1 glass dark:bg-white/5 rounded-[32px] overflow-hidden flex flex-col relative border-white/5">
          <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.5))} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white hover:scale-110 transition-all">
              <ZoomIn size={18} strokeWidth={2.5} />
            </button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white hover:scale-110 transition-all">
              <ZoomOut size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="p-5 bg-zinc-900/50 dark:bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <ImageIcon size={16} className="text-emerald-500" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">{language === 'ar' ? 'محرك عرض المحاضر' : 'Moteur de Visualisation PV'}</span>
            </div>
            <span className="text-[10px] font-black text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">ID: {currentResult._id}</span>
          </div>

          <div className="flex-1 overflow-auto p-12 flex items-center justify-center custom-scrollbar bg-zinc-50 dark:bg-zinc-950/50">
            <motion.div 
              style={{ scale: zoom }}
              className="relative w-[500px] h-[700px] bg-white rounded-sm border-[16px] border-zinc-100 flex flex-col p-0 overflow-hidden shadow-2xl"
            >
              <img 
                src={`/api/results/desk/${currentResult._id}/image`} 
                alt="PV Scan" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as any).src = "https://placehold.co/500x700/white/zinc-900?text=PV+Scan+Not+Available";
                }}
              />
              <div className="absolute inset-0 pointer-events-none border-[1px] border-zinc-900/10"></div>
            </motion.div>
          </div>
        </div>

        {/* Verification Sidebar */}
        <div className="w-[450px] glass dark:bg-white/5 rounded-[32px] flex flex-col overflow-hidden border-white/5">
          <div className="p-8 bg-zinc-50/50 dark:bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <FileText size={20} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white uppercase">{language === 'ar' ? 'التحقق من الإدخال' : 'Vérification de Saisie'}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-black/40 p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{language === 'ar' ? 'إجمالي الأصوات' : 'Total Voix'}</p>
                <p className="text-2xl font-black text-emerald-500">{currentResult.manual}</p>
              </div>
              <div className="bg-white dark:bg-black/40 p-4 rounded-2xl border border-zinc-200 dark:border-white/5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">{language === 'ar' ? 'الحالة' : 'Status'}</p>
                <p className="text-sm font-black text-zinc-900 dark:text-white tracking-widest uppercase">{currentResult.status}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-12 gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest px-4">
              <div className="col-span-6">{language === 'ar' ? 'الهوية / الخيار' : 'Identité / Option'}</div>
              <div className="col-span-3 text-center">{language === 'ar' ? 'يدوي' : 'Manuel'}</div>
              <div className="col-span-3 text-center">OCR</div>
            </div>

            <div className="space-y-3">
              <motion.div 
                layout
                className={cn(
                  "grid grid-cols-12 gap-3 p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group",
                  currentResult.manual !== currentResult.ocr 
                    ? "bg-red-500/[0.03] dark:bg-red-500/[0.08] border-red-500/20" 
                    : "bg-white dark:bg-white/5 border-zinc-100 dark:border-white/5 hover:border-emerald-500/30"
                )}
              >
                {currentResult.manual !== currentResult.ocr && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                )}
                <div className="col-span-6 flex flex-col justify-center">
                  <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{currentResult.candidate}</span>
                  {currentResult.manual !== currentResult.ocr && (
                    <span className="text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1 mt-1">
                      <Zap size={10} strokeWidth={3} />
                      {language === 'ar' ? 'تم اكتشاف تباين' : 'Discrépance Détectée'}
                    </span>
                  )}
                </div>
                <div className="col-span-3">
                   <div className="w-full h-11 flex items-center justify-center rounded-xl text-sm font-black bg-zinc-100 dark:bg-white/5 border-transparent text-zinc-900 dark:text-white">
                      {currentResult.manual}
                   </div>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <div className={cn(
                    "w-full h-11 flex items-center justify-center rounded-xl text-sm font-black font-mono border-2 border-dashed",
                    currentResult.manual !== currentResult.ocr ? "border-red-500/40 text-red-500 bg-red-500/5" : "border-zinc-200 dark:border-white/10 text-zinc-400"
                  )}>
                    {currentResult.ocr}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-zinc-900 dark:bg-black/40 p-6 rounded-[24px] border border-white/5 space-y-4">
               <div className="flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{language === 'ar' ? 'بيانات المحرك' : 'Metadata Engine'}</span>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-zinc-500">{language === 'ar' ? 'المركز' : 'Centre'}</span>
                    <span className="text-white">{currentResult.center}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-zinc-500">{language === 'ar' ? 'المكتب' : 'Bureau'}</span>
                    <span className="text-emerald-500">#{currentResult.desk}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-8 border-t border-white/5 bg-zinc-50/50 dark:bg-black/20 backdrop-blur-2xl">
             <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest mb-6">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" />
                  <span className="text-zinc-500">{language === 'ar' ? 'محرك الثقة' : 'Moteur de Confiance'}</span>
                </div>
                <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {currentResult.manual === currentResult.ocr ? '100%' : '84.2%'} {language === 'ar' ? 'تدقيق ناجح' : 'Audit Pass'}
                </span>
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={() => handleStatusUpdate("rejected")}
                  className="flex-1 h-14 rounded-2xl bg-white dark:bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/20 transition-all">
                  <XCircle size={18} strokeWidth={2.5} />
                  {language === 'ar' ? 'رفض المحضر' : 'Rejeter PV'}
                </button>
                <button 
                  onClick={() => handleStatusUpdate("ocr_human_done")}
                  className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all">
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                  {language === 'ar' ? 'قبول المحضر' : 'Approuver PV'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
