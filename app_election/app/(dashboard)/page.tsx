"use client";

import { useAuth } from "@/app/context/AuthContext";
import MemberDashboard from "./components/MemberDashboard";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import AdminWilayaDashboard from "./components/AdminWilayaDashboard";
import AdminCommunDashboard from "./components/AdminCommunDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "member_actif") {
    return <MemberDashboard />;
  }
  if (user?.role === "admin_wilaya") {
    return <AdminWilayaDashboard />;
  }
  if (user?.role === "admin_commun") {
    return <AdminCommunDashboard />;
  }
  return <SuperAdminDashboard />;
}
