"use client";

import { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { 
  Flag, 
  UserSquare, 
  Plus, 
  MapPin,
  UserPlus,
  ShieldCheck,
  Activity,
  Medal,
  Image as ImageIcon,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useRef } from "react";

export default function EntitesPolitiques() {
  const { 
    wilayasData,
    partiesData, setPartiesData,
    candidatesData, setCandidatesData,
    mutation
  } = useData();
  const { t, language, dir } = useLanguage();

  const [activeTab, setActiveTab] = useState<"parties" | "candidates">("parties");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    name: "",
    short: "",
    leader: "",
    wilaya: "Alger",
    founded: "2024",
    nin: "",
    phone: "",
    birthday: "",
    fav: false,
    imageFile: null,
    imagePreview: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name || item.full_name || "",
        short: item.short || item.party || "",
        leader: item.leader || "",
        wilaya: item.wilaya_siege || item.wilaya || "Alger",
        founded: item.founded || "2024",
        nin: item.nin || "",
        phone: item.phone || "",
        birthday: item.birthday || "",
        fav: item.fav || false,
        imageFile: null,
        imagePreview: item._id ? `/api/candidats/${item._id}/portrait` : null
      });
    } else {
      setFormData({
        name: "", short: "", leader: "", wilaya: "Alger", founded: "2024",
        nin: "", phone: "", birthday: "", fav: false,
        imageFile: null, imagePreview: null
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number | string, type: "party" | "candidate") => {
    const confirmMsg = language === 'ar' 
      ? `هل أنت متأكد من رغبتك في حذف هذا ${type === 'party' ? 'الحزب' : 'المترشح'}؟`
      : `Êtes-vous sûr de vouloir supprimer ce ${type === 'party' ? 'parti' : 'candidat'} ?`;
    
    if (confirm(confirmMsg)) {
      try {
        const item = type === "party" 
          ? partiesData.find(p => p.id === id || p._id === id)
          : candidatesData.find(c => c.id === id || c._id === id);
        const apiId = item?._id || item?.id || id;
        const endpoint = type === "party" ? `/parties/${apiId}` : `/candidats/${apiId}`;
        await mutation.mutate("DELETE", endpoint);
        // Trigger refetch
        if (type === "party") setPartiesData([]);
        else setCandidatesData([]);
      } catch (err: any) {
        alert(err?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "parties") {
        const body = {
          name: formData.name,
          acronym: formData.short,
          leader: formData.leader,
          wilaya_siege: formData.wilaya,
          founded: formData.founded,
        };
        if (editingItem) {
          const apiId = editingItem._id || editingItem.id;
          await mutation.mutate("PUT", `/parties/${apiId}`, body);
        } else {
          await mutation.mutate("POST", "/parties", body);
        }
        setPartiesData([]); // trigger refetch
      } else {
        // Find wilaya ID from name for the API
        const selectedWilaya = wilayasData.find(w => 
          w.name === formData.wilaya || w.name_fr === formData.wilaya || w.name_ar === formData.wilaya
        );
        
        // Use FormData for candidate (to include image)
        const fData = new FormData();
        fData.append("full_name", formData.name);
        fData.append("nin", formData.nin);
        fData.append("phone", formData.phone);
        fData.append("date_of_birth", formData.birthday);
        if (editingItem?.party_id) fData.append("party", editingItem.party_id);
        if (selectedWilaya?._id) fData.append("wilaya", selectedWilaya._id);
        fData.append("is_favorite", String(formData.fav));
        
        if (formData.imageFile) {
          fData.append("image", formData.imageFile);
        }

        if (editingItem) {
          const apiId = editingItem._id || editingItem.id;
          await mutation.mutate("PUT", `/candidats/${apiId}`, fData);
        } else {
          await mutation.mutate("POST", "/candidats", fData);
        }
        setCandidatesData([]); // trigger refetch
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.message || "Operation failed");
    }
  };

  const tabs = [
    { id: "parties", label: language === 'ar' ? 'الأحزاب السياسية' : "Partis Politiques", icon: Flag, count: partiesData.length },
    { id: "candidates", label: language === 'ar' ? 'الترشيحات' : "Candidatures", icon: UserSquare, count: candidatesData.length },
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{language === 'ar' ? 'السجل الرسمي' : 'Registre Officiel'}</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white lg:text-4xl lg:whitespace-nowrap font-plus-jakarta">
            {t("nav.entities")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            {language === 'ar' ? 'الإدارة المؤسسية للأحزاب والمصادقة على السجل الوطني للترشيحات.' : 'Gestion institutionnelle des partis et validation du registre national des candidatures.'}
          </p>
        </motion.div>

        <button 
          onClick={() => openModal()}
          className="h-12 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
          {activeTab === 'parties' 
            ? (language === 'ar' ? 'تسجيل حزب' : 'Enregistrer Parti') 
            : (language === 'ar' ? 'تسجيل مترشح' : 'Inscrire Candidat')}
        </button>
      </div>

      {/* Tabs System */}
      <div className="grid grid-cols-2 gap-1 md:flex md:flex-nowrap items-center md:gap-2 p-1.5 glass dark:bg-white/5 rounded-[22px] w-full md:w-fit border-white/5">
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

      {/* Modal System */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          editingItem 
            ? (language === 'ar' ? 'تعديل ' : "Modification ") + (activeTab === 'parties' ? (language === 'ar' ? "حزب" : "Parti") : (language === 'ar' ? "مترشح" : "Candidat")) 
            : (activeTab === 'parties' ? (language === 'ar' ? "حزب جديد" : "Nouveau Parti") : (language === 'ar' ? "ترشيح جديد" : "Nouvelle Candidature"))
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          {activeTab === "parties" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'التسمية الرسمية' : 'Dénomination Officielle'}</label>
                <input required type="text" placeholder={language === 'ar' ? 'مثال: جبهة التحرير الوطني' : "Ex: Front de Libération Nationale"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الشعار' : 'Acronyme'}</label>
                  <input required type="text" placeholder="Ex: FLN" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.short} onChange={(e) => setFormData({...formData, short: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الأمين العام' : 'Secrétaire Général'}</label>
                  <input required type="text" placeholder={language === 'ar' ? 'المسؤول القانوني' : "Responsable légal"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.leader} onChange={(e) => setFormData({...formData, leader: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'المقر الوطني' : 'Siège National'}</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                  <option value="">{language === 'ar' ? 'اختر ولاية' : 'Sélectionner une Wilaya'}</option>
                  {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'هوية المترشح' : 'Identité du Candidat'}</label>
                <input required type="text" placeholder={language === 'ar' ? 'الاسم واللقب' : "Prénom et Nom"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الانتماء' : 'Affiliation'}</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.short} onChange={(e) => setFormData({...formData, short: e.target.value})}>
                    <option value="">{language === 'ar' ? 'اختر...' : 'Choisir...'}</option>
                    <option value="Indépendant">{language === 'ar' ? 'مستقل' : 'Indépendant'}</option>
                    {partiesData.map(p => <option key={p.id} value={p.short}>{p.name} ({p.short})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الدائرة الانتخابية' : 'Circonscription'}</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                    <option value="">{language === 'ar' ? 'اختر...' : 'Choisir...'}</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الرقم التعريفي الوطني (NIN)' : 'Identifiant National (NIN)'}</label>
                  <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder={language === 'ar' ? '18 رقمًا' : "18 chiffres"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.nin} onChange={(e) => setFormData({...formData, nin: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الاتصال' : 'Contact'}</label>
                  <input required type="text" placeholder="05/06/07..." className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'تاريخ الميلاد' : 'Date de Naissance'}</label>
                  <input required type="date" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                </div>
                <div className="flex items-center gap-3 pt-8">
                   <div className="relative flex items-center">
                    <input type="checkbox" id="fav" className="peer w-6 h-6 rounded-lg border-2 border-zinc-200 dark:border-white/10 appearance-none checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer" checked={formData.fav} onChange={(e) => setFormData({...formData, fav: e.target.checked})} />
                    <ShieldCheck size={14} className="absolute left-1.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-all" />
                  </div>
                  <label htmlFor="fav" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer">{language === 'ar' ? 'تأكيد الأهلية' : 'Éligibilité Confirmée'}</label>
                </div>
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-2xl flex flex-col items-center gap-3 text-zinc-400 dark:bg-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden"
              >
                {formData.imagePreview ? (
                  <div className="absolute inset-0">
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Camera size={24} className="text-white drop-shadow-md" />
                      <span className="text-[10px] font-black uppercase text-white drop-shadow-md">{language === 'ar' ? 'تغيير الصورة' : 'Changer la Photo'}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <UserPlus size={32} className="group-hover:text-emerald-500 transition-all" />
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest block">{language === 'ar' ? 'الصورة الرسمية' : 'Portrait Officiel'}</span>
                      <span className="text-[9px] font-medium opacity-50">PNG, JPG (Max. 2MB)</span>
                    </div>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
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

      {/* Data Visualization */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "parties" && (
              <DataTable 
                title={language === 'ar' ? 'سجل الأحزاب السياسية' : "Registre des Partis Politiques"}
                columns={[
                  { header: language === 'ar' ? 'الشعار' : "Sigle", accessor: "short", render: (val) => (
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center font-black text-emerald-500 border border-transparent dark:border-white/10">
                      {val}
                    </div>
                  )},
                  { header: language === 'ar' ? 'التسمية الرسمية' : "Dénomination Officielle", accessor: "name", render: (val) => <span className="font-black text-zinc-900 dark:text-white tracking-tight">{val}</span> },
                  { header: language === 'ar' ? 'المقر الوطني' : "Siège National", accessor: "wilaya_siege", render: (val) => <span className="text-[11px] font-black uppercase text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'الحالة' : "Status", accessor: "short", render: (val) => (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500">
                        {candidatesData.filter(c => c.party === val).length} {language === 'ar' ? 'مترشحين' : 'Candidats'}
                      </span>
                    </div>
                  )},
                ]}
                data={partiesData}
                onEdit={(row) => openModal(row)}
                onDelete={(row) => handleDelete(row.id, "party")}
              />
            )}

            {activeTab === "candidates" && (
              <DataTable 
                title={language === 'ar' ? 'السجل الوطني للترشيحات' : "Registre National des Candidatures"}
                columns={[
                  { header: language === 'ar' ? 'المترشح' : "Candidat", accessor: "full_name", render: (val, row: any) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {row._id ? (
                          <img 
                            src={`/api/candidats/${row._id}/portrait?t=${new Date().getTime()}`} 
                            alt={val} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              (e.target as any).style.display = 'none';
                              (e.target as any).parentElement.innerHTML = '<div class="text-zinc-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-square"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-1a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"/></svg></div>';
                            }}
                          />
                        ) : (
                          <div className="text-zinc-400">
                            {row.fav ? <Medal size={20} className="text-emerald-500 fill-emerald-500/20" /> : <UserSquare size={20} />}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{val}</span>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{language === 'ar' ? 'التعريف الوطني' : 'NIN'}: {row.nin}</span>
                      </div>
                    </div>
                  )},
                  { header: language === 'ar' ? 'الانتماء' : "Affiliation", accessor: "party", render: (val) => (
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      val === 'Indépendant' || !val ? "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {val === 'Indépendant' ? (language === 'ar' ? 'مستقل' : 'Indépendant') : (val || (language === 'ar' ? 'مستقل' : 'Indépendant'))}
                    </span>
                  )},
                  { header: language === 'ar' ? 'الدائرة الانتخابية' : "Circonscription", accessor: "wilaya", render: (val) => <span className="text-[11px] font-black uppercase text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'الاتصال' : "Contact", accessor: "phone", render: (val) => <span className="text-[11px] font-bold text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'المصادقة' : "Validation", accessor: "result", render: (val) => (
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-emerald-500" />
                      <span className="font-black text-emerald-500">{val}%</span>
                    </div>
                  )},
                ]}
                data={candidatesData}
                onEdit={(row) => openModal(row)}
                onDelete={(row) => handleDelete(row.id, "candidate")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
