"use client";

import { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { 
  Flag, 
  UserSquare, 
  Plus, 
  ExternalLink,
  MapPin,
  Image as ImageIcon,
  UserPlus,
  ShieldCheck,
  Users,
  Target,
  Medal,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";

export default function EntitesPolitiques() {
  const { 
    wilayasData,
    partiesData, setPartiesData,
    candidatesData, setCandidatesData
  } = useData();

  const [activeTab, setActiveTab] = useState<"parties" | "candidates">("parties");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    short: "",
    leader: "",
    wilaya: "Alger",
    founded: "2024",
    nin: "",
    phone: "",
    birthday: "",
    fav: false
  });

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
        fav: item.fav || false
      });
    } else {
      setFormData({
        name: "", short: "", leader: "", wilaya: "Alger", founded: "2024",
        nin: "", phone: "", birthday: "", fav: false
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, type: "party" | "candidate") => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce ${type === 'party' ? 'parti' : 'candidat'} ?`)) {
      if (type === "party") {
        setPartiesData(partiesData.filter(p => p.id !== id));
      } else {
        setCandidatesData(candidatesData.filter(c => c.id !== id));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "parties") {
      if (editingItem) {
        setPartiesData(partiesData.map(p => p.id === editingItem.id ? {
          ...p,
          name: formData.name,
          short: formData.short,
          leader: formData.leader,
          wilaya_siege: formData.wilaya,
          founded: formData.founded
        } : p));
      } else {
        setPartiesData([{
          id: partiesData.length + 1,
          name: formData.name,
          short: formData.short,
          leader: formData.leader,
          wilaya_siege: formData.wilaya,
          founded: formData.founded
        }, ...partiesData]);
      }
    } else {
      if (editingItem) {
        setCandidatesData(candidatesData.map(c => c.id === editingItem.id ? {
          ...c,
          full_name: formData.name,
          party: formData.short || "Indépendant",
          wilaya: formData.wilaya,
          nin: formData.nin,
          phone: formData.phone,
          birthday: formData.birthday,
          fav: formData.fav
        } : c));
      } else {
        setCandidatesData([{
          id: candidatesData.length + 1,
          full_name: formData.name,
          party: formData.short || "Indépendant",
          wilaya: formData.wilaya,
          nin: formData.nin,
          phone: formData.phone,
          birthday: formData.birthday,
          fav: formData.fav,
          result: 0
        }, ...candidatesData]);
      }
    }
    setIsModalOpen(false);
  };

  const tabs = [
    { id: "parties", label: "Partis Politiques", icon: Flag, count: partiesData.length },
    { id: "candidates", label: "Candidatures", icon: UserSquare, count: candidatesData.length },
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
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Registre Officiel</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white lg:text-5xl lg:whitespace-nowrap">
            Entités Politiques
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            Gestion institutionnelle des partis et validation du registre national des candidatures.
          </p>
        </motion.div>

        <button 
          onClick={() => openModal()}
          className="h-12 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
          {activeTab === 'parties' ? 'Enregistrer Parti' : 'Inscrire Candidat'}
        </button>
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

      {/* Modal System */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Modification " + (activeTab === 'parties' ? "Parti" : "Candidat") : (activeTab === 'parties' ? "Nouveau Parti" : "Nouvelle Candidature")}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          {activeTab === "parties" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dénomination Officielle</label>
                <input required type="text" placeholder="Ex: Front de Libération Nationale" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Acronyme</label>
                  <input required type="text" placeholder="Ex: FLN" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.short} onChange={(e) => setFormData({...formData, short: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Secrétaire Général</label>
                  <input required type="text" placeholder="Responsable légal" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.leader} onChange={(e) => setFormData({...formData, leader: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Siège National</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                  <option value="">Sélectionner une Wilaya</option>
                  {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identité du Candidat</label>
                <input required type="text" placeholder="Prénom et Nom" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Affiliation</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.short} onChange={(e) => setFormData({...formData, short: e.target.value})}>
                    <option value="">Choisir...</option>
                    <option value="Indépendant">Indépendant</option>
                    {partiesData.map(p => <option key={p.id} value={p.short}>{p.name} ({p.short})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Circonscription</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})}>
                    <option value="">Choisir...</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identifiant National (NIN)</label>
                  <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="18 chiffres" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.nin} onChange={(e) => setFormData({...formData, nin: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact</label>
                  <input required type="text" placeholder="05/06/07..." className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date de Naissance</label>
                  <input required type="date" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                </div>
                <div className="flex items-center gap-3 pt-8">
                   <div className="relative flex items-center">
                    <input type="checkbox" id="fav" className="peer w-6 h-6 rounded-lg border-2 border-zinc-200 dark:border-white/10 appearance-none checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer" checked={formData.fav} onChange={(e) => setFormData({...formData, fav: e.target.checked})} />
                    <ShieldCheck size={14} className="absolute left-1.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-all" />
                  </div>
                  <label htmlFor="fav" className="text-[11px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer">Éligibilité Confirmée</label>
                </div>
              </div>
              <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-2xl flex flex-col items-center gap-3 text-zinc-400 dark:bg-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer">
                <UserPlus size={32} className="group-hover:text-emerald-500 transition-all" />
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest block">Portrait Officiel</span>
                  <span className="text-[9px] font-medium opacity-50">PNG, JPG (Max. 2MB)</span>
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
                title="Registre des Partis Politiques"
                columns={[
                  { header: "Sigle", accessor: "short", render: (val) => (
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center font-black text-emerald-500 border border-transparent dark:border-white/10">
                      {val}
                    </div>
                  )},
                  { header: "Dénomination Officielle", accessor: "name", render: (val) => <span className="font-black text-zinc-900 dark:text-white tracking-tight">{val}</span> },
                  { header: "Siège National", accessor: "wilaya_siege", render: (val) => <span className="text-[11px] font-black uppercase text-zinc-500">{val}</span> },
                  { header: "Status", accessor: "short", render: (val) => (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500">
                        {candidatesData.filter(c => c.party === val).length} Candidats
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
                title="Registre National des Candidatures"
                columns={[
                  { header: "Candidat", accessor: "full_name", render: (val, row: any) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400">
                        {row.fav ? <Medal size={20} className="text-emerald-500 fill-emerald-500/20" /> : <UserSquare size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{val}</span>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">NIN: {row.nin}</span>
                      </div>
                    </div>
                  )},
                  { header: "Affiliation", accessor: "party", render: (val) => (
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      val === 'Indépendant' || !val ? "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {val || 'Indépendant'}
                    </span>
                  )},
                  { header: "Circonscription", accessor: "wilaya", render: (val) => <span className="text-[11px] font-black uppercase text-zinc-500">{val}</span> },
                  { header: "Contact", accessor: "phone", render: (val) => <span className="text-[11px] font-bold text-zinc-500">{val}</span> },
                  { header: "Validation", accessor: "result", render: (val) => (
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
