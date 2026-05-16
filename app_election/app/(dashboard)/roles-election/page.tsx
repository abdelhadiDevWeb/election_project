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
import { useLanguage } from "@/app/context/LanguageContext";

export default function RolesElection() {
  const { 
    observersData, setObserversData,
    centersData,
    mutation
  } = useData();
  const { t, language, dir } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    birthday: "",
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
        password: "",
        birthday: item.birthday || "",
        role: item.role === "Observateur Centre" ? "obs_center" : "obs_desk",
        center: item.center_id || "",
        desk: item.desk || "",
        time: item.expires || "",
        date: "",
        nin: item.nin || "",
        phone: item.phone || ""
      });
    } else {
      setNewUser({ name: "", email: "", password: "", birthday: "", role: "obs_center", center: "", desk: "", time: "", date: "", nin: "", phone: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من إلغاء هذا الاعتماد المؤقت؟' : "Révoquer cet accès temporaire ?")) {
      try {
        const item = observersData.find(o => o.id === id || o._id === id);
        const apiId = item?._id || item?.id || id;
        await mutation.mutate("DELETE", `/roles-election-day/${apiId}`);
        setObserversData([]);
      } catch (err: any) {
        alert(err?.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCenter = centersData.find(c => c.id === newUser.center || c._id === newUser.center);
      
      const roleMap: Record<string, string> = {
        obs_center: "observateur_centre",
        obs_desk: "observateur_bureau",
        chef_centre: "chef_centre",
        scrutateur: "scrutateur",
      };

      if (!newUser.email || !newUser.name || !newUser.nin || !newUser.birthday || !selectedCenter) {
        alert("Please fill all required fields (Name, Email, NIN, Birthday, and Center)");
        return;
      }

      const body: any = {
        full_name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        nin: newUser.nin,
        password: newUser.password,
        date_of_birth: newUser.birthday,
        role: roleMap[newUser.role] || "observateur_centre",
        center: selectedCenter.id || selectedCenter._id,
        wilaya: selectedCenter.wilaya_id,
        commune: selectedCenter.commune_id,
        assigned_time: newUser.time || "20:00",
        assigned_date: newUser.date || new Date().toISOString().split('T')[0],
      };

      if (editingItem) {
        const apiId = editingItem._id || editingItem.id;
        await mutation.mutate("PUT", `/roles-election-day/${apiId}`, body);
      } else {
        if (!newUser.password) { alert("Password is required. Use the lightning icon to generate one."); return; }
        await mutation.mutate("POST", "/roles-election-day", body);
      }
      setObserversData([]);
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
            <Timer size={12} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{language === 'ar' ? 'الانتشار العملياتي يوم الاقتراع' : 'Déploiement Opérationnel Jour-J'}</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white lg:text-4xl lg:whitespace-nowrap font-plus-jakarta">
            {t("nav.roles")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-2xl leading-relaxed w-full min-w-[300px]">
            {language === 'ar' ? 'إدارة الاعتمادات المؤقتة والإشراف على الموظفين الميدانيين للاقتراع الوطني.' : 'Gestion des accréditations temporaires et supervision du personnel de terrain pour le scrutin national.'}
          </p>
        </motion.div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => openModal()}
            className="h-12 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <UserCheck size={18} strokeWidth={3} />
            {language === 'ar' ? 'اعتماد مراقب' : 'Accréditer Observateur'}
          </button>
        </div>
      </div>

      {/* Stats Summary Bento */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
        {[
          { label: language === 'ar' ? "إجمالي المعتمدين" : "Total Accrédités", value: observersData.length, icon: Users, color: "text-emerald-500" },
          { label: language === 'ar' ? "الجلسات النشطة" : "Sessions Actives", value: observersData.filter(o => o.status === 'Actif' || o.status === 'نشط').length, icon: Activity, color: "text-blue-500" },
          { label: language === 'ar' ? "المناطق المغطاة" : "Zones Couvertes", value: Array.from(new Set(observersData.map(o => o.center))).length, icon: MapPin, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 sm:p-4 md:p-6 glass dark:bg-white/5 rounded-2xl md:rounded-3xl border-white/10 flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-start gap-2 md:gap-0"
          >
            <div className="order-2 md:order-1">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest text-zinc-500 mb-1 leading-tight line-clamp-1">{stat.label}</p>
              <h3 className="text-lg md:text-3xl font-black text-zinc-900 dark:text-white leading-none">{stat.value}</h3>
            </div>
            <div className={cn("h-8 w-8 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center order-1 md:order-2 flex-shrink-0", stat.color)}>
              <stat.icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} />
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem 
          ? (language === 'ar' ? "تحديث الاعتماد" : "Mise à jour d'Accréditation") 
          : (language === 'ar' ? "اعتماد مؤقت جديد" : "Nouvelle Accréditation Temporaire")}
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'هوية الموظف' : 'Identité du Personnel'}</label>
              <input required type="text" placeholder={language === 'ar' ? 'الاسم واللقب' : 'Prénom et Nom'} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                <input required type="email" placeholder="email@exemple.dz" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'كلمة المرور' : 'Mot de Passe'}</label>
                <div className="relative">
                  <input required={!editingItem} type="text" placeholder="••••••••" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold pr-12" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                  <button type="button" onClick={() => setNewUser({...newUser, password: generateCode()})} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 transition-all">
                    <Zap size={14} className="text-amber-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'تاريخ الميلاد' : 'Date de Naissance'}</label>
                <input required type="date" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.birthday || ""} onChange={(e) => setNewUser({...newUser, birthday: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الرقم التعريفي الوطني (NIN)' : 'Identifiant National (NIN)'}</label>
                <input required type="text" maxLength={18} pattern="[0-9]*" inputMode="numeric" placeholder={language === 'ar' ? '18 رقم' : '18 chiffres'} className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.nin} onChange={(e) => setNewUser({...newUser, nin: e.target.value.replace(/\D/g, "")})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'الدور العملياتي' : 'Rôle Opérationnel'}</label>
                <select className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="obs_center">{language === 'ar' ? 'مراقب مركز' : 'Observateur Centre'}</option>
                  <option value="obs_desk">{language === 'ar' ? 'مراقب مكتب' : 'Observateur Bureau'}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'تعيين المركز' : 'Affectation Centre'}</label>
                <select required className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.center} onChange={(e) => setNewUser({...newUser, center: e.target.value})}>
                  <option value="">{language === 'ar' ? 'اختيار...' : 'Sélectionner...'}</option>
                  {centersData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'جهة اتصال طارئة' : 'Contact Urgent'}</label>
                <input required type="text" placeholder="05XX XX XX XX" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{language === 'ar' ? 'انتهاء صلاحية الجلسة' : 'Expiration de Session'}</label>
                <input type="time" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold" value={newUser.time} onChange={(e) => setNewUser({...newUser, time: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">{language === 'ar' ? 'إلغاء' : 'Annuler'}</button>
            <button type="submit" className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {editingItem 
                ? (language === 'ar' ? "تحديث" : "Mettre à jour") 
                : (language === 'ar' ? "إصدار الاعتماد" : "Délivrer Accréditation")}
            </button>
          </div>
        </form>
      </Modal>

      <DataTable 
        title={language === 'ar' ? "مراقبة الاعتمادات المؤقتة" : "Contrôle des Accréditations Temporaires"}
        columns={[
          { header: language === 'ar' ? "الموظفون المعتمدون" : "Personnel Accrédité", accessor: "name", render: (val, row: any) => (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                <Fingerprint size={18} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{val}</span>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{language === 'ar' ? 'معرف الجلسة' : 'Session ID'}: {row.id * 8243}</span>
              </div>
            </div>
          )},
          { header: language === 'ar' ? "المهمة" : "Mission", accessor: "role", render: (val) => {
            const roleKey = val === "Chef de Centre" ? "roles.chef" : 
                            val === "Observateur Bureau" ? "roles.obs_bureau" : 
                            val === "Observateur Centre" ? "roles.obs_center" : null;
            return (
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                  {roleKey ? t(roleKey) : val}
                </span>
              </div>
            );
          }},
          { header: language === 'ar' ? "المنطقة المعينة" : "Zone Affectée", accessor: "location", render: (val) => (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-zinc-400" />
              <span className="text-[11px] font-bold text-zinc-500 truncate max-w-[150px]">{val}</span>
            </div>
          )},
          { header: language === 'ar' ? "رمز الوصول" : "Token d'Accès", accessor: "code", render: (val) => (
            <div className="flex items-center gap-2">
              <QrCode size={14} className="text-zinc-400" />
              <code className="bg-zinc-100 dark:bg-white/10 px-2 py-1 rounded font-mono text-[10px] text-emerald-500 font-black border border-emerald-500/10 uppercase tracking-wider">
                {val}
              </code>
            </div>
          )},
          { header: language === 'ar' ? "التحقق" : "Vérification", accessor: "status", render: (val) => (
            <div className="flex items-center gap-2">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", (val === 'Actif' || val === 'نشط') ? "bg-emerald-500" : "bg-zinc-400")} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                (val === 'Actif' || val === 'نشط') ? "text-emerald-500" : "text-zinc-400"
              )}>
                {val}
              </span>
            </div>
          )},
          { header: language === 'ar' ? "الصلاحية" : "Validité", accessor: "expires", render: (val) => (
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
