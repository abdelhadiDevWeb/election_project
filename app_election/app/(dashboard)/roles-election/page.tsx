"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { 
  Key, 
  Calendar, 
  ShieldAlert, 
  Plus,
  QrCode,
  Users,
  X,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Fingerprint,
  Zap,
  Activity,
  Timer,
  Loader2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { normalizeAlgerianPhone, normalizeNin } from "@/lib/phone";
import { api } from "@/lib/api";
import { useQuery } from "@/lib/hooks/useApi";
import { normalizeEntityId } from "@/lib/entity-id";
import type { IRoleElectionDay } from "@/lib/types";

type CreateMode = "new" | "existing";

type PickerPerson = {
  key: string;
  kind: "member" | "citizen";
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nin: string;
  date_of_birth: string;
};

type CenterRow = {
  id?: string;
  _id?: string;
  name?: string;
  location?: string;
  wilaya_id?: string;
  commune_id?: string;
};

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findCenterMatch(centers: CenterRow[], typed: string): CenterRow | null {
  const raw = typed.trim();
  if (!raw) return null;

  const norm = normalizeSearchText(raw);

  const byId = centers.find(
    (c) => String(c.id || "") === raw || String(c._id || "") === raw
  );
  if (byId) return byId;

  const byExact = centers.find((c) => {
    const name = normalizeSearchText(String(c.name || ""));
    const loc = normalizeSearchText(String(c.location || ""));
    return name === norm || loc === norm;
  });
  if (byExact) return byExact;

  const byStarts = centers.find((c) => {
    const name = normalizeSearchText(String(c.name || ""));
    const loc = normalizeSearchText(String(c.location || ""));
    return name.startsWith(norm) || loc.startsWith(norm) || norm.startsWith(name);
  });
  if (byStarts) return byStarts;

  if (norm.length >= 3) {
    return (
      centers.find((c) => {
        const name = normalizeSearchText(String(c.name || ""));
        const loc = normalizeSearchText(String(c.location || ""));
        return name.includes(norm) || loc.includes(norm) || norm.includes(name);
      }) || null
    );
  }

  return null;
}

const defaultMissionDate = () => {
  const y = new Date().getFullYear();
  return `${y}-07-02`;
};

