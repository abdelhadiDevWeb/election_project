"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.overview": "Tableau de Bord",
    "nav.access": "Gestion des Accès",
    "nav.infrastructure": "Infrastructure",
    "nav.entities": "Entités Politiques",
    "nav.validation": "Saisie & Audit PV",
    "nav.roles": "Rôles & Missions",
    "nav.settings": "Paramètres",
    "nav.logout": "Déconnexion",

    // Dashboard
    "dash.title": "Tableau de Bord",
    "dash.subtitle": "Surveillance en temps réel de l'infrastructure électorale nationale et de la validation des résultats.",
    "dash.badge": "Opérations Nationales",
    "dash.kpi.centers": "Centres de Vote",
    "dash.kpi.desks": "Bureaux de Vote",
    "dash.kpi.voters": "Électeurs Inscrits",
    "dash.kpi.turnout": "Taux de Participation",
    "dash.recent.title": "Flux d'Activité Récent",
    "dash.recent.subtitle": "Dernières validations et alertes système",
    "dash.scope.national": "National",
    "dash.scope.wilaya": "Wilaya",
    "dash.scope.communal": "Communal",
    "dash.scope.commun": "Commun",

    // Infrastructure
    "infra.title": "Infrastructure Électorale",
    "infra.subtitle": "Configuration et déploiement de la hiérarchie administrative pour le scrutin national.",
    "infra.badge": "Cartographie Nationale",
    "infra.btn.add": "Ajouter Centre",
    "infra.tab.centers": "Centres de Vote",
    "infra.tab.desks": "Bureaux de Vote",
    "infra.table.name": "Nom du Centre",
    "infra.table.location": "Localisation",
    "infra.table.capacity": "Capacité",

    // Access Management
    "access.title": "Gestion des Accès",
    "access.subtitle": "Orchestration des permissions institutionnelles et audit du personnel opérationnel national.",
    "access.badge": "Contرôle de Gouvernance",
    "access.btn.add": "Créer Utilisateur",
    "access.tab.admins": "Administrateurs",
    "access.tab.members": "Membres de Bureau",
    "access.table.user": "Utilisateur",
    "access.table.role": "Rôle",
    "access.table.status": "Statut",

    // Political Entities
    "entities.title": "Entités Politiques",
    "entities.subtitle": "Gestion institutionnelle des partis et validation du registre national des candidatures.",
    "entities.badge": "Registre Officiel",
    "entities.btn.add.party": "Enregistrer Parti",
    "entities.btn.add.candidate": "Inscrire Candidat",
    "entities.tab.parties": "Partis Politiques",
    "entities.tab.candidates": "Candidatures",

    // Validation
    "val.title": "Saisie & Audit PV",
    "val.badge": "Validation Intelligente",
    "val.table.pv": "Procès-Verbal",
    "val.table.status": "État de Validation",
    "val.btn.audit": "Auditer PV",

    // Roles
    "roles.title": "Rôles & Missions",
    "roles.subtitle": "Gestion des accréditations temporaires et supervision du personnel de terrain.",
    "roles.badge": "Déploiement Opérationnel",
    "roles.btn.add": "Accréditer Observateur",

    // Common
    "common.search": "Rechercher...",
    "common.filter": "Filtrer",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.actions": "Actions",
    "common.units": "UNITÉS",
    "common.variation": "Variation",
    "user.admin_central": "Admin Central",
    "roles.chef": "Chef de Centre",
    "roles.obs_bureau": "Observateur Bureau",
    "roles.obs_center": "Observateur Centre",
    "roles.admin": "Admin",
    "roles.admin_wilaya": "Admin Wilaya",
    "roles.admin_commun": "Admin Commun",
    "roles.super_admin": "Super Admin"
  },
  ar: {
    // Navigation
    "nav.overview": "لوحة التحكم",
    "nav.access": "تسيير الصلاحيات",
    "nav.infrastructure": "الهياكل الانتخابية",
    "nav.entities": "الكيانات السياسية",
    "nav.validation": "إدخال وتدقيق المحاضر",
    "nav.roles": "الأدوار والمهام",
    "nav.settings": "الإعدادات",
    "nav.logout": "تسجيل الخروج",

    // Dashboard
    "dash.title": "لوحة القيادة والتحكم",
    "dash.subtitle": "مراقبة البنية التحتية الانتخابية الوطنية والمصادقة على النتائج في الوقت الفعلي.",
    "dash.badge": "العمليات الوطنية",
    "dash.kpi.centers": "مراكز التصويت",
    "dash.kpi.desks": "مكاتب التصويت",
    "dash.kpi.voters": "الناخبون المسجلون",
    "dash.kpi.turnout": "نسبة المشاركة",
    "dash.recent.title": "نشاط العمليات الأخير",
    "dash.recent.subtitle": "آخر عمليات المصادقة وتنبيهات النظام",
    "dash.scope.national": "وطني",
    "dash.scope.wilaya": "ولاية",
    "dash.scope.communal": "بلدي",
    "dash.scope.commun": "بلدي",

    // Infrastructure
    "infra.title": "الهياكل الانتخابية",
    "infra.subtitle": "تكوين ونشر التسلسل الإداري للاقتراع الوطني.",
    "infra.badge": "الخريطة الوطنية",
    "infra.btn.add": "إضافة مركز",
    "infra.tab.centers": "مراكز التصويت",
    "infra.tab.desks": "مكاتب التصويت",
    "infra.table.name": "اسم المركز",
    "infra.table.location": "الموقع",
    "infra.table.capacity": "السعة",

    // Access Management
    "access.title": "تسيير الصلاحيات",
    "access.subtitle": "تنسيق الأذونات المؤسساتية وتدقيق الموظفين العملياتيين الوطنيين.",
    "access.badge": "مراقبة الحوكمة",
    "access.btn.add": "إنشاء مستخدم",
    "access.tab.admins": "المسؤولون",
    "access.tab.members": "أعضاء المكتب",
    "access.table.user": "المستخدم",
    "access.table.role": "الدور",
    "access.table.status": "الحالة",

    // Political Entities
    "entities.title": "الكيانات السياسية",
    "entities.subtitle": "التسيير المؤسساتي للأحزاب والمصادقة على السجل الوطني للترشيحات.",
    "entities.badge": "السجل الرسمي",
    "entities.btn.add.party": "تسجيل حزب",
    "entities.btn.add.candidate": "تسجيل مترشح",
    "entities.tab.parties": "الأحزاب السياسية",
    "entities.tab.candidates": "الترشيحات",

    // Validation
    "val.title": "إدخال وتدقيق المحاضر",
    "val.badge": "المصادقة الذكية",
    "val.table.pv": "محضر رسمي",
    "val.table.status": "حالة المصادقة",
    "val.btn.audit": "تدقيق المحضر",

    // Roles
    "roles.title": "الأدوار والمهام",
    "roles.subtitle": "تسيير الاعتمادات المؤقتة والإشراف على الموظفين الميدانيين.",
    "roles.badge": "الانتشار العملياتي",
    "roles.btn.add": "اعتماد مراقب",

    // Common
    "common.search": "بحث...",
    "common.filter": "تصفية",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.actions": "إجراءات",
    "common.units": "وحدات",
    "common.variation": "تغيير",
    "user.admin_central": "المسؤول المركزي",
    "roles.chef": "رئيس مركز",
    "roles.obs_bureau": "مراقب مكتب",
    "roles.obs_center": "مراقب مركز",
    "roles.admin": "مسؤول",
    "roles.admin_wilaya": "مسؤول ولاية",
    "roles.admin_commun": "مسؤول بلدية",
    "roles.super_admin": "مسؤول أعلى"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "fr" || savedLang === "ar")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir} className={language === "ar" ? "font-plus-jakarta" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
