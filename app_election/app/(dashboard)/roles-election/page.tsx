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
  X,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  Fingerprint,
  Zap,
  Activity,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";

export default function RolesElection() {
  const { 
    observersData, setObserversData,
    centersData
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
    nin: "",
    phone: ""
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
        nin: item.nin || "",
        phone: item.phone || ""
      });
    } else {
      setNewUser({ name: "", email: "", role: "obs_center", center: "", desk: "", time: "", date: "", nin: "", phone: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Révoquer cet accès temporaire ?")) {
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
      setObserversData([{
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
      }, ...observersData]);
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
            <Timer size={12} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Déploiement Opérationnel Jour-J</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white lg:text-5xl lg:whitespace-nowrap">
            Rôles & Missions
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            Gestion des accréditations temporaires et supervision du personnel de terrain pour le scrutin national.
          </p>
        </motion.div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => openModal()}
            className="h-12 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <UserCheck size={18} strokeWidth={3} />
            Accréditer Observateur
          </button>
        </div>
      </div>

      {/* Stats Summary Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Accrédités", value: observersData.length, icon: Users, color: "text-emerald-500" },
          { label: "Sessions Actives", value: observersData.filter(o => o.status === 'Actif').length, icon: Activity, color: "text-blue-500" },
          { label: "Zones Couvertes", value: Array.from(new Set(observersData.map(o => o.center))).length, icon: MapPin, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass dark:bg-white/5 rounded-3xl border-white/10 shadow-xl flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={cn("h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center", stat.color)}>
              <stat.icon size={24} strokeWidth={2.5} />
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Mise à jour d'Accréditation" : "Nouvelle Accréditation Temporaire"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identité du Personnel</label>
              <input required type="text" placeholder="Prénom et Nom" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Rôle Opérationnel</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="obs_center">Observateur Centre</option>
                  <option value="obs_desk">Observateur Bureau</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Affectation Centre</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.center} onChange={(e) => setNewUser({...newUser, center: e.target.value})}>
                  <option value="">Sélectionner...</option>
                  {centersData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identifiant National (NIN)</label>
                <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder="18 chiffres" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact Urgent</label>
                <input required type="text" placeholder="05XX XX XX XX" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Expiration de Session</label>
                <input type="time" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.time} onChange={(e) => setNewUser({...newUser, time: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date Effective</label>
                <input type="date" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.date} onChange={(e) => setNewUser({...newUser, date: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">Annuler</button>
            <button type="submit" className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
              {editingItem ? "Mettre à jour" : "Délivrer Accréditation"}
            </button>
          </div>
        </form>
      </Modal>

      <DataTable 
        title="Contrôle des Accréditations Temporaires"
        columns={[
          { header: "Personnel Accrédité", accessor: "name", render: (val, row: any) => (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                <Fingerprint size={18} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{val}</span>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Session ID: {row.id * 8243}</span>
              </div>
            </div>
          )},
          { header: "Mission", accessor: "role", render: (val) => (
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{val}</span>
            </div>
          )},
          { header: "Zone Affectée", accessor: "location", render: (val) => (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-zinc-400" />
              <span className="text-[11px] font-bold text-zinc-500 truncate max-w-[150px]">{val}</span>
            </div>
          )},
          { header: "Token d'Accès", accessor: "code", render: (val) => (
            <div className="flex items-center gap-2">
              <QrCode size={14} className="text-zinc-400" />
              <code className="bg-zinc-100 dark:bg-white/10 px-2 py-1 rounded font-mono text-[10px] text-emerald-500 font-black border border-emerald-500/10 uppercase tracking-wider">
                {val}
              </code>
            </div>
          )},
          { header: "Vérification", accessor: "status", render: (val) => (
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
          { header: "Validité", accessor: "expires", render: (val) => (
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-zinc-400" />
              <span className="text-[11px] font-bold text-zinc-500">{val}</span>
            </div>
          )},
        ]}
        data={observersData}
        onEdit={(row) => openModal(row)}
        onDelete={(row) => handleDelete(row.id)}
      />
    </div>
  );
}
