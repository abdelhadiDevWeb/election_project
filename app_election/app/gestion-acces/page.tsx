"use client";

import { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { 
  UserPlus, 
  Shield, 
  UserRound, 
  Key,
  BadgeCheck,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { useData } from "../context/DataContext";

export default function GestionAcces() {
  const { 
    adminsData, setAdminsData,
    membersData, setMembersData
  } = useData();

  const [activeTab, setActiveTab] = useState("admins");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"admin" | "member">("admin");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    nin: "",
    role: "admin_wilaya",
    wilaya: "Alger",
    baladia: "",
    birthday: "",
    goal: "",
    admin_commun: "Abdelkader Ben"
  });

  const tabs = [
    { id: "admins", label: "Administration", icon: Shield },
    { id: "members", label: "Membres Actifs", icon: UserRound },
  ];

  const openModal = (mode: "admin" | "member", item: any = null) => {
    setModalMode(mode);
    setEditingItem(item);
    if (item) {
      setNewUser({
        name: item.name,
        email: item.email,
        phone: item.phone,
        nin: item.nin,
        role: item.role.includes("Wilaya") ? "admin_wilaya" : "admin_baladia",
        wilaya: item.wilaya || item.location || "Alger",
        baladia: "",
        birthday: item.birthday || "",
        goal: item.goal || "",
        admin_commun: item.admin_commun || "Abdelkader Ben"
      });
    } else {
      setNewUser({ 
        name: "", email: "", phone: "", nin: "", 
        role: mode === 'admin' ? 'admin_wilaya' : 'membre_actif',
        wilaya: "Alger", baladia: "", birthday: "", goal: "",
        admin_commun: "Abdelkader Ben"
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, type: "admin" | "member") => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      if (type === "admin") {
        setAdminsData(adminsData.filter(a => a.id !== id));
      } else {
        setMembersData(membersData.filter(m => m.id !== id));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "admin") {
      if (editingItem) {
        setAdminsData(adminsData.map(a => a.id === editingItem.id ? {
          ...a,
          name: newUser.name,
          email: newUser.email,
          nin: newUser.nin,
          phone: newUser.phone,
          role: newUser.role === "admin_wilaya" ? `Admin Wilaya (${newUser.wilaya})` : "Admin Baladia",
          wilaya: newUser.wilaya
        } : a));
      } else {
        const entry = {
          id: adminsData.length + 1,
          name: newUser.name,
          email: newUser.email,
          nin: newUser.nin || "Non spécifié",
          phone: newUser.phone || "Non spécifié",
          role: newUser.role === "admin_wilaya" ? `Admin Wilaya (${newUser.wilaya})` : "Admin Baladia",
          status: "Actif",
          wilaya: newUser.wilaya
        };
        setAdminsData([entry, ...adminsData]);
      }
    } else {
      if (editingItem) {
        setMembersData(membersData.map(m => m.id === editingItem.id ? {
          ...m,
          name: newUser.name,
          email: newUser.email,
          nin: newUser.nin,
          phone: newUser.phone,
          birthday: newUser.birthday,
          goal: newUser.goal,
          location: newUser.wilaya,
          admin_commun: newUser.admin_commun
        } : m));
      } else {
        const entry = {
          id: membersData.length + 1,
          name: newUser.name,
          email: newUser.email,
          nin: newUser.nin || "Non spécifié",
          phone: newUser.phone || "Non spécifié",
          birthday: newUser.birthday,
          party: "Indépendant",
          goal: newUser.goal || "Aucun objectif spécifié",
          location: newUser.wilaya,
          admin_commun: newUser.admin_commun,
          status: "Permanent"
        };
        setMembersData([entry, ...membersData]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Accès</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gérez les permissions et les utilisateurs du système par module.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === "admins" && (
            <button onClick={() => openModal("admin")} className="bg-algerian-green text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg transition-all active:scale-95">
              <Shield size={18} /> Ajouter Admin
            </button>
          )}
          {activeTab === "members" && (
            <button onClick={() => openModal("member")} className="bg-algerian-green text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg transition-all active:scale-95">
              <UserRound size={18} /> Ajouter Membre
            </button>
          )}
        </div>
      </div>

      {/* Modal de Création / Edition Dédié */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          editingItem 
            ? (modalMode === "admin" ? "Modifier l'Administrateur" : "Modifier le Membre Actif")
            : (modalMode === "admin" ? "Module Administration - Nouvel Admin" : "Module Membres - Nouveau Membre Actif")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto px-1">
          {modalMode === "admin" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nom Complet</label>
                <input required type="text" placeholder="Prénom et Nom" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Email Professionnel</label>
                  <input required type="email" placeholder="exemple@anie.dz" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">N° Téléphone</label>
                  <input required type="text" placeholder="05XX XX XX XX" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">NIN (18 chiffres)</label>
                <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="Identifiant National" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Rôle / Niveau</label>
                  <select className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                    <option value="Admin Wilaya">Admin Wilaya</option>
                    <option value="Admin Baladia">Admin Baladia</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Wilaya de Compétence</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                    value={newUser.wilaya} 
                    onChange={(e) => setNewUser({...newUser, wilaya: e.target.value})}
                  >
                    <option value="">Sélectionner une Wilaya</option>
                    {useData().wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nom du Membre Actif</label>
                <input required type="text" placeholder="Prénom et Nom" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Appartenance Politique</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="">Choisir un parti...</option>
                    <option value="Indépendant">Indépendant</option>
                    {useData().partiesData.map(p => <option key={p.id} value={p.short}>{p.name} ({p.short})</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Wilaya de Résidence</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                    value={newUser.wilaya} 
                    onChange={(e) => setNewUser({...newUser, wilaya: e.target.value})}
                  >
                    <option value="">Sélectionner une Wilaya</option>
                    {useData().wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">NIN</label>
                  <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="18 chiffres" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Date de Naissance</label>
                  <input required type="date" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.birthday} onChange={(e) => setNewUser({...newUser, birthday: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Mission Assignée</label>
                <input required type="text" placeholder="Ex: Contrôle des listes" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" value={newUser.goal} onChange={(e) => setNewUser({...newUser, goal: e.target.value})} />
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

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-zinc-100 rounded-2xl w-fit tab-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === tab.id
                ? "bg-white text-algerian-green shadow-sm tab-active"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "admins" && (
            <DataTable 
              columns={[
                { header: "Nom Complet", accessor: "name", render: (val, row) => (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 font-bold text-xs border border-transparent dark:border-zinc-800">
                      {val.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">{val}</span>
                      <span className="text-[10px] text-zinc-400">{row.email}</span>
                    </div>
                  </div>
                )},
                { header: "NIN", accessor: "nin" },
                { header: "Téléphone", accessor: "phone" },
                { header: "Rôle", accessor: "role" },
                { header: "Statut", accessor: "status", render: (val) => (
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    val === 'Actif' ? "badge-actif" : "badge-expire"
                  )}>
                    {val}
                  </span>
                )},
              ]}
              data={adminsData}
              onEdit={(row) => openModal("admin", row)}
              onDelete={(row) => handleDelete(row.id, "admin")}
            />
          )}

          {activeTab === "members" && (
            <DataTable 
              columns={[
                { header: "Membre Permanent", accessor: "name", render: (val, row) => (
                   <div className="flex flex-col">
                    <span className="font-bold">{val}</span>
                    <span className="text-[10px] text-zinc-400">{row.email}</span>
                  </div>
                )},
                { header: "NIN", accessor: "nin" },
                { header: "Admin Commun Resp.", accessor: "admin_commun", render: (val) => (
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-algerian-green" />
                    <span className="text-xs font-bold">{val}</span>
                  </div>
                )},
                { header: "Objectif (Goal)", accessor: "goal", render: (val) => (
                  <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{val}</span>
                )},
                { header: "Statut", accessor: "status", render: (val) => (
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase">{val}</span>
                )},
              ]}
              data={membersData}
              onEdit={(row) => openModal("member", row)}
              onDelete={(row) => handleDelete(row.id, "member")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
