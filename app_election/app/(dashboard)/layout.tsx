"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { DataProvider } from "./context/DataContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dir } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            Initializing Secure Session...
          </span>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DataProvider>
      <div className="flex min-h-screen relative w-full overflow-x-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 w-full min-w-0",
          dir === 'rtl' ? 'lg:pr-72 pl-0' : 'lg:pl-72 pr-0'
        )}>
          <Header toggleSidebar={() => setIsSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-8 w-full">
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
