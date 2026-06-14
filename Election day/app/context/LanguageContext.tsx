"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type Language = "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    "nav.overview": "Tableau de Bord",
    "nav.votes": "Votes & Résultats",
    "nav.pvCapture": "Photo PV",
    "nav.centerView": "Vue Centre",
    "nav.settings": "Paramètres",
    "nav.logout": "Déconnexion",
    "common.search": "Rechercher…",
    "dash.title": "Jour d'Élection",
    "login.title": "PVP Jour d'Élection",
    "login.subtitle": "Portail Observateur Sécurisé",
    "login.welcome": "Bienvenue",
    "login.authenticate": "Authentifiez-vous pour continuer",
    "login.email": "Identifiant Email",
    "login.password": "Mot de Passe Sécurisé",
    "login.submit": "Accéder au Portail",
    "login.verifying": "Vérification…",
    "login.forgot": "Mot de passe oublié ?",
    "login.footer": "Infrastructure Gouvernementale Sécurisée",
    "bureau.assignedDesk": "Bureau Assigné",
    "bureau.parties": "Partis Politiques",
    "bureau.candidats": "Candidats",
    "bureau.submitted": "Résultats Soumis",
    "bureau.enterVotes": "Saisir les Votes",
    "bureau.submitVotes": "Soumettre les Votes",
    "bureau.votes": "votes",
    "bureau.pvPhoto": "Photo du Procès-Verbal",
    "bureau.takePhoto": "Prendre une Photo",
    "bureau.retake": "Reprendre",
    "bureau.upload": "Envoyer la Photo",
    "bureau.uploadFile": "Sélectionner un Fichier",
    "centre.centerInfo": "Information du Centre",
    "centre.totalDesks": "Total Bureaux",
    "centre.maleDesks": "Bureaux Hommes",
    "centre.femaleDesks": "Bureaux Femmes",
    "centre.results": "Résultats par Parti",
    "centre.totalVotes": "Total des Votes",
    "common.loading": "Chargement…",
    "common.noData": "Aucune donnée disponible",
    "common.refresh": "Actualiser",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.success": "Succès",
    "common.error": "Erreur",
    "common.units": "unités",
  },
  ar: {
    "nav.overview": "لوحة التحكم",
    "nav.votes": "الأصوات والنتائج",
    "nav.pvCapture": "صورة المحضر",
    "nav.centerView": "نظرة المركز",
    "nav.settings": "الإعدادات",
    "nav.logout": "تسجيل الخروج",
    "common.search": "بحث…",
    "dash.title": "يوم الانتخاب",
    "login.title": "PVP يوم الانتخاب",
    "login.subtitle": "بوابة المراقب الآمنة",
    "login.welcome": "مرحباً",
    "login.authenticate": "قم بالمصادقة للمتابعة",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.submit": "الدخول إلى البوابة",
    "login.verifying": "جاري التحقق…",
    "login.forgot": "نسيت كلمة المرور؟",
    "login.footer": "بنية حكومية آمنة",
    "bureau.assignedDesk": "المكتب المعيّن",
    "bureau.parties": "الأحزاب السياسية",
    "bureau.candidats": "المرشحون",
    "bureau.submitted": "النتائج المرسلة",
    "bureau.enterVotes": "إدخال الأصوات",
    "bureau.submitVotes": "إرسال الأصوات",
    "bureau.votes": "أصوات",
    "bureau.pvPhoto": "صورة محضر الفرز",
    "bureau.takePhoto": "التقاط صورة",
    "bureau.retake": "إعادة التقاط",
    "bureau.upload": "إرسال الصورة",
    "bureau.uploadFile": "اختيار ملف",
    "centre.centerInfo": "معلومات المركز",
    "centre.totalDesks": "إجمالي المكاتب",
    "centre.maleDesks": "مكاتب الذكور",
    "centre.femaleDesks": "مكاتب الإناث",
    "centre.results": "النتائج حسب الحزب",
    "centre.totalVotes": "مجموع الأصوات",
    "common.loading": "جاري التحميل…",
    "common.noData": "لا توجد بيانات",
    "common.refresh": "تحديث",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.success": "نجاح",
    "common.error": "خطأ",
    "common.units": "وحدة",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const stored = localStorage.getItem("pvp_lang") as Language | null;
    if (stored && (stored === "fr" || stored === "ar")) {
      setLanguageState(stored);
      document.documentElement.dir = stored === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = stored;
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("pvp_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string) => translations[language][key] || key,
    [language]
  );

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
