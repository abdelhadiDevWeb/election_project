"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const { dir } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-[95vw] sm:w-[512px] max-w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col",
              className
            )}
            dir={dir}
          >
            <div className="flex items-center justify-between p-8 border-b border-zinc-100 dark:border-white/5">
              <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
