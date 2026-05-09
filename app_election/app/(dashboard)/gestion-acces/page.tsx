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
  X,
  ShieldAlert,
  Fingerprint,
  Activity,
  Zap,
  ShieldCheck,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";

export default function GestionAcces() {
  const { 
    adminsData, setAdminsData,
    membersData, setMembersData,
    wilayasData
  } = useData();

  const [activeTab, setActiveTab] = useState<"admins" | "members">("admins");
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
    { id: "admins", label: "Administration", icon: Shield, count: adminsData.length },
    { id: "members", label: "Membres Actifs", icon: Users, count: membersData.length },
  ] as const;

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
    if (confirm("Êtes-vous sûr de vouloir révoquer cet accès ?")) {
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
        setAdminsData([{
          id: adminsData.length + 1,
          name: newUser.name,
          email: newUser.email,
          nin: newUser.nin || "Non spécifié",
          phone: newUser.phone || "Non spécifié",
          role: newUser.role === "admin_wilaya" ? `Admin Wilaya (${newUser.wilaya})` : "Admin Baladia",
          status: "Actif",
          wilaya: newUser.wilaya
        }, ...adminsData]);
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
        setMembersData([{
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
        }, ...membersData]);
      }
    }
    setIsModalOpen(false);
  };

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
            <ShieldAlert size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Contrôle de Gouvernance</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white lg:text-5xl lg:whitespace-nowrap">
            Gestion des Accès
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            Orchestration des permissions institutionnelles et audit du personnel opérationnel national.
          </p>
        </motion.div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => openModal(activeTab === 'admins' ? 'admin' : 'member')}
            className="h-12 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} strokeWidth={3} />
            {activeTab === 'admins' ? 'Nouvel Admin' : 'Inscrire Membre'}
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

      {/* Modal System */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Modification d'Accès" : (modalMode === "admin" ? "Recrutement Admin" : "Enrôlement Membre")}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          {modalMode === "admin" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identité de l'Administrateur</label>
                <input required type="text" placeholder="Prénom et Nom" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Sécurisé</label>
                  <input required type="email" placeholder="exemple@anie.dz" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact Officiel</label>
                  <input required type="text" placeholder="05XX XX XX XX" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identifiant National (NIN)</label>
                <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="18 chiffres" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Niveau d'Autorité</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                    <option value="Admin Wilaya">Admin Wilaya</option>
                    <option value="Admin Baladia">Admin Baladia</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Circonscription</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.wilaya} onChange={(e) => setNewUser({...newUser, wilaya: e.target.value})}>
                    <option value="">Sélectionner une Wilaya</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nom du Membre Actif</label>
                <input required type="text" placeholder="Prénom et Nom" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Affiliation Politique</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                    <option value="Indépendant">Indépendant</option>
                    {useData().partiesData.map(p => <option key={p.id} value={p.short}>{p.name} ({p.short})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Résidence</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.wilaya} onChange={(e) => setNewUser({...newUser, wilaya: e.target.value})}>
                    <option value="">Sélectionner une Wilaya</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NIN</label>
                  <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="18 chiffres" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date de Naissance</label>
                  <input required type="date" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.birthday} onChange={(e) => setNewUser({...newUser, birthday: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Objectif Stratégique</label>
                <textarea rows={3} placeholder="Détails de la mission..." className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold resize-none" value={newUser.goal} onChange={(e) => setNewUser({...newUser, goal: e.target.value})} />
              </div>
            </div>
          )}

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">Annuler</button>
            <button type="submit" className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
              {editingItem ? "Sauvegarder" : "Autoriser"}
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
            {activeTab === "admins" && (
              <DataTable 
                title="Registre de l'Administration Centrale"
                columns={[
                  { header: "Opérateur", accessor: "name", render: (val, row: any) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                        <Fingerprint size={18} className="text-emerald-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{val}</span>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{row.email}</span>
                      </div>
                    </div>
                  )},
                  { header: "Identifiant NIN", accessor: "nin", render: (val) => <span className="font-mono text-[11px] font-bold text-zinc-500">{val}</span> },
                  { header: "Autorité", accessor: "role", render: (val) => (
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{val}</span>
                    </div>
                  )},
                  { header: "État de Session", accessor: "status", render: (val) => (
                    <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", val === 'Actif' ? "bg-emerald-500" : "bg-zinc-400")} />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        val === 'Actif' ? "text-emerald-500" : "text-zinc-400"
                      )}>
                        {val}
                      </span>
                    </div>
                  )},
                ]}
                data={adminsData}
                onEdit={(row) => openModal("admin", row)}
                onDelete={(row) => handleDelete(row.id, "admin")}
              />
            )}

            {activeTab === "members" && (
              <DataTable 
                title="Audit du Personnel de Terrain"
                columns={[
                  { header: "Membre Actif", accessor: "name", render: (val, row: any) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400">
                        <UserRound size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{val}</span>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{row.email}</span>
                      </div>
                    </div>
                  )},
                  { header: "Superviseur", accessor: "admin_commun", render: (val) => (
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={14} className="text-emerald-500" />
                      <span className="text-[11px] font-black uppercase text-zinc-500">{val}</span>
                    </div>
                  )},
                  { header: "Mission Stratégique", accessor: "goal", render: (val) => (
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 italic">"{val}"</span>
                  )},
                  { header: "Vérification", accessor: "status", render: (val) => (
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{val}</span>
                    </div>
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
    </div>
  );
}
