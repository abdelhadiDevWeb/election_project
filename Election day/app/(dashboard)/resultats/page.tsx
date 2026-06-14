"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  ScanLine,
  ShieldCheck,
  Loader2,
  Building2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

// ────────── Types ────────────────────────────────
interface ResultRecord {
  _id: string;
  total: number;
  status: string;
  ocr_extracted_total?: number;
  ocr_confidence?: number;
  hasImage?: boolean;
  desk?: { _id: string; desk_number: number; type: string };
  party?: { _id: string; name: string };
  candidat?: { _id: string; full_name: string };
  createdAt?: string;
}

// ────────── Status helpers ────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  verified:       { label: "Vérifié",    color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle },
  mismatch:       { label: "Divergence", color: "text-red-500",     bg: "bg-red-500/10 border-red-500/20",         icon: AlertTriangle },
  pending:        { label: "En attente", color: "text-amber-500",   bg: "bg-amber-500/10 border-amber-500/20",     icon: Clock },
  ocr_done:       { label: "OCR Fait",   color: "text-blue-500",    bg: "bg-blue-500/10 border-blue-500/20",       icon: ScanLine },
  ocr_processing: { label: "Traitement", color: "text-purple-500",  bg: "bg-purple-500/10 border-purple-500/20",   icon: Loader2 },
  ocr_human_done: { label: "Validé",     color: "text-teal-500",    bg: "bg-teal-500/10 border-teal-500/20",       icon: ShieldCheck },
  rejected:       { label: "Rejeté",     color: "text-zinc-500",    bg: "bg-zinc-500/10 border-zinc-500/20",       icon: X },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", cfg.bg, cfg.color)}>
      <Icon size={10} className={cn(status === "ocr_processing" && "animate-spin")} />
      {cfg.label}
    </span>
  );
}