function toDateInputValue(v: unknown): string {
  if (!v) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function mapMemberToPicker(m: Record<string, unknown>): PickerPerson {
  const id = normalizeEntityId(m._id) || normalizeEntityId(m.id);
  return {
    key: `member-${id}`,
    kind: "member",
    id,
    full_name: String(m.full_name || ""),
    email: String(m.email || ""),
    phone: String(m.phone || ""),
    nin: String(m.nin || ""),
    date_of_birth: toDateInputValue(m.date_of_birth),
  };
}

function mapCitizenToPicker(c: Record<string, unknown>): PickerPerson {
  const id = normalizeEntityId(c._id) || normalizeEntityId(c.id);
  return {
    key: `citizen-${id}`,
    kind: "citizen",
    id,
    full_name: String(c.full_name || ""),
    email: String(c.email || ""),
    phone: String(c.phone || ""),
    nin: String(c.nin || ""),
    date_of_birth: toDateInputValue(c.date_of_birth),
  };
}

const API_ROLE_TO_FORM: Record<string, string> = {
  observateur_centre: "obs_center",
  observateur_bureau: "obs_desk",
  chef_centre: "chef_centre",
  scrutateur: "scrutateur",
};

export default function RolesElection() {
  const {
    observersData,
    setObserversData,
    centersData,
    communesData,
    wilayasData,
    desksData,
    mutation,
  } = useData();
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "super_admin";
  const isAdminWilaya = user?.role === "admin_wilaya";
  const isAdminCommun = user?.role === "admin_commun";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>("new");
  const [pickerWilayaId, setPickerWilayaId] = useState("");
  const [pickerCommuneId, setPickerCommuneId] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<PickerPerson | null>(null);
  const [personSearch, setPersonSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formTopRef = useRef<HTMLDivElement | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editBaseline, setEditBaseline] = useState<{
    password: string;
    role: string;
    time: string;
    date: string;
  } | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    birthday: "",
    role: "obs_center",
    center: "",
    desk: "",
    time: "",
    date: "",
    nin: "",
    phone: ""
  });

  useEffect(() => {
    if (isModalOpen && formError) {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formError, isModalOpen]);

  const scopedWilayas = useMemo(() => {
    if (isSuperAdmin) return wilayasData;
    if (user?.wilaya_id) {
      return wilayasData.filter((w) => String(w._id || w.id) === String(user.wilaya_id));
    }
    return [];
  }, [wilayasData, isSuperAdmin, user?.wilaya_id]);

  const scopedCommunes = useMemo(() => {
    let rows = communesData;
    if (isAdminCommun && user?.commune_id) {
      return rows.filter((c) => String(c._id || c.id) === String(user.commune_id));
    }
    if (isAdminWilaya && user?.wilaya_id) {
      rows = rows.filter((c) => String(c.wilaya_id) === String(user.wilaya_id));
    }
    if (pickerWilayaId) {
      rows = rows.filter((c) => String(c.wilaya_id) === String(pickerWilayaId));
    }
    return rows;
  }, [communesData, isAdminCommun, isAdminWilaya, user?.commune_id, user?.wilaya_id, pickerWilayaId]);

  const pickerFetchEnabled = createMode === "existing" && Boolean(pickerCommuneId) && isModalOpen && !editingItem;

  const membersPickerQ = useQuery<Record<string, unknown>[]>(
    pickerFetchEnabled ? "/members-actifs" : null,
    { commune: pickerCommuneId, limit: 5000, sortBy: "full_name", sortOrder: "asc" },
    [pickerCommuneId, createMode, isModalOpen]
  );

  const citizensPickerQ = useQuery<Record<string, unknown>[]>(
    pickerFetchEnabled ? "/citizens" : null,
    { commune: pickerCommuneId, limit: 5000, sortBy: "full_name", sortOrder: "asc" },
    [pickerCommuneId, createMode, isModalOpen]
  );

  const accreditedNins = useMemo(() => {
    const set = new Set<string>();
    for (const o of observersData) {
      const n = normalizeNin(String(o.nin || ""));
      if (n) set.add(n);
    }
    return set;
  }, [observersData]);

  const pickerPeople = useMemo(() => {
    const members = (membersPickerQ.data || []).map(mapMemberToPicker);
    const citizens = (citizensPickerQ.data || []).map(mapCitizenToPicker);
    const byNin = new Map<string, PickerPerson>();
    for (const p of [...members, ...citizens]) {
      const ninKey = normalizeNin(p.nin) || p.key;
      if (!byNin.has(ninKey)) byNin.set(ninKey, p);
    }
    let list = Array.from(byNin.values()).sort((a, b) =>
      a.full_name.localeCompare(b.full_name, language === "ar" ? "ar" : "fr")
    );
    const q = personSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          p.nin.includes(q) ||
          p.phone.includes(q) ||
          p.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [membersPickerQ.data, citizensPickerQ.data, personSearch, language]);

  const identityLocked = createMode === "existing" && Boolean(selectedPerson);

  const centersForMission = useMemo(() => {
    const rows = centersData as CenterRow[];
    if (createMode === "existing" && pickerCommuneId) {
      return rows.filter((c) => String(c.commune_id) === String(pickerCommuneId));
    }
    if (user?.commune_id) {
      return rows.filter((c) => String(c.commune_id) === String(user.commune_id));
    }
    if (user?.wilaya_id) {
      return rows.filter((c) => String(c.wilaya_id) === String(user.wilaya_id));
    }
  }, [centersData, createMode, pickerCommuneId, user?.commune_id, user?.wilaya_id]);

  const desksForMission = useMemo(() => {
    const rows = (desksData || []) as any[];
    if (createMode === "existing" && pickerCommuneId) {
      return rows.filter((d) => String(d.commune_id) === String(pickerCommuneId));
    }
    if (user?.commune_id) {
      return rows.filter((d) => String(d.commune_id) === String(user.commune_id));
    }
    if (user?.wilaya_id) {
      return rows.filter((d) => String(d.wilaya_id) === String(user.wilaya_id));
    }
    return rows;
  }, [desksData, createMode, pickerCommuneId, user?.commune_id, user?.wilaya_id]);

  const generatePassword = () => {
    const n = Math.floor(1000 + Math.random() * 9000);
    return `Pvp${n}!`;
  };

  const defaultNewUser = () => ({
    name: "",
    email: "",
    password: "",
    birthday: "",
    role: "obs_center",
    center: "",
    desk: "",
    time: "08:00",
    date: defaultMissionDate(),
    nin: "",
    phone: "",
  });

  const applyPersonToForm = (person: PickerPerson) => {
    setSelectedPerson(person);
    setNewUser((prev) => ({
      ...prev,
      name: person.full_name,
      email: person.email,
      nin: person.nin,
      phone: person.phone.replace(/\D/g, "").slice(0, 10),
      birthday: person.date_of_birth || prev.birthday,
      password: prev.password || generatePassword(),
    }));
  };

  const openCreateModal = (mode: CreateMode) => {
    setCreateMode(mode);
    setEditingItem(null);
    setEditBaseline(null);
    setFormError(null);
    setSelectedPerson(null);
    setPersonSearch("");
    const wilayaDefault =
      isAdminWilaya || isAdminCommun ? String(user?.wilaya_id || "") : "";
    const communeDefault = isAdminCommun ? String(user?.commune_id || "") : "";
    setPickerWilayaId(wilayaDefault);
    setPickerCommuneId(communeDefault);
    setNewUser(defaultNewUser());
    setIsModalOpen(true);
  };

  const openModal = async (item: any = null) => {
    if (!item) {
      openCreateModal("new");
      return;
    }
    setCreateMode("new");
    setEditingItem(item);
    setEditBaseline(null);
    setFormError(null);
    setSelectedPerson(null);
    setPersonSearch("");

    const apiId = item._id || item.id;
    const fallbackRole =
      API_ROLE_TO_FORM[item.role_code as string] ||
      (item.role === "Observateur Centre" ? "obs_center" : "obs_desk");
    const fallbackTime = item.expires || "08:00";
    const fallbackDate = toDateInputValue(item.assigned_date) || defaultMissionDate();

    setNewUser({
      name: item.name || "",
      email: item.email || "",
      password: "",
      birthday: toDateInputValue(item.birthday) || "",
      role: fallbackRole,
      center: item.location || item.center || "",
      desk: item.desk || "",
      time: fallbackTime,
      date: fallbackDate,
      nin: item.nin || "",
      phone: item.phone || "",
    });
    setIsModalOpen(true);
    setIsLoadingEdit(true);

    try {
      const res = await api.get<{ ok: boolean; data: IRoleElectionDay & { password_plain?: string } }>(
        `/roles-election-day/${apiId}`
      );
      const r = ((res as any).data ?? res) as (IRoleElectionDay & { password_plain?: string });
      const role = API_ROLE_TO_FORM[r.role] || fallbackRole;
      const time = r.assigned_time || fallbackTime;
      const date = toDateInputValue(r.assigned_date) || fallbackDate;
      const password = String(r.password_plain ?? "").trim();
      const birthday = toDateInputValue(r.date_of_birth) || toDateInputValue(item.birthday);

      setNewUser({
        name: r.full_name || item.name || "",
        email: r.email || "",
        password,
        birthday,
        role,
        center:
          r.center
            ? String(typeof r.center === "object" && (r.center as any)._id ? (r.center as any)._id : r.center)
            : item.center || "",
        desk:
          r.desk
            ? String(typeof r.desk === "object" && (r.desk as any)._id ? (r.desk as any)._id : r.desk)
            : item.desk || "",
        time,
        date,
        nin: r.nin || item.nin || "",
        phone: r.phone || item.phone || "",
      });
      setEditBaseline({ password, role, time, date });
    } catch {
      setEditBaseline({
        password: "",
        role: fallbackRole,
        time: fallbackTime,
        date: fallbackDate,
      });
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من إلغاء هذا الاعتماد المؤقت؟' : "Révoquer cet accès temporaire ?")) {
      try {
        const item = observersData.find(o => o.id === id || o._id === id);
        const apiId = item?._id || item?.id || id;
        await mutation.mutate("DELETE", `/roles-election-day/${apiId}`);
        setObserversData([]);
      } catch (err: any) {
        alert(err?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const roleMap: Record<string, string> = {
        obs_center: "observateur_centre",
        obs_desk: "observateur_bureau",
        chef_centre: "chef_centre",
        scrutateur: "scrutateur",
      };

      const typedCenter = String(newUser.center || "").trim();
      const matchedCenter = findCenterMatch(centersData as CenterRow[], typedCenter);
      const phone = normalizeAlgerianPhone(newUser.phone);
      const nin = normalizeNin(newUser.nin);

      if (!String(newUser.name || "").trim()) {
        setFormError(language === "ar" ? "الاسم مطلوب" : "Le nom complet est requis.");
        return;
      }
      if (!String(newUser.email || "").trim()) {
        setFormError(language === "ar" ? "البريد الإلكتروني مطلوب" : "L'email est requis.");
        return;
      }
      if (!newUser.birthday) {
        setFormError(language === "ar" ? "تاريخ الميلاد مطلوب" : "La date de naissance est requise.");
        return;
      }
      if (!nin) {
        setFormError(
          language === "ar"
            ? "الرقم الوطني يجب أن يتكون من 18 رقمًا"
            : "Le NIN doit contenir exactement 18 chiffres."
        );
        return;
      }
      if (!phone) {
        setFormError(
          language === "ar"
            ? "رقم الهاتف غير صالح (يجب أن يبدأ بـ 05/06/07 ويتكون من 10 أرقام)"
            : "Numéro de téléphone invalide (doit commencer par 05/06/07 et contenir 10 chiffres)."
        );
        return;
      }
      if (!typedCenter) {
        setFormError(language === "ar" ? "تعيين المركز مطلوب" : "L'affectation centre est requise.");
        return;
      }

      if (!editingItem && createMode === "existing") {
        if (!pickerWilayaId || !pickerCommuneId) {
          setFormError(
            language === "ar"
              ? "اختر الولاية والبلدية أولاً"
              : "Sélectionnez d'abord la wilaya et la commune."
          );
          return;
        }
        if (!selectedPerson) {
          setFormError(
            language === "ar"
              ? "اختر عضواً نشطاً أو مواطناً من القائمة"
              : "Sélectionnez un membre actif ou un citoyen dans la liste."
          );
          return;
        }
        if (!String(newUser.email || "").trim()) {
          setFormError(
            language === "ar"
              ? "البريد الإلكتروني مطلوب لهذا الشخص"
              : "L'email est requis pour cette personne."
          );
          return;
        }
      }

      let centerId = "";
      let wilayaId =
        !editingItem && createMode === "existing"
          ? pickerWilayaId
          : String(user?.wilaya_id || "");
      let communeId =
        !editingItem && createMode === "existing"
          ? pickerCommuneId
          : String(user?.commune_id || "");
      const locationText = typedCenter;

      if (matchedCenter) {
        centerId = String(matchedCenter.id || matchedCenter._id || "");
        wilayaId = String(matchedCenter.wilaya_id || wilayaId);
        communeId = String(matchedCenter.commune_id || communeId);
      } else {
        const scoped = (centersData as CenterRow[]).filter((c) => {
          if (user?.wilaya_id && String(c.wilaya_id || "") !== String(user.wilaya_id)) return false;
          if (user?.commune_id && String(c.commune_id || "") !== String(user.commune_id)) return false;
          return true;
        });
        const fallback = scoped[0] || (centersData as CenterRow[])[0];
        if (fallback) {
          centerId = String(fallback.id || fallback._id || "");
          wilayaId = String(fallback.wilaya_id || wilayaId);
          communeId = String(fallback.commune_id || communeId);
        }
      }

      if (!wilayaId || !communeId) {
        const commune = communesData[0];
        if (commune) {
          communeId = String(commune._id || commune.id || communeId);
          wilayaId = String(commune.wilaya_id || wilayaId);
        }
      }
      if (!wilayaId && wilayasData[0]) {
        wilayaId = String(wilayasData[0]._id || wilayasData[0].id || "");
      }

      if (!wilayaId || !communeId) {
        setFormError(
          language === "ar"
            ? "تعذر تحديد الولاية/البلدية. أضف بيانات جغرافية في النظام."
            : "Impossible de déterminer la wilaya/commune. Vérifiez les données géographiques."
        );
        return;
      }

      if (!editingItem && !newUser.password) {
        setFormError(
          language === "ar"
            ? "كلمة المرور مطلوبة"
            : "Mot de passe requis. Utilisez l'icône éclair pour en générer un."
        );
        return;
      }

      setIsSubmitting(true);

      const body: Record<string, unknown> = {
        full_name: newUser.name.trim(),
        email: newUser.email.trim(),
        phone,
        nin,
        password: newUser.password,
        date_of_birth: newUser.birthday,
        role: roleMap[newUser.role] || "observateur_centre",
        wilaya: wilayaId,
        commune: communeId,
        assigned_time: newUser.time || "08:00",
        assigned_date: newUser.date || defaultMissionDate(),
        location: locationText,
      };
      if (centerId) body.center = centerId;
      if (newUser.role === "obs_desk" && newUser.desk) {
        body.desk = newUser.desk;
      }

      if (editingItem) {
        const apiId = editingItem._id || editingItem.id;
        if (newUser.password && (!editBaseline || newUser.password !== editBaseline.password)) {
          body.password = newUser.password;
        } else {
          delete body.password;
        }

        const res = await mutation.mutate<{
          ok: boolean;
          sms?: { sent: boolean; error?: string; phone?: string; skipped?: boolean };
        }>("PUT", `/roles-election-day/${apiId}`, body);

        if (res.sms && !res.sms.skipped) {
          if (res.sms.sent) {
            alert(
              language === "ar"
                ? `تم التحديث وإرسال رسالة SMS إلى ${res.sms.phone || phone}.`
                : `Mis à jour. Message SMS renvoyé au ${res.sms.phone || phone}.`
            );
          } else {
            alert(
              (language === "ar" ? "تم التحديث لكن SMS لم يُرسل: " : "Mis à jour, mais SMS non envoyé : ") +
                (res.sms.error || "")
            );
          }
        } else {
          alert(language === "ar" ? "تم التحديث بنجاح." : "Mis à jour avec succès.");
        }
      } else {
        const res = await mutation.mutate<{
          ok: boolean;
          sms?: { sent: boolean; error?: string; phone?: string };
        }>("POST", "/roles-election-day", body);

        if (res.sms?.sent) {
          alert(
            language === "ar"
              ? `تم إنشاء الاعتماد وإرسال رسالة SMS إلى ${res.sms.phone || phone}.`
              : `Accréditation créée. Message SMS envoyé au ${res.sms.phone || phone}.`
          );
        } else {
          alert(
            (language === "ar"
              ? "تم إنشاء الاعتماد لكن SMS لم يُرسل: "
              : "Accréditation créée, mais SMS non envoyé : ") +
              (res.sms?.error ||
                (language === "ar"
                  ? "تحقق من إعدادات NetBEOPEN في server/.env وأعد تشغيل الخادم"
                  : "Vérifiez NETBEOPEN dans server/.env et redémarrez le serveur"))
          );
        }
      }
      setObserversData([]);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; response?: { details?: string[] } };
      const details = apiErr.response?.details;
      const detailStr =
        Array.isArray(details) && details.length > 0
          ? "\n\n" + details.join("\n")
          : "";
      setFormError((apiErr.message || "Operation failed") + detailStr);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2 flex-1 flex-shrink-0"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
            <Timer size={12} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{language === 'ar' ? 'الانتشار العملياتي يوم الاقتراع' : 'Déploiement Opérationnel Jour-J'}</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white lg:text-4xl lg:whitespace-nowrap font-plus-jakarta">
            {t("nav.roles")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px] whitespace-nowrap">
            {language === 'ar' ? 'إدارة الاعتمادات المؤقتة والإشراف على الموظفين الميدانيين للاقتراع الوطني.' : 'Gestion des accréditations temporaires et supervision du personnel de terrain pour le scrutin national.'}
          </p>
        </motion.div>

      </div>

      {/* Stats Summary Bento */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
        {[
          { label: language === 'ar' ? "إجمالي المعتمدين" : "Total Accrédités", value: observersData.length, icon: Users, color: "text-emerald-500" },
          { label: language === 'ar' ? "الجلسات النشطة" : "Sessions Actives", value: observersData.filter(o => o.status === 'Actif' || o.status === 'نشط').length, icon: Activity, color: "text-blue-500" },
          { label: language === 'ar' ? "المناطق المغطاة" : "Zones Couvertes", value: Array.from(new Set(observersData.map(o => o.center))).length, icon: MapPin, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 sm:p-4 md:p-6 glass dark:bg-white/5 rounded-2xl md:rounded-3xl border-white/10 flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-start gap-2 md:gap-0"
          >
            <div className="order-2 md:order-1">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest text-zinc-500 mb-1 leading-tight line-clamp-1">{stat.label}</p>
              <h3 className="text-lg md:text-3xl font-black text-zinc-900 dark:text-white leading-none">{stat.value}</h3>
            </div>
            <div className={cn("h-8 w-8 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center order-1 md:order-2 flex-shrink-0", stat.color)}>
              <stat.icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} />
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        size="xlarge"
        title={
          editingItem
            ? language === "ar"
              ? "تحديث الاعتماد"
              : "Mise à jour d'Accréditation"
            : createMode === "existing"
              ? language === "ar"
                ? "اعتماد — شخص مسجّل مسبقاً"
                : "Accréditation — personne déjà connue"
              : language === "ar"
                ? "اعتماد مؤقت جديد"
                : "Nouvelle accréditation"
        }
      >
        <form onSubmit={handleSubmit} className="flex min-h-[520px] flex-col space-y-6 px-1">
          <div ref={formTopRef} />
          {isLoadingEdit && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 py-8 dark:border-white/10 dark:bg-white/5">
              <Loader2 size={22} className="animate-spin text-amber-500" />
              <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                {language === "ar" ? "جاري تحميل البيانات…" : "Chargement des données…"}
              </span>
            </div>
          )}
          {formError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-600 dark:text-red-400">
              {formError}
            </div>
          )}
          <div
            className={cn(
              "flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-1",
              isLoadingEdit && "pointer-events-none opacity-50"
            )}
          >
            {!editingItem && createMode === "existing" && (
              <div className="space-y-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  {language === "ar"
                    ? "اختر الولاية والبلدية ثم الشخص"
                    : "Wilaya, commune, puis choisissez la personne"}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      {language === "ar" ? "الولاية" : "Wilaya"}
                    </label>
                    <select
                      disabled={isSubmitting || isAdminWilaya || isAdminCommun}
                      className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900"
                      value={pickerWilayaId}
                      onChange={(e) => {
                        setPickerWilayaId(e.target.value);
                        setPickerCommuneId("");
                        setSelectedPerson(null);
                        setPersonSearch("");
                      }}
                    >
                      <option value="">{language === "ar" ? "اختر الولاية" : "Choisir wilaya"}</option>
                      {scopedWilayas.map((w) => {
                        const wId = String(w._id || w.id);
                        return (
                          <option key={wId} value={wId}>
                            {w.num_wilaya ? `${w.num_wilaya} - ` : ""}
                            {w.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      {language === "ar" ? "البلدية" : "Commune"}
                    </label>
                    <select
                      disabled={isSubmitting || !pickerWilayaId || isAdminCommun}
                      className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm font-bold outline-none disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900"
                      value={pickerCommuneId}
                      onChange={(e) => {
                        setPickerCommuneId(e.target.value);
                        setSelectedPerson(null);
                        setPersonSearch("");
                      }}
                    >
                      <option value="">{language === "ar" ? "اختر البلدية" : "Choisir commune"}</option>
                      {scopedCommunes.map((c) => {
                        const cId = String(c._id || c.id);
                        return (
                          <option key={cId} value={cId}>
                            {c.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {pickerCommuneId && (
                  <>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="search"
                        disabled={isSubmitting}
                        placeholder={
                          language === "ar" ? "بحث بالاسم أو NIN…" : "Rechercher nom, NIN…"
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-zinc-900"
                        value={personSearch}
                        onChange={(e) => setPersonSearch(e.target.value)}
                      />
                    </div>
                    {(membersPickerQ.isLoading || citizensPickerQ.isLoading) && (
                      <div className="flex items-center justify-center gap-2 py-6 text-sm font-bold text-zinc-500">
                        <Loader2 size={18} className="animate-spin text-indigo-500" />
                        {language === "ar" ? "جاري التحميل…" : "Chargement…"}
                      </div>
                    )}
                    {!membersPickerQ.isLoading && !citizensPickerQ.isLoading && (
                      <div className="max-h-48 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                        {pickerPeople.length === 0 ? (
                          <p className="py-4 text-center text-xs font-bold text-zinc-500">
                            {language === "ar"
                              ? "لا يوجد أعضاء أو مواطنون في هذه البلدية"
                              : "Aucun membre actif ni citoyen dans cette commune"}
                          </p>
                        ) : (
                          pickerPeople.map((p) => {
                            const ninKey = normalizeNin(p.nin);
                            const already = ninKey && accreditedNins.has(ninKey);
                            const selected = selectedPerson?.key === p.key;
                            return (
                              <button
                                key={p.key}
                                type="button"
                                disabled={isSubmitting || !!already}
                                onClick={() => applyPersonToForm(p)}
                                className={cn(
                                  "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                                  selected
                                    ? "border-algerian-green bg-algerian-green/10"
                                    : "border-zinc-200 bg-white hover:border-indigo-300 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-indigo-500/40",
                                  already && "cursor-not-allowed opacity-50"
                                )}
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-zinc-900 dark:text-white">
                                    {p.full_name}
                                  </p>
                                  <p className="text-[10px] font-bold text-zinc-500">
                                    {p.kind === "member"
                                      ? language === "ar"
                                        ? "عضو نشط"
                                        : "Membre actif"
                                      : language === "ar"
                                        ? "مواطن"
                                        : "Citoyen"}{" "}
                                    · NIN {p.nin}
                                  </p>
                                </div>
                                {already ? (
                                  <span className="shrink-0 text-[9px] font-black uppercase text-amber-600">
                                    {language === "ar" ? "معتمد" : "Accrédité"}
                                  </span>
                                ) : selected ? (
                                  <UserCheck size={18} className="shrink-0 text-algerian-green" />
                                ) : null}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {createMode === "existing" && !selectedPerson && !editingItem && (
              <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-center text-xs font-bold text-zinc-500 dark:border-white/10">
                {language === "ar"
                  ? "اختر شخصاً من القائمة أعلاه لإكمال المهمة"
                  : "Sélectionnez une personne ci-dessus pour compléter la mission"}
              </p>
            )}

            {(editingItem || createMode === "new" || selectedPerson) && (
            <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'هوية الموظف' : 'Identité du Personnel'}</label>
              <input required disabled={isSubmitting || identityLocked} type="text" placeholder={language === 'ar' ? 'الاسم واللقب' : 'Prénom et Nom'} className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                <input required disabled={isSubmitting || (identityLocked && Boolean(newUser.email))} type="email" placeholder="email@exemple.dz" className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'كلمة المرور' : 'Mot de Passe'}</label>
                <div className="relative">
                  <input
                    required={!editingItem}
                    disabled={isSubmitting || isLoadingEdit}
                    type="text"
                    placeholder={editingItem ? (language === 'ar' ? 'كلمة المرور الحالية' : 'Mot de passe actuel') : '••••••••'}
                    className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold pr-12 disabled:opacity-60"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                  <button
                    type="button"
                    disabled={isSubmitting || isLoadingEdit}
                    onClick={() => setNewUser({ ...newUser, password: generatePassword() })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    <Zap size={14} className="text-amber-500" />
                  </button>
                </div>
                {editingItem && !isLoadingEdit && !newUser.password && (
                  <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    {language === 'ar'
                      ? 'كلمة المرور غير محفوظة — أنشئ واحدة جديدة قبل إعادة إرسال SMS'
                      : 'Mot de passe non enregistré — générez-en un nouveau si vous modifiez la mission'}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'تاريخ الميلاد' : 'Date de Naissance'}</label>
                <input required disabled={isSubmitting || identityLocked} type="date" className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60" value={newUser.birthday || ""} onChange={(e) => setNewUser({...newUser, birthday: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الرقم التعريفي الوطني (NIN)' : 'Identifiant National (NIN)'}</label>
                <input required disabled={isSubmitting || identityLocked} type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder={language === 'ar' ? '18 رقم' : '18 chiffres'} className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الدور العملياتي' : 'Rôle Opérationnel'}</label>
                <select disabled={isSubmitting} className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="obs_center">{language === 'ar' ? 'مراقب مركز' : 'Observateur Centre'}</option>
                  <option value="obs_desk">{language === 'ar' ? 'مراقب مكتب' : 'Observateur Bureau'}</option>
                </select>
              </div>
              <div className="space-y-2">
                {newUser.role === "obs_center" ? (
                  <>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {language === 'ar' ? 'تعيين المركز' : 'Affectation Centre'}
                    </label>
                    <select
                      required
                      disabled={isSubmitting}
                      className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60"
                      value={newUser.center}
                      onChange={(e) => setNewUser({ ...newUser, center: e.target.value, desk: "" })}
                    >
                      <option value="">{language === 'ar' ? 'اختر مركزاً…' : 'Choisir un centre…'}</option>
                      {centersForMission?.map((c) => {
                        const id = String(c.id || c._id || "");
                        const name = String(c.name || "");
                        return (
                          <option key={id} value={name}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </>
                ) : (
                  <>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {language === 'ar' ? 'تعيين المكتب' : 'Affectation bureau'}
                    </label>
                    <select
                      required
                      disabled={isSubmitting}
                      className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60"
                      value={newUser.desk}
                      onChange={(e) => {
                        const deskId = e.target.value;
                        const desk = desksForMission.find((d: any) => String(d.id || d._id) === deskId);
                        if (desk) {
                          setNewUser({
                            ...newUser,
                            desk: deskId,
                            center: desk.center_id || desk.center || ""
                          });
                        } else {
                          setNewUser({
                            ...newUser,
                            desk: "",
                            center: ""
                          });
                        }
                      }}
                    >
                      <option value="">{language === 'ar' ? 'اختر مكتباً…' : 'Choisir un bureau…'}</option>
                      {desksForMission?.map((d) => {
                        const id = String(d.id || d._id || "");
                        const label = language === 'ar'
                          ? `مكتب ${d.num_desk} (${d.center})`
                          : `Bureau ${d.num_desk} (${d.center})`;
                        return (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'جهة اتصال طارئة' : 'Contact Urgent'}</label>
              <input
                required
                disabled={isSubmitting || identityLocked}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern="^0[5-7][0-9]{8}$"
                placeholder="05XXXXXXXX"
                className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60"
                value={newUser.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setNewUser({ ...newUser, phone: digits });
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'موعد المهمة' : 'Heure de mission'}</label>
                <input
                  type="time"
                  disabled={isSubmitting}
                  className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60"
                  value={newUser.time || "08:00"}
                  onChange={(e) => setNewUser({ ...newUser, time: e.target.value })}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setNewUser({ ...newUser, time: "08:00" })}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[10px] font-black uppercase tracking-widest text-amber-600 transition-all hover:bg-amber-500/20 disabled:opacity-50 dark:text-amber-400"
                >
                  <Clock size={14} strokeWidth={2.5} />
                  {language === 'ar' ? '8h00' : '8h00'}
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'تاريخ المهمة' : 'Date de mission'}</label>
                <input
                  type="date"
                  disabled={isSubmitting}
                  className="w-full h-14 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold disabled:opacity-60"
                  value={newUser.date || defaultMissionDate()}
                  onChange={(e) => setNewUser({ ...newUser, date: e.target.value })}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setNewUser({ ...newUser, date: defaultMissionDate() })}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[10px] font-black uppercase tracking-widest text-amber-600 transition-all hover:bg-amber-500/20 disabled:opacity-50 dark:text-amber-400"
                >
                  <Calendar size={14} strokeWidth={2.5} />
                  {language === 'ar' ? '2 جويلية' : '2 juillet'}
                </button>
              </div>
            </div>
            </>
            )}
          </div>

          <div className="mt-auto flex gap-4 border-t border-zinc-100 pt-6 dark:border-white/5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-16 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                isLoadingEdit ||
                (createMode === "existing" && !editingItem && !selectedPerson)
              }
              className="flex flex-1 h-16 items-center justify-center gap-2 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {language === 'ar'
                    ? (editingItem ? 'جاري التحديث…' : 'جاري إصدار الاعتماد…')
                    : (editingItem ? 'Mise à jour…' : 'Envoi en cours…')}
                </>
              ) : editingItem ? (
                language === 'ar' ? 'تحديث' : 'Mettre à jour'
              ) : (
                language === 'ar' ? 'إصدار الاعتماد' : 'Délivrer Accréditation'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create accréditation — two flows */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => openCreateModal("new")}
          className="group flex flex-col items-start gap-4 rounded-[28px] border border-zinc-200 bg-white p-6 text-left transition-all hover:border-zinc-900 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black">
            <UserPlus size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {language === "ar" ? "القسم 1" : "Section 1"}
            </p>
            <h3 className="mt-1 text-lg font-black text-zinc-900 dark:text-white">
              {language === "ar" ? "اعتماد شخص جديد" : "Nouvelle personne"}
            </h3>
            <p className="mt-2 text-sm font-medium text-zinc-500">
              {language === "ar"
                ? "إدخال كامل للبيانات كما في النموذج الحالي"
                : "Saisie complète des informations (formulaire actuel)"}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openCreateModal("existing")}
          className="group flex flex-col items-start gap-4 rounded-[28px] border border-indigo-500/25 bg-indigo-500/5 p-6 text-left transition-all hover:border-indigo-500 hover:shadow-lg dark:border-indigo-500/30 dark:bg-indigo-500/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white">
            <Users size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {language === "ar" ? "القسم 2" : "Section 2"}
            </p>
            <h3 className="mt-1 text-lg font-black text-zinc-900 dark:text-white">
              {language === "ar" ? "شخص تعاملنا معه سابقاً" : "Personne déjà connue"}
            </h3>
            <p className="mt-2 text-sm font-medium text-zinc-500">
              {language === "ar"
                ? "اختر الولاية والبلدية ثم عضوًا نشطًا أو مواطنًا"
                : "Choisir wilaya, commune, puis membre actif ou citoyen"}
            </p>
          </div>
        </button>
      </motion.div>

      <DataTable 
        title={language === 'ar' ? "مراقبة الاعتمادات المؤقتة" : "Contrôle des Accréditations Temporaires"}
        columns={[
          { header: language === 'ar' ? "الموظفون المعتمدون" : "Personnel Accrédité", accessor: "name", render: (val: any, row: any) => (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                <Fingerprint size={18} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{val}</span>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{language === 'ar' ? 'معرف الجلسة' : 'Session ID'}: {row.id * 8243}</span>
              </div>
            </div>
          )},
          { header: language === 'ar' ? "المهمة" : "Mission", accessor: "role", render: (val: any) => {
            const roleKey = val === "Chef de Centre" ? "roles.chef" : 
                            val === "Observateur Bureau" ? "roles.obs_bureau" : 
                            val === "Observateur Centre" ? "roles.obs_center" : null;
            return (
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                  {roleKey ? t(roleKey) : val}
                </span>
              </div>
            );
          }},
          { header: language === 'ar' ? "المنطقة المعينة" : "Zone Affectée", accessor: "location", render: (val: any) => (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-zinc-400" />
              <span className="text-[11px] font-bold text-zinc-500 truncate max-w-[150px]">{val}</span>
            </div>
          )},
          { header: language === 'ar' ? "رمز الوصول" : "Token d'Accès", accessor: "code", render: (val: any) => (
            <div className="flex items-center gap-2">
              <QrCode size={14} className="text-zinc-400" />
              <code className="bg-zinc-100 dark:bg-white/10 px-2 py-1 rounded font-mono text-[10px] text-emerald-500 font-black border border-emerald-500/10 uppercase tracking-wider">
                {val}
              </code>
            </div>
          )},
          { header: language === 'ar' ? "التحقق" : "Vérification", accessor: "status", render: (val: any) => (
            <div className="flex items-center gap-2">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", (val === 'Actif' || val === 'نشط') ? "bg-emerald-500" : "bg-zinc-400")} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                (val === 'Actif' || val === 'نشط') ? "text-emerald-500" : "text-zinc-400"
              )}>
                {val}
              </span>
            </div>
          )},
          { header: language === 'ar' ? "الصلاحية" : "Validité", accessor: "expires", render: (val: any) => (
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-zinc-400" />
              <span className="text-[11px] font-bold text-zinc-500">{val}</span>
            </div>
          )},
        ]}
        data={observersData}
        onEdit={(row: any) => openModal(row)}
        onDelete={(row: any) => handleDelete(row.id)}
      />
    </div>
  );
}
