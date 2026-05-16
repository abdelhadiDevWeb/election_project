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
  Users,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";

export default function GestionAcces() {
  const { 
    adminsData, setAdminsData,
    membersData, setMembersData,
    wilayasData, communesData,
    partiesData,
    mutation
  } = useData();
  const { t, language, dir } = useLanguage();

  const [activeTab, setActiveTab] = useState<"admins" | "members">("admins");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"admin" | "member">("admin");
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    nin: "",
    password: "",
    wilaya: "",
    baladia: "",
    party_id: "",
    birthday: "",
    goal: "",
    admin_commun: "Abdelkader Ben"
  });
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: "admins", label: language === 'ar' ? 'الإدارة' : 'Administration', icon: Shield, count: adminsData.length },
    { id: "members", label: language === 'ar' ? 'الأعضاء النشطون' : 'Membres Actifs', icon: Users, count: membersData.length },
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
        password: "",
        role: item.role.includes("Wilaya") ? "admin_wilaya" : "admin_commun",
        wilaya: item.wilaya_id || "",
        baladia: item.commune_id || "",
        party_id: item.party_id || "",
        birthday: item.birthday || "",
        goal: item.goal || "",
        admin_commun: item.admin_commun || "Abdelkader Ben"
      });
    } else {
      setNewUser({ 
        name: "", email: "", phone: "", nin: "", password: "",
        role: mode === 'admin' ? 'admin_wilaya' : 'membre_actif',
        wilaya: "", baladia: "", party_id: "", birthday: "", goal: "",
        admin_commun: "Abdelkader Ben"
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string, type: "admin" | "member") => {
    if (confirm("Êtes-vous sûr de vouloir révoquer cet accès ?")) {
      try {
        if (type === "admin") {
          const admin = adminsData.find(a => a.id === id || a._id === id);
          const apiId = admin?._id || admin?.id || id;
          const endpoint = admin?._type === "admin_commun" 
            ? `/admin-communs/${apiId}` 
            : `/admin-wilayas/${apiId}`;
          await mutation.mutate("DELETE", endpoint);
          setAdminsData([]);
        } else {
          const member = membersData.find(m => m.id === id || m._id === id);
          const apiId = member?._id || member?.id || id;
          await mutation.mutate("DELETE", `/members-actifs/${apiId}`);
          setMembersData([]);
        }
      } catch (err: any) {
        alert(err?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "admin") {
        const isWilayaAdmin = newUser.role === "admin_wilaya";
        const endpoint = isWilayaAdmin ? "/admin-wilayas" : "/admin-communs";
        const body: any = {
          full_name: newUser.name,
          email: newUser.email,
          nin: newUser.nin,
          phone: newUser.phone,
          wilaya: newUser.wilaya,
          status: "active",
        };
        if (newUser.password) body.password = newUser.password;
        if (!isWilayaAdmin && newUser.baladia) body.commune = newUser.baladia;

        if (editingItem) {
          const apiId = editingItem._id || editingItem.id;
          const editEndpoint = editingItem._type === "admin_commun" 
            ? `/admin-communs/${apiId}` 
            : `/admin-wilayas/${apiId}`;
          await mutation.mutate("PUT", editEndpoint, body);
        } else {
          if (!newUser.password) { alert("Password is required"); return; }
          await mutation.mutate("POST", endpoint, body);
        }
        setAdminsData([]);
      } else {
        const body: any = {
          full_name: newUser.name,
          email: newUser.email,
          nin: newUser.nin,
          phone: newUser.phone,
          date_of_birth: newUser.birthday,
          goal: newUser.goal,
          wilaya: newUser.wilaya,
          commune: newUser.baladia,
          party: newUser.party_id || undefined,
        };
        if (newUser.password) body.password = newUser.password;

        if (editingItem) {
          const apiId = editingItem._id || editingItem.id;
          await mutation.mutate("PUT", `/members-actifs/${apiId}`, body);
        } else {
          if (!newUser.password) { alert("Password is required"); return; }
          await mutation.mutate("POST", "/members-actifs", body);
        }
        setMembersData([]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const details = err.response?.details;
      const detailStr = Array.isArray(details) ? "\n" + details.join("\n") : "";
      alert((err?.message || "Operation failed") + detailStr);
    }
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
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{language === 'ar' ? 'مراقبة الحوكمة' : 'Contrôle de Gouvernance'}</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white lg:text-4xl lg:whitespace-nowrap font-plus-jakarta">
            {t("nav.access")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            {language === 'ar' ? 'تنظيم التصاريح المؤسسية وتدقيق الموظفين التشغيليين الوطنيين.' : 'Orchestration des permissions institutionnelles et audit du personnel opérationnel national.'}
          </p>
        </motion.div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => openModal(activeTab === 'admins' ? 'admin' : 'member')}
            className="h-12 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} strokeWidth={3} />
            {activeTab === 'admins' ? (language === 'ar' ? 'مسؤول جديد' : 'Nouvel Admin') : (language === 'ar' ? 'تسجيل عضو' : 'Inscrire Membre')}
          </button>
        </div>
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
        title={editingItem ? (language === 'ar' ? 'تعديل الوصول' : "Modification d'Accès") : (modalMode === "admin" ? (language === 'ar' ? 'توظيف مسؤول' : "Recrutement Admin") : (language === 'ar' ? 'تسجيل عضو' : "Enrôlement Membre"))}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          {modalMode === "admin" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'هوية المسؤول' : "Identité de l'Administrateur"}</label>
                <input required type="text" placeholder={language === 'ar' ? 'الاسم واللقب' : "Prénom et Nom"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'البريد الإلكتروني المؤمن' : 'Email Sécurisé'}</label>
                  <input required type="email" placeholder="exemple@anie.dz" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الاتصال الرسمي' : 'Contact Officiel'}</label>
                  <input required type="text" placeholder="05XX XX XX XX" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'التعريف الوطني (NIN)' : 'Identifiant National (NIN)'}</label>
                <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder={language === 'ar' ? '18 رقمًا' : "18 chiffres"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'مستوى السلطة' : "Niveau d'Autorité"}</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                    <option value="admin_wilaya">{language === 'ar' ? 'مسؤول ولاية' : 'Admin Wilaya'}</option>
                    <option value="admin_commun">{language === 'ar' ? 'مسؤول بلدية' : 'Admin Commun'}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'كلمة المرور' : 'Mot de Passe'}</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold pr-12" 
                      value={newUser.password} 
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                      required={!editingItem}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {newUser.role === "admin_wilaya" ? (
                  <>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الولاية' : 'Wilaya'}</label>
                    <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.wilaya} onChange={(e) => setNewUser({...newUser, wilaya: e.target.value})}>
                      <option value="">{language === 'ar' ? 'اختر ولاية' : 'Sélectionner une Wilaya'}</option>
                      {wilayasData.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                    </select>
                  </>
                ) : (
                  <>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'البلدية' : 'Admin Commun'}</label>
                    <select 
                      required 
                      className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" 
                      value={newUser.baladia} 
                      onChange={(e) => {
                        const com = communesData.find(c => c._id === e.target.value || c.id === e.target.value);
                        setNewUser({...newUser, baladia: e.target.value, wilaya: com?.wilaya_id || ""});
                      }}
                    >
                      <option value="">{language === 'ar' ? 'اختر بلدية' : 'Sélectionner une Commune'}</option>
                      {communesData.map(c => <option key={c._id} value={c._id}>{c.name} ({c.wilaya})</option>)}
                    </select>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'اسم العضو النشط' : 'Nom du Membre Actif'}</label>
                <input required type="text" placeholder={language === 'ar' ? 'الاسم واللقب' : "Prénom et Nom"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الانتماء السياسي' : 'Affiliation Politique'}</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.party_id} onChange={(e) => setNewUser({...newUser, party_id: e.target.value})}>
                    <option value="">{language === 'ar' ? 'مستقل' : 'Indépendant'}</option>
                    {partiesData.map(p => <option key={p._id} value={p._id}>{p.name} ({p.short})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الولاية' : 'Wilaya'}</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.wilaya} onChange={(e) => setNewUser({...newUser, wilaya: e.target.value, baladia: ""})}>
                    <option value="">{language === 'ar' ? 'اختر ولاية' : 'Sélectionner une Wilaya'}</option>
                    {wilayasData.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'البلدية' : 'Commune'}</label>
                  <select 
                    required 
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" 
                    value={newUser.baladia} 
                    onChange={(e) => setNewUser({...newUser, baladia: e.target.value})}
                  >
                    <option value="">{language === 'ar' ? 'اختر بلدية' : 'Sélectionner une Commune'}</option>
                    {communesData.filter(c => String(c.wilaya_id) === String(newUser.wilaya)).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'رقم التعريف الوطني' : 'NIN'}</label>
                  <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder={language === 'ar' ? '18 رقمًا' : "18 chiffres"} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'تاريخ الميلاد' : 'Date de Naissance'}</label>
                <input required type="date" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.birthday} onChange={(e) => setNewUser({...newUser, birthday: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'كلمة المرور' : 'Mot de Passe'}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold pr-12" 
                    value={newUser.password} 
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                    required={!editingItem}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الهدف الاستراتيجي' : 'Objectif Stratégique'}</label>
                <textarea rows={3} placeholder={language === 'ar' ? 'تفاصيل المهمة...' : "Détails de la mission..."} className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold resize-none" value={newUser.goal} onChange={(e) => setNewUser({...newUser, goal: e.target.value})} />
              </div>
            </div>
          )}

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">{language === 'ar' ? 'إلغاء' : 'Annuler'}</button>
            <button type="submit" className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {editingItem ? (language === 'ar' ? 'حفظ' : "Sauvegarder") : (language === 'ar' ? 'تصريح' : "Autoriser")}
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
                title={language === 'ar' ? 'سجل الإدارة المركزية' : "Registre de l'Administration Centrale"}
                columns={[
                  { header: language === 'ar' ? 'المشغل' : "Opérateur", accessor: "name", render: (val, row: any) => (
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
                  { header: language === 'ar' ? 'رقم التعريف' : "Identifiant NIN", accessor: "nin", render: (val) => <span className="font-mono text-[11px] font-bold text-zinc-500">{val}</span> },
                  { header: language === 'ar' ? 'السلطة' : "Autorité", accessor: "role", render: (val) => (
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{t(`roles.${val.toLowerCase().replace(' ', '_')}`) || val}</span>
                    </div>
                  )},
                  { header: language === 'ar' ? 'حالة الجلسة' : "État de Session", accessor: "status", render: (val) => (
                    <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", val === 'Actif' ? "bg-emerald-500" : "bg-zinc-400")} />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        val === 'Actif' ? "text-emerald-500" : "text-zinc-400"
                      )}>
                        {val === 'Actif' ? (language === 'ar' ? 'نشط' : 'Actif') : (language === 'ar' ? 'غير نشط' : 'Inactif')}
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
                title={language === 'ar' ? 'تدقيق الموظفين الميدانيين' : "Audit du Personnel de Terrain"}
                columns={[
                  { header: language === 'ar' ? 'العضو النشط' : "Membre Actif", accessor: "name", render: (val, row: any) => (
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
                  { header: language === 'ar' ? 'المشرف' : "Superviseur", accessor: "admin_commun", render: (val) => (
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={14} className="text-emerald-500" />
                      <span className="text-[11px] font-black uppercase text-zinc-500">{val}</span>
                    </div>
                  )},
                  { header: language === 'ar' ? 'المهمة الاستراتيجية' : "Mission Stratégique", accessor: "goal", render: (val) => (
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 italic">"{val}"</span>
                  )},
                  { header: language === 'ar' ? 'التحقق' : "Vérification", accessor: "status", render: (val) => (
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{val === 'Permanent' ? (language === 'ar' ? 'دائم' : 'Permanent') : val}</span>
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
