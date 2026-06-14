"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Zap,
  Filter,
  RefreshCw,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  ScanLine,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/lib/api";

// ────────── Types ────────────────────────────────
interface ResultRecord {
  _id: string;
  total: number;
  status: string;
  ocr_extracted_total?: number;
  ocr_confidence?: number;
  none_ocr?: boolean;
  hasImage?: boolean;
  desk?: { _id: string; desk_number: number; type: string };
  party?: { _id: string; name: string };
  candidat?: { _id: string; full_name: string };
  owner?: { _id: string; full_name: string };
  createdAt?: string;
}

interface OcrSummary {
  summary: Record<string, number>;
  total: number;
  pvUploads?: number;
}

interface FilterState {
  wilayaId: string;
  communeId: string;
  centerId: string;
  deskId: string;
  status: string;
}

// ────────── Status helpers ────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  verified:       { label: "Vérifié",     color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle },
  mismatch:       { label: "Divergence",  color: "text-red-500",     bg: "bg-red-500/10 border-red-500/20",         icon: AlertTriangle },
  pending:        { label: "En attente",  color: "text-amber-500",   bg: "bg-amber-500/10 border-amber-500/20",     icon: Clock },
  ocr_done:       { label: "OCR Fait",    color: "text-blue-500",    bg: "bg-blue-500/10 border-blue-500/20",       icon: ScanLine },
  ocr_processing: { label: "Traitement",  color: "text-purple-500",  bg: "bg-purple-500/10 border-purple-500/20",   icon: Loader2 },
  ocr_human_done: { label: "Validé",      color: "text-teal-500",    bg: "bg-teal-500/10 border-teal-500/20",       icon: ShieldCheck },
  rejected:       { label: "Rejeté",      color: "text-zinc-500",    bg: "bg-zinc-500/10 border-zinc-500/20",       icon: X },
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

