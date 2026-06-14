"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Phone,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    nin: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register(formData);
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
    <motion.div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 py-10 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 0% 0%, rgba(0, 98, 51, 0.08) 0%, transparent 40%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] z-10"
      >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900/50 border border-white/5 mb-4 backdrop-blur-xl"
        >
          <ShieldCheck size={28} className="text-emerald-500" strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-2xl md:text-[28px] font-bold text-white tracking-tight leading-tight mb-2">
          Create Super Admin
        </h1>
        <p className="text-zinc-500 text-sm font-medium">
          Register a new platform administrator
        </p>
      </div>

      <div className="glass-morphism rounded-[28px] p-6 md:p-8 border border-white/5 bg-[#0f0f12]/75 backdrop-blur-2xl relative">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Account Setup</h2>
          <p className="text-zinc-500 text-[13px] mt-1">
            Role: <span className="text-emerald-500 font-semibold">Super Admin</span>
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <span className="text-[12px] font-bold text-red-400">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                required
                type="text"
                placeholder="Full legal name"
                className="w-full h-[46px] pl-11 pr-4 rounded-[12px] bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium"
                value={formData.full_name}
                onChange={(e) => update("full_name", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                required
                type="email"
                placeholder="admin@pvp.dz"
                className="w-full h-[46px] pl-11 pr-4 rounded-[12px] bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Phone
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                required
                type="tel"
                placeholder="05XXXXXXXX"
                className="w-full h-[46px] pl-11 pr-4 rounded-[12px] bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium"
                value={formData.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              NIN (18 digits)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Hash size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                required
                type="text"
                inputMode="numeric"
                pattern="\d{18}"
                maxLength={18}
                placeholder="18-digit national ID"
                className="w-full h-[46px] pl-11 pr-4 rounded-[12px] bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium"
                value={formData.nin}
                onChange={(e) => update("nin", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 chars, upper, digit, special"
                minLength={8}
                className="w-full h-[46px] pl-11 pr-11 rounded-[12px] bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium"
                value={formData.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] mt-2 rounded-[12px] bg-gradient-to-br from-[#006233] to-[#008c5a] text-white text-sm font-bold tracking-tight hover:translate-y-[-1px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <>
                <span>Create Super Admin</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            Already have an account? Sign in
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2">
          <Shield size={12} className="text-zinc-600" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            Secure Government Infrastructure
          </span>
        </div>
      </div>
      </motion.div>

      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
    </motion.div>
  );
}
