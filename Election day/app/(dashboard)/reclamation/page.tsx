"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { MessageSquarePlus, Send, AlertTriangle, MessageCircle, FileText, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function ReclamationPage() {
  const { user } = useAuth();
  const { language, dir } = useLanguage();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"reclamation" | "message">("reclamation");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError(language === "ar" ? "يرجى ملء جميع الحقول" : "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.post<any>("/notifications/reclamation", { type, title, content });
      
      if (!response.ok) {
        throw new Error(response.message || "Failed to submit");
      }

      setSuccess(true);
      setTitle("");
      setContent("");
      setType("reclamation");
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 lg:py-12">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass border border-white/20 dark:border-white/5 rounded-[2rem] p-6 lg:p-10 shadow-2xl shadow-black/5 relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-algerian-green/5 dark:bg-algerian-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-algerian-red/5 dark:bg-algerian-red/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div variants={itemVariants} className="flex items-start gap-5 mb-10 relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-algerian-green to-algerian-green-light text-white flex items-center justify-center shadow-lg shadow-algerian-green/20 shrink-0">
            <MessageSquarePlus size={32} />
          </div>
          <div className="pt-2">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
              {language === "ar" ? "تواصل مع الإدارة" : "Communiquer avec l'Administration"}
            </h1>
            <p className="text-zinc-500 font-medium">
              {language === "ar"
                ? "أرسل شكوى رسمية أو رسالة إلى الإدارة المركزية والولائية. سيتم إشعارهم فوراً."
                : "Envoyez une réclamation officielle ou un message à l'administration centrale et de wilaya. Ils seront notifiés immédiatement."}
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden relative z-10"
            >
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 flex items-center gap-3 font-bold shadow-sm">
                <AlertTriangle size={20} className="shrink-0" />
                {error}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden relative z-10"
            >
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 font-bold shadow-sm">
                <CheckCircle2 size={20} className="shrink-0" />
                {language === "ar" ? "تم إرسال رسالتك بنجاح! سيتم مراجعتها قريباً." : "Votre message a été envoyé avec succès ! Il sera examiné prochainement."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType("reclamation")}
              className={cn(
                "p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 font-bold transition-all duration-300 relative overflow-hidden group",
                type === "reclamation"
                  ? "border-algerian-red bg-algerian-red/5 text-algerian-red dark:bg-algerian-red/10 dark:text-algerian-red shadow-md shadow-algerian-red/10"
                  : "border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-algerian-red/50 hover:bg-zinc-50 dark:hover:bg-white/5"
              )}
            >
              {type === "reclamation" && (
                <motion.div layoutId="type-active" className="absolute inset-0 bg-gradient-to-br from-algerian-red/10 to-transparent pointer-events-none" />
              )}
              <AlertTriangle size={28} className={cn("transition-transform group-hover:scale-110", type === "reclamation" ? "text-algerian-red" : "text-zinc-400")} />
              <span className="text-sm tracking-wide uppercase">{language === "ar" ? "شكوى" : "Réclamation"}</span>
            </button>
            
            <button
              type="button"
              onClick={() => setType("message")}
              className={cn(
                "p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 font-bold transition-all duration-300 relative overflow-hidden group",
                type === "message"
                  ? "border-algerian-green bg-algerian-green/5 text-algerian-green dark:bg-algerian-green/10 dark:text-algerian-green shadow-md shadow-algerian-green/10"
                  : "border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-algerian-green/50 hover:bg-zinc-50 dark:hover:bg-white/5"
              )}
            >
              {type === "message" && (
                <motion.div layoutId="type-active" className="absolute inset-0 bg-gradient-to-br from-algerian-green/10 to-transparent pointer-events-none" />
              )}
              <MessageCircle size={28} className={cn("transition-transform group-hover:scale-110", type === "message" ? "text-algerian-green" : "text-zinc-400")} />
              <span className="text-sm tracking-wide uppercase">{language === "ar" ? "رسالة" : "Message"}</span>
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-algerian-green" />
              {language === "ar" ? "الموضوع" : "Sujet"}
            </label>
            <div className="relative group">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === "ar" ? "اكتب موضوع الرسالة باختصار" : "Saisissez l'objet du message brièvement"}
                className={cn(
                  "w-full h-14 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-[#09090b] focus:ring-4 focus:ring-algerian-green/20 focus:border-algerian-green/50 outline-none transition-all font-medium text-zinc-900 dark:text-white shadow-sm",
                  dir === 'rtl' ? 'pr-5 pl-4' : 'pl-5 pr-4'
                )}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <MessageSquarePlus size={16} className="text-algerian-green" />
              {language === "ar" ? "المحتوى" : "Contenu"}
            </label>
            <div className="relative group">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={language === "ar" ? "اكتب تفاصيل الرسالة أو الشكوى هنا بوضوح..." : "Rédigez les détails de votre message ou réclamation ici clairement..."}
                className={cn(
                  "w-full h-48 py-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-[#09090b] focus:ring-4 focus:ring-algerian-green/20 focus:border-algerian-green/50 outline-none transition-all resize-none font-medium text-zinc-900 dark:text-white shadow-sm",
                  dir === 'rtl' ? 'pr-5 pl-4' : 'pl-5 pr-4'
                )}
              />
              <div className="absolute bottom-4 left-4 text-xs font-bold text-zinc-400">
                {content.length}/2000
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-end pt-6 border-t border-zinc-100 dark:border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="px-8 h-14 bg-gradient-to-r from-algerian-green to-[#046A38] text-white rounded-2xl font-black flex items-center gap-3 hover:shadow-lg hover:shadow-algerian-green/30 focus:ring-4 focus:ring-algerian-green/30 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none uppercase tracking-wider text-sm"
            >
              {loading ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={20} className={cn(dir === 'rtl' ? 'rotate-180' : '')} />
                  {language === "ar" ? "إرسال الآن" : "Envoyer Maintenant"}
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
