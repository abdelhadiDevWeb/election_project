"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Hash,
  Search,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useQuery, useMutation } from "@/lib/hooks/useApi";
import { api } from "@/lib/api";
import type { IParty, ICandidat } from "@/lib/types";
import Modal from "../components/Modal";

type VoteEntry = Record<string, number>; // candidat_id → votes

export default function VotesPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const mutation = useMutation();

  const [expandedParty, setExpandedParty] = useState<string | null>(null);
  const [votes, setVotes] = useState<VoteEntry>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states for adding results
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [selectedCandidatId, setSelectedCandidatId] = useState("");
  const [voteCount, setVoteCount] = useState<number | "">("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const { data: partiesRaw, isLoading: partiesLoading } = useQuery<IParty[]>("/parties", { limit: 500 });
  const { data: candidatsRaw, isLoading: candidatsLoading } = useQuery<ICandidat[]>("/candidats", { limit: 1000 });
  const { data: existingResults, refetch: refetchResults } = useQuery<any[]>(
    "/results/desk",
    { owner: user?.id, limit: 500 }
  );

  const parties: IParty[] = Array.isArray(partiesRaw) ? partiesRaw : (partiesRaw as any)?.data || [];
  const candidats: ICandidat[] = Array.isArray(candidatsRaw) ? candidatsRaw : (candidatsRaw as any)?.data || [];
  const results: any[] = Array.isArray(existingResults) ? existingResults : (existingResults as any)?.data || [];

  // Group candidats by party
  const candidatsByParty = useMemo(() => {
    const map: Record<string, ICandidat[]> = {};
    candidats.forEach((c) => {
      const partyId =
        typeof c.party === "object" ? String((c.party as IParty)._id || (c.party as IParty).id) : String(c.party || "");
      if (!map[partyId]) map[partyId] = [];
      map[partyId].push(c);
    });
    return map;
  }, [candidats]);

  // Sync submitted map and prefilled votes dynamically
  useEffect(() => {
    if (results.length > 0) {
      const prefilled: VoteEntry = {};
      const submittedMap: Record<string, boolean> = {};
      results.forEach((r: any) => {
        const candidatId = typeof r.candidat === "object" ? String(r.candidat._id || r.candidat.id) : String(r.candidat);
        prefilled[candidatId] = r.total ?? 0;
        submittedMap[candidatId] = true;
      });
      setSubmitted(submittedMap);
      setVotes((prev) => ({ ...prefilled, ...prev }));
    }
  }, [results]);

  const filteredParties = useMemo(() => {
    if (!searchQuery.trim()) return parties;
    const q = searchQuery.toLowerCase();
    return parties.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.acronym?.toLowerCase().includes(q)
    );
  }, [parties, searchQuery]);

  // Table results mapping
  const resultsTableData = useMemo(() => {
    return results.map((r: any) => {
      const candidatObj = typeof r.candidat === "object" ? r.candidat : candidats.find((c) => String(c._id || c.id) === String(r.candidat));
      const partyObj = typeof r.party === "object" ? r.party : parties.find((p) => String(p._id || p.id) === String(r.party));
      return {
        id: r._id || r.id,
        candidatId: candidatObj?.id || candidatObj?._id || String(r.candidat),
        candidatName: candidatObj?.full_name || "—",
        partyId: partyObj?.id || partyObj?._id || String(r.party),
        partyName: partyObj?.name || "—",
        partyAcronym: partyObj?.acronym || "—",
        totalVotes: r.total ?? 0,
        status: r.status || "draft",
      };
    });
  }, [results, candidats, parties]);

  const filteredTableData = useMemo(() => {
    if (!searchQuery.trim()) return resultsTableData;
    const q = searchQuery.toLowerCase();
    return resultsTableData.filter(
      (row) =>
        row.partyName.toLowerCase().includes(q) ||
        row.partyAcronym.toLowerCase().includes(q) ||
        row.candidatName.toLowerCase().includes(q)
    );
  }, [resultsTableData, searchQuery]);

  // Filter out candidates already present in the table
  const availableCandidatsForModal = useMemo(() => {
    if (!selectedPartyId) return [];
    const partyCandidats = candidatsByParty[selectedPartyId] || [];
    return partyCandidats.filter((cand) => {
      const candId = String(cand._id || cand.id);
      return !submitted[candId]; // Don't display in list if it's already in the table!
    });
  }, [selectedPartyId, candidatsByParty, submitted]);

  const handleVoteChange = (candidatId: string, value: string) => {
    const num = parseInt(value, 10);
    setVotes((prev) => ({
      ...prev,
      [candidatId]: isNaN(num) ? 0 : Math.max(0, num),
    }));
  };

  const handleModalPartyChange = (partyId: string) => {
    setSelectedPartyId(partyId);
    setSelectedCandidatId("");
    setVoteCount("");
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartyId || !selectedCandidatId || voteCount === "") {
      setModalError(language === "ar" ? "يرجى ملء جميع الحقول" : "Veuillez remplir tous les champs");
      return;
    }
    if (!user?.desk_id) {
      setModalError(language === "ar" ? "لم يتم تعيين مكتب" : "Aucun bureau assigné");
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      await api.post("/results/desk", {
        party: selectedPartyId,
        desk: user.desk_id,
        candidat: selectedCandidatId,
        total: Number(voteCount),
      });

      // Update local states
      setSubmitted((prev) => ({ ...prev, [selectedCandidatId]: true }));
      setVotes((prev) => ({ ...prev, [selectedCandidatId]: Number(voteCount) }));

      setSubmitSuccess(
        language === "ar"
          ? "تمت إضافة النتيجة بنجاح!"
          : "Résultat ajouté avec succès !"
      );

      // Reset modal state
      setIsModalOpen(false);
      setSelectedPartyId("");
      setSelectedCandidatId("");
      setVoteCount("");

      // Refetch results from server
      await refetchResults();

      setTimeout(() => setSubmitSuccess(null), 4000);
    } catch (err: any) {
      setModalError(err.message || "Erreur lors de l'ajout");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmitParty = useCallback(
    async (partyId: string) => {
      if (!user?.desk_id) {
        setSubmitError(language === "ar" ? "لم يتم تعيين مكتب" : "Aucun bureau assigné");
        return;
      }

      const partyCandidats = candidatsByParty[partyId] || [];
      if (partyCandidats.length === 0) return;

      setSubmitError(null);
      setSubmitSuccess(null);

      try {
        for (const candidat of partyCandidats) {
          const cid = String(candidat._id || candidat.id);
          const total = votes[cid] || 0;

          await api.post("/results/desk", {
            party: partyId,
            desk: user.desk_id,
            candidat: cid,
            total,
          });

          setSubmitted((prev) => ({ ...prev, [cid]: true }));
        }

        setSubmitSuccess(
          language === "ar"
            ? "تم إرسال النتائج بنجاح!"
            : "Résultats soumis avec succès !"
        );
        await refetchResults();

        // Auto-dismiss success
        setTimeout(() => setSubmitSuccess(null), 4000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur lors de la soumission";
        setSubmitError(msg);
      }
    },
    [user, votes, candidatsByParty, language, refetchResults]
  );

  const isLoading = partiesLoading || candidatsLoading;

  if (isLoading) {
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

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <Vote size={12} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
            {language === "ar" ? "سجل الأصوات" : "Registre des Votes"}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta">
          {language === "ar" ? "الأحزاب والمرشحون" : "Partis & Candidats"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-none">
          {language === "ar"
            ? "اختر حزبًا لعرض مرشحيه وإدخال عدد الأصوات لكل مرشح"
            : "Sélectionnez un parti pour voir ses candidats et saisir le nombre de vote"}
        </p>
      </motion.div>

      {/* Alerts */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
          >
            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{submitSuccess}</span>
          </motion.div>
        )}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <span className="text-sm font-bold text-red-600 dark:text-red-400">{submitError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Actions Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "ar" ? "بحث عن مرشح أو حزب…" : "Rechercher un candidat ou parti…"}
            className="w-full h-12 ps-12 pe-4 rounded-xl bg-white/[0.03] dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 rounded-xl bg-gradient-to-br from-[#006233] to-[#008c5a] text-white text-sm font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus size={18} />
          {language === "ar" ? "إضافة نتيجة" : "Ajouter un Résultat"}
        </button>
      </div>

      {/* Results Table Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <Vote size={18} className="text-emerald-500" />
          {language === "ar" ? "النتائج المسجلة" : "Résultats Enregistrés"}
        </h2>

        {filteredTableData.length === 0 ? (
          <div className="glass dark:bg-white/[0.02] p-12 rounded-3xl border border-zinc-200 dark:border-white/10 text-center space-y-4 shadow-xl">
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mx-auto text-zinc-400">
              <Vote size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                {language === "ar" ? "لا توجد نتائج مسجلة" : "Aucun résultat enregistré"}
              </h3>
              <p className="text-xs text-zinc-500 max-w-none mx-auto">
                {language === "ar"
                  ? "لم تقم بإدخال أي نتائج بعد لمكتب التصويت الخاص بك. اضغط على الزر أعلاه لإضافة نتيجة."
                  : "Vous n'avez pas encore saisi de résultats pour votre bureau de vote. Cliquez sur le bouton ci-dessus pour ajouter un résultat."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-zinc-200 dark:border-white/10 glass shadow-xl">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02]">
                  <th className="px-6 py-4 text-start text-xs font-black uppercase tracking-wider text-zinc-500">
                    {language === "ar" ? "الحزب" : "Parti"}
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-black uppercase tracking-wider text-zinc-500">
                    {language === "ar" ? "المرشح" : "Candidat"}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-zinc-500">
                    {language === "ar" ? "عدد الأصوات" : "Nombre de Votes"}
                  </th>
                  <th className="px-6 py-4 text-end text-xs font-black uppercase tracking-wider text-zinc-500">
                    {language === "ar" ? "الحالة" : "Statut"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {filteredTableData.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs border border-emerald-500/20">
                          {row.partyAcronym}
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">{row.partyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white">
                      {row.candidatName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-sm border border-emerald-500/20">
                        {row.totalVotes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        row.status === "verified" || row.status === "validated"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : row.status === "mismatch" || row.status === "rejected"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          : row.status === "ocr_processing"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      )}>
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          row.status === "verified" || row.status === "validated" ? "bg-emerald-500 animate-pulse" :
                          row.status === "mismatch" || row.status === "rejected" ? "bg-rose-500 animate-pulse" :
                          row.status === "ocr_processing" ? "bg-blue-500 animate-pulse" :
                          "bg-amber-500"
                        )} />
                        {row.status === "verified" || row.status === "validated" ? (language === "ar" ? "مطابق (مؤكد)" : "Vérifié (OK)")
                          : row.status === "mismatch" ? (language === "ar" ? "اختلاف بالصورة" : "Anomalie PV")
                          : row.status === "rejected" ? (language === "ar" ? "مرفوض" : "Rejeté")
                          : row.status === "ocr_processing" ? (language === "ar" ? "جاري التحقق" : "Vérification en cours")
                          : (language === "ar" ? "مؤقت (بانتظار الصورة)" : "En attente du PV")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 dark:border-white/10 my-8" />

      {/* Accordion of all Parties */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">
          {language === "ar" ? "قائمة الأحزاب الكاملة" : "Liste Complète des Partis"}
        </h2>

        <div className="space-y-3">
          {filteredParties.length === 0 && (
            <div className="text-center py-12 text-zinc-400 text-sm font-bold">
              {language === "ar" ? "لا توجد أحزاب" : "Aucun parti trouvé"}
            </div>
          )}
          {filteredParties.map((party, i) => {
            const partyId = String(party._id || party.id);
            const isExpanded = expandedParty === partyId;
            const partyCandidats = candidatsByParty[partyId] || [];
            const allSubmitted = partyCandidats.every(
              (c) => submitted[String(c._id || c.id)]
            );

            return (
              <motion.div
                key={partyId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass dark:bg-white/[0.03] rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden"
              >
                {/* Party Header */}
                <button
                  onClick={() => setExpandedParty(isExpanded ? null : partyId)}
                  className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm border border-emerald-500/20">
                      {party.acronym?.slice(0, 3) || "—"}
                    </div>
                    <div className="text-start">
                      <h3 className="text-sm font-black text-zinc-900 dark:text-white">{party.name}</h3>
                      <p className="text-[11px] text-zinc-500 font-bold">
                        {partyCandidats.length} {language === "ar" ? "مرشح" : "candidat(s)"}
                        {allSubmitted && partyCandidats.length > 0 && (
                          <span className="text-emerald-500 ms-2">✓ {language === "ar" ? "مُرسل" : "Soumis"}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-zinc-400" />
                  ) : (
                    <ChevronDown size={20} className="text-zinc-400" />
                  )}
                </button>

                {/* Candidats List (expanded) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3 border-t border-zinc-100 dark:border-white/5 pt-4">
                        {partyCandidats.length === 0 && (
                          <p className="text-xs text-zinc-400 text-center py-4">
                            {language === "ar" ? "لا يوجد مرشحون لهذا الحزب" : "Aucun candidat pour ce parti"}
                          </p>
                        )}
                        {partyCandidats.map((candidat) => {
                          const cid = String(candidat._id || candidat.id);
                          const isSubmittedItem = submitted[cid];
                          return (
                            <div
                              key={cid}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                                isSubmittedItem
                                  ? "bg-emerald-500/5 border-emerald-500/20"
                                  : "bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/10"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-zinc-900 dark:text-white truncate">
                                  {candidat.full_name}
                                </p>
                                {isSubmittedItem && (
                                  <p className="text-[10px] text-emerald-500 font-bold mt-0.5">
                                    {language === "ar" ? "تم الإرسال" : "Déjà soumis"}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Hash size={14} className="text-zinc-400" />
                                <input
                                  type="number"
                                  min={0}
                                  value={votes[cid] ?? ""}
                                  onChange={(e) => handleVoteChange(cid, e.target.value)}
                                  placeholder="0"
                                  className="w-24 h-10 text-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm font-black text-zinc-900 dark:text-white outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                  {language === "ar" ? "صوت" : "votes"}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Submit Button for Party */}
                        {partyCandidats.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSubmitParty(partyId)}
                            disabled={mutation.isLoading}
                            className="w-full h-12 mt-2 rounded-xl bg-gradient-to-br from-[#006233] to-[#008c5a] text-white text-sm font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                          >
                            {mutation.isLoading ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={18} />
                            )}
                            {allSubmitted
                              ? language === "ar" ? "تحديث الأصوات" : "Mettre à Jour"
                              : language === "ar" ? "إرسال أصوات هذا الحزب" : "Soumettre les Votes de ce Parti"}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal for adding results */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPartyId("");
          setSelectedCandidatId("");
          setVoteCount("");
          setModalError(null);
        }}
        title={language === "ar" ? "إضافة نتيجة جديدة" : "Ajouter un Résultat"}
      >
        <form onSubmit={handleModalSubmit} className="space-y-6">
          {modalError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <span className="text-xs font-bold text-red-600 dark:text-red-400">{modalError}</span>
            </div>
          )}

          {/* Select Party */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
              {language === "ar" ? "الحزب السياسي" : "Parti Politique"}
            </label>
            <select
              value={selectedPartyId}
              onChange={(e) => handleModalPartyChange(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-emerald-500/50"
              required
            >
              <option value="" className="bg-zinc-950 text-zinc-400">
                {language === "ar" ? "-- اختر الحزب --" : "-- Choisir un Parti --"}
              </option>
              {parties.map((p) => (
                <option key={String(p._id || p.id)} value={String(p._id || p.id)} className="bg-zinc-950 text-white">
                  {p.name} ({p.acronym || ""})
                </option>
              ))}
            </select>
          </div>

          {/* Select Candidate */}
          {selectedPartyId && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                {language === "ar" ? "المرشح" : "Candidat"}
              </label>
              <select
                value={selectedCandidatId}
                onChange={(e) => {
                  setSelectedCandidatId(e.target.value);
                  setVoteCount("");
                }}
                className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-emerald-500/50"
                required
              >
                <option value="" className="bg-zinc-950 text-zinc-400">
                  {language === "ar" ? "-- اختر المرشح --" : "-- Choisir un Candidat --"}
                </option>
                {availableCandidatsForModal.map((cand) => (
                  <option key={String(cand._id || cand.id)} value={String(cand._id || cand.id)} className="bg-zinc-950 text-white">
                    {cand.full_name}
                  </option>
                ))}
              </select>
              {availableCandidatsForModal.length === 0 && (
                <p className="text-[11px] text-amber-500 font-bold mt-1">
                  {language === "ar"
                    ? "تم إدخال جميع مرشحي هذا الحزب بالفعل في الجدول."
                    : "Tous les candidats de ce parti ont déjà été ajoutés au tableau."}
                </p>
              )}
            </div>
          )}

          {/* Vote Count Input */}
          {selectedCandidatId && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                {language === "ar" ? "عدد الأصوات" : "Nombre de Votes"}
              </label>
              <div className="relative">
                <Hash className="absolute start-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="number"
                  min={0}
                  value={voteCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVoteCount(val === "" ? "" : Math.max(0, parseInt(val, 10)));
                  }}
                  placeholder="0"
                  className="w-full h-12 ps-12 pe-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm font-black text-zinc-900 dark:text-white outline-none focus:border-emerald-500/50"
                  required
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-white/5">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedPartyId("");
                setSelectedCandidatId("");
                setVoteCount("");
                setModalError(null);
              }}
              className="h-12 px-6 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
            >
              {language === "ar" ? "إلغاء" : "Annuler"}
            </button>
            <button
              type="submit"
              disabled={modalLoading || !selectedCandidatId || voteCount === ""}
              className="h-12 px-6 rounded-xl bg-gradient-to-br from-[#006233] to-[#008c5a] text-white text-sm font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {modalLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {language === "ar" ? "حفظ النتيجة" : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
