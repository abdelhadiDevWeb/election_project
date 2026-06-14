"use client";

import { useState, useRef } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { UserSquare, Plus, Medal, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";

export default function MesCandidatsPage() {
  const { candidatesData, setCandidatesData, mutation } = useData();
  const { language, dir } = useLanguage();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nin: "",
    phone: "",
    birthday: "",
    fav: false,
    imageFile: null as File | null,
    imagePreview: null as string | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (item: Record<string, unknown> | null = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        name: String(item.full_name || item.name || ""),
        nin: String(item.nin || ""),
        phone: String(item.phone || ""),
        birthday: String(item.birthday || "").slice(0, 10),
        fav: Boolean(item.fav),
        imageFile: null,
        imagePreview: item._id ? `/api/candidats/${item._id}/portrait` : null,
      });
    } else {
      setFormData({
        name: "",
        nin: "",
        phone: "",
        birthday: "",
        fav: false,
        imageFile: null,
        imagePreview: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: number | string) => {
    const msg =
      language === "ar"
        ? "هل أنت متأكد من حذف هذا المترشح؟"
        : "Êtes-vous sûr de vouloir supprimer ce candidat ?";
    if (!confirm(msg)) return;
    try {
      const item = candidatesData.find((c) => c.id === id || c._id === id);
      const apiId = item?._id || item?.id || id;
      await mutation.mutate("DELETE", `/candidats/${apiId}`);
      setCandidatesData([]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nin) {
      alert(language === "ar" ? "الاسم والرقم الوطني مطلوبان" : "Nom et NIN requis");
      return;
    }
    try {
      const fData = new FormData();
      fData.append("full_name", formData.name);
      fData.append("nin", formData.nin);
      fData.append("phone", formData.phone || "");
      fData.append("date_of_birth", formData.birthday || "2000-01-01");
      fData.append("is_favorite", String(formData.fav));
      if (user?.party_id) fData.append("party", user.party_id);
      if (user?.wilaya_id) fData.append("wilaya", user.wilaya_id);
      if (formData.imageFile) fData.append("image", formData.imageFile);

      if (editingItem) {
        const apiId = editingItem._id || editingItem.id;
        await mutation.mutate("PUT", `/candidats/${apiId}`, fData);
      } else {
        await mutation.mutate("POST", "/candidats", fData);
      }
      setCandidatesData([]);
      setIsModalOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Operation failed");
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2 flex-1"
        >
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta">
            {language === "ar" ? "مرشحي" : "Mes Candidats"}
          </h1>
          <p className="w-full text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
            {language === "ar"
              ? "عرض وإضافة وتعديل المترشحين المسجلين تحت مسؤوليتك."
              : "Consultez, ajoutez et modifiez les candidats enregistrés sous votre responsabilité."}
          </p>
        </motion.div>
        <button
          type="button"
          onClick={() => openModal()}
          className="h-12 px-6 rounded-2xl bg-algerian-green text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
          {language === "ar" ? "مترشح جديد" : "Nouveau candidat"}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem
            ? language === "ar"
              ? "تعديل مترشح"
              : "Modifier le candidat"
            : language === "ar"
              ? "ترشيح جديد"
              : "Nouvelle candidature"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
          <motion.div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              {language === "ar" ? "الاسم الكامل" : "Nom complet"}
            </label>
            <input
              required
              type="text"
              className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">NIN</label>
              <input
                required
                type="text"
                maxLength={18}
                inputMode="numeric"
                className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                value={formData.nin}
                onChange={(e) => setFormData({ ...formData, nin: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {language === "ar" ? "الهاتف" : "Téléphone"}
              </label>
              <input
                type="text"
                className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              {language === "ar" ? "تاريخ الميلاد" : "Date de naissance"}
            </label>
            <input
              type="date"
              className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none text-sm font-bold"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-32 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-algerian-green/50 transition-colors overflow-hidden"
          >
            {formData.imagePreview ? (
              <img src={formData.imagePreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <>
                <Camera size={28} className="text-zinc-400" />
                <span className="text-[10px] font-black uppercase text-zinc-500">
                  {language === "ar" ? "صورة المترشح" : "Portrait"}
                </span>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-white/5 text-[11px] font-black uppercase"
            >
              {language === "ar" ? "إلغاء" : "Annuler"}
            </button>
            <button
              type="submit"
              className="flex-1 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase"
            >
              {language === "ar" ? "حفظ" : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>

      <AnimatePresence mode="wait">
        <motion.div
          key="table"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DataTable
            title={language === "ar" ? "قائمة مرشحي" : "Liste de mes candidats"}
            exportFileName="mes-candidats-pvp"
            columns={[
              {
                header: language === "ar" ? "المترشح" : "Candidat",
                accessor: "full_name",
                render: (val, row: Record<string, unknown>) => (
                  <div className="flex items-center gap-3">
                    <motion.div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/10 overflow-hidden flex items-center justify-center">
                      {row._id ? (
                        <img
                          src={`/api/candidats/${row._id}/portrait`}
                          alt={String(val)}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <UserSquare size={18} className="text-zinc-400" />
                      )}
                    </motion.div>
                    <span className="font-black text-zinc-900 dark:text-white">{String(val)}</span>
                  </div>
                ),
              },
              { header: "NIN", accessor: "nin" },
              { header: language === "ar" ? "الولاية" : "Wilaya", accessor: "wilaya" },
              { header: language === "ar" ? "الحزب" : "Parti", accessor: "party" },
              {
                header: language === "ar" ? "مفضل" : "Favori",
                accessor: "fav",
                render: (val) =>
                  val ? <Medal size={16} className="text-emerald-500" /> : <span className="text-zinc-400">—</span>,
              },
            ]}
            data={candidatesData}
            onEdit={(row) => openModal(row)}
            onDelete={(row) => handleDelete(row.id as string)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
