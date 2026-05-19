"use client";

import { useState, useEffect, useMemo } from "react";
import type { AdminRole } from "@/lib/types";
import { useAuth } from "@/app/context/AuthContext";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import {
  UserPlus,
  Shield,
  UserRound,
  BadgeCheck,
  ShieldAlert,
  Fingerprint,
  Activity,
  ShieldCheck,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { resolveGeoLabelForExport } from "@/lib/export-geo";

export default function GestionAcces() {
  const {
    adminsData,
    setAdminsData,
    membersData,
    setMembersData,
    wilayasData,
    communesData,
    partiesData,
    mutation,
  } = useData();
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "super_admin";
  const isAdminWilaya = user?.role === "admin_wilaya";
  const isAdminCommun = user?.role === "admin_commun";
  const canManageAdmins = isSuperAdmin || isAdminWilaya;

  const scopedCommunes = useMemo(() => {
    if (isSuperAdmin) return communesData;
    if (isAdminWilaya && user?.wilaya_id) {
      return communesData.filter((c) => String(c.wilaya_id) === String(user.wilaya_id));
    }
    if (isAdminCommun && user?.commune_id) {
      return communesData.filter((c) => String(c._id || c.id) === String(user.commune_id));
    }
    return communesData;
  }, [communesData, isSuperAdmin, isAdminWilaya, isAdminCommun, user?.wilaya_id, user?.commune_id]);

  const scopedWilayas = useMemo(() => {
    if (isSuperAdmin) return wilayasData;
    if (user?.wilaya_id) {
      return wilayasData.filter((w) => String(w._id || w.id) === String(user.wilaya_id));
    }
    return wilayasData;
  }, [wilayasData, isSuperAdmin, user?.wilaya_id]);

  const visibleAdmins = useMemo(() => {
    if (isSuperAdmin) return adminsData;
    if (isAdminWilaya) return adminsData.filter((a) => a.role === "admin_commun");
    return [];
  }, [adminsData, isSuperAdmin, isAdminWilaya]);

  const [activeTab, setActiveTab] = useState<"admins" | "members">(
    user?.role === "admin_commun" ? "members" : "admins"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"admin" | "member">("admin");
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    nin: "",
    password: "",
    role: "admin_wilaya" as AdminRole,
    wilaya: "",
    baladia: "",
    party_id: "",
    birthday: "",
    goal: "",
    admin_commun: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAdminCommun && activeTab === "admins") setActiveTab("members");
  }, [isAdminCommun, activeTab]);

  const tabs = [
    ...(canManageAdmins
      ? [
          {
            id: "admins" as const,
            label: language === "ar" ? "الإدارة" : "Administration",
            icon: Shield,
            count: visibleAdmins.length,
          },
        ]
      : []),
    {
      id: "members" as const,
      label: language === "ar" ? "الأعضاء النشطون" : "Membres Actifs",
      icon: Users,
      count: membersData.length,
    },
  ];

  const defaultAdminRole = (): AdminRole => (isAdminWilaya ? "admin_commun" : "admin_wilaya");

  const openModal = (mode: "admin" | "member", item: Record<string, unknown> | null = null) => {
    if (mode === "admin" && !canManageAdmins) return;
    setModalMode(mode);
    setEditingItem(item);
    if (item) {
      setNewUser({
        name: String(item.name ?? ""),
        email: String(item.email ?? ""),
        phone: String(item.phone ?? ""),
        nin: String(item.nin ?? ""),
        password: "",
        role: (item.role as AdminRole) || defaultAdminRole(),
        wilaya: String(item.wilaya_id || ""),
        baladia: String(item.commune_id || ""),
        party_id: String(item.party_id || ""),
        birthday: String(item.birthday || ""),
        goal: String(item.goal || ""),
        admin_commun: String(item.admin_commun || ""),
      });
    } else {
      setNewUser({
        name: "",
        email: "",
        phone: "",
        nin: "",
        password: "",
        role: mode === "admin" ? defaultAdminRole() : "admin_commun",
        wilaya: isAdminWilaya || isAdminCommun ? String(user?.wilaya_id || "") : "",
        baladia: isAdminCommun ? String(user?.commune_id || "") : "",
        party_id: "",
        birthday: "",
        goal: "",
        admin_commun: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string, type: "admin" | "member") => {
    if (!confirm(language === "ar" ? "هل أنت متأكد؟" : "Êtes-vous sûr de vouloir révoquer cet accès ?")) return;
    try {
      if (type === "admin") {
        if (!canManageAdmins) return;
        const admin = adminsData.find((a) => a.id === id || a._id === id);
        const apiId = admin?._id || admin?.id || id;
        await mutation.mutate("DELETE", `/admins/${apiId}`);
        setAdminsData([]);
      } else {
        const member = membersData.find((m) => m.id === id || m._id === id);
        const apiId = member?._id || member?.id || id;
        await mutation.mutate("DELETE", `/members-actifs/${apiId}`);
        setMembersData([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      alert(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "admin") {
        if (!canManageAdmins) return;
        const body: Record<string, unknown> = {
          full_name: newUser.name,
          email: newUser.email,
          nin: newUser.nin,
          phone: newUser.phone,
          status: "active",
        };
        if (newUser.password) body.password = newUser.password;

        if (isAdminWilaya) {
          body.role = "admin_commun";
          body.wilaya = user?.wilaya_id;
          body.commune = newUser.baladia;
        } else {
          body.role = newUser.role;
          if (newUser.role === "admin_wilaya") body.wilaya = newUser.wilaya;
          if (newUser.role === "admin_commun") {
            body.wilaya = newUser.wilaya;
            body.commune = newUser.baladia;
          }
        }

        if (editingItem) {
          const apiId = editingItem._id || editingItem.id;
          await mutation.mutate("PUT", `/admins/${apiId}`, body);
        } else {
          if (!newUser.password) {
            alert(language === "ar" ? "كلمة المرور مطلوبة" : "Password is required");
            return;
          }
          await mutation.mutate("POST", "/admins", body);
        }
        setAdminsData([]);
      } else {
        const body: Record<string, unknown> = {
          full_name: newUser.name,
          email: newUser.email,
          nin: newUser.nin,
          phone: newUser.phone,
          date_of_birth: newUser.birthday,
          goal: newUser.goal,
          wilaya: isAdminCommun ? user?.wilaya_id : newUser.wilaya,
          commune: isAdminCommun ? user?.commune_id : newUser.baladia,
          party: newUser.party_id || undefined,
        };
        if (newUser.password) body.password = newUser.password;

        if (editingItem) {
          const apiId = editingItem._id || editingItem.id;
          await mutation.mutate("PUT", `/members-actifs/${apiId}`, body);
        } else {
          if (!newUser.password) {
            alert(language === "ar" ? "كلمة المرور مطلوبة" : "Le mot de passe est requis");
            return;
          }
          if (!isAdminCommun && !newUser.wilaya) {
            alert(language === "ar" ? "الولاية مطلوبة" : "La Wilaya est requise");
            return;
          }
          if (!isAdminCommun && !newUser.baladia) {
            alert(language === "ar" ? "البلدية مطلوبة" : "La Commune est requise");
            return;
          }
          if (!newUser.birthday) {
            alert(language === "ar" ? "تاريخ الميلاد مطلوب" : "La date de naissance est requise");
            return;
          }
          await mutation.mutate("POST", "/members-actifs", body);
        }
        setMembersData([]);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { details?: string[] } };
      const details = e.response?.details;
      const detailStr = Array.isArray(details) ? "\n" + details.join("\n") : "";
      alert((e?.message || "Operation failed") + detailStr);
    }
  };

  const adminGeoField =
    isAdminWilaya || newUser.role === "admin_commun" ? (
      <motion.div className="space-y-2">
        {isAdminWilaya && user?.wilaya_id && (
          <p className="text-[10px] font-bold text-zinc-500 mb-2">
            {language === "ar" ? "الولاية:" : "Wilaya:"} {scopedWilayas[0]?.name || user.wilaya_id}
          </p>
        )}
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {language === "ar" ? "البلدية" : "Commune"}
        </label>
        <select
          required
          className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
          value={newUser.baladia}
          onChange={(e) => {
            const com = scopedCommunes.find((c) => c._id === e.target.value || c.id === e.target.value);
            setNewUser({
              ...newUser,
              baladia: e.target.value,
              wilaya: isAdminWilaya ? String(user?.wilaya_id || "") : String(com?.wilaya_id || ""),
            });
          }}
        >
          <option value="">{language === "ar" ? "اختر بلدية" : "Sélectionner une Commune"}</option>
          {scopedCommunes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
              {isSuperAdmin ? ` (${c.wilaya})` : ""}
            </option>
          ))}
        </select>
      </motion.div>
    ) : newUser.role === "admin_wilaya" ? (
      <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {language === "ar" ? "الولاية" : "Wilaya"}
        </label>
        <select
          className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
          value={newUser.wilaya}
          onChange={(e) => setNewUser({ ...newUser, wilaya: e.target.value })}
        >
          <option value="">{language === "ar" ? "اختر ولاية" : "Sélectionner une Wilaya"}</option>
          {wilayasData.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    ) : null;

  return (
    <div className="space-y-10 pb-20">
      <motion.div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 w-full">
        <motion.div
          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2 flex-1 w-full min-w-0"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
            <ShieldAlert size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              {language === "ar" ? "مراقبة الحوكمة" : "Contrôle de Gouvernance"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta w-full">
            {t("nav.access")}
          </h1>
          <p className="w-full text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
            {language === "ar"
              ? "تنظيم التصاريح المؤسسية وتدقيق الموظفين التشغيليين."
              : "Orchestration des permissions institutionnelles et audit du personnel opérationnel."}
          </p>
        </motion.div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => openModal(activeTab === "admins" && canManageAdmins ? "admin" : "member")}
            className="h-12 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} strokeWidth={3} />
            {activeTab === "admins" && canManageAdmins
              ? language === "ar"
                ? "مسؤول جديد"
                : "Nouvel Admin"
              : language === "ar"
                ? "تسجيل عضو"
                : "Inscrire Membre"}
          </button>
        </div>
      </motion.div>

      <div
        className={cn(
          "grid gap-1 md:flex md:flex-nowrap items-center md:gap-2 p-1.5 glass dark:bg-white/5 rounded-[22px] w-full md:w-fit border-white/5",
          tabs.length === 1 ? "grid-cols-1" : "grid-cols-2"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 p-2 md:px-6 md:py-3 rounded-[18px] text-[8px] md:text-xs font-black uppercase tracking-tight md:tracking-widest transition-all duration-500 relative",
              activeTab === tab.id
                ? "bg-white dark:bg-white text-zinc-900 dark:text-black scale-100 md:scale-105 z-10"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4" strokeWidth={2.5} />
            <span>{tab.label}</span>
            <span
              className={cn(
                "md:ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black hidden sm:block",
                activeTab === tab.id ? "bg-zinc-900/10 text-zinc-900" : "bg-zinc-200 dark:bg-white/10 text-zinc-500"
              )}
            >
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-white rounded-[18px] -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem
            ? language === "ar"
              ? "تعديل الوصول"
              : "Modification d'Accès"
            : modalMode === "admin"
              ? language === "ar"
                ? "توظيف مسؤول"
                : "Recrutement Admin"
              : language === "ar"
                ? "تسجيل عضو"
                : "Enrôlement Membre"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          {modalMode === "admin" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {language === "ar" ? "هوية المسؤول" : "Identité de l'Administrateur"}
                </label>
                <input
                  required
                  type="text"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {language === "ar" ? "الهاتف" : "Téléphone"}
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
              </div>
              <motion.div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NIN</label>
                <input
                  required
                  type="text"
                  maxLength={18}
                  inputMode="numeric"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                  value={newUser.nin}
                  onChange={(e) => setNewUser({ ...newUser, nin: e.target.value.replace(/\D/g, "") })}
                />
              </motion.div>
              <div className={cn("grid gap-4", isSuperAdmin || isAdminWilaya ? "grid-cols-2" : "grid-cols-1")}>
                {isSuperAdmin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {language === "ar" ? "مستوى السلطة" : "Niveau d'Autorité"}
                    </label>
                    <select
                      className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          role: e.target.value as AdminRole,
                          wilaya: "",
                          baladia: "",
                        })
                      }
                    >
                      <option value="admin_wilaya">{language === "ar" ? "مسؤول ولاية" : "Admin Wilaya"}</option>
                      <option value="admin_commun">{language === "ar" ? "مسؤول بلدية" : "Admin Commun"}</option>
                      {editingItem?.role === "super_admin" && (
                        <option value="super_admin">{language === "ar" ? "مسؤول أعلى" : "Super Admin"}</option>
                      )}
                    </select>
                  </div>
                )}
                {isAdminWilaya && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {language === "ar" ? "مستوى السلطة" : "Niveau d'Autorité"}
                    </label>
                    <div className="w-full h-12 px-4 rounded-xl bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 flex items-center text-sm font-bold text-zinc-600 dark:text-zinc-300">
                      {language === "ar" ? "مسؤول بلدية" : "Admin Commun"}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {language === "ar" ? "كلمة المرور" : "Mot de Passe"}
                  </label>
                  <motion.div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold pr-12"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required={!editingItem}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>
                </div>
              </div>
              {adminGeoField}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {language === "ar" ? "اسم العضو النشط" : "Nom du Membre Actif"}
                </label>
                <input
                  required
                  type="text"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {language === "ar" ? "الهاتف" : "Téléphone"}
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {language === "ar" ? "الانتماء السياسي" : "Affiliation Politique"}
                  </label>
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                    value={newUser.party_id}
                    onChange={(e) => setNewUser({ ...newUser, party_id: e.target.value })}
                  >
                    <option value="">{language === "ar" ? "مستقل" : "Indépendant"}</option>
                    {partiesData.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.acronym})
                      </option>
                    ))}
                  </select>
                </div>
                {!isAdminCommun && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {language === "ar" ? "الولاية" : "Wilaya"}
                    </label>
                    <select
                      className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                      value={newUser.wilaya}
                      onChange={(e) => setNewUser({ ...newUser, wilaya: e.target.value, baladia: "" })}
                    >
                      <option value="">{language === "ar" ? "اختر ولاية" : "Sélectionner une Wilaya"}</option>
                      {scopedWilayas.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {!isAdminCommun ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {language === "ar" ? "البلدية" : "Commune"}
                    </label>
                    <select
                      required
                      className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                      value={newUser.baladia}
                      onChange={(e) => setNewUser({ ...newUser, baladia: e.target.value })}
                    >
                      <option value="">{language === "ar" ? "اختر بلدية" : "Sélectionner une Commune"}</option>
                      {scopedCommunes
                        .filter((c) => !newUser.wilaya || String(c.wilaya_id) === String(newUser.wilaya))
                        .map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {language === "ar" ? "البلدية" : "Commune"}
                    </label>
                    <div className="w-full h-12 px-4 rounded-xl bg-zinc-100 dark:bg-white/10 border flex items-center text-sm font-bold text-zinc-600">
                      {scopedCommunes[0]?.name || user?.commune_id}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NIN</label>
                  <input
                    required
                    type="text"
                    maxLength={18}
                    inputMode="numeric"
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                    value={newUser.nin}
                    onChange={(e) => setNewUser({ ...newUser, nin: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {language === "ar" ? "تاريخ الميلاد" : "Date de Naissance"}
                </label>
                <input
                  required
                  type="date"
                  className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                  value={newUser.birthday}
                  onChange={(e) => setNewUser({ ...newUser, birthday: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {language === "ar" ? "كلمة المرور" : "Mot de Passe"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold pr-12"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required={!editingItem}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {language === "ar" ? "الهدف" : "Objectif"}
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold resize-none"
                  value={newUser.goal}
                  onChange={(e) => setNewUser({ ...newUser, goal: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest"
            >
              {language === "ar" ? "إلغاء" : "Annuler"}
            </button>
            <button
              type="submit"
              className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest"
            >
              {editingItem ? (language === "ar" ? "حفظ" : "Sauvegarder") : language === "ar" ? "تصريح" : "Autoriser"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeTab === "admins" && canManageAdmins && (
              <DataTable
                title={
                  isAdminWilaya
                    ? language === "ar"
                      ? "مسؤولو البلديات"
                      : "Registre Admin Commune"
                    : language === "ar"
                      ? "سجل الإدارة"
                      : "Registre Administration"
                }
                exportFileName="registre-admins-anie"
                columns={[
                  {
                    header: language === "ar" ? "المشغل" : "Opérateur",
                    accessor: "name",
                    render: (val, row) => (
                      <div className="flex items-center gap-3">
                        <Fingerprint size={18} className="text-emerald-500" />
                        <motion.div>
                          <span className="font-black text-zinc-900 dark:text-white">{String(val)}</span>
                          <span className="block text-[9px] text-zinc-400">{String(row.email)}</span>
                        </motion.div>
                      </div>
                    ),
                  },
                  { header: "NIN", accessor: "nin" },
                  {
                    header: language === "ar" ? "السلطة" : "Autorité",
                    accessor: "role",
                    exportValue: (row) => {
                      const r = row.role as string;
                      return r === "super_admin"
                        ? t("roles.super_admin")
                        : r === "admin_wilaya"
                          ? t("roles.admin_wilaya")
                          : t("roles.admin_commun");
                    },
                    render: (val) => (
                      <span className="text-[11px] font-black uppercase">
                        {val === "super_admin"
                          ? t("roles.super_admin")
                          : val === "admin_wilaya"
                            ? t("roles.admin_wilaya")
                            : t("roles.admin_commun")}
                      </span>
                    ),
                  },
                  {
                    header: language === "ar" ? "الولاية" : "Wilaya",
                    accessor: "wilaya",
                    exportValue: (row) =>
                      row.role === "super_admin"
                        ? "National"
                        : String(row.wilaya_export || "") ||
                          resolveGeoLabelForExport(String(row.wilaya_id || ""), wilayasData, String(row.wilaya || "")),
                  },
                  {
                    header: language === "ar" ? "البلدية" : "Commune",
                    accessor: "commune",
                    exportValue: (row) =>
                      row.role === "admin_commun"
                        ? String(row.commune_export || "") ||
                          resolveGeoLabelForExport(String(row.commune_id || ""), communesData, String(row.commune || ""))
                        : "",
                    render: (_v, row) => (
                      <span className="text-[11px] font-bold text-zinc-500">
                        {row.role === "admin_commun" ? String(row.commune || "—") : "—"}
                      </span>
                    ),
                  },
                  { header: language === "ar" ? "الحالة" : "Statut", accessor: "status" },
                ]}
                data={visibleAdmins}
                onEdit={(row) => openModal("admin", row)}
                onDelete={(row) => handleDelete(row.id as string, "admin")}
              />
            )}

            {activeTab === "members" && (
              <DataTable
                title={language === "ar" ? "الأعضاء النشطون" : "Membres Actifs"}
                columns={[
                  {
                    header: language === "ar" ? "العضو" : "Membre",
                    accessor: "name",
                    render: (val, row) => (
                      <div className="flex items-center gap-3">
                        <UserRound size={18} />
                        <div>
                          <span className="font-black">{String(val)}</span>
                          <span className="block text-[9px] text-zinc-400">{String(row.email)}</span>
                        </div>
                      </div>
                    ),
                  },
                  { header: language === "ar" ? "المشرف" : "Superviseur", accessor: "admin_commun" },
                  { header: language === "ar" ? "المهمة" : "Mission", accessor: "goal" },
                  { header: language === "ar" ? "الحالة" : "Statut", accessor: "status" },
                ]}
                data={membersData}
                onEdit={(row) => openModal("member", row)}
                onDelete={(row) => handleDelete(row.id as string, "member")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
