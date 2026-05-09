"use client";

import { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { 
  Key, 
  Calendar, 
  ShieldAlert, 
  Plus,
  QrCode,
  Users,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { useData } from "../context/DataContext";

export default function RolesElection() {
  const { 
    observersData, setObserversData
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "obs_center",
    center: "",
    desk: "",
    time: "",
    date: "",
  });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const randomNums = Array.from({length: 3}, () => nums[Math.floor(Math.random() * nums.length)]).join("");
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    return `TMP-${randomNums}-${randomChar}`;
  };

  const openModal = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      setNewUser({
        name: item.name,
        email: item.email || "",
        role: item.role === "Observateur Centre" ? "obs_center" : "obs_desk",
        center: item.center || "",
        desk: item.desk || "",
        time: item.expires || "",
        date: "",
      });
    } else {
      setNewUser({ name: "", email: "", role: "obs_center", center: "", desk: "", time: "", date: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet observateur ?")) {
      setObserversData(observersData.filter(o => o.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setObserversData(observersData.map(o => o.id === editingItem.id ? {
        ...o,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role === "obs_center" ? "Observateur Centre" : "Observateur Bureau",
        center: newUser.center,
        desk: newUser.desk,
        location: `${newUser.center || "Centre Non Spécifié"}${newUser.desk ? ` - Bureau ${newUser.desk}` : ""}`,
        expires: newUser.time || o.expires
      } : o));
    } else {
      const entry = {
        id: observersData.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role === "obs_center" ? "Observateur Centre" : "Observateur Bureau",
        center: newUser.center,
        desk: newUser.desk,
        location: `${newUser.center || "Centre Non Spécifié"}${newUser.desk ? ` - Bureau ${newUser.desk}` : ""}`,
        code: generateCode(),
        status: "Actif",
        expires: newUser.time || "20:00"
      };
      setObserversData([entry, ...observersData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rôles Jour-J</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gérez les accès temporaires pour le jour du scrutin.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-algerian-green hover:bg-algerian-green-dark text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-algerian-green/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          Ajouter Observateur
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Modifier l'Observateur" : "Module Jour-J - Nouvel Observateur"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Nom Complet</label>
              <input required type="text" placeholder="Prénom et Nom" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Rôle Jour-J</label>
                <select className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="obs_center">Observateur Centre</option>
                  <option value="obs_desk">Observateur Bureau</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Centre de Vote</label>
                <select 
                  className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                  value={newUser.center} 
                  onChange={(e) => setNewUser({...newUser, center: e.target.value})}
                >
                  <option value="">Sélectionner...</option>
                  {useData().centersData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">NIN (18 chiffres)</label>
                <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="Identifiant National" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">N° Téléphone</label>
                <input required type="text" placeholder="05/06/07..." className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Heure Début</label>
                <input type="time" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.time} onChange={(e) => setNewUser({...newUser, time: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Date</label>
                <input type="date" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.date} onChange={(e) => setNewUser({...newUser, date: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Annuler</button>
            <button type="submit" className="flex-1 h-12 rounded-xl bg-algerian-green text-white text-sm font-bold shadow-lg shadow-algerian-green/20 hover:bg-algerian-green-dark transition-all">
              {editingItem ? "Enregistrer les modifications" : "Confirmer l'Ajout"}
            </button>
          </div>
        </form>
      </Modal>


      <DataTable 
        columns={[
          { header: "Personnel", accessor: "name", render: (val) => (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 border border-transparent dark:border-zinc-800">
                <Calendar size={14} />
              </div>
              <span className="font-bold">{val}</span>
            </div>
          )},
          { header: "Fonction", accessor: "role" },
          { header: "Affectation", accessor: "location" },
          { header: "Code d'Accès", accessor: "code", render: (val) => (
            <code className="bg-zinc-100 dark:bg-zinc-950 px-2 py-1 rounded font-mono text-xs text-algerian-green font-bold border border-transparent dark:border-zinc-800">
              {val}
            </code>
          )},
          { header: "Statut", accessor: "status", render: (val) => (
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
              val === 'Actif' ? "badge-actif" : "badge-expire"
            )}>
              {val}
            </span>
          )},
          { header: "Validité Jusqu'à", accessor: "expires" },
        ]}
        data={observersData}
        onEdit={(row) => openModal(row)}
        onDelete={(row) => handleDelete(row.id)}
      />
    </div>
  );
}
