"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Building2,
  FileText,
  X,
  Scan,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useData } from "../context/DataContext";

export default function PVCapturePage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { refreshAll } = useData();
  const router = useRouter();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const [verificationReport, setVerificationReport] = useState<any | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera
  const startCamera = async () => {
    setError(null);
    setPhoto(null);
    setPhotoBlob(null);
    setIsUploaded(false);
    setIsUploadingImg(false);

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        language === "ar"
          ? "تنبيه: يتطلب الوصول المباشر للكاميرا اتصالاً آمنًا (HTTPS). تم تحويلك تلقائيًا لكاميرا الهاتف العادية."
          : "Remarque: L'accès direct à la caméra nécessite une connexion HTTPS. Ouverture de l'appareil photo natif..."
      );
      fileInputRef.current?.click();
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
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
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setPhoto(dataUrl);

      canvas.toBlob((blob) => {
        if (blob) setPhotoBlob(blob);
      }, "image/jpeg", 0.95);
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
    setIsUploaded(false);
    setIsUploadingImg(false);

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
    if (!user?.desk_id) {
      setError(
        language === "ar" ? "لم يتم تحديد مكتب لهذا المستخدم." : "Aucun bureau assigné à cet observateur."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("image", photoBlob, "pv_capture.jpg");

      const token = localStorage.getItem("pvp_observer_token");
      const res = await fetch(`/api/results/desk/verify-desk/${user.desk_id}`, {
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
          ? "تم رفع صورة محضر الفرز والتحقق منها بنجاح!"
          : "Le PV a été téléversé et vérifié avec succès !"
      );
      
      if (resData.data) {
        setVerificationReport(resData.data);
      }
      
      setPhoto(null);
      setPhotoBlob(null);
      await refreshAll();
      
      // Redirect to results after 2 seconds
      setTimeout(() => {
        router.push("/resultats");
      }, 2000);
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

  // Multilingual labels for clean usage
  const labels = {
    badge: language === "ar" ? "التحقق الذكي للمحضر" : "Vérification intelligente du PV",
    title: language === "ar" ? "مسح محضر الفرز (PV)" : "Numérisation du PV",
    subtitle: language === "ar" 
      ? "قم بتصوير أو تحميل محضر الفرز الرسمي للتحقق من تطابق الأرقام مع مدخلاتك يدوياً" 
      : "Photographiez ou importez le Procès-Verbal officiel pour comparer automatiquement les chiffres avec vos saisies.",
    bureauLabel: language === "ar" ? "مكتب التصويت" : "Bureau de Vote",
    helpInfo: language === "ar" 
      ? "سيقوم نظامنا بمطابقة الصورة مع الأرقام التي أدخلتها للتحقق من عدم وجود أي تفاوتات." 
      : "Notre système analysera l'image pour valider sa conformité avec les résultats saisis.",
    cameraReady: language === "ar" ? "المستند جاهز للمسح" : "Document prêt à scanner",
    cameraInstructions: language === "ar" 
      ? "اختر تشغيل الكاميرا لالتقاط صورة مباشرة أو قم تحميل ملف المحضر من جهازك" 
      : "Activez la caméra pour photographier le document directement ou importez une image existante.",
    btnCamera: language === "ar" ? "تشغيل الكاميرا" : "Activer la Caméra",
    btnUpload: language === "ar" ? "تحميل ملف" : "Sélectionner un fichier",
    btnCancel: language === "ar" ? "إلغاء" : "Annuler",
    btnRetake: language === "ar" ? "إعادة التقاط" : "Reprendre",
    btnSubmit: language === "ar" ? "تأكيد وتحليل المحضر" : "Vérifier le PV",
    alignText: language === "ar" ? "يرجى محاذاة المحضر داخل الإطار" : "Alignez le PV dans le cadre",
    reportTitle: language === "ar" ? "تقرير المطابقة الفوري" : "Rapport de conformité instantané",
    reportSubtitle: language === "ar" 
      ? "مقارنة حية لنتائج OCR المستخلصة مع البيانات المدخلة يدوياً" 
      : "Comparaison des chiffres extraits par OCR avec la saisie manuelle.",
    colCandidate: language === "ar" ? "المرشح" : "Candidat",
    colManual: language === "ar" ? "المدخل يدوياً" : "Saisie Manuelle",
    colOcr: language === "ar" ? "المستخلص (OCR)" : "Lecture OCR",
    colStatus: language === "ar" ? "الحالة" : "Statut",
    statusMatch: language === "ar" ? "مطابق" : "Conforme",
    statusMismatch: language === "ar" ? "غير مطابق" : "Écart détecté",
    statusInconclusive: language === "ar" ? "غير حاسم" : "Indéterminé",
    warningMatch: language === "ar" 
      ? "تنبيه: يوجد اختلاف بين الصورة ومدخلاتك اليدوية. يرجى إعادة فحص الأرقام." 
      : "Attention: Des différences ont été détectées entre l'image et vos saisies. Veuillez vérifier.",
    badgeOk: language === "ar" ? "مطابق" : "OK",
    badgeDiff: language === "ar" ? "اختلاف" : "Écart",
    badgeNotRead: language === "ar" ? "غير مقروء" : "Non lu",
  };

  return (
    <div className="w-full mx-auto space-y-8 pb-20" style={{ maxWidth: "56rem" }}>
      {/* Elegant Header with Floating Accents */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 lg:p-8 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 shadow-sm w-full"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="space-y-2 flex-1 w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={12} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest font-plus-jakarta">
                {labels.badge}
              </span>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight font-plus-jakarta w-full">
              {labels.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed w-full" style={{ maxWidth: "42rem" }}>
              {labels.subtitle}
            </p>
          </div>

          {/* Bureau Info Tag */}
          {user?.desk_id && (
            <div className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-white/5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  {labels.bureauLabel}
                </span>
                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                  {user.desk_id}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Global Status Alerts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3 w-full"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 flex items-center gap-3 w-full"
          >
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
              <AlertCircle size={18} />
            </div>
            <span className="text-sm font-bold text-rose-800 dark:text-rose-300">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Workspace Card */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-hidden shadow-sm w-full">
        
        {/* Dynamic Inner Container */}
        <div className="p-6 lg:p-8 w-full">
          
          {cameraActive ? (
            /* Active Camera HUD */
            <div className="relative aspect-[4/3] md:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-black/40">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Intelligent Overlay Brackets (Scanner Frame) */}
              <div className="absolute inset-8 border border-white/20 pointer-events-none rounded-xl">
                {/* Four Corner Brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-md" />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-md" />
                <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-md" />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-md" />
                
                {/* Subtitle Inside Grid */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold tracking-wide">
                  {labels.alignText}
                </div>
              </div>

              {/* Laser Scanning Indicator Animation */}
              <motion.div 
                initial={{ y: "0%" }}
                animate={{ y: "100%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] pointer-events-none"
              />

              {/* Shutter Controls */}
              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-10">
                <button
                  onClick={stopCamera}
                  className="h-11 w-11 rounded-full bg-black/60 hover:bg-black border border-white/10 text-white flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={capturePhoto}
                  className="h-16 w-16 rounded-full border-4 border-white/90 bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  <div className="h-12 w-12 rounded-full bg-white/20 border border-white flex items-center justify-center">
                    <Scan size={20} className="text-white" />
                  </div>
                </motion.button>
                <div className="w-11" /> {/* Spacer for balance */}
              </div>
            </div>

          ) : photo ? (
            /* Image Preview & Operations */
            <div className="space-y-6 w-full">
              <div className="relative aspect-[4/3] md:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5">
                <img src={photo} alt="PV Capture" className="absolute inset-0 w-full h-full object-contain" />
                
                {/* Sparkles / AI Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-black tracking-wide flex items-center gap-1.5 shadow-md">
                  <Scan size={12} className="animate-pulse" />
                  <span>PREVIEW</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-end w-full">
                <button
                  onClick={startCamera}
                  disabled={loading || isUploadingImg}
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={15} />
                  {labels.btnRetake}
                </button>

                {!isUploaded ? (
                  <button
                    onClick={async () => {
                      if (!photoBlob || !user?.desk_id) return;
                      setIsUploadingImg(true);
                      try {
                        const formData = new FormData();
                        formData.append("image", photoBlob, "pv_capture.jpg");
                        const token = localStorage.getItem("pvp_observer_token");
                        
                        const res = await fetch(`/api/results/desk/upload-image/${user.desk_id}`, {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}` },
                          body: formData,
                        });
                        
                        if (res.ok) {
                          setIsUploaded(true);
                          await refreshAll();
                        } else {
                          const data = await res.json();
                          setError(data.message || "Erreur lors du téléversement de l'image");
                        }
                      } catch (err: any) {
                        setError(err.message || "Erreur de connexion");
                      } finally {
                        setIsUploadingImg(false);
                      }
                    }}
                    disabled={isUploadingImg}
                    className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-zinc-800 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
                  >
                    {isUploadingImg ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {language === "ar" ? "رفع الصورة" : "Téléverser"}
                  </button>
                ) : (
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-emerald-600/10"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    {labels.btnSubmit}
                  </button>
                )}
              </div>
            </div>

          ) : (
            /* Upload & Camera Action Hub (Inactive state) */
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative cursor-pointer border-2 border-dashed border-zinc-200 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl p-8 lg:p-12 transition-all duration-300 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col items-center justify-center text-center overflow-hidden w-full"
            >
              {/* Background ambient light */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 group-hover:scale-105 transition-all shadow-sm">
                <FileText size={26} className="transition-colors" />
              </div>

              <div className="space-y-2 mt-6 w-full relative z-10" style={{ maxWidth: "28rem" }}>
                <h3 className="text-base font-black text-zinc-900 dark:text-white font-plus-jakarta tracking-tight">
                  {labels.cameraReady}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {labels.cameraInstructions}
                </p>
              </div>

              {/* Action buttons inside the dropzone */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8 relative z-10 w-full" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={startCamera}
                  className="h-11 px-5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-xs font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-2 hover:bg-zinc-100 hover:border-zinc-300 dark:hover:bg-zinc-700/80 transition-all shadow-sm"
                >
                  <Camera size={14} className="text-emerald-500" />
                  {labels.btnCamera}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 px-5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-black flex items-center gap-2 transition-all shadow-sm"
                >
                  <ImageIcon size={14} />
                  {labels.btnUpload}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Small bottom footer on Action card */}
        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-white/5 flex items-center gap-2.5 text-[11px] font-bold text-zinc-400 w-full">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>{labels.helpInfo}</span>
        </div>
      </div>

      {/* Verification Report Section */}
      {verificationReport && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-hidden shadow-sm space-y-6 w-full"
        >
          {/* Report Header */}
          <div className="p-6 pb-0 border-b border-zinc-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="pb-4 flex-1 w-full">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white font-plus-jakarta tracking-tight">
                {labels.reportTitle}
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                {labels.reportSubtitle}
              </p>
            </div>
            
            <div className="pb-4 shrink-0">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border",
                verificationReport.status === "verified"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400"
                  : verificationReport.status === "mismatch"
                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400"
              )}>
                {verificationReport.status === "verified" && labels.statusMatch}
                {verificationReport.status === "mismatch" && labels.statusMismatch}
                {verificationReport.status === "inconclusive" && labels.statusInconclusive}
              </span>
            </div>
          </div>

          {/* Mismatch Critical Banner */}
          {verificationReport.status === "mismatch" && (
            <div className="mx-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 flex gap-3 text-rose-800 dark:text-rose-300 w-[calc(100%-3rem)]">
              <AlertCircle size={20} className="flex-shrink-0 text-rose-500 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">
                {labels.warningMatch}
              </p>
            </div>
          )}

          {/* Report Table */}
          <div className="px-6 pb-6 w-full">
            <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-zinc-950/20 w-full">
              <table className="w-full text-start border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-white/5 text-zinc-500 font-bold uppercase tracking-wider text-left">
                    <th className="px-4 py-3 text-start font-black">{labels.colCandidate}</th>
                    <th className="px-4 py-3 text-center font-black">{labels.colManual}</th>
                    <th className="px-4 py-3 text-center font-black">{labels.colOcr}</th>
                    <th className="px-4 py-3 text-end font-black">{labels.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 dark:divide-white/5">
                  {verificationReport.candidats.map((c: any) => {
                    const hasDifference = !c.match && c.ocrTotal !== null;
                    return (
                      <tr 
                        key={c.candidatId} 
                        className={cn(
                          "transition-colors",
                          hasDifference 
                            ? "bg-rose-50/40 dark:bg-rose-950/5 hover:bg-rose-50/60 dark:hover:bg-rose-950/10" 
                            : "hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
                        )}
                      >
                        <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white">
                          <span className="text-sm block">{c.candidatName}</span>
                          <span className="block text-[10px] text-zinc-400 font-semibold">{c.partyName}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-black text-zinc-800 dark:text-zinc-100">
                          {c.manualTotal}
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-black text-zinc-500 dark:text-zinc-400">
                          {c.ocrTotal !== null ? c.ocrTotal : "—"}
                        </td>
                        <td className="px-4 py-3 text-end">
                          {c.match ? (
                            <span className="inline-flex items-center gap-1 text-emerald-500 font-black">
                              <CheckCircle2 size={13} /> 
                              <span>{labels.badgeOk}</span>
                            </span>
                          ) : c.ocrTotal !== null ? (
                            <span className="inline-flex items-center gap-1.5 text-rose-500 font-black">
                              <AlertCircle size={13} /> 
                              <span>{labels.badgeDiff}</span>
                              <span className="text-[10px] opacity-75 font-bold px-1.5 py-0.5 rounded-full bg-rose-500/10">
                                ({c.difference > 0 ? "+" : ""}{c.difference})
                              </span>
                            </span>
                          ) : (
                            <span className="text-zinc-400 font-semibold">
                              {labels.badgeNotRead}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
