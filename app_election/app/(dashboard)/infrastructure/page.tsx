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

export default function InfrastructureSetup() {
  const { 
    wilayasData, setWilayasData,
    communesData, setCommunesData,
    centersData, setCentersData,
    desksData, setDesksData
  } = useData();

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

        setWilayasData(prev => [...newWilayas, ...prev]);
        setCommunesData(prev => [...newCommunes, ...prev]);
        setCentersData(prev => [...newCenters, ...prev]);
        
        alert("Importation réussie : " + data.length + " lignes traitées.");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'importation. Vérifiez le format du fichier.");
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

  const handleDelete = (id: number, type: "wilaya" | "commune" | "center" | "desk") => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      switch (type) {
        case "wilaya": setWilayasData(wilayasData.filter(w => w.id !== id)); break;
        case "commune": setCommunesData(communesData.filter(c => c.id !== id)); break;
        case "center": setCentersData(centersData.filter(c => c.id !== id)); break;
        case "desk": setDesksData(desksData.filter(d => d.id !== id)); break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "wilaya") {
      if (editingItem) {
        setWilayasData(wilayasData.map(w => w.id === editingItem.id ? {
          ...w,
          name: formData.name,
          num_wilaya: formData.num,
          seats_count: parseInt(formData.seats) || 0,
        } : w));
      } else {
        setWilayasData([{
          id: wilayasData.length + 50,
          name: formData.name,
          num_wilaya: formData.num,
          seats_count: parseInt(formData.seats) || 0,
          communes: 0,
          centers: 0,
          desks: 0
        }, ...wilayasData]);
      }
    } else if (modalType === "commune") {
      if (editingItem) {
        setCommunesData(communesData.map(c => c.id === editingItem.id ? {
          ...c,
          name: formData.name,
          num_bladia: formData.num,
          wilaya: formData.wilaya,
        } : c));
      } else {
        setCommunesData([{
          id: communesData.length + 1,
          name: formData.name,
          num_bladia: formData.num,
          wilaya: formData.wilaya,
          centers: 0,
          desks: 0
        }, ...communesData]);
      }
    } else if (modalType === "center") {
      if (editingItem) {
        setCentersData(centersData.map(c => c.id === editingItem.id ? {
          ...c,
          name: formData.name,
          location: formData.location,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female,
          numbers_desks: formData.desksCount
        } : c));
      } else {
        setCentersData([{
          id: centersData.length + 1,
          name: formData.name,
          location: formData.location,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female,
          numbers_desks: formData.desksCount
        }, ...centersData]);
      }
    } else if (modalType === "desk") {
      if (editingItem) {
        setDesksData(desksData.map(d => d.id === editingItem.id ? {
          ...d,
          num_desk: formData.num,
          center: formData.center,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female
        } : d));
      } else {
        setDesksData([{
          id: desksData.length + 1,
          num_desk: formData.num,
          center: formData.center,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female
        }, ...desksData]);
      }
    }
    setIsModalOpen(false);
  };

  const tabs = [
    { id: "wilayas", label: "Wilayas", icon: Globe, count: wilayasData.length },
    { id: "communes", label: "Communes", icon: MapPin, count: communesData.length },
    { id: "centers", label: "Centres", icon: Building2, count: centersData.length },
    { id: "desks", label: "Bureaux", icon: Vote, count: desksData.length },
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
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Cartographie Nationale</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white lg:text-5xl lg:whitespace-nowrap">
            Infrastructure Électorale
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            Configuration et déploiement de la hiérarchie administrative pour le scrutin national.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button 
            onClick={downloadTemplate}
            className="h-12 px-5 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={18} className="text-zinc-400" />
            Modèle
          </button>
          
          <label className="h-12 px-5 rounded-2xl border border-dashed border-algerian-green/30 bg-algerian-green/5 text-algerian-green text-[11px] font-black uppercase tracking-widest hover:bg-algerian-green/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm">
            <FileUp size={18} />
            <span>{isImporting ? "Importation..." : "Importer Registre"}</span>
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={isImporting} />
          </label>

          <button 
            onClick={() => openModal(activeTab === 'wilayas' ? 'wilaya' : activeTab === 'communes' ? 'commune' : activeTab === 'centers' ? 'center' : 'desk')}
            className="h-12 px-6 rounded-2xl bg-algerian-green text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-algerian-green/20 hover:bg-algerian-green-dark transition-all flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={3} />
            Ajouter {activeTab === 'wilayas' ? 'Wilaya' : activeTab === 'communes' ? 'Commune' : activeTab === 'centers' ? 'Centre' : 'Bureau'}
          </button>
        </div>
      </div>

      {/* Tabs System */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 glass dark:bg-white/5 rounded-[22px] w-fit border-white/5 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all duration-500 relative",
              activeTab === tab.id
                ? "bg-white dark:bg-white text-zinc-900 dark:text-black shadow-xl scale-105 z-10"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            <tab.icon size={16} strokeWidth={2.5} />
            {tab.label}
            <span className={cn(
              "ml-1 px-2 py-0.5 rounded-full text-[9px] font-black",
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
          editingItem ? "Modification de " + (modalType === "wilaya" ? "la Wilaya" : modalType === "commune" ? "la Commune" : modalType === "center" ? "du Centre" : "du Bureau") :
          modalType === "wilaya" ? "Enregistrement Wilaya" : 
          modalType === "commune" ? "Enregistrement Commune" : 
          modalType === "center" ? "Enregistrement Centre" : "Enregistrement Bureau"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          {modalType === "wilaya" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Code Wilaya</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 16" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sièges</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 12" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.seats} onChange={(e) => setFormData({...formData, seats: e.target.value.replace(/\D/g, "")})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Désignation</label>
                <input required type="text" placeholder="Ex: Alger" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
          )}

          {modalType === "commune" && (
            <div className="space-y-5">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Wilaya d'Attachement</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                  <option value="">Choisir la wilaya...</option>
                  {wilayasData.map(w => <option key={w.id} value={w.name}>{w.num_wilaya} - {w.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Désignation</label>
                  <input required type="text" placeholder="Ex: Sidi M'hamed" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Code Commune</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 01" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold focus:ring-2 focus:ring-algerian-green/10" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
                </div>
              </div>
            </div>
          )}

          {modalType === "center" && (
            <div className="space-y-5">
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Wilaya</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                    <option value="">Choisir...</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Commune</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.location.split(', ')[1]} onChange={(e) => setFormData({...formData, location: `${formData.wilaya}, ${e.target.value}`})}>
                    <option value="">Choisir...</option>
                    {communesData.filter(c => c.wilaya === formData.wilaya).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Désignation du Centre</label>
                <input required type="text" placeholder="Ex: Centre Pasteur" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Adresse / Localisation</label>
                <input required type="text" placeholder="Ex: Rue Didouche Mourad" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase">Inscrits (H)</label>
                  <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.male} onChange={(e) => setFormData({...formData, male: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase">Inscrits (F)</label>
                  <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.female} onChange={(e) => setFormData({...formData, female: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total</label>
                  <div className="w-full h-12 px-4 rounded-xl bg-algerian-green/10 flex items-center text-algerian-green font-black border border-algerian-green/20">
                    {formData.male + formData.female}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nombre de Bureaux</label>
                <input required type="number" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.desksCount} onChange={(e) => setFormData({...formData, desksCount: parseInt(e.target.value) || 0})} />
              </div>
            </div>
          )}

          {modalType === "desk" && (
            <div className="space-y-5">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Centre Parent</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.center} onChange={(e) => setFormData({...formData, center: e.target.value})}>
                  <option value="">Sélectionner un Centre</option>
                  {centersData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">N° du Bureau</label>
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
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">Annuler</button>
            <button type="submit" className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
              {editingItem ? "Sauvegarder" : "Confirmer"}
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
                title="Registre des Wilayas"
                columns={[
                  { header: "Code", accessor: "num_wilaya" },
                  { header: "Wilaya", accessor: "name", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: "Sièges", accessor: "seats_count", render: (val) => <span className="font-bold text-indigo-500">{val}</span> },
                  { header: "Communes", accessor: "communes", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                  { header: "Centres", accessor: "centers", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                ]}
                data={wilayasData}
                onEdit={(row) => openModal("wilaya", row)}
                onDelete={(row) => handleDelete(row.id, "wilaya")}
              />
            )}

            {activeTab === "communes" && (
              <DataTable 
                title="Registre des Communes"
                columns={[
                  { header: "N°", accessor: "num_bladia" },
                  { header: "Commune", accessor: "name", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: "Wilaya d'Origine", accessor: "wilaya", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                  { header: "Centres", accessor: "centers", render: (val) => <span className="font-bold text-indigo-500">{val}</span> },
                  { header: "Bureaux", accessor: "desks", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                ]}
                data={communesData}
                onEdit={(row) => openModal("commune", row)}
                onDelete={(row) => handleDelete(row.id, "commune")}
              />
            )}

            {activeTab === "centers" && (
              <DataTable 
                title="Centres de Scrutin"
                columns={[
                  { header: "Centre de Vote", accessor: "name", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: "Localisation", accessor: "location", render: (val) => <span className="text-[11px] font-medium text-zinc-500">{val}</span> },
                  { header: "H", accessor: "male" },
                  { header: "F", accessor: "female" },
                  { header: "Total Inscrits", accessor: "total", render: (val) => <span className="text-algerian-green font-black">{val?.toLocaleString()}</span> },
                  { header: "Bureaux", accessor: "numbers_desks", render: (val) => <span className="font-bold text-indigo-500">{val}</span> },
                ]}
                data={centersData}
                onEdit={(row) => openModal("center", row)}
                onDelete={(row) => handleDelete(row.id, "center")}
              />
            )}

            {activeTab === "desks" && (
              <DataTable 
                title="Bureaux de Vote"
                columns={[
                  { header: "N° Bureau", accessor: "num_desk", render: (val) => <span className="text-zinc-900 dark:text-white font-black tracking-tight">{val}</span> },
                  { header: "Centre de Rattachement", accessor: "center", render: (val) => <span className="font-bold text-zinc-500">{val}</span> },
                  { header: "H", accessor: "male" },
                  { header: "F", accessor: "female" },
                  { header: "Inscrits", accessor: "total", render: (val) => <span className="text-algerian-green font-black">{val}</span> },
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
