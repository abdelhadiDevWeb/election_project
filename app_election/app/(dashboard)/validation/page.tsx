"use client";

import { useState } from "react";
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

const mockPVData = [
  { id: "PV-1029-A", candidate: "Abdelmadjid Tebboune", manual: 450, ocr: 450, status: "matched" },
  { id: "PV-1029-B", candidate: "Youcef Aouchiche", manual: 120, ocr: 125, status: "mismatch" },
  { id: "PV-1029-C", candidate: "Ali Benflis", manual: 85, ocr: 85, status: "matched" },
  { id: "PV-1029-D", candidate: "Votes Blancs", manual: 12, ocr: 12, status: "matched" },
  { id: "PV-1029-E", candidate: "Votes Nuls", manual: 5, ocr: 8, status: "mismatch" },
];

export default function ValidationResults() {
  const [selectedPV, setSelectedPV] = useState(mockPVData);
  const [zoom, setZoom] = useState(1);

  const handleUpdateManual = (id: string, value: string) => {
    const val = parseInt(value) || 0;
    setSelectedPV(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, manual: val, status: val === p.ocr ? "matched" : "mismatch" };
      }
      return p;
    }));
  };

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
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Validation Intelligente</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white lg:text-5xl lg:whitespace-nowrap">
            Saisie & Audit PV
          </h1>
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-lg">
              <MapPin size={12} className="text-emerald-500" />
              <span>Alger • 16001</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-lg">
              <Clock size={12} className="text-emerald-500" />
              <span>Dernier Scan: 14:32</span>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Intégrité OCR</span>
            <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs uppercase tracking-tighter">
              <AlertTriangle size={14} />
              2 Écarts Détectés
            </div>
          </div>
          <button className="h-12 px-6 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 transition-all flex items-center gap-2">
            <RotateCcw size={16} />
            Réinitialiser
          </button>
          <button className="h-12 px-6 rounded-2xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2">
            <Save size={16} />
            Confirmer l'Audit
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Document Engine View */}
        <div className="flex-1 glass dark:bg-white/5 rounded-[32px] overflow-hidden flex flex-col relative border-white/5 shadow-2xl">
          <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.5))} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white hover:scale-110 transition-all">
              <ZoomIn size={18} strokeWidth={2.5} />
            </button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white hover:scale-110 transition-all">
              <ZoomOut size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="p-5 bg-zinc-900/50 dark:bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <ImageIcon size={16} className="text-emerald-500" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">Moteur de Visualisation PV</span>
            </div>
            <span className="text-[10px] font-black text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">PV_2024_AUDIT_16.SCAN</span>
          </div>

          <div className="flex-1 overflow-auto p-12 flex items-center justify-center custom-scrollbar bg-zinc-50 dark:bg-zinc-950/50">
            <motion.div 
              style={{ scale: zoom }}
              className="relative w-[500px] h-[700px] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rounded-sm border-[16px] border-zinc-100 flex flex-col p-12 space-y-10"
            >
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-zinc-900 pb-6 space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900">الجمهورية الجزائرية الديمقراطية الشعبية</h4>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Autorité Nationale Indépendante des Élections</p>
                <div className="h-6 w-6 mx-auto rounded-full border-4 border-zinc-900 mt-2"></div>
              </div>

              <div className="text-center">
                <h3 className="font-serif text-xl font-black border-2 border-zinc-900 px-6 py-2 w-fit mx-auto uppercase">PV de Scrutin</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase border-2 border-zinc-900 p-4 rounded-md">
                <div className="space-y-1.5">
                  <p className="flex justify-between">Wilaya: <span className="text-emerald-600">Alger (16)</span></p>
                  <p className="flex justify-between">Commune: <span>Sidi M'hamed</span></p>
                </div>
                <div className="space-y-1.5">
                  <p className="flex justify-between">Centre: <span>Pasteur</span></p>
                  <p className="flex justify-between">Bureau: <span className="text-emerald-600">008</span></p>
                </div>
              </div>
              
              <div className="flex-1 border-2 border-zinc-900 p-4 space-y-6">
                 <div className="flex justify-between font-black text-[10px] uppercase border-b-2 border-zinc-900 pb-2">
                    <span>Option / Candidat</span>
                    <span>Voix</span>
                 </div>
                 <div className="space-y-3">
                   {mockPVData.map((p, i) => (
                     <div key={i} className="flex justify-between items-end border-b border-zinc-200 pb-1">
                        <span className="text-[11px] font-black text-zinc-900">{p.candidate}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black border-2 border-zinc-900 px-3 py-1 bg-zinc-50">{p.manual}</span>
                          <div className="h-4 w-4 rounded-full bg-zinc-100 border border-zinc-300"></div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-zinc-200">
                 <div className="h-12 w-28 border-2 border-dashed border-zinc-300 flex items-center justify-center text-[10px] font-black text-zinc-300 uppercase rotate-12">Sceau ANIE</div>
                 <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-black uppercase text-zinc-400">Président du Bureau</span>
                    <div className="h-10 w-24 border-b-2 border-zinc-900 font-serif text-sm flex items-end justify-center italic text-zinc-400">Signature</div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Verification Sidebar */}
        <div className="w-[450px] glass dark:bg-white/5 rounded-[32px] flex flex-col overflow-hidden border-white/5 shadow-2xl">
          <div className="p-8 bg-zinc-50/50 dark:bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <FileText size={20} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white uppercase">Vérification de Saisie</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-black/40 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-inner">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Total Voix</p>
                <p className="text-2xl font-black text-emerald-500">672</p>
              </div>
              <div className="bg-white dark:bg-black/40 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-inner">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Inscrits</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">800</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-12 gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest px-4">
              <div className="col-span-6">Identité / Option</div>
              <div className="col-span-3 text-center">Manuel</div>
              <div className="col-span-3 text-center">OCR</div>
            </div>

            <div className="space-y-3">
              {selectedPV.map((pv) => (
                <motion.div 
                  layout
                  key={pv.id}
                  className={cn(
                    "grid grid-cols-12 gap-3 p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group",
                    pv.status === 'mismatch' 
                      ? "bg-red-500/[0.03] dark:bg-red-500/[0.08] border-red-500/20 shadow-lg shadow-red-500/5" 
                      : "bg-white dark:bg-white/5 border-zinc-100 dark:border-white/5 hover:border-emerald-500/30"
                  )}
                >
                  {pv.status === 'mismatch' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                  )}
                  <div className="col-span-6 flex flex-col justify-center">
                    <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{pv.candidate}</span>
                    {pv.status === 'mismatch' && (
                      <span className="text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1 mt-1">
                        <Zap size={10} strokeWidth={3} />
                        Discrépance Détectée
                      </span>
                    )}
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      value={pv.manual}
                      onChange={(e) => handleUpdateManual(pv.id, e.target.value)}
                      className={cn(
                        "w-full h-11 text-center rounded-xl font-black text-sm transition-all focus:ring-4 outline-none",
                        pv.status === 'mismatch' 
                          ? "bg-red-500/10 border-red-500/30 text-red-500 focus:ring-red-500/10" 
                          : "bg-zinc-100 dark:bg-white/5 border-transparent text-zinc-900 dark:text-white focus:ring-emerald-500/10"
                      )}
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-center">
                    <div className={cn(
                      "w-full h-11 flex items-center justify-center rounded-xl text-sm font-black font-mono border-2 border-dashed",
                      pv.status === 'mismatch' ? "border-red-500/40 text-red-500 bg-red-500/5" : "border-zinc-200 dark:border-white/10 text-zinc-400"
                    )}>
                      {pv.ocr}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-8 border-t border-white/5 bg-zinc-50/50 dark:bg-black/20 backdrop-blur-2xl">
             <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest mb-6">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" />
                  <span className="text-zinc-500">Moteur de Confiance</span>
                </div>
                <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">84.2% Audit Pass</span>
             </div>
             <div className="flex gap-4">
                <button className="flex-1 h-14 rounded-2xl bg-white dark:bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/20 transition-all shadow-lg">
                  <XCircle size={18} strokeWidth={2.5} />
                  Rejeter PV
                </button>
                <button className="flex-1 h-14 rounded-2xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all">
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                  Approuver PV
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
