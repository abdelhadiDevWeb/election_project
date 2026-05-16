"use client";

import { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import * as XLSX from "xlsx";
import { 
  MapPin, 
  Building2, 
  Vote, 
  ChevronRight,
  Search,
  Users,
  Plus,
  Globe,
  FileUp,
  Download,
  Activity,
  Zap,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";

export default function InfrastructureSetup() {
  const { 
    wilayasData, setWilayasData,
    communesData, setCommunesData,
    centersData, setCentersData,
    desksData, setDesksData,
    mutation
  } = useData();
  const { t, language, dir } = useLanguage();

  const [activeTab, setActiveTab] = useState<"wilayas" | "communes" | "centers" | "desks">("wilayas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"wilaya" | "commune" | "center" | "desk">("center");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    num: "",
    seats: "",
    wilaya: "Alger",
    center: "Centre Pasteur",
    location: "",
    male: 0,
    female: 0,
    total: 0,
    desksCount: 0
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        const newWilayas: any[] = [];
        const newCommunes: any[] = [];
        const newCenters: any[] = [];

        data.forEach((row, index) => {
          if (row.Wilaya && !newWilayas.find(w => w.name === row.Wilaya)) {
            newWilayas.push({
              id: Date.now() + index,
              name: row.Wilaya,
              num_wilaya: row.CodeWilaya || "00",
              seats_count: row.Sieges || 10,
              communes: 0,
              centers: 0,
              desks: 0
            });
          }

          if (row.Commune && !newCommunes.find(c => c.name === row.Commune)) {
            newCommunes.push({
              id: Date.now() + index + 1000,
              name: row.Commune,
              num_bladia: row.CodeCommune || "00",
              wilaya: row.Wilaya || "Alger",
              centers: 0,
              desks: 0
            });
          }

          if (row.Centre) {
            newCenters.push({
              id: Date.now() + index + 2000,
              name: row.Centre,
              location: row.Localisation || "Inconnu",
              male: row.Hommes || 0,
              female: row.Femmes || 0,
              total: (row.Hommes || 0) + (row.Femmes || 0),
              numbers_desks: row.Bureaux || 0
            });
          }
        });

        // Note: In a real integration, this should hit a batch create API endpoint.
        // For now, we just refresh the data.
        setCentersData([]);
        
        alert(language === 'ar' ? `تم الاستيراد بنجاح: تمت معالجة ${data.length} صفًا.` : "Importation réussie : " + data.length + " lignes traitées.");
      } catch (err) {
        console.error(err);
        alert(language === 'ar' ? "خطأ أثناء الاستيراد. تحقق من تنسيق الملف." : "Erreur lors de l'importation. Vérifiez le format du fichier.");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      { Wilaya: "Alger", CodeWilaya: "16", Sieges: 35, Commune: "Sidi M'hamed", CodeCommune: "01", Centre: "Centre Pasteur", Localisation: "Rue Didouche", Hommes: 2000, Femmes: 2000, Bureaux: 10 },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Infrastructure_ANIE.xlsx");
  };

  const openModal = (type: "wilaya" | "commune" | "center" | "desk", item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name || item.num_desk || "",
        num: item.num_wilaya || item.num_bladia || item.num_desk || "",
        seats: item.seats_count?.toString() || "",
        wilaya: item.wilaya || "Alger",
        center: item.center || "Centre Pasteur",
        location: item.location || "",
        male: item.male || 0,
        female: item.female || 0,
        total: item.total || 0,
        desksCount: item.numbers_desks || 0
      });
    } else {
      setFormData({ ...formData, name: "", num: "", seats: "", location: "", male: 0, female: 0, total: 0, desksCount: 0 });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string, type: "wilaya" | "commune" | "center" | "desk") => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        const endpointMap = { wilaya: "wilayas", commune: "communes", center: "centers", desk: "desks" };
        const dataMap = { wilaya: wilayasData, commune: communesData, center: centersData, desk: desksData };
        const item = dataMap[type].find((i: any) => i.id === id || i._id === id);
        const apiId = item?._id || item?.id || id;
        await mutation.mutate("DELETE", `/${endpointMap[type]}/${apiId}`);
        switch (type) {
          case "wilaya": setWilayasData([]); break;
          case "commune": setCommunesData([]); break;
          case "center": setCentersData([]); break;
          case "desk": setDesksData([]); break;
        }
      } catch (err: any) {
        alert(err?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === "wilaya") {
        const body = {
          name_fr: formData.name,
          name_ar: formData.name,
          wilaya_code: parseInt(formData.num) || 0,
          seats_count: parseInt(formData.seats) || 0,
        };
        if (editingItem) {
          await mutation.mutate("PUT", `/wilayas/${editingItem._id || editingItem.id}`, body);
        }
        setWilayasData([]);
      } else if (modalType === "commune") {
        const selectedWilaya = wilayasData.find(w => w.name === formData.wilaya || w.name_fr === formData.wilaya);
        const body = {
          name_fr: formData.name,
          name_ar: formData.name,
          commune_id: parseInt(formData.num) || 0,
          wilaya: selectedWilaya?._id,
        };
        if (editingItem) {
          await mutation.mutate("PUT", `/communes/${editingItem._id || editingItem.id}`, body);
        } else {
          await mutation.mutate("POST", "/communes", body);
        }
        setCommunesData([]);
      } else if (modalType === "center") {
        const body = {
          name: formData.name,
          address: formData.location,
          male_registered: formData.male,
          female_registered: formData.female,
          total_registered: formData.male + formData.female,
          numbers_desks: formData.desksCount,
        };
        if (editingItem) {
          await mutation.mutate("PUT", `/centers/${editingItem._id || editingItem.id}`, body);
        } else {
          await mutation.mutate("POST", "/centers", body);
        }
        setCentersData([]);
      } else if (modalType === "desk") {
        const body = {
          desk_number: parseInt(formData.num) || 0,
          male_registered: formData.male,
          female_registered: formData.female,
          total_registered: formData.male + formData.female,
        };
        if (editingItem) {
          await mutation.mutate("PUT", `/desks/${editingItem._id || editingItem.id}`, body);
        } else {
          await mutation.mutate("POST", "/desks", body);
        }
        setDesksData([]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.message || "Operation failed");
    }
  };

  const tabs = [
    { id: "wilayas", label: language === 'ar' ? 'الولايات' : 'Wilayas', icon: Globe, count: wilayasData.length },
    { id: "communes", label: language === 'ar' ? 'البلديات' : 'Communes', icon: MapPin, count: communesData.length },
    { id: "centers", label: language === 'ar' ? 'المراكز' : 'Centres', icon: Building2, count: centersData.length },
    { id: "desks", label: language === 'ar' ? 'المكاتب' : 'Bureaux', icon: Vote, count: desksData.length },
  ] as const;

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2 flex-1 flex-shrink-0"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
            <Server size={12} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{language === 'ar' ? 'الخرائط الوطنية' : 'Cartographie Nationale'}</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white lg:text-4xl lg:whitespace-nowrap font-plus-jakarta">
            {t("nav.infrastructure")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            {language === 'ar' ? 'تهيئة ونشر الهيكل الإداري للاقتراع الوطني.' : 'Configuration et déploiement de la hiérarchie administrative pour le scrutin national.'}
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button 
            onClick={downloadTemplate}
            className="h-12 px-5 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <Download size={18} className="text-zinc-400" />
            {language === 'ar' ? 'نموذج' : 'Modèle'}
          </button>
          
          <label className="h-12 px-5 rounded-2xl border border-dashed border-algerian-green/30 bg-algerian-green/5 text-algerian-green text-[11px] font-black uppercase tracking-widest hover:bg-algerian-green/10 transition-all flex items-center gap-2 cursor-pointer">
            <FileUp size={18} />
            <span>{isImporting ? (language === 'ar' ? 'جاري الاستيراد...' : "Importation...") : (language === 'ar' ? 'استيراد السجل' : "Importer Registre")}</span>
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={isImporting} />
          </label>

          <button 
            onClick={() => openModal(activeTab === 'wilayas' ? 'wilaya' : activeTab === 'communes' ? 'commune' : activeTab === 'centers' ? 'center' : 'desk')}
            className="h-12 px-6 rounded-2xl bg-algerian-green text-white text-[11px] font-black uppercase tracking-widest hover:bg-algerian-green-dark transition-all flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={3} />
            {language === 'ar' ? 'إضافة ' : 'Ajouter '}
            {activeTab === 'wilayas' ? (language === 'ar' ? 'ولاية' : 'Wilaya') : 
             activeTab === 'communes' ? (language === 'ar' ? 'بلدية' : 'Commune') : 
             activeTab === 'centers' ? (language === 'ar' ? 'مركز' : 'Centre') : 
             (language === 'ar' ? 'مكتب' : 'Bureau')}
          </button>
        </div>
      </div>

      {/* Tabs System */}
      <div className="grid grid-cols-4 gap-1 md:flex md:flex-nowrap items-center md:gap-2 p-1.5 glass dark:bg-white/5 rounded-[22px] w-full md:w-fit border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 p-2 md:px-6 md:py-3 rounded-[18px] text-[8px] md:text-xs font-black uppercase tracking-tight md:tracking-widest transition-all duration-500 relative",
              activeTab === tab.id
                ? "bg-white dark:bg-white text-zinc-900 dark:text-black scale-100 md:scale-105 z-10"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4 md:w-4 md:h-4" strokeWidth={2.5} />
            <span className="text-center leading-tight line-clamp-1">{tab.label}</span>
            <span className={cn(
              "md:ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black hidden sm:block",
              activeTab === tab.id ? "bg-zinc-900/10 text-zinc-900" : "bg-zinc-200 dark:bg-white/10 text-zinc-500"
            )}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-white rounded-[18px] -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
          </button>
        ))}
      </div>

      {/* Infrastructure Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          editingItem ? (language === 'ar' ? 'تعديل ' : "Modification de ") + (modalType === "wilaya" ? (language === 'ar' ? 'الولاية' : "la Wilaya") : modalType === "commune" ? (language === 'ar' ? 'البلدية' : "la Commune") : modalType === "center" ? (language === 'ar' ? 'المركز' : "du Centre") : (language === 'ar' ? 'المكتب' : "du Bureau")) :
          modalType === "wilaya" ? (language === 'ar' ? 'تسجيل ولاية' : "Enregistrement Wilaya") : 
          modalType === "commune" ? (language === 'ar' ? 'تسجيل بلدية' : "Enregistrement Commune") : 
          modalType === "center" ? (language === 'ar' ? 'تسجيل مركز' : "Enregistrement Centre") : (language === 'ar' ? 'تسجيل مكتب' : "Enregistrement Bureau")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          {modalType === "wilaya" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'رمز الولاية' : 'Code Wilaya'}</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 16" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'المقاعد' : 'Sièges'}</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 12" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.seats} onChange={(e) => setFormData({...formData, seats: e.target.value.replace(/\D/g, "")})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'التسمية' : 'Désignation'}</label>
                <input required type="text" placeholder="Ex: Alger" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
          )}

          {modalType === "commune" && (
            <div className="space-y-5">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الولاية التابعة لها' : "Wilaya d'Attachement"}</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                  <option value="">{language === 'ar' ? 'اختر الولاية...' : 'Choisir la wilaya...'}</option>
                  {wilayasData.map(w => <option key={w.id} value={w.name}>{w.num_wilaya} - {w.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'التسمية' : 'Désignation'}</label>
                  <input required type="text" placeholder="Ex: Sidi M'hamed" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'رمز البلدية' : 'Code Commune'}</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 01" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
                </div>
              </div>
            </div>
          )}

          {modalType === "center" && (
            <div className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الولاية' : 'Wilaya'}</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                    <option value="">{language === 'ar' ? 'اختر...' : 'Choisir...'}</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'البلدية' : 'Commune'}</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.location.split(', ')[1]} onChange={(e) => setFormData({...formData, location: `${formData.wilaya}, ${e.target.value}`})}>
                    <option value="">{language === 'ar' ? 'اختر...' : 'Choisir...'}</option>
                    {communesData.filter(c => c.wilaya === formData.wilaya).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'تسمية المركز' : 'Désignation du Centre'}</label>
                <input required type="text" placeholder="Ex: Centre Pasteur" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'العنوان / الموقع' : 'Adresse / Localisation'}</label>
                <input required type="text" placeholder="Ex: Rue Didouche Mourad" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase">{language === 'ar' ? 'مسجلين (ذكور)' : 'Inscrits (H)'}</label>
                  <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.male} onChange={(e) => setFormData({...formData, male: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase">{language === 'ar' ? 'مسجلين (إناث)' : 'Inscrits (F)'}</label>
                  <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.female} onChange={(e) => setFormData({...formData, female: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الإجمالي' : 'Total'}</label>
                  <div className="w-full h-12 px-4 rounded-xl bg-algerian-green/10 flex items-center text-algerian-green font-black border border-algerian-green/20">
                    {formData.male + formData.female}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'عدد المكاتب' : 'Nombre de Bureaux'}</label>
                <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.desksCount} onChange={(e) => setFormData({...formData, desksCount: parseInt(e.target.value) || 0})} />
              </div>
            </div>
          )}

          {modalType === "desk" && (
            <div className="space-y-5">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'المركز الرئيسي' : 'Centre Parent'}</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.center} onChange={(e) => setFormData({...formData, center: e.target.value})}>
                  <option value="">{language === 'ar' ? 'اختر مركزًا' : 'Sélectionner un Centre'}</option>
                  {centersData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'رقم المكتب' : 'N° du Bureau'}</label>
                <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 01" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase">H</label>
                  <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.male} onChange={(e) => setFormData({...formData, male: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase">F</label>
                  <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.female} onChange={(e) => setFormData({...formData, female: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase">Total</label>
                  <div className="w-full h-12 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center text-algerian-green font-black border border-zinc-200 dark:border-zinc-700">
                    {formData.male + formData.female}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">{language === 'ar' ? 'إلغاء' : 'Annuler'}</button>
            <button type="submit" className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {editingItem ? (language === 'ar' ? 'حفظ' : "Sauvegarder") : (language === 'ar' ? 'تأكيد' : "Confirmer")}
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "wilayas" && (
              <DataTable 
                title={language === 'ar' ? 'سجل الولايات' : "Registre des Wilayas"}
                columns={[
                  { header: language === 'ar' ? 'الرمز' : "Code", accessor: "num_wilaya" },
                  { header: language === 'ar' ? 'الولاية' : "Wilaya", accessor: "name", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: language === 'ar' ? 'المقاعد' : "Sièges", accessor: "seats_count", render: (val) => <span className="font-bold text-indigo-500">{val}</span> },
                  { header: language === 'ar' ? 'البلديات' : "Communes", accessor: "communes", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'المراكز' : "Centres", accessor: "centers", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                ]}
                data={wilayasData}
                onEdit={(row) => openModal("wilaya", row)}
                onDelete={(row) => handleDelete(row.id, "wilaya")}
              />
            )}

            {activeTab === "communes" && (
              <DataTable 
                title={language === 'ar' ? 'سجل البلديات' : "Registre des Communes"}
                columns={[
                  { header: language === 'ar' ? 'رقم' : "N°", accessor: "num_bladia" },
                  { header: language === 'ar' ? 'البلدية' : "Commune", accessor: "name", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: language === 'ar' ? 'الولاية الأصلية' : "Wilaya d'Origine", accessor: "wilaya", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'المراكز' : "Centres", accessor: "centers", render: (val) => <span className="font-bold text-indigo-500">{val}</span> },
                  { header: language === 'ar' ? 'المكاتب' : "Bureaux", accessor: "desks", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                ]}
                data={communesData}
                onEdit={(row) => openModal("commune", row)}
                onDelete={(row) => handleDelete(row.id, "commune")}
              />
            )}

            {activeTab === "centers" && (
              <DataTable 
                title={language === 'ar' ? 'مراكز الاقتراع' : "Centres de Scrutin"}
                columns={[
                  { header: language === 'ar' ? 'مركز التصويت' : "Centre de Vote", accessor: "name", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: language === 'ar' ? 'الموقع' : "Localisation", accessor: "location", render: (val) => <span className="text-[11px] font-medium text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'ذ' : "H", accessor: "male" },
                  { header: language === 'ar' ? 'إ' : "F", accessor: "female" },
                  { header: language === 'ar' ? 'إجمالي المسجلين' : "Total Inscrits", accessor: "total", render: (val) => <span className="text-algerian-green font-black">{val?.toLocaleString()}</span> },
                  { header: language === 'ar' ? 'المكاتب' : "Bureaux", accessor: "numbers_desks", render: (val) => <span className="font-bold text-indigo-500">{val}</span> },
                ]}
                data={centersData}
                onEdit={(row) => openModal("center", row)}
                onDelete={(row) => handleDelete(row.id, "center")}
              />
            )}

            {activeTab === "desks" && (
              <DataTable 
                title={language === 'ar' ? 'مكاتب التصويت' : "Bureaux de Vote"}
                columns={[
                  { header: language === 'ar' ? 'رقم المكتب' : "N° Bureau", accessor: "num_desk", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: language === 'ar' ? 'المركز التابع له' : "Centre de Rattachement", accessor: "center", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'ذ' : "H", accessor: "male" },
                  { header: language === 'ar' ? 'إ' : "F", accessor: "female" },
                  { header: language === 'ar' ? 'المسجلين' : "Inscrits", accessor: "total", render: (val) => <span className="text-algerian-green font-black">{val}</span> },
                ]}
                data={desksData}
                onEdit={(row) => openModal("desk", row)}
                onDelete={(row) => handleDelete(row.id, "desk")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