// ────────── Main Component ────────────────────────
export default function ResultatsPage() {
  const { user } = useAuth();
  const role = user?.role;

  const [results, setResults] = useState<ResultRecord[]>([]);
  const [ocrSummary, setOcrSummary] = useState<OcrSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    wilayaId: role === "admin_wilaya" || role === "admin_commun" ? (user?.wilaya_id || "") : "",
    communeId: role === "admin_commun" ? (user?.commune_id || "") : "",
    centerId: "",
    deskId: "",
    status: "",
  });

  // Dropdown data
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [desks, setDesks] = useState<any[]>([]);

  // PV Image Modal
  const [modalResult, setModalResult] = useState<ResultRecord | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);

  // Fetch dropdown data
  useEffect(() => {
    if (role === "super_admin") {
      api.get<any>("/wilayas", { limit: 100 }).then(r => setWilayas(r.data || [])).catch(() => {});
    }
  }, [role]);

  useEffect(() => {
    if (filters.wilayaId) {
      api.get<any>(`/wilayas/${filters.wilayaId}/communes`).then(r => setCommunes(r.data || [])).catch(() => {});
      setCenters([]); setDesks([]);
      if (role !== "admin_commun") setFilters(f => ({ ...f, communeId: "", centerId: "", deskId: "" }));
    }
  }, [filters.wilayaId]);

  useEffect(() => {
    if (filters.communeId) {
      api.get<any>("/centers", { commune: filters.communeId, limit: 100 }).then(r => setCenters(r.data || [])).catch(() => {});
      setDesks([]);
      setFilters(f => ({ ...f, centerId: "", deskId: "" }));
    }
  }, [filters.communeId]);

  useEffect(() => {
    if (filters.centerId) {
      api.get<any>("/desks", { center: filters.centerId, limit: 100 }).then(r => setDesks(r.data || [])).catch(() => {});
      setFilters(f => ({ ...f, deskId: "" }));
    }
  }, [filters.centerId]);

  // Fetch results
  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (filters.wilayaId) params.wilayaId = filters.wilayaId;
      if (filters.communeId) params.communeId = filters.communeId;
      if (filters.centerId) params.centerId = filters.centerId;
      if (filters.deskId) params.desk = filters.deskId;
      if (filters.status) params.status = filters.status;

      const res = await api.getResultsDesk(params);
      setResults(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch {}
    finally { setIsLoading(false); }
  }, [filters, page]);

  const fetchOcrSummary = useCallback(async () => {
    try {
      const params: any = {};
      if (filters.wilayaId) params.wilayaId = filters.wilayaId;
      if (filters.communeId) params.communeId = filters.communeId;
      const res = await api.getOcrSummary(params);
      setOcrSummary(res.data);
    } catch {}
  }, [filters.wilayaId, filters.communeId]);

  useEffect(() => { fetchResults(); fetchOcrSummary(); }, [fetchResults, fetchOcrSummary]);

  const handleRunOcr = async () => {
    if (!modalResult) return;
    setIsOcrRunning(true);
    try {
      await api.triggerOcr(modalResult._id);
      setOcrDone(true);
      await fetchResults();
      // Re-fetch the updated result
      const fresh = await api.get<any>(`/results/desk/${modalResult._id}`);
      if (fresh.ok) setModalResult(fresh.data);
    } catch (e: any) {
      alert(e.message || "OCR failed");
    } finally { setIsOcrRunning(false); }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!modalResult) return;
    try {
      setIsUpdating(true);
      const res = await api.put<any>(`/results/desk/${modalResult._id}/status`, { status });
      if (res.ok) {
        setModalResult({ ...modalResult, status });
        fetchResults();
        fetchOcrSummary();
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (e: any) {
      alert(e.message || "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const isReadOnly = role === "admin_commun"; // admin_commun can view but not trigger OCR (wait, plan says they can)
  const canTriggerOcr = role === "super_admin" || role === "admin_wilaya" || role === "admin_commun";


  // Grouped by unique desk ID
  const deskIds = Array.from(new Set(results.map(r => r.desk?._id).filter(Boolean))) as string[];
  const byDesk: Record<string, ResultRecord[]> = {};
  for (const r of results) {
    const id = r.desk?._id ?? "unknown";
    if (!byDesk[id]) byDesk[id] = [];
    byDesk[id].push(r);
  }

  const verifiedCount = (ocrSummary?.summary?.verified ?? 0) + (ocrSummary?.summary?.ocr_human_done ?? 0);
  const mismatchCount = (ocrSummary?.summary?.mismatch ?? 0) + (ocrSummary?.summary?.rejected ?? 0);

  const statCards = [
    { label: "Total Saisies", value: ocrSummary?.total ?? "–", icon: BarChart3, color: "text-zinc-500", bg: "bg-zinc-500/10" },
    { label: "Vérifiés", value: verifiedCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Refusés", value: mismatchCount, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "PV Uploadés", value: ocrSummary?.pvUploads ?? 0, icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <BarChart3 size={12} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Tableau de Résultats</span>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta">Résultats & OCR</h1>
        <p className="text-zinc-500 text-sm font-medium">
          Consultez les résultats de votes et les données de vérification OCR
          {role === "admin_wilaya" && " pour votre wilaya"}
          {role === "admin_commun" && " pour votre commune"}.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5 p-5 flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", card.bg)}>
                <Icon size={22} className={card.color} />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{card.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      

      {/* Filter Bar */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={14} className="text-zinc-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Filtres</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Wilaya */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Wilaya</label>
            <select
              disabled={role !== "super_admin"}
              value={filters.wilayaId}
              onChange={e => setFilters(f => ({ ...f, wilayaId: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs font-semibold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
              <option value="">Toutes</option>
              {wilayas.map((w: any) => <option key={w.id || w._id} value={w.id || w._id}>{w.name}</option>)}
            </select>
          </div>
          {/* Commune */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Commune</label>
            <select
              disabled={role === "admin_commun" || !filters.wilayaId}
              value={filters.communeId}
              onChange={e => setFilters(f => ({ ...f, communeId: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs font-semibold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
              <option value="">Toutes</option>
              {communes.map((c: any) => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
            </select>
          </div>
          {/* Centre */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Centre</label>
            <select
              disabled={!filters.communeId}
              value={filters.centerId}
              onChange={e => setFilters(f => ({ ...f, centerId: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs font-semibold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
              <option value="">Tous</option>
              {centers.map((c: any) => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
            </select>
          </div>
          {/* Bureau */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Bureau</label>
            <select
              disabled={!filters.centerId}
              value={filters.deskId}
              onChange={e => setFilters(f => ({ ...f, deskId: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs font-semibold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
              <option value="">Tous</option>
              {desks.map((d: any) => <option key={d.id || d._id} value={d.id || d._id}>Bureau #{d.desk_number}</option>)}
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Statut</label>
            <select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
              <option value="">Tous</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        {/* Actions row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-white/5">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{total} résultat{total !== 1 ? "s" : ""}</span>
          <button onClick={() => { setPage(1); fetchResults(); fetchOcrSummary(); }}
            className="flex items-center gap-2 px-4 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
            <RefreshCw size={13} className={cn(isLoading && "animate-spin")} />
            Actualiser
          </button>
        </div>
      </div>

            {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-emerald-500" size={28} />
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-zinc-400 bg-white dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5 mt-6">
          <FileText size={36} className="opacity-20" />
          <p className="text-sm font-semibold">Aucun résultat trouvé pour ces filtres</p>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {deskIds.map(deskId => {
            const bureauResults = byDesk[deskId] || [];
            const deskNumber = bureauResults[0]?.desk?.desk_number;
            const deskType = bureauResults[0]?.desk?.type;
            const hasMismatch = bureauResults.some(r => r.status === "mismatch");
            const allVerified = bureauResults.every(r => r.status === "verified");
            const pvResult = bureauResults.find(r => r.hasImage);

            return (
              <motion.div key={deskId}
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
                      #{deskNumber || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900 dark:text-white">Bureau #{deskNumber || "?"}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {deskType === "male" ? "Hommes" : deskType === "female" ? "Femmes" : "—"} · {bureauResults.length} candidat{bureauResults.length !== 1 ? "s" : ""}
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
                      <button onClick={() => { setModalResult(pvResult); setOcrDone(false); }}
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
          <PVModal
            result={modalResult}
            canTriggerOcr={canTriggerOcr}
            isOcrRunning={isOcrRunning}
            ocrDone={ocrDone}
            isUpdating={isUpdating}
            onUpdateStatus={handleStatusUpdate}
            onRunOcr={handleRunOcr}
            onClose={() => { setModalResult(null); setOcrDone(false); }}
            onFullscreen={(url) => setFullscreenImage(url)}
          />
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

// ────────── PV Modal ──────────────────────────────
function PVModal({ result, canTriggerOcr, isOcrRunning, ocrDone, isUpdating, onUpdateStatus, onRunOcr, onClose, onFullscreen }: {
  result: ResultRecord;
  canTriggerOcr: boolean;
  isOcrRunning: boolean;
  ocrDone: boolean;
  isUpdating?: boolean;
  onUpdateStatus?: (status: string) => void;
  onRunOcr: () => void;
  onClose: () => void;
  onFullscreen: (url: string) => void;
}) {
  const hasMismatch = result.status === "mismatch";
  const isVerified = result.status === "verified";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-[95vw] md:w-[896px] max-w-full h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-white/10">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">PV — Bureau #{result.desk?.desk_number}</h2>
            <p className="text-sm text-zinc-500 font-medium mt-0.5">
              {result.candidat?.full_name} · {result.party?.name}
            </p>
          </div>
          <button onClick={onClose}
            className="h-10 w-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Image */}
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 overflow-auto">
            <button 
              onClick={() => onFullscreen(api.getDeskImageUrl(result._id))}
              className="relative max-w-full max-h-full transition-transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 rounded-xl"
            >
              <img
                src={api.getDeskImageUrl(result._id)}
                alt="PV Scan"
                className="max-w-full max-h-full object-contain rounded-xl shadow-md cursor-zoom-in"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                }}
              />
            </button>
          </div>

          {/* Sidebar info */}
          <div className="w-80 border-l border-zinc-100 dark:border-white/10 flex flex-col overflow-y-auto">
            {/* Verification result */}
            <div className="p-6 border-b border-zinc-100 dark:border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">Vérification</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-500">Statut</span>
                  <StatusBadge status={result.status} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-500">Saisie manuelle</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{result.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-500">Résultat OCR</span>
                  <span className={cn("text-sm font-black font-mono",
                    hasMismatch ? "text-red-500" : isVerified ? "text-emerald-500" : "text-zinc-400")}>
                    {result.ocr_extracted_total ?? "—"}
                  </span>
                </div>
                {result.ocr_confidence != null && (
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-zinc-500">Confiance OCR</span>
                    <span className={cn("text-[11px] font-black",
                      result.ocr_confidence > 70 ? "text-emerald-500" : "text-amber-500")}>
                      {Math.round(result.ocr_confidence)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Mismatch warning */}
            {hasMismatch && (
              <div className="mx-4 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-black text-red-500 uppercase tracking-wider">Divergence Détectée</p>
                    <p className="text-[10px] text-red-400 mt-1">
                      Différence de {Math.abs((result.ocr_extracted_total ?? 0) - result.total)} voix entre la saisie manuelle et le résultat OCR.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isVerified && (
              <div className="mx-4 mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <p className="text-[11px] font-black text-emerald-500 uppercase tracking-wider">Données Concordantes</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-6 mt-auto border-t border-zinc-100 dark:border-white/10 space-y-3">
              {onUpdateStatus && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdateStatus("rejected")}
                    disabled={isUpdating || isOcrRunning}
                    className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50 transition-all">
                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                    Refuser
                  </button>
                  <button
                    onClick={() => onUpdateStatus("ocr_human_done")}
                    disabled={isUpdating || isOcrRunning}
                    className="flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 disabled:opacity-50 transition-all">
                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Accepter
                  </button>
                </div>
              )}
              {canTriggerOcr && (
                <div>
                  <button
                    onClick={onRunOcr}
                    disabled={isOcrRunning || ocrDone}
                    className={cn(
                      "w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all",
                      ocrDone
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
                        : "bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                    )}>
                    {isOcrRunning ? (
                      <><Loader2 size={16} className="animate-spin" /> Traitement OCR...</>
                    ) : ocrDone ? (
                      <><CheckCircle size={16} /> OCR Terminé</>
                    ) : (
                      <><Zap size={16} /> Relancer l'OCR</>
                    )}
                  </button>
                  <p className="text-[9px] text-zinc-400 text-center mt-2 font-medium">
                    Utilisera Tesseract.js en local
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
