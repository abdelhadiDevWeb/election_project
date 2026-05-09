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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Nom Complet</label>
              <input required type="text" placeholder="Ex: Mohamed Amine" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none transition-all" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
              <input required type="email" placeholder="m.amine@anie.dz" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Téléphone</label>
              <input type="text" pattern="[0-9]*" inputMode="numeric" placeholder="05XX XX XX XX" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">NIN (Numéro d'Identification National)</label>
              <input type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Numéro à 18 chiffres" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" />
            </div>

            <div className="space-y-1 col-span-2">
               <label className="text-xs font-bold text-zinc-500 uppercase">Rôle Jour-J</label>
               <select className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                <option value="obs_center">Observateur Centre</option>
                <option value="obs_desk">Observateur Bureau</option>
              </select>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Centre</label>
              <input required type="text" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" placeholder="Nom du centre" value={newUser.center} onChange={(e) => setNewUser({...newUser, center: e.target.value})} />
            </div>

            {newUser.role === "obs_desk" && (
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">ID Bureau</label>
                <input required type="text" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" placeholder="N° Bureau" value={newUser.desk} onChange={(e) => setNewUser({...newUser, desk: e.target.value})} />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Heure Début</label>
              <input type="time" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.time} onChange={(e) => setNewUser({...newUser, time: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Date</label>
              <input type="date" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.date} onChange={(e) => setNewUser({...newUser, date: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Photo / Image</label>
            <div className="h-24 w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 text-xs font-medium cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Cliquez pour uploader
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-6 border border-amber-500/20 bg-amber-500/5">
           <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
              <ShieldAlert size={20} />
           </div>
           <h3 className="font-bold text-sm mb-1">Expiration Automatique</h3>
           <p className="text-xs text-zinc-500">Tous les accès temporaires expirent à H+2 après la clôture des bureaux.</p>
        </div>
        <div className="glass rounded-3xl p-6 border border-algerian-green/20 bg-algerian-green/5">
           <div className="h-10 w-10 rounded-xl bg-algerian-green/10 flex items-center justify-center text-algerian-green mb-4">
              <QrCode size={20} />
           </div>
           <h3 className="font-bold text-sm mb-1">Authentification QR</h3>
           <p className="text-xs text-zinc-500">Les observateurs peuvent utiliser le code généré pour se connecter via l'application mobile.</p>
        </div>
        <div className="glass rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
           <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              <Users size={20} />
           </div>
           <h3 className="font-bold text-sm mb-1">Volume Actif</h3>
           <p className="text-xs text-zinc-500">Actuellement <span className="font-bold text-algerian-green">4,210</span> accès temporaires sont actifs sur le territoire.</p>
        </div>
      </div>

      <DataTable 
        columns={[
          { header: "Personnel", accessor: "name", render: (val) => (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Calendar size={14} />
              </div>
              <span className="font-bold">{val}</span>
            </div>
          )},
          { header: "Fonction", accessor: "role" },
          { header: "Affectation", accessor: "location" },
          { header: "Code d'Accès", accessor: "code", render: (val) => (
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono text-xs text-algerian-green font-bold">
              {val}
            </code>
          )},
          { header: "Statut", accessor: "status", render: (val) => (
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
              val === 'Actif' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
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
