"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings2, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone, 
  Check, 
  Lock, 
  Mail, 
  Save,
  Moon,
  Sun,
  Laptop
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t, language, setLanguage, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "appearance">("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);

  const tabs = [
    { id: "profile", label: language === 'ar' ? 'الملف الشخصي' : 'Profil', icon: User },
    { id: "security", label: language === 'ar' ? 'الأمان' : 'Sécurité', icon: Shield },
    { id: "notifications", label: language === 'ar' ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: "appearance", label: language === 'ar' ? 'المظهر' : 'Apparence', icon: Palette },
  ] as const;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
            <Settings2 size={12} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
              {language === 'ar' ? 'تكوين النظام' : 'Configuration Système'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white lg:text-4xl lg:whitespace-nowrap font-plus-jakarta">
            {t("nav.settings")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            {language === 'ar' 
              ? 'إدارة تفضيلات حسابك، وإعدادات الأمان، وتخصيص واجهة منصة السلطة الوطنية المستقلة للانتخابات.' 
              : 'Gérez vos préférences de compte, les paramètres de sécurité et personnalisez l\'interface de la plateforme de l\'ANIE.'}
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 px-6 rounded-2xl bg-algerian-green text-white text-[11px] font-black uppercase tracking-widest hover:bg-algerian-green-dark transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Settings2 size={16} />
              </motion.div>
            ) : (
              <Save size={16} />
            )}
            {language === 'ar' ? 'حفظ التغييرات' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-white/5"
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white border border-transparent"
                )}
              >
                <tab.icon size={18} strokeWidth={2.5} className={cn(
                  activeTab === tab.id ? "text-algerian-green" : "text-zinc-400"
                )} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-algerian-green rounded-r-full"
                    style={{ left: dir === 'rtl' ? 'auto' : 0, right: dir === 'rtl' ? 0 : 'auto' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass dark:bg-[#09090b] border border-zinc-200 dark:border-white/5 rounded-[32px] p-6 lg:p-10 shadow-sm"
            >
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <User size={32} className="text-zinc-400" />
                        {isEditingProfile && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity cursor-pointer">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">
                              {language === 'ar' ? 'تغيير' : 'Modifier'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white">Admin Central</h3>
                        <p className="text-sm font-medium text-zinc-500">Super Admin • ANIE</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className={cn(
                        "h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                        isEditingProfile 
                          ? "bg-algerian-green text-white hover:bg-algerian-green-dark" 
                          : "bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/20"
                      )}
                    >
                      {isEditingProfile 
                        ? (language === 'ar' ? 'حفظ التعديلات' : 'Enregistrer') 
                        : (language === 'ar' ? 'تعديل' : 'Modifier')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {language === 'ar' ? 'الاسم الكامل' : 'Nom Complet'}
                      </label>
                      <input 
                        type="text" 
                        defaultValue="Admin Central"
                        disabled={!isEditingProfile}
                        className={cn("w-full h-12 px-4 rounded-xl outline-none text-sm font-bold transition-all", isEditingProfile ? "bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:ring-2 focus:ring-algerian-green/20" : "bg-zinc-50 dark:bg-white/5 border border-transparent text-zinc-500 cursor-not-allowed")} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Adresse Email'}
                      </label>
                      <div className="relative">
                        <input 
                          type="email" 
                          defaultValue="admin@anie.dz"
                          disabled={!isEditingProfile}
                          className={cn(
                            "w-full h-12 rounded-xl outline-none text-sm font-bold transition-all", 
                            dir === 'rtl' ? "pr-4 pl-20" : "pl-4 pr-20",
                            isEditingProfile 
                              ? "bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:ring-2 focus:ring-algerian-green/20" 
                              : "bg-zinc-50 dark:bg-white/5 border border-transparent text-zinc-500 cursor-not-allowed"
                          )} 
                        />
                        <div className={cn(
                          "absolute top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500",
                          dir === 'rtl' ? "left-4" : "right-4"
                        )}>
                          <Check size={12} />
                          {language === 'ar' ? 'مُحقق' : 'Vérifié'}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {language === 'ar' ? 'رقم الهاتف' : 'Numéro de Téléphone'}
                      </label>
                      <input 
                        type="text" 
                        defaultValue="+213 555 12 34 56"
                        disabled={!isEditingProfile}
                        className={cn("w-full h-12 px-4 rounded-xl outline-none text-sm font-bold transition-all", isEditingProfile ? "bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:ring-2 focus:ring-algerian-green/20" : "bg-zinc-50 dark:bg-white/5 border border-transparent text-zinc-500 cursor-not-allowed")} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {language === 'ar' ? 'المنصب / الهيئة' : 'Poste / Organisme'}
                      </label>
                      <input 
                        type="text" 
                        defaultValue="Direction Générale"
                        disabled
                        className="w-full h-12 px-4 rounded-xl bg-zinc-100 dark:bg-white/5 border border-transparent outline-none text-sm font-bold text-zinc-500 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                        {language === 'ar' ? 'تغيير كلمة المرور' : 'Changer le Mot de Passe'}
                      </h3>
                      <button 
                        onClick={() => setIsEditingSecurity(!isEditingSecurity)}
                        className={cn(
                          "h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                          isEditingSecurity 
                            ? "bg-algerian-green text-white hover:bg-algerian-green-dark" 
                            : "bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/20"
                        )}
                      >
                        {isEditingSecurity 
                          ? (language === 'ar' ? 'حفظ التعديلات' : 'Enregistrer') 
                          : (language === 'ar' ? 'تعديل' : 'Modifier')}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          {language === 'ar' ? 'كلمة المرور الحالية' : 'Mot de passe actuel'}
                        </label>
                        <input disabled={!isEditingSecurity} type="password" placeholder="••••••••" className={cn("w-full h-12 px-4 rounded-xl outline-none text-sm font-bold transition-all", isEditingSecurity ? "bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:ring-2 focus:ring-algerian-green/20" : "bg-zinc-50 dark:bg-white/5 border border-transparent text-zinc-500 cursor-not-allowed")} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          {language === 'ar' ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
                        </label>
                        <input disabled={!isEditingSecurity} type="password" placeholder="••••••••" className={cn("w-full h-12 px-4 rounded-xl outline-none text-sm font-bold transition-all", isEditingSecurity ? "bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:ring-2 focus:ring-algerian-green/20" : "bg-zinc-50 dark:bg-white/5 border border-transparent text-zinc-500 cursor-not-allowed")} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white/10 pb-4">
                      {language === 'ar' ? 'المصادقة الثنائية (2FA)' : 'Authentification à Deux Facteurs (2FA)'}
                    </h3>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Smartphone size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">
                            {language === 'ar' ? 'تطبيق المصادقة' : 'Application Authenticator'}
                          </p>
                          <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
                            {language === 'ar' ? 'استخدم Google Authenticator أو Authy' : 'Utilisez Google Authenticator ou Authy'}
                          </p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-500 transition-colors cursor-pointer">
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                          dir === 'rtl' ? "left-1 translate-x-6" : "left-1 translate-x-6"
                        )} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white/10 pb-4">
                      {language === 'ar' ? 'اللغة والإقليم' : 'Langue & Région'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setLanguage('fr')}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                          language === 'fr' 
                            ? "border-algerian-green bg-algerian-green/5" 
                            : "border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🇫🇷</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">Français</span>
                        </div>
                        {language === 'fr' && <Check size={18} className="text-algerian-green" />}
                      </button>
                      <button 
                        onClick={() => setLanguage('ar')}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                          language === 'ar' 
                            ? "border-algerian-green bg-algerian-green/5" 
                            : "border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🇩🇿</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">العربية</span>
                        </div>
                        {language === 'ar' && <Check size={18} className="text-algerian-green" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white/10 pb-4">
                      {language === 'ar' ? 'سمة الواجهة' : 'Thème de l\'Interface'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
                        <Sun size={24} className="text-zinc-500" />
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {language === 'ar' ? 'فاتح' : 'Clair'}
                        </span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-algerian-green bg-algerian-green/5 transition-all">
                        <Moon size={24} className="text-algerian-green" />
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {language === 'ar' ? 'داكن' : 'Sombre'}
                        </span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
                        <Laptop size={24} className="text-zinc-500" />
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {language === 'ar' ? 'النظام' : 'Système'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {language === 'ar' ? 'تنبيهات المحاضر (PV)' : 'Alertes des PVs'}
                      </p>
                      <p className="text-[11px] font-medium text-zinc-500 mt-1">
                        {language === 'ar' ? 'إشعارات عند اكتشاف تناقض في محضر.' : 'Notifications lors de la détection de discordance dans un PV.'}
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-500">
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                        dir === 'rtl' ? "left-1 translate-x-6" : "left-1 translate-x-6"
                      )} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {language === 'ar' ? 'التقارير اليومية' : 'Rapports Quotidiens'}
                      </p>
                      <p className="text-[11px] font-medium text-zinc-500 mt-1">
                        {language === 'ar' ? 'ملخص يومي للمشاركة ونشاط النظام.' : 'Résumé quotidien de la participation et de l\'activité système.'}
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-zinc-300 dark:bg-white/10">
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                        dir === 'rtl' ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {language === 'ar' ? 'تنبيهات الأمان' : 'Alertes de Sécurité'}
                      </p>
                      <p className="text-[11px] font-medium text-zinc-500 mt-1">
                        {language === 'ar' ? 'محاولات تسجيل دخول مشبوهة وتغييرات في الأذونات.' : 'Tentatives de connexion suspectes et changements de permissions.'}
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-500">
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                        dir === 'rtl' ? "left-1 translate-x-6" : "left-1 translate-x-6"
                      )} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
