"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2,
  User,
  Bell,
  Shield,
  Palette,
  Check,
  Save,
  Moon,
  Sun,
  Laptop,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme, type ThemeMode } from "@/app/context/ThemeContext";
import { api, ApiError } from "@/lib/api";
import { normalizeAuthUser } from "@/lib/auth-user";
import type { AuthUser, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import PageHero from "../components/PageHero";

type TabId = "profile" | "security" | "notifications" | "appearance";

function roleLabel(role: UserRole, language: string): string {
  const map: Record<UserRole, { fr: string; ar: string }> = {
    super_admin: { fr: "Super administrateur", ar: "المشرف العام" },
    admin_wilaya: { fr: "Administrateur wilaya", ar: "مشرف الولاية" },
    admin_commun: { fr: "Administrateur commune", ar: "مشرف البلدية" },
    member_actif: { fr: "Membre actif", ar: "عضو نشط" },
    role_election_day: { fr: "Rôle jour J", ar: "دور يوم الانتخاب" },
    citizen: { fr: "Citoyen", ar: "مواطن" },
  };
  const entry = map[role];
  return language === "ar" ? entry.ar : entry.fr;
}

type ProfileForm = {
  full_name: string;
  email: string;
  phone: string;
  goal: string;
  date_of_birth: string;
};

function userToForm(user: AuthUser): ProfileForm {
  return {
    full_name: user.full_name || "",
    email: user.email || "",
    phone: user.phone || "",
    goal: user.goal || "",
    date_of_birth: user.date_of_birth ? user.date_of_birth.slice(0, 10) : "",
  };
}

export default function SettingsPage() {
  const { t, language, setLanguage, dir } = useLanguage();
  const { user, refreshUser, setUser, isLoading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    full_name: "",
    email: "",
    phone: "",
    goal: "",
    date_of_birth: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const syncProfileFromUser = useCallback((u: AuthUser) => {
    setProfileForm(userToForm(u));
  }, []);

  useEffect(() => {
    if (!user) return;
    syncProfileFromUser(user);
  }, [user, syncProfileFromUser]);

  useEffect(() => {
    if (!authLoading && user) {
      refreshUser().catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { id: "profile" as const, label: language === "ar" ? "الملف الشخصي" : "Profil", icon: User },
    { id: "security" as const, label: language === "ar" ? "الأمان" : "Sécurité", icon: Shield },
    { id: "notifications" as const, label: language === "ar" ? "الإشعارات" : "Notifications", icon: Bell },
    { id: "appearance" as const, label: language === "ar" ? "المظهر" : "Apparence", icon: Palette },
  ];

  const inputClass = (editable: boolean) =>
    cn(
      "w-full h-12 px-4 rounded-xl outline-none text-sm font-bold transition-all",
      editable
        ? "bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:ring-2 focus:ring-algerian-green/20"
        : "bg-zinc-50 dark:bg-white/5 border border-transparent text-zinc-500 cursor-not-allowed"
    );

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      const body: Record<string, string> = {
        full_name: profileForm.full_name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
      };
      if (user.role === "member_actif") {
        if (profileForm.goal !== undefined) body.goal = profileForm.goal.trim();
        if (profileForm.date_of_birth) body.date_of_birth = profileForm.date_of_birth;
      }
      const res = await api.updateProfile(body);
      if (res.ok && res.user) {
        const normalized = normalizeAuthUser(res.user as unknown as Record<string, unknown>);
        if (normalized) {
          setUser(normalized);
          syncProfileFromUser(normalized);
        }
        setIsEditingProfile(false);
        setProfileMessage({
          type: "ok",
          text: language === "ar" ? "تم تحديث الملف الشخصي" : "Profil mis à jour",
        });
      }
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : language === "ar" ? "فشل التحديث" : "Échec de la mise à jour";
      setProfileMessage({ type: "err", text });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "err",
        text: language === "ar" ? "كلمتا المرور غير متطابقتين" : "Les mots de passe ne correspondent pas",
      });
      return;
    }
    setPasswordSaving(true);
    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({
        type: "ok",
        text: language === "ar" ? "تم تغيير كلمة المرور" : "Mot de passe modifié",
      });
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : language === "ar" ? "فشل تغيير كلمة المرور" : "Échec du changement";
      setPasswordMessage({ type: "err", text });
    } finally {
      setPasswordSaving(false);
    }
  };

  const cancelProfileEdit = () => {
    if (user) syncProfileFromUser(user);
    setIsEditingProfile(false);
    setProfileMessage(null);
  };

  if (authLoading && !user) {
    return (
      <motion.div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </motion.div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <PageHero
        dir={dir}
        badge={
          <div className="flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
            <Settings2 size={12} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
              {language === "ar" ? "\u062a\u0643\u0648\u064a\u0646 \u0627\u0644\u062d\u0633\u0627\u0628" : "Configuration du compte"}
            </span>
          </div>
        }
        title={t("nav.settings")}
        subtitle={
          language === "ar"
            ? "\u0639\u0631\u0636 \u0648\u062a\u0639\u062f\u064a\u0644 \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u062d\u0633\u0627\u0628\u0643 \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0645\u0638\u0647\u0631 \u0627\u0644\u0648\u0627\u062c\u0647\u0629."
            : "Consultez et modifiez vos informations, votre mot de passe et l'apparence de l'interface."
        }
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full shrink-0 lg:w-64">
          <div className="custom-scrollbar flex flex-row gap-2 overflow-x-auto pb-4 lg:flex-col lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-3 whitespace-nowrap rounded-2xl border px-5 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300",
                  activeTab === tab.id
                    ? "border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-white/5 dark:bg-white/10 dark:text-white"
                    : "border-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-white"
                )}
              >
                <tab.icon
                  size={18}
                  strokeWidth={2.5}
                  className={cn(activeTab === tab.id ? "text-algerian-green" : "text-zinc-400")}
                />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="settingsTab"
                    className="absolute top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-algerian-green"
                    style={{ left: dir === "rtl" ? "auto" : 0, right: dir === "rtl" ? 0 : "auto" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-[32px] border border-zinc-200 p-6 shadow-sm dark:border-white/5 dark:bg-[#09090b] lg:p-10"
            >
              {activeTab === "profile" && user && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/5">
                        <User size={32} className="text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white">{user.full_name}</h3>
                        <p className="text-sm font-medium text-zinc-500">
                          {roleLabel(user.role, language)} • PVP
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isEditingProfile ? (
                        <>
                          <button
                            type="button"
                            onClick={cancelProfileEdit}
                            disabled={profileSaving}
                            className="h-10 rounded-xl bg-zinc-100 px-5 text-[11px] font-black uppercase tracking-widest text-zinc-600 transition-all hover:bg-zinc-200 disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                          >
                            {language === "ar" ? "إلغاء" : "Annuler"}
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                            className="flex h-10 items-center gap-2 rounded-xl bg-algerian-green px-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-algerian-green-dark disabled:opacity-50"
                          >
                            {profileSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {language === "ar" ? "حفظ" : "Enregistrer"}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="h-10 rounded-xl bg-zinc-100 px-5 text-[11px] font-black uppercase tracking-widest text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                          {language === "ar" ? "تعديل" : "Modifier"}
                        </button>
                      )}
                    </div>
                  </div>

                  {profileMessage && (
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold",
                        profileMessage.type === "ok"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}
                    >
                      {profileMessage.type === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {profileMessage.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "الاسم الكامل" : "Nom complet"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                        disabled={!isEditingProfile}
                        className={inputClass(isEditingProfile)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "البريد الإلكتروني" : "Adresse e-mail"}
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                        disabled={!isEditingProfile}
                        className={inputClass(isEditingProfile)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "رقم الهاتف" : "Téléphone"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                        disabled={!isEditingProfile}
                        placeholder="+2135XXXXXXXX"
                        className={inputClass(isEditingProfile)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "رقم التعريف الوطني" : "NIN"}
                      </label>
                      <input type="text" value={user.nin || "—"} disabled className={inputClass(false)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "الدور" : "Rôle"}
                      </label>
                      <input
                        type="text"
                        value={roleLabel(user.role, language)}
                        disabled
                        className={inputClass(false)}
                      />
                    </div>
                    {user.role === "member_actif" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            {language === "ar" ? "تاريخ الميلاد" : "Date de naissance"}
                          </label>
                          <input
                            type="date"
                            value={profileForm.date_of_birth}
                            onChange={(e) => setProfileForm((f) => ({ ...f, date_of_birth: e.target.value }))}
                            disabled={!isEditingProfile}
                            className={inputClass(isEditingProfile)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            {language === "ar" ? "الهدف" : "Objectif"}
                          </label>
                          <input
                            type="text"
                            value={profileForm.goal}
                            onChange={(e) => setProfileForm((f) => ({ ...f, goal: e.target.value }))}
                            disabled={!isEditingProfile}
                            className={inputClass(isEditingProfile)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-200 pb-4 dark:border-white/10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                      {language === "ar" ? "تغيير كلمة المرور" : "Changer le mot de passe"}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-zinc-500">
                      {language === "ar"
                        ? "8 أحرف على الأقل، حرف كبير، رقم ورمز خاص"
                        : "8 caractères min., une majuscule, un chiffre et un caractère spécial"}
                    </p>
                  </div>

                  {passwordMessage && (
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold",
                        passwordMessage.type === "ok"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}
                    >
                      {passwordMessage.type === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {passwordMessage.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "كلمة المرور الحالية" : "Mot de passe actuel"}
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={inputClass(true)}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "كلمة المرور الجديدة" : "Nouveau mot de passe"}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={inputClass(true)}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {language === "ar" ? "تأكيد كلمة المرور" : "Confirmer le mot de passe"}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClass(true)}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                    className="flex h-11 items-center gap-2 rounded-xl bg-algerian-green px-6 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-algerian-green-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {passwordSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {language === "ar" ? "تحديث كلمة المرور" : "Mettre à jour le mot de passe"}
                  </button>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="border-b border-zinc-200 pb-4 text-sm font-black uppercase tracking-widest text-zinc-900 dark:border-white/10 dark:text-white">
                      {language === "ar" ? "اللغة" : "Langue"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {(["fr", "ar"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setLanguage(lang)}
                          className={cn(
                            "flex items-center justify-between rounded-2xl border-2 p-4 transition-all",
                            language === lang
                              ? "border-algerian-green bg-algerian-green/5"
                              : "border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                          )}
                        >
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            {lang === "fr" ? "Français" : "العربية"}
                          </span>
                          {language === lang && <Check size={18} className="text-algerian-green" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="border-b border-zinc-200 pb-4 text-sm font-black uppercase tracking-widest text-zinc-900 dark:border-white/10 dark:text-white">
                      {language === "ar" ? "سمة الواجهة" : "Thème de l'interface"}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {(
                        [
                          { id: "light" as ThemeMode, icon: Sun, label: language === "ar" ? "فاتح" : "Clair" },
                          { id: "dark" as ThemeMode, icon: Moon, label: language === "ar" ? "داكن" : "Sombre" },
                          { id: "system" as ThemeMode, icon: Laptop, label: language === "ar" ? "النظام" : "Système" },
                        ] as const
                      ).map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setTheme(id)}
                          className={cn(
                            "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all",
                            theme === id
                              ? "border-algerian-green bg-algerian-green/5"
                              : "border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                          )}
                        >
                          <Icon size={24} className={theme === id ? "text-algerian-green" : "text-zinc-500"} />
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">{label}</span>
                          {theme === id && <Check size={16} className="text-algerian-green" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <p className="text-sm font-medium text-zinc-500">
                  {language === "ar"
                    ? "إعدادات الإشعارات ستكون متاحة قريباً."
                    : "Les préférences de notifications seront disponibles prochainement."}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
