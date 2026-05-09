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
  UserPlus
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

  const [activeTab, setActiveTab] = useState("parties");
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Entités Politiques</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gérez les partis politiques et les candidats officiels.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-algerian-green hover:bg-algerian-green-dark text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-algerian-green/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          {activeTab === 'parties' ? 'Nouveau Parti' : 'Nouveau Candidat'}
        </button>
      </div>

      {/* Creation / Edition Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Modifier " + (activeTab === 'parties' ? "le Parti" : "le Candidat") : (activeTab === 'parties' ? "Enregistrer un Nouveau Parti" : "Enregistrer un Nouveau Candidat")}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {activeTab === "parties" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nom Complet du Parti</label>
                <input required type="text" placeholder="Ex: Front de Libération Nationale" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Acronyme / Sigle</label>
                  <input required type="text" placeholder="Ex: FLN" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.short} onChange={(e) => setFormData({...formData, short: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Secrétaire Général</label>
                  <input required type="text" placeholder="Nom du leader" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.leader} onChange={(e) => setFormData({...formData, leader: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Wilaya du Siège</label>
                <select 
                  className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                  value={formData.wilaya} 
                  onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                >
                  <option value="">Sélectionner une Wilaya</option>
                  {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nom Complet du Candidat</label>
                <input required type="text" placeholder="Prénom et Nom" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Parti Politique</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                    value={formData.short} 
                    onChange={(e) => setFormData({...formData, short: e.target.value})}
                  >
                    <option value="">Choisir un parti...</option>
                    <option value="Indépendant">Indépendant</option>
                    {partiesData.map(p => <option key={p.id} value={p.short}>{p.name} ({p.short})</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Wilaya de Candidature</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                    value={formData.wilaya} 
                    onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                  >
                    <option value="">Choisir une wilaya...</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">NIN (18 chiffres)</label>
                  <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="Identifiant National" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.nin} onChange={(e) => setFormData({...formData, nin: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">N° Téléphone</label>
                  <input required type="text" placeholder="05/06/07..." className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Date de Naissance</label>
                  <input required type="date" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="fav" className="w-5 h-5 rounded border-zinc-300 text-algerian-green focus:ring-algerian-green" checked={formData.fav} onChange={(e) => setFormData({...formData, fav: e.target.checked})} />
                  <label htmlFor="fav" className="text-sm font-medium">Candidat Favori</label>
                </div>
              </div>
              <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-2 text-zinc-400">
                <UserPlus size={24} />
                <span className="text-xs font-medium">Photo du Candidat</span>
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Annuler</button>
            <button type="submit" className="flex-1 h-12 rounded-xl bg-algerian-green text-white text-sm font-bold shadow-lg shadow-algerian-green/20 hover:bg-algerian-green-dark transition-all">
              {editingItem ? "Enregistrer les modifications" : "Confirmer l'Ajout"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex gap-2 p-1.5 rounded-2xl w-fit tab-container">
        <button
          onClick={() => setActiveTab("parties")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
            activeTab === "parties"
              ? "bg-white text-algerian-green shadow-sm tab-active"
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          <Flag size={18} />
          Partis Politiques
        </button>
        <button
          onClick={() => setActiveTab("candidates")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
            activeTab === "candidates"
              ? "bg-white text-algerian-green shadow-sm tab-active"
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          <UserSquare size={18} />
          Candidats
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "parties" && (
            <DataTable 
              columns={[
                { header: "Sigle", accessor: "short", render: (val) => (
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center font-black text-algerian-green border border-transparent dark:border-zinc-800">
                    {val}
                  </div>
                )},
                { header: "Nom du Parti (Hizb)", accessor: "name", render: (val) => <span className="font-bold">{val}</span> },
                { header: "Siège (Wilaya)", accessor: "wilaya_siege" },
                { header: "Participants", accessor: "short", render: (val) => (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-algerian-green animate-pulse" />
                    <span className="font-bold text-algerian-green">
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
              columns={[
                { header: "Candidat", accessor: "full_name", render: (val, row: any) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
                      {row.fav ? <Flag size={20} className="text-algerian-green fill-algerian-green" /> : <UserSquare size={20} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">{val}</span>
                      <span className="text-[10px] text-zinc-400">NIN: {row.nin}</span>
                    </div>
                  </div>
                )},
                { header: "Parti", accessor: "party", render: (val) => (
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold",
                    val === 'Indépendant' || !val ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-950" : "bg-algerian-green/10 text-algerian-green"
                  )}>
                    {val || 'Indépendant'}
                  </span>
                )},
                { header: "Wilaya", accessor: "wilaya" },
                { header: "Téléphone", accessor: "phone" },
                { header: "Naissance", accessor: "birthday" },
                { header: "Résultats", accessor: "result", render: (val) => (
                  <span className="font-black text-algerian-green">{val}</span>
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
  );
}
