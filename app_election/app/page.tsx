"use client";

import { 
  Users, 
  MapPin, 
  Vote, 
  FileCheck, 
  ArrowUpRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
  Shield,
  Building2,
  Key
} from "lucide-react";
import StatCard from "./components/StatCard";
import { motion } from "framer-motion";
import { useData } from "./context/DataContext";

export default function Dashboard() {
  const { 
    wilayasData, 
    communesData, 
    centersData, 
    desksData, 
    partiesData, 
    candidatesData, 
    adminsData, 
    membersData, 
    observersData 
  } = useData();

  const adminStats = [
    { title: "Wilayas", value: wilayasData.length.toString(), icon: MapPin },
    { title: "Communes", value: communesData.length.toString(), icon: Building2 },
    { title: "Admins Wilaya", value: adminsData.filter(a => a.role.includes("Wilaya")).length.toString(), icon: Shield },
    { title: "Admins Commun", value: adminsData.filter(a => a.role.includes("Baladia")).length.toString(), icon: Shield },
  ];

  const politicalStats = [
    { title: "Partis Politiques", value: partiesData.length.toString(), icon: Flag },
    { title: "Candidats", value: candidatesData.length.toString(), icon: Users },
    { title: "Membres Actifs", value: membersData.length.toString(), icon: Users },
  ];

  const jourJStats = [
    { title: "Obs. Centres", value: observersData.filter(o => o.role.includes("Centre")).length.toString(), icon: Key },
    { title: "Obs. Bureaux", value: observersData.filter(o => o.role.includes("Bureau")).length.toString(), icon: Key },
  ];

  const recentActivity = [
    { id: 1, type: "success", title: "PV Validé", bureau: "Bureau 04 - Centre Ibn Badis", location: "Alger, Sidi M'hamed", time: "Il y a 2 min" },
    { id: 2, type: "warning", title: "Écart de Saisie", bureau: "Bureau 12 - Centre Emir Abdelkader", location: "Oran, Es Senia", time: "Il y a 5 min" },
    { id: 3, type: "success", title: "PV Soumis", bureau: "Bureau 01 - Centre 1er Novembre", location: "Constantine, El Khroub", time: "Il y a 12 min" },
    { id: 4, type: "info", title: "Ouverture du Bureau", bureau: "Bureau 08 - Centre Pasteur", location: "Bejaia, Akbou", time: "Il y a 45 min" },
  ];
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Tableau de Bord</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          État global du système électoral - <span className="font-semibold text-algerian-green dark:text-algerian-green-light">Admin Central</span>
        </p>
      </div>

      {/* Infrastructure & Admins */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Infrastructure & Administration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* Politics & Members */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Entités Politiques & Membres</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {politicalStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* Jour-J Observers */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Personnel de Scrutin (Jour-J)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jourJStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Real-time Progress */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass rounded-3xl p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Progression des Résultats (PV)</h2>
            <button className="text-algerian-green dark:text-algerian-green-light text-xs font-semibold flex items-center gap-1 hover:underline">
              Détails complets <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 font-medium">Validation Globale</span>
              <span className="font-bold">78.3%</span>
            </div>
            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "78.3%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-algerian-green"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Validés</p>
                <p className="text-lg font-bold text-emerald-600">48,210</p>
              </div>
              <div className="space-y-1 border-x border-zinc-100 dark:border-zinc-800 px-4">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">En attente</p>
                <p className="text-lg font-bold text-amber-600">12,143</p>
              </div>
              <div className="space-y-1 pl-4">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Litiges</p>
                <p className="text-lg font-bold text-algerian-red">1,190</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Activité Récente</h2>
            <Clock size={18} className="text-zinc-400" />
          </div>

          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative">
                <div className="mt-1">
                  {activity.type === 'success' && <CheckCircle2 className="text-emerald-500" size={18} />}
                  {activity.type === 'warning' && <AlertCircle className="text-algerian-red" size={18} />}
                  {activity.type === 'info' && <Clock className="text-blue-500" size={18} />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">{activity.title}</p>
                  <p className="text-xs text-zinc-500">{activity.bureau}</p>
                  <p className="text-[10px] text-zinc-400">{activity.location} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
