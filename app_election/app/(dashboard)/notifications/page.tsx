"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useData } from "@/app/(dashboard)/context/DataContext";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MailOpen, User, MapPin, Building, Flag, CheckCircle2, Search, Info, Phone, Calendar, Hash, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { wilayasData, communesData, centersData, desksData } = useData();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  const { data: notifications, refetch } = useNotifications({ limit: 100 });
  const [selectedId, setSelectedId] = useState<string | null>(urlId || null);
  const [searchQuery, setSearchQuery] = useState("");

  const notifs = Array.isArray(notifications) ? notifications : [];

  useEffect(() => {
    if (urlId) setSelectedId(urlId);
  }, [urlId]);

  const filteredNotifs = useMemo(() => {
    return notifs.filter((n) =>
      (n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (n.body?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );
  }, [notifs, searchQuery]);

  const selectedNotif = useMemo(() => {
    return notifs.find((n) => (n._id || n.id) === selectedId);
  }, [notifs, selectedId]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedNotif && !selectedNotif.is_read) {
      handleMarkAsRead(selectedNotif._id || selectedNotif.id);
    }
  }, [selectedNotif]);

  const renderSenderInfo = (notif: any) => {
    if (!notif.sender) return null;

    const metadata = notif.metadata || {};
    const wilaya = wilayasData.find(w => w._id === metadata.wilaya_id || w.id === metadata.wilaya_id);
    const commune = communesData.find(c => c._id === metadata.commune_id || c.id === metadata.commune_id);
    const center = centersData.find(c => c._id === metadata.center_id || c.id === metadata.center_id);
    
    const deskId = notif.sender.desk?._id || notif.sender.desk || metadata.desk_id;
    const desk = desksData.find(d => d._id === deskId || d.id === deskId);

    return (
      <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-6 border border-zinc-200 dark:border-white/10 space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-200 dark:border-white/10 pb-2">
          {language === 'ar' ? 'معلومات المرسل' : 'Informations sur l\'expéditeur'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <User className="text-indigo-500" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'الاسم الكامل' : 'Nom Complet'}</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">{notif.sender.full_name || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Info className="text-emerald-500" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'الدور' : 'Rôle'}</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white capitalize">
                {(notif.sender.role || metadata.role || 'N/A').replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Phone className="text-sky-500" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white" dir="ltr">
                {notif.sender.phone || 'N/A'}
              </p>
            </div>
          </div>

          {notif.sender.nin && (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <Hash className="text-rose-500" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'رقم التعريف' : 'NIN'}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {notif.sender.nin}
                </p>
              </div>
            </div>
          )}

          {notif.sender.date_of_birth && (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="text-amber-500" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'تاريخ الميلاد' : 'Date de Naissance'}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {new Date(notif.sender.date_of_birth).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                </p>
              </div>
            </div>
          )}

          {wilaya && (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'الولاية' : 'Wilaya'}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{wilaya.name_ar || wilaya.name_fr || wilaya.name}</p>
              </div>
            </div>
          )}

          {commune && (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Flag className="text-purple-500" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'البلدية' : 'Commune'}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{commune.name_ar || commune.name_fr || commune.name}</p>
              </div>
            </div>
          )}

          {center && (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Building className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'المركز' : 'Centre'}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{center.name}</p>
              </div>
            </div>
          )}

          {desk && (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <Monitor className="text-teal-500" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">{language === 'ar' ? 'المكتب' : 'Bureau'}</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {language === 'ar' ? 'رقم ' : 'N° '}{desk.num_desk || desk.desk_number}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#09090b] rounded-3xl p-6 lg:p-8 border border-zinc-200 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-algerian-green/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-algerian-green/10 text-algerian-green border border-algerian-green/20">
              <Bell size={16} />
              <span className="text-xs font-black uppercase tracking-widest">
                {language === 'ar' ? 'مركز الإشعارات' : 'Centre de Notifications'}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {language === 'ar' ? 'صندوق الوارد' : 'Boîte de réception'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              {language === 'ar' ? 'إدارة رسائلك والشكاوى الواردة' : 'Gérez vos messages et réclamations entrants'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Pane */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* Left List Pane */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 bg-white dark:bg-[#09090b] rounded-3xl p-4 lg:p-6 border border-zinc-200 dark:border-white/10 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث في الإشعارات...' : 'Rechercher...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-algerian-green/20 focus:border-algerian-green transition-all outline-none text-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {filteredNotifs.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" size={32} />
                <p className="text-sm font-bold text-zinc-500">
                  {language === 'ar' ? 'لا توجد إشعارات' : 'Aucune notification trouvée'}
                </p>
              </div>
            ) : (
              filteredNotifs.map((notif) => {
                const isSelected = selectedId === (notif._id || notif.id);
                return (
                  <button
                    key={notif._id || notif.id}
                    onClick={() => setSelectedId(notif._id || notif.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all border",
                      isSelected 
                        ? "bg-algerian-green/5 border-algerian-green text-zinc-900 dark:text-white shadow-sm" 
                        : "bg-white dark:bg-white/5 border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className={cn("text-sm font-bold truncate", isSelected ? "text-zinc-900 dark:text-white" : "")}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-algerian-red flex-shrink-0 mt-1 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs line-clamp-2 mb-3 opacity-75">
                      {notif.body}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <span>{new Date(notif.createdAt || Date.now()).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}</span>
                      <span>{notif.type}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-[#09090b] rounded-3xl p-6 lg:p-8 border border-zinc-200 dark:border-white/10 shadow-sm min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {selectedNotif ? (
              <motion.div
                key={selectedNotif._id || selectedNotif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 space-y-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 dark:bg-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
                      {selectedNotif.type}
                    </div>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                      {selectedNotif.title}
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold mt-2">
                      {new Date(selectedNotif.createdAt || Date.now()).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border border-zinc-100 dark:border-white/5">
                  {selectedNotif.body}
                </div>

                {renderSenderInfo(selectedNotif)}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="h-24 w-24 rounded-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                  <MailOpen size={48} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                    {language === 'ar' ? 'اختر إشعاراً' : 'Sélectionnez une notification'}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    {language === 'ar' 
                      ? 'انقر على أحد الإشعارات في القائمة الجانبية لعرض تفاصيله' 
                      : 'Cliquez sur une notification dans la liste pour voir ses détails'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
