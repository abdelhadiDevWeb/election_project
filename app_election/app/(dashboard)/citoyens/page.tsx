"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UsersRound, ShieldCheck, MapPin } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useQuery } from "@/lib/hooks/useApi";
import DataTable from "../components/DataTable";
import { cn } from "@/lib/utils";

type CitizenRow = {
  id: string;
  full_name: string;
  nin: string;
  phone: string;
  email: string;
  wilaya: string;
  commune: string;
  party: string;
  added_by: string;
};

function geoLabel(
  doc: { name_fr?: string; name_ar?: string; name?: string } | string | null | undefined,
  language: string
): string {
  if (!doc) return "—";
  if (typeof doc === "string") return doc;
  if (language === "ar") return doc.name_ar || doc.name_fr || doc.name || "—";
  return doc.name_fr || doc.name_ar || doc.name || "—";
}

function mapCitizen(
  raw: Record<string, unknown>,
  language: string
): CitizenRow {
  const member = raw.member_actif as Record<string, unknown> | undefined;
  const wilayaDoc = (raw.wilaya || member?.wilaya) as Record<string, unknown> | string | undefined;
  const communeDoc = (raw.commune || member?.commune) as Record<string, unknown> | string | undefined;
  const partyDoc = raw.party as Record<string, unknown> | string | undefined;

  let party = "—";
  if (partyDoc && typeof partyDoc === "object") {
    party = String(partyDoc.acronym || partyDoc.name || "—");
  } else if (typeof partyDoc === "string") {
    party = partyDoc;
  }

  return {
    id: String(raw._id || raw.id),
    full_name: String(raw.full_name || ""),
    nin: String(raw.nin || ""),
    phone: String(raw.phone || ""),
    email: raw.email ? String(raw.email) : "—",
    wilaya: geoLabel(wilayaDoc, language),
    commune: geoLabel(communeDoc, language),
    party,
    added_by: member?.full_name ? String(member.full_name) : "—",
  };
}

