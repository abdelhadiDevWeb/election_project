"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  User,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useData } from "../context/DataContext";
import { api } from "@/lib/api";

export default function PVCapturePage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { parties, myResults, refreshAll } = useData();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Selector state
  const [selectedCandidatId, setSelectedCandidatId] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flatten candidates list from parties
  const allCandidats = useRef<{ id: string; full_name: string; partyId: string; partyName: string }[]>([]);
  allCandidats.current = parties.flatMap((p: any) =>
    (p.candidats || []).map((c: any) => ({
      id: c.id || c._id,
      full_name: c.full_name,
      partyId: p.id || p._id,
      partyName: p.name,
    }))
  );

  // Default selection to first candidate if not set
  useEffect(() => {
    if (allCandidats.current.length > 0 && !selectedCandidatId) {
      setSelectedCandidatId(allCandidats.current[0].id);
    }
  }, [parties, selectedCandidatId]);

  // Start Camera
  const startCamera = async () => {
    setError(null);
    setPhoto(null);
    setPhotoBlob(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      setError(
        language === "ar"
          ? "تعذر تشغيل الكاميرا. يرجى تحميل ملف بدلاً من ذلك."
          : "Impossible d'accéder à la caméra. Veuillez utiliser l'importation de fichier."
      );
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  // Take Snapshot
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setPhoto(dataUrl);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) setPhotoBlob(blob);
      }, "image/jpeg", 0.9);
    }
    stopCamera();
  };

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPhoto(null);
    setPhotoBlob(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setPhotoBlob(file);
    };
    reader.onerror = () => {
      setError(
        language === "ar"
          ? "حدث خطأ أثناء قراءة الملف."
          : "Erreur lors de la lecture du fichier."
      );
    };
    reader.readAsDataURL(file);
  };

  // Upload photo
  const handleUpload = async () => {
    if (!photoBlob) return;
    if (!selectedCandidatId) {
      setError(
        language === "ar" ? "يرجى تحديد المرشح أولاً." : "Veuillez sélectionner un candidat."
      );
      return;
    }
    if (!user?.desk_id) {
      setError(
        language === "ar" ? "لم يتم تحديد مكتب لهذا المستخدم." : "Aucun bureau assigné à cet observateur."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const candInfo = allCandidats.current.find((c) => c.id === selectedCandidatId);
    if (!candInfo) return;

    // Find pre-existing total or default to 0
    const existing = myResults.find(
      (r: any) =>
        (typeof r.candidat === "object" ? r.candidat.id || r.candidat._id : r.candidat) === selectedCandidatId
    );
    const total = existing?.total ?? 0;

    try {
      const formData = new FormData();
      formData.append("desk", user.desk_id);
      formData.append("party", candInfo.partyId);
      formData.append("candidat", candInfo.id);
      formData.append("total", String(total));
      formData.append("image", photoBlob, "pv_capture.jpg");

      // API Call via fetch / upload multipart
      const token = localStorage.getItem("anie_observer_token");
      const res = await fetch("/api/results/desk", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Upload failed");
      }

      setSuccess(
        language === "ar"
          ? "تم رفع صورة محضر الفرز بنجاح!"
          : "Le PV d'émargement a été téléversé avec succès !"
      );
      setPhoto(null);
      setPhotoBlob(null);
      await refreshAll();
    } catch (err: any) {
      setError(err.message || "Erreur de téléversement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
          <Camera size={12} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
            {language === "ar" ? "التقاط المحضر" : "Capture Photo PV"}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white font-plus-jakarta">
          {language === "ar" ? "تصوير محضر الفرز (PV)" : "Numérisation du Procès-Verbal"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium max-w-none">
          {language === "ar"
            ? "التقط صورة واضحة لمحضر الفرز النهائي لمكتب التصويت الخاص بك وتأكيد إرسالها للجهة المركزية"
            : "Photographiez le Procès-Verbal officiel signé pour votre bureau de vote et téléversez-le pour validation."}
        </p>
      </motion.div>

      {/* Alerts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
          >
            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <span className="text-sm font-bold text-red-600 dark:text-red-400">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Scoping Selector */}
        <div className="lg:col-span-4 space-y-6 glass p-6 rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-900/10">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Building2 size={16} />
              {language === "ar" ? "ربط الصورة بالنتائج" : "Lien de la Capture"}
            </h3>
            <p className="text-xs text-zinc-500 font-medium">
              {language === "ar"
                ? "حدد مرشحًا لربط الصورة به. سيتم ربط هذه الصورة ببيانات الفرز الخاصة بك."
                : "Associez ce PV à l'un des candidats de votre bureau pour le téléversement."}
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">
                {language === "ar" ? "المرشح المستهدف" : "Candidat Ciblé"}
              </label>
              <select
                value={selectedCandidatId}
                onChange={(e) => setSelectedCandidatId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-white/[0.03] dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white outline-none focus:border-emerald-500/50"
              >
                {allCandidats.current.map((cand) => (
                  <option key={cand.id} value={cand.id} className="bg-zinc-950 text-white">
                    {cand.full_name} ({cand.partyName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Camera capture Box */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-black border border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center group shadow-2xl">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Shutter Button HUD */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={capturePhoto}
                    className="h-16 w-16 rounded-full border-4 border-white bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg"
                  >
                    <div className="h-12 w-12 rounded-full bg-white/30 border border-white" />
                  </motion.button>
                  <button
                    onClick={stopCamera}
                    className="h-12 px-4 rounded-xl bg-black/60 hover:bg-black text-white text-xs font-bold transition-colors"
                  >
                    {language === "ar" ? "إلغاء" : "Annuler"}
                  </button>
                </div>
              </>
            ) : photo ? (
              <>
                {/* Captured Preview */}
                <img src={photo} alt="PV Capture" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                  <button
                    onClick={startCamera}
                    className="h-12 px-5 rounded-xl bg-white text-zinc-900 font-black text-sm flex items-center gap-2 hover:bg-zinc-100 transition-all shadow-lg"
                  >
                    <RefreshCw size={16} />
                    {language === "ar" ? "إعادة التقاط" : "Reprendre"}
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="h-12 px-6 rounded-xl bg-gradient-to-br from-[#006233] to-[#008c5a] text-white font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 shadow-lg"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {language === "ar" ? "تأكيد ورفع الصورة" : "Téléverser le PV"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 p-8 text-center text-zinc-500">
                <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400">
                  <Camera size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    {language === "ar" ? "الكاميرا جاهزة" : "Caméra non démarrée"}
                  </p>
                  <p className="text-xs max-w-none">
                    {language === "ar"
                      ? "اضغط أدناه لبدء تشغيل الكاميرا والتقاط صورة لمحضر الفرز"
                      : "Démarrez le flux vidéo pour prendre une photo nette ou importez un fichier image."}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  <button
                    onClick={startCamera}
                    className="h-12 px-6 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
                  >
                    <Camera size={16} />
                    {language === "ar" ? "تشغيل الكاميرا" : "Activer la Caméra"}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-12 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-950 text-white text-sm font-black flex items-center gap-2 transition-all"
                  >
                    <ImageIcon size={16} />
                    {language === "ar" ? "تحميل ملف" : "Sélectionner un fichier"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