export default function CentreResultatsPage() {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [modalResult, setModalResult] = useState<ResultRecord | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Grouped by bureau
  const bureaux = Array.from(new Set(results.map(r => r.desk?.desk_number).filter(Boolean)));
  const byBureau: Record<number, ResultRecord[]> = {};
  for (const r of results) {
    const n = r.desk?.desk_number ?? 0;
    if (!byBureau[n]) byBureau[n] = [];
    byBureau[n].push(r);
  }

  const stats = {
    total,
    verified: results.filter(r => r.status === "verified" || r.status === "ocr_human_done").length,
    mismatch: results.filter(r => r.status === "mismatch" || r.status === "rejected").length,
    withImage: results.filter(r => r.hasImage).length,
  };

  const handleStatusUpdate = async (status: string) => {
    if (!modalResult) return;
    try {
      setIsUpdating(true);
      const res = await api.put<any>(`/results/desk/${modalResult._id}/status`, { status });
      if (res.ok) {
        setModalResult({ ...modalResult, status });
        fetchResults();
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (e: any) {
      alert(e.message || "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getCentreResults({ page, limit: 50, ...(statusFilter ? { status: statusFilter } : {}) });
      setResults(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch {}
    finally { setIsLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <Building2 size={12} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Mon Centre</span>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Résultats du Centre</h1>
        <p className="text-zinc-500 text-sm font-medium">Consultez tous les PV uploadés et les résultats de vote de votre centre.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Saisies", value: total, icon: BarChart3, color: "text-zinc-500", bg: "bg-zinc-500/10" },
          { label: "Vérifiés",      value: stats.verified, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Refusés",   value: stats.mismatch, icon: AlertTriangle, color: "text-red-500",   bg: "bg-red-500/10" },
          { label: "PV Uploadés",   value: stats.withImage, icon: ImageIcon,  color: "text-blue-500",   bg: "bg-blue-500/10" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5 p-5 flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", card.bg)}>
                <Icon size={20} className={card.color} />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{card.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters & Refresh */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-zinc-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Statut</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["", "verified", "mismatch", "pending", "ocr_done"].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all",
                statusFilter === s
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white dark:bg-white/5 text-zinc-500 border-zinc-200 dark:border-white/10 hover:border-emerald-500/30"
              )}>
              {s === "" ? "Tous" : (STATUS_CONFIG[s]?.label || s)}
            </button>
          ))}
        </div>
        <button onClick={fetchResults}
          className="ml-auto flex items-center gap-2 px-4 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
          <RefreshCw size={13} className={cn(isLoading && "animate-spin")} />
          Actualiser
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-emerald-500" size={28} />
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-zinc-400 bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
          <FileText size={36} className="opacity-20" />
          <p className="text-sm font-semibold">Aucun résultat pour ce centre</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bureaux.sort((a, b) => (a ?? 0) - (b ?? 0)).map(bureauNum => {
            const bureauResults = byBureau[bureauNum ?? 0] || [];
            const hasMismatch = bureauResults.some(r => r.status === "mismatch");
            const allVerified = bureauResults.every(r => r.status === "verified");
            const pvResult = bureauResults.find(r => r.hasImage);

            return (
              <motion.div key={bureauNum}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-white dark:bg-white/5 rounded-2xl border overflow-hidden",
                  hasMismatch ? "border-red-500/30" : allVerified ? "border-emerald-500/20" : "border-zinc-100 dark:border-white/5"
                )}>
                {/* Bureau header */}
                <div className={cn(
                  "flex items-center justify-between px-6 py-4 border-b",
                  hasMismatch ? "bg-red-500/5 border-red-500/10" : allVerified ? "bg-emerald-500/5 border-emerald-500/10" : "bg-zinc-50 dark:bg-white/3 border-zinc-100 dark:border-white/5"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black",
                      hasMismatch ? "bg-red-500/10 text-red-500" : allVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400"
                    )}>
                      #{bureauNum}
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900 dark:text-white">Bureau #{bureauNum}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {bureauResults[0]?.desk?.type === "male" ? "Hommes" : bureauResults[0]?.desk?.type === "female" ? "Femmes" : "—"} · {bureauResults.length} candidat{bureauResults.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasMismatch && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-red-500 uppercase tracking-wider">
                        <AlertTriangle size={12} /> Divergence
                      </span>
                    )}
                    {allVerified && !hasMismatch && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                        <CheckCircle size={12} /> Tout vérifié
                      </span>
                    )}
                    {pvResult && (
                      <button onClick={() => setModalResult(pvResult)}
                        className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-black uppercase tracking-wider hover:bg-blue-500/20 transition-all">
                        <ImageIcon size={11} /> Voir PV
                      </button>
                    )}
                  </div>
                </div>

                {/* Results table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-50 dark:border-white/3">
                        <th className="text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400">Candidat</th>
                        <th className="text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400">Parti</th>
                        <th className="text-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400">Voix Saisies</th>
                        <th className="text-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400">OCR</th>
                        <th className="text-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-400">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bureauResults.map((r, i) => {
                        const rowMismatch = r.status === "mismatch";
                        const rowVerified = r.status === "verified";
                        return (
                          <tr key={r._id}
                            className={cn(
                              "border-b border-zinc-50 dark:border-white/3 transition-colors",
                              rowMismatch ? "bg-red-500/[0.02] hover:bg-red-500/[0.04]" : "hover:bg-zinc-50 dark:hover:bg-white/3"
                            )}>
                            <td className="px-6 py-3 font-bold text-zinc-900 dark:text-white">{r.candidat?.full_name || "—"}</td>
                            <td className="px-4 py-3 text-xs text-zinc-500">{r.party?.name || "—"}</td>
                            <td className="px-4 py-3 text-center font-black text-zinc-900 dark:text-white">{r.total}</td>
                            <td className={cn("px-4 py-3 text-center font-black font-mono",
                              rowMismatch ? "text-red-500" : rowVerified ? "text-emerald-500" : "text-zinc-400")}>
                              {r.ocr_extracted_total ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <StatusBadge status={r.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Page {page} / {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="h-9 px-4 flex items-center gap-1.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-30 transition-all">
                  <ChevronLeft size={14} /> Précédent
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="h-9 px-4 flex items-center gap-1.5 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-white/10 disabled:opacity-30 transition-all">
                  Suivant <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PV Image Modal */}
      <AnimatePresence>
        {modalResult && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalResult(null)}>
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-[95vw] md:w-[768px] max-w-full h-[85vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}>

              <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-white/10">
                <div>
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white">PV — Bureau #{modalResult.desk?.desk_number}</h2>
                  <p className="text-sm text-zinc-500 mt-0.5">{modalResult.candidat?.full_name} · {modalResult.party?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={modalResult.status} />
                  <button onClick={() => setModalResult(null)}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Info bar */}
              <div className="flex items-center gap-6 px-6 py-3 bg-zinc-50 dark:bg-white/3 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Saisie Manuelle</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{modalResult.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">OCR</span>
                  <span className={cn("text-sm font-black font-mono",
                    modalResult.status === "mismatch" ? "text-red-500" :
                    modalResult.status === "verified" ? "text-emerald-500" : "text-zinc-400")}>
                    {modalResult.ocr_extracted_total ?? "—"}
                  </span>
                </div>
                {modalResult.ocr_confidence != null && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Confiance</span>
                    <span className={cn("text-[11px] font-black",
                      modalResult.ocr_confidence > 70 ? "text-emerald-500" : "text-amber-500")}>
                      {Math.round(modalResult.ocr_confidence)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
                <button
                  onClick={() => setFullscreenImage(api.getDeskImageUrl(modalResult._id))}
                  className="relative max-w-full max-h-full transition-transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 rounded-xl"
                >
                  <img
                    src={api.getDeskImageUrl(modalResult._id)}
                    alt="PV Scan"
                    className="max-w-full max-h-full object-contain rounded-xl shadow-md cursor-zoom-in"
                  />
                </button>
              </div>

              {/* Actions / Mismatch warning */}
              <div className="flex flex-col border-t border-zinc-100 dark:border-white/10">
                {modalResult.status === "mismatch" && (
                  <div className="flex items-center gap-3 px-6 py-4 bg-red-500/5">
                    <AlertTriangle size={16} className="text-red-500 shrink-0" />
                    <p className="text-[11px] font-bold text-red-500">
                      Divergence de {Math.abs((modalResult.ocr_extracted_total ?? 0) - modalResult.total)} voix entre la saisie manuelle et le résultat OCR.
                    </p>
                  </div>
                )}
                {(modalResult.status === "mismatch" || modalResult.status === "verified" || modalResult.status === "rejected" || modalResult.status === "ocr_human_done" || modalResult.status === "ocr_done") && (
                  <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50 dark:bg-white/3">
                    <button
                      onClick={() => handleStatusUpdate("rejected")}
                      disabled={isUpdating}
                      className="px-4 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50 transition-all">
                      {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                      Refuser
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("ocr_human_done")}
                      disabled={isUpdating}
                      className="px-4 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 disabled:opacity-50 transition-all">
                      {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                      Accepter
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 cursor-zoom-out backdrop-blur-sm"
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={fullscreenImage}
              alt="PV Scan Fullscreen"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself if needed
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