export default function CitoyensPage() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { wilayasData, communesData } = useData();

  const isSuperAdmin = user?.role === "super_admin";
  const isAdminWilaya = user?.role === "admin_wilaya";
  const isAdminCommun = user?.role === "admin_commun";

  const [filterWilaya, setFilterWilaya] = useState("");
  const [filterCommune, setFilterCommune] = useState("");

  const scopedWilayas = useMemo(() => {
    if (isSuperAdmin) return wilayasData;
    if (user?.wilaya_id) {
      return wilayasData.filter((w) => String(w._id || w.id) === String(user.wilaya_id));
    }
    return wilayasData;
  }, [wilayasData, isSuperAdmin, user?.wilaya_id]);

  const filterWilayaId = useMemo(() => {
    if (isAdminWilaya && user?.wilaya_id) return String(user.wilaya_id);
    if (!filterWilaya) return undefined;
    const w = wilayasData.find((x) => String(x._id || x.id) === filterWilaya);
    return w ? String(w._id || w.id) : filterWilaya;
  }, [isAdminWilaya, user?.wilaya_id, filterWilaya, wilayasData]);

  const scopedCommunes = useMemo(() => {
    if (isAdminCommun && user?.commune_id) {
      return communesData.filter((c) => String(c._id || c.id) === String(user.commune_id));
    }
    if (isSuperAdmin || isAdminWilaya) {
      if (!filterWilayaId) return isAdminWilaya ? communesData.filter((c) => String(c.wilaya_id) === String(user?.wilaya_id)) : communesData;
      return communesData.filter((c) => String(c.wilaya_id) === filterWilayaId);
    }
    return communesData;
  }, [communesData, isSuperAdmin, isAdminWilaya, isAdminCommun, user?.commune_id, user?.wilaya_id, filterWilayaId]);

  const citizensQueryParams = useMemo(() => {
    const params: Record<string, unknown> = { limit: 5000, sortBy: "full_name", sortOrder: "asc" };
    if (isSuperAdmin) {
      if (filterWilayaId) params.wilaya = filterWilayaId;
      if (filterCommune) params.commune = filterCommune;
    }
    if (isAdminWilaya && filterCommune) {
      params.commune = filterCommune;
    }
    return params;
  }, [isSuperAdmin, isAdminWilaya, filterWilayaId, filterCommune]);

  const { data: citizensRaw, isLoading, error } = useQuery<Record<string, unknown>[]>(
    isAdminCommun || isSuperAdmin || isAdminWilaya ? "/citizens" : null,
    citizensQueryParams,
    [user?.role, filterWilayaId, filterCommune]
  );

  const citizens = useMemo(
    () => (citizensRaw || []).map((c) => mapCitizen(c, language)),
    [citizensRaw, language]
  );

  const scopeLabel = useMemo(() => {
    if (isAdminCommun && user?.commune_id) {
      const c = communesData.find((x) => String(x._id || x.id) === String(user.commune_id));
      return c?.name_fr || c?.name || c?.name_ar || null;
    }
    if ((isAdminWilaya || isAdminCommun) && user?.wilaya_id) {
      const w = scopedWilayas[0];
      return w?.name_fr || w?.name || w?.name_ar || null;
    }
    return null;
  }, [isAdminCommun, isAdminWilaya, user?.commune_id, user?.wilaya_id, communesData, scopedWilayas]);

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-w-0 flex-1 space-y-2"
        >
          <div className="flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
            <UsersRound size={12} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
              {language === "ar" ? "السجل المدني" : "Registre citoyen"}
            </span>
          </div>
          <h1 className="w-full text-3xl font-black text-zinc-900 dark:text-white font-plus-jakarta md:text-4xl">
            {t("nav.citizens")}
          </h1>
          <p className="w-full max-w-full text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
            {language === "ar"
              ? "عرض جميع المواطنين المسجلين في قاعدة البيانات حسب نطاق صلاحياتك."
              : "Consultation des citoyens enregistrés dans la base, selon votre périmètre."}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass flex shrink-0 items-center gap-3 rounded-2xl border border-white/5 px-5 py-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {language === "ar" ? "الإجمالي" : "Total"}
            </p>
            <p className="text-2xl font-black tabular-nums text-zinc-900 dark:text-white">{citizens.length}</p>
          </div>
        </motion.div>
      </div>

      {scopeLabel && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {isAdminCommun
              ? language === "ar"
                ? "نطاق البلدية"
                : "Périmètre communal"
              : language === "ar"
                ? "نطاق الولاية"
                : "Périmètre wilaya"}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <MapPin size={14} className="text-indigo-500" />
            {scopeLabel}
          </p>
        </motion.div>
      )}

      {isSuperAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {language === "ar" ? "تصفية حسب الولاية" : "Filtrer par wilaya"}
            </label>
            <select
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none dark:border-white/10 dark:bg-white/5"
              value={filterWilaya}
              onChange={(e) => {
                setFilterWilaya(e.target.value);
                setFilterCommune("");
              }}
            >
              <option value="">{language === "ar" ? "كل الولايات" : "Toutes les wilayas"}</option>
              {wilayasData.map((w) => (
                <option key={w._id || w.id} value={String(w._id || w.id)}>
                  {w.name_fr || w.name || w.name_ar}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {language === "ar" ? "تصفية حسب البلدية" : "Filtrer par commune"}
            </label>
            <select
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
              value={filterCommune}
              disabled={!filterWilayaId}
              onChange={(e) => setFilterCommune(e.target.value)}
            >
              <option value="">{language === "ar" ? "كل البلديات" : "Toutes les communes"}</option>
              {scopedCommunes.map((c) => (
                <option key={c._id || c.id} value={String(c._id || c.id)}>
                  {c.name_fr || c.name || c.name_ar}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {isAdminWilaya && (
        <div className="max-w-md space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {language === "ar" ? "تصفية حسب البلدية" : "Filtrer par commune"}
          </label>
          <select
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none dark:border-white/10 dark:bg-white/5"
            value={filterCommune}
            onChange={(e) => setFilterCommune(e.target.value)}
          >
            <option value="">{language === "ar" ? "كل بلديات الولاية" : "Toutes les communes de la wilaya"}</option>
            {scopedCommunes.map((c) => (
              <option key={c._id || c.id} value={String(c._id || c.id)}>
                {c.name_fr || c.name || c.name_ar}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
        </div>
      ) : (
        <DataTable
          title={
            language === "ar" ? "سجل المواطنين" : "Registre des citoyens"
          }
          exportFileName="citoyens"
          columns={[
            {
              header: language === "ar" ? "الاسم الكامل" : "Nom complet",
              accessor: "full_name",
              render: (val) => (
                <span className="font-black text-zinc-900 dark:text-white">{String(val)}</span>
              ),
            },
            {
              header: "NIN",
              accessor: "nin",
              render: (val) => (
                <span className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">{String(val)}</span>
              ),
            },
            {
              header: language === "ar" ? "الهاتف" : "Téléphone",
              accessor: "phone",
            },
            {
              header: language === "ar" ? "البريد" : "E-mail",
              accessor: "email",
            },
            {
              header: language === "ar" ? "الولاية" : "Wilaya",
              accessor: "wilaya",
              render: (val) => (
                <span className="text-[11px] font-black uppercase text-zinc-500">{String(val)}</span>
              ),
            },
            {
              header: language === "ar" ? "البلدية" : "Commune",
              accessor: "commune",
            },
            {
              header: language === "ar" ? "أضيف بواسطة" : "Ajouté par",
              accessor: "added_by",
              render: (val) => (
                <span className={cn(
                  "text-xs font-semibold",
                  val && val !== "—" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-zinc-400"
                )}>
                  {String(val)}
                </span>
              ),
            },
            {
              header: language === "ar" ? "الحزب" : "Parti",
              accessor: "party",
              render: (val) => (
                <span
                  className={cn(
                    "rounded-lg px-2 py-1 text-[10px] font-black uppercase",
                    val && val !== "—"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-zinc-100 text-zinc-500 dark:bg-white/5"
                  )}
                >
                  {String(val)}
                </span>
              ),
            },
          ]}
          data={citizens as unknown as Record<string, unknown>[]}
        />
      )}
    </div>
  );
}
