"use client";

import { useMemo, useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { UsersRound, Plus, Loader2 } from "lucide-react";
import { normalizeAlgerianPhone, normalizeNin } from "@/lib/phone";
import { ApiError } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { useQuery } from "@/lib/hooks/useApi";

type CitizenRow = {
  id: string;
  full_name: string;
  nin: string;
  phone: string;
  email: string;
  wilaya: string;
  commune: string;
};

function geoLabel(
  doc: { name_fr?: string; name_ar?: string; name?: string } | string | null | undefined,
  language: string
): string {
  if (!doc) return "\u2014";
  if (typeof doc === "string") return doc;
  if (language === "ar") return doc.name_ar || doc.name_fr || doc.name || "\u2014";
  return doc.name_fr || doc.name_ar || doc.name || "\u2014";
}

function mapCitizen(raw: Record<string, unknown>, language: string): CitizenRow {
  const member = raw.member_actif as Record<string, unknown> | undefined;
  const wilayaDoc = (raw.wilaya || member?.wilaya) as Record<string, unknown> | string | undefined;
  const communeDoc = (raw.commune || member?.commune) as Record<string, unknown> | string | undefined;

  return {
    id: String(raw._id || raw.id),
    full_name: String(raw.full_name || ""),
    nin: String(raw.nin || ""),
    phone: String(raw.phone || ""),
    email: raw.email ? String(raw.email) : "\u2014",
    wilaya: geoLabel(wilayaDoc as { name_fr?: string; name_ar?: string; name?: string }, language),
    commune: geoLabel(communeDoc as { name_fr?: string; name_ar?: string; name?: string }, language),
  };
}

export default function MesCitoyensPage() {
  const { mutation, memberWilaya, memberCommune } = useData();
  const { language, dir, t } = useLanguage();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    nin: "",
    phone: "",
    email: "",
    birthday: "",
    password: "",
  });

  const { data: citizensRaw, isLoading, error, refetch } = useQuery<Record<string, unknown>[]>(
    user?.role === "member_actif" ? "/citizens" : null,
    { limit: 5000, sortBy: "full_name", sortOrder: "asc" },
    [user?.id]
  );

  const citizens = useMemo(
    () => (citizensRaw || []).map((c) => mapCitizen(c, language)),
    [citizensRaw, language]
  );

  const wilayaLabel =
    language === "ar"
      ? memberWilaya?.name_ar || memberWilaya?.name_fr || "?"
      : memberWilaya?.name_fr || memberWilaya?.name_ar || "?";
  const communeLabel =
    language === "ar"
      ? memberCommune?.name_ar || memberCommune?.name_fr || "?"
      : memberCommune?.name_fr || memberCommune?.name_ar || "?";

  const openModal = (item: Record<string, unknown> | null = null) => {
    setEditingItem(item);
    if (item) {
      const raw = (citizensRaw || []).find(
        (c) => String(c._id || c.id) === String(item.id || item._id)
      );
      const dob = raw?.date_of_birth;
      const birthday =
        dob instanceof Date
          ? dob.toISOString().slice(0, 10)
          : String(dob || "").slice(0, 10);
      setFormData({
        full_name: String(item.full_name || ""),
        nin: String(item.nin || ""),
        phone: String(item.phone || ""),
        email: item.email && item.email !== "\u2014" ? String(item.email) : "",
        birthday,
        password: "",
      });
    } else {
      setFormData({
        full_name: "",
        nin: "",
        phone: "",
        email: "",
        birthday: "",
        password: "",
      });
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.full_name.trim()) {
      setFormError(language === "ar" ? "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u0637\u0644\u0648\u0628" : "Nom complet requis");
      return;
    }

    const nin = normalizeNin(formData.nin);
    if (!nin) {
      setFormError(
        language === "ar"
          ? "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0648\u0637\u0646\u064a \u064a\u062c\u0628 \u0623\u0646 \u064a\u062a\u0643\u0648\u0646 \u0645\u0646 18 \u0631\u0642\u0645\u0627\u064b"
          : "Le NIN doit contenir exactement 18 chiffres"
      );
      return;
    }

    const phone = normalizeAlgerianPhone(formData.phone);
    if (!phone) {
      setFormError(
        language === "ar"
          ? "\u0631\u0642\u0645 \u0647\u0627\u062a\u0641 \u062c\u0632\u0627\u0626\u0631\u064a \u063a\u064a\u0631 \u0635\u0627\u0644\u062d (\u0645\u062b\u0627\u0644: 0555123456)"
          : "Num\u00e9ro alg\u00e9rien invalide (ex. 0555123456)"
      );
      return;
    }

    if (!formData.birthday) {
      setFormError(
        language === "ar" ? "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0645\u064a\u0644\u0627\u062f \u0645\u0637\u0644\u0648\u0628" : "Date de naissance requise"
      );
      return;
    }

    if (!editingItem && !formData.password) {
      setFormError(language === "ar" ? "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0629" : "Mot de passe requis");
      return;
    }
    if (formData.password && formData.password.length < 8) {
      setFormError(
        language === "ar"
          ? "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 8 \u0623\u062d\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644"
          : "Mot de passe : 8 caract\u00e8res minimum"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        full_name: formData.full_name.trim(),
        nin,
        phone,
        date_of_birth: formData.birthday,
      };
      if (formData.email.trim()) body.email = formData.email.trim();
      if (formData.password) body.password = formData.password;

      if (editingItem) {
        const apiId = editingItem._id || editingItem.id;
        await mutation.mutate("PUT", `/citizens/${apiId}`, body);
      } else {
        await mutation.mutate("POST", "/citizens", body);
      }
      await refetch();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : language === "ar"
              ? "???? ???????"
              : "Operation failed";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <motion.div
          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-w-0 flex-1 space-y-2"
        >
          <div className="flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
            <UsersRound size={12} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
              {language === "ar" ? "??????" : "Mes citoyens"}
            </span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white font-plus-jakarta md:text-4xl">
            {t("nav.myCitizens")}
          </h1>
          <p className="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
            {language === "ar"
              ? "??? ????????? ????? ?????? ?????? ??????? ???."
              : "Consultez les citoyens que vous avez enregistr?s et ajoutez-en de nouveaux."}
          </p>
          <p className="text-xs font-bold text-zinc-500">
            {wilayaLabel} ? {communeLabel}
          </p>
        </motion.div>
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-algerian-green px-6 text-[11px] font-black uppercase tracking-widest text-white"
        >
          <Plus size={18} strokeWidth={3} />
          {language === "ar" ? "????? ????" : "Nouveau citoyen"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        size="large"
        className="min-h-[min(560px,88vh)]"
        title={
          editingItem
            ? language === "ar"
              ? "????? ?????"
              : "Modifier le citoyen"
            : language === "ar"
              ? "????? ????"
              : "Nouveau citoyen"
        }
      >
        <form onSubmit={handleSubmit} className="flex min-h-[420px] flex-col space-y-5 px-1">
          {formError && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600">
              {formError}
            </p>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {language === "ar" ? "????? ??????" : "Nom complet"}
            </label>
            <input
              required
              type="text"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">NIN</label>
              <input
                required
                type="text"
                maxLength={18}
                inputMode="numeric"
                disabled={isSubmitting}
                placeholder="000000000000000000"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
                value={formData.nin}
                onChange={(e) =>
                  setFormData({ ...formData, nin: e.target.value.replace(/\D/g, "").slice(0, 18) })
                }
              />
              <p className="text-[10px] font-bold tabular-nums text-zinc-400">{formData.nin.length}/18</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {language === "ar" ? "??????" : "T?l?phone"}
              </label>
              <input
                required
                type="tel"
                disabled={isSubmitting}
                placeholder="0555123456"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email</label>
            <input
              type="email"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {language === "ar" ? "????? ???????" : "Date de naissance"}
            </label>
            <input
              required
              type="date"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {editingItem
                ? language === "ar"
                  ? "???? ???? ????? (???????)"
                  : "Nouveau mot de passe (optionnel)"
                : language === "ar"
                  ? "???? ??????"
                  : "Mot de passe"}
            </label>
            <input
              type="password"
              minLength={8}
              required={!editingItem}
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-[10px] font-medium text-zinc-400">
              {language === "ar" ? "8 ???? ??? ?????" : "8 caract?res minimum"}
            </p>
          </div>
          <div className="mt-auto flex gap-4 border-t border-zinc-100 pt-6 dark:border-white/5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
              className="h-14 flex-1 rounded-2xl border border-zinc-200 text-[11px] font-black uppercase disabled:opacity-50 dark:border-white/5"
            >
              {language === "ar" ? "?????" : "Annuler"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-zinc-900 text-[11px] font-black uppercase text-white disabled:opacity-70 dark:bg-white dark:text-black"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {language === "ar" ? "\u062c\u0627\u0631\u064a \u0627\u0644\u062d\u0641\u0638\u2026" : "Enregistrement\u2026"}
                </>
              ) : language === "ar" ? (
                "\u062d\u0641\u0638"
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key="table" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <DataTable
              title={language === "ar" ? "????? ??????" : "Liste de mes citoyens"}
              exportFileName="mes-citoyens-anie"
              columns={[
                { header: language === "ar" ? "?????" : "Nom", accessor: "full_name" },
                { header: "NIN", accessor: "nin" },
                { header: language === "ar" ? "??????" : "T?l?phone", accessor: "phone" },
                { header: "Email", accessor: "email" },
                { header: language === "ar" ? "???????" : "Wilaya", accessor: "wilaya" },
                { header: language === "ar" ? "???????" : "Commune", accessor: "commune" },
              ]}
              data={citizens as unknown as Record<string, unknown>[]}
              onEdit={(row) => openModal(row)}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
