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
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-algerian-green/10 flex items-center justify-center text-algerian-green">
            <CheckCircle size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Validation des Procès-Verbaux</h1>
            <p className="text-xs text-zinc-500">ID Bureau: <span className="font-mono text-algerian-green">008-C12-S04</span> • Localisation: Alger, Sidi M'hamed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">État OCR</span>
            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs uppercase">
              <AlertTriangle size={14} />
              Écarts Détectés (2)
            </div>
          </div>
          <button className="h-10 px-6 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-bold hover:bg-zinc-50 transition-all flex items-center gap-2">
            <RotateCcw size={16} />
            Réinitialiser
          </button>
          <button className="h-10 px-6 rounded-xl bg-algerian-green text-white text-sm font-bold shadow-lg shadow-algerian-green/20 hover:bg-algerian-green-dark transition-all flex items-center gap-2">
            <Save size={16} />
            Valider le PV
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Side: Document View */}
        <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col relative bg-zinc-900 border-zinc-800">
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.5))} className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 transition-all">
              <ZoomIn size={18} />
            </button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 transition-all">
              <ZoomOut size={18} />
            </button>
          </div>

          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <ImageIcon size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Image du Procès-Verbal Scanné</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">PV_SCAN_2024_08_01_008.JPG</span>
          </div>

          <div className="flex-1 overflow-auto p-8 flex items-center justify-center cursor-grab active:cursor-grabbing">
            <motion.div 
              style={{ scale: zoom }}
              className="relative w-[500px] h-[700px] bg-white shadow-2xl rounded-sm border-[12px] border-zinc-200 flex flex-col p-10 space-y-8"
            >
              {/* Fake PV Document UI */}
              <div className="text-center border-b-2 border-zinc-800 pb-4 space-y-1">
                <h4 className="text-xs font-black uppercase tracking-widest">République Algérienne Démocratique et Populaire</h4>
                <p className="text-[10px] font-bold">Autorité Nationale Indépendante des Élections</p>
                <div className="h-4 w-4 mx-auto rounded-full bg-zinc-200 mt-2"></div>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-lg font-bold border-2 border-zinc-800 px-4 py-1 w-fit mx-auto uppercase">Procès-Verbal de Scrutin</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px] border border-zinc-300 p-3 rounded">
                <div className="space-y-1">
                  <p>Wilaya: <strong>ALGER (16)</strong></p>
                  <p>Commune: <strong>SIDI M'HAMED</strong></p>
                </div>
                <div className="space-y-1">
                  <p>Centre: <strong>PASTEUR</strong></p>
                  <p>Bureau: <strong>008</strong></p>
                </div>
              </div>
              
              <div className="flex-1 border-2 border-zinc-800 p-2 space-y-4">
                 <div className="flex justify-between font-bold text-[8px] uppercase border-b border-zinc-300 pb-1">
                    <span>Candidat</span>
                    <span>Voix Obtenues</span>
                 </div>
                 {mockPVData.map((p, i) => (
                   <div key={i} className="flex justify-between items-end border-b border-zinc-100 pb-1">
                      <span className="text-[9px] font-bold">{p.candidate}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm border border-zinc-800 px-2 py-0.5 bg-zinc-50">{p.manual}</span>
                        <div className="h-3 w-3 rounded-full bg-zinc-200"></div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex justify-between items-center pt-8">
                 <div className="h-10 w-24 border border-dashed border-zinc-300 flex items-center justify-center text-[8px] text-zinc-300 uppercase">Cachet ANIE</div>
                 <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase text-zinc-400">Signature</span>
                    <div className="h-8 w-20 border-b border-zinc-800"></div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Data Verification */}
        <div className="w-[450px] glass rounded-3xl flex flex-col overflow-hidden">
          <div className="p-6 bg-zinc-50/50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-algerian-green" />
              <h2 className="font-bold">Vérification de Saisie</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Total Voix</p>
                <p className="text-xl font-black text-algerian-green">672</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Inscrits</p>
                <p className="text-xl font-black">800</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">
              <div className="col-span-6">Candidat / Option</div>
              <div className="col-span-3 text-center">Manuel</div>
              <div className="col-span-3 text-center">OCR</div>
            </div>

            <div className="space-y-2">
              {selectedPV.map((pv) => (
                <div 
                  key={pv.id}
                  className={cn(
                    "grid grid-cols-12 gap-2 p-3 rounded-2xl border transition-all duration-300",
                    pv.status === 'mismatch' 
                      ? "bg-algerian-red/[0.03] border-algerian-red/20 shadow-[0_0_15px_rgba(210,16,52,0.05)]" 
                      : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800"
                  )}
                >
                  <div className="col-span-6 flex flex-col justify-center">
                    <span className="text-sm font-bold">{pv.candidate}</span>
                    {pv.status === 'mismatch' && (
                      <span className="text-[10px] text-algerian-red font-medium flex items-center gap-1">
                        <AlertTriangle size={10} />
                        Conflit détecté
                      </span>
                    )}
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      value={pv.manual}
                      onChange={(e) => handleUpdateManual(pv.id, e.target.value)}
                      className={cn(
                        "w-full h-10 text-center rounded-xl font-bold text-sm transition-all",
                        pv.status === 'mismatch' 
                          ? "bg-algerian-red/10 border-algerian-red/30 text-algerian-red focus:ring-algerian-red/20" 
                          : "bg-zinc-100 dark:bg-zinc-900 border-transparent focus:ring-algerian-green/20"
                      )}
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-center">
                    <div className={cn(
                      "w-full h-10 flex items-center justify-center rounded-xl text-sm font-mono border-2 border-dashed",
                      pv.status === 'mismatch' ? "border-algerian-red/50 text-algerian-red font-black" : "border-zinc-200 dark:border-zinc-700 text-zinc-400"
                    )}>
                      {pv.ocr}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
             <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-zinc-500 font-medium">Auto-Validation OCR</span>
                <span className="font-bold text-emerald-600">Confiance 84%</span>
             </div>
             <div className="flex gap-3">
                <button className="flex-1 h-12 rounded-xl bg-algerian-red/10 text-algerian-red text-sm font-bold flex items-center justify-center gap-2 border border-algerian-red/20 hover:bg-algerian-red/20 transition-all">
                  <XCircle size={18} />
                  Rejeter
                </button>
                <button className="flex-1 h-12 rounded-xl bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                  <CheckCircle2 size={18} />
                  Accepter
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
