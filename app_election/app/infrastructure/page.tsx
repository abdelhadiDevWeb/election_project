"use client";

import { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import * as XLSX from "xlsx";
import { 
  MapPin, 
  Building2, 
  Vote, 
  ChevronRight,
  Search,
  Users,
  Plus,
  Globe,
  FileUp,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";

export default function InfrastructureSetup() {
  const { 
    wilayasData, setWilayasData,
    communesData, setCommunesData,
    centersData, setCentersData,
    desksData, setDesksData
  } = useData();

  const [activeTab, setActiveTab] = useState<"wilayas" | "communes" | "centers" | "desks">("wilayas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"wilaya" | "commune" | "center" | "desk">("center");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    num: "",
    seats: "",
    wilaya: "Alger",
    center: "Centre Pasteur",
    location: "",
    male: 0,
    female: 0,
    total: 0,
    desksCount: 0
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        const newWilayas: any[] = [];
        const newCommunes: any[] = [];
        const newCenters: any[] = [];

        data.forEach((row, index) => {
          if (row.Wilaya && !newWilayas.find(w => w.name === row.Wilaya)) {
            newWilayas.push({
              id: Date.now() + index,
              name: row.Wilaya,
              num_wilaya: row.CodeWilaya || "00",
              seats_count: row.Sieges || 10,
              communes: 0,
              centers: 0,
              desks: 0
            });
          }

          if (row.Commune && !newCommunes.find(c => c.name === row.Commune)) {
            newCommunes.push({
              id: Date.now() + index + 1000,
              name: row.Commune,
              num_bladia: row.CodeCommune || "00",
              wilaya: row.Wilaya || "Alger",
              centers: 0,
              desks: 0
            });
          }

          if (row.Centre) {
            newCenters.push({
              id: Date.now() + index + 2000,
              name: row.Centre,
              location: row.Localisation || "Inconnu",
              male: row.Hommes || 0,
              female: row.Femmes || 0,
              total: (row.Hommes || 0) + (row.Femmes || 0),
              numbers_desks: row.Bureaux || 0
            });
          }
        });

        setWilayasData(prev => [...newWilayas, ...prev]);
        setCommunesData(prev => [...newCommunes, ...prev]);
        setCentersData(prev => [...newCenters, ...prev]);
        
        alert("Importation réussie : " + data.length + " lignes traitées.");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'importation. Vérifiez le format du fichier.");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      { Wilaya: "Alger", CodeWilaya: "16", Sieges: 35, Commune: "Sidi M'hamed", CodeCommune: "01", Centre: "Centre Pasteur", Localisation: "Rue Didouche", Hommes: 2000, Femmes: 2000, Bureaux: 10 },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Infrastructure_ANIE.xlsx");
  };

  const openModal = (type: "wilaya" | "commune" | "center" | "desk", item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name || item.num_desk || "",
        num: item.num_wilaya || item.num_bladia || item.num_desk || "",
        seats: item.seats_count?.toString() || "",
        wilaya: item.wilaya || "Alger",
        center: item.center || "Centre Pasteur",
        location: item.location || "",
        male: item.male || 0,
        female: item.female || 0,
        total: item.total || 0,
        desksCount: item.numbers_desks || 0
      });
    } else {
      setFormData({ ...formData, name: "", num: "", seats: "", location: "", male: 0, female: 0, total: 0, desksCount: 0 });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, type: "wilaya" | "commune" | "center" | "desk") => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      switch (type) {
        case "wilaya": setWilayasData(wilayasData.filter(w => w.id !== id)); break;
        case "commune": setCommunesData(communesData.filter(c => c.id !== id)); break;
        case "center": setCentersData(centersData.filter(c => c.id !== id)); break;
        case "desk": setDesksData(desksData.filter(d => d.id !== id)); break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "wilaya") {
      if (editingItem) {
        setWilayasData(wilayasData.map(w => w.id === editingItem.id ? {
          ...w,
          name: formData.name,
          num_wilaya: formData.num,
          seats_count: parseInt(formData.seats) || 0,
        } : w));
      } else {
        setWilayasData([{
          id: wilayasData.length + 50,
          name: formData.name,
          num_wilaya: formData.num,
          seats_count: parseInt(formData.seats) || 0,
          communes: 0,
          centers: 0,
          desks: 0
        }, ...wilayasData]);
      }
    } else if (modalType === "commune") {
      if (editingItem) {
        setCommunesData(communesData.map(c => c.id === editingItem.id ? {
          ...c,
          name: formData.name,
          num_bladia: formData.num,
          wilaya: formData.wilaya,
        } : c));
      } else {
        setCommunesData([{
          id: communesData.length + 1,
          name: formData.name,
          num_bladia: formData.num,
          wilaya: formData.wilaya,
          centers: 0,
          desks: 0
        }, ...communesData]);
      }
    } else if (modalType === "center") {
      if (editingItem) {
        setCentersData(centersData.map(c => c.id === editingItem.id ? {
          ...c,
          name: formData.name,
          location: formData.location,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female,
          numbers_desks: formData.desksCount
        } : c));
      } else {
        setCentersData([{
          id: centersData.length + 1,
          name: formData.name,
          location: formData.location,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female,
          numbers_desks: formData.desksCount
        }, ...centersData]);
      }
    } else if (modalType === "desk") {
      if (editingItem) {
        setDesksData(desksData.map(d => d.id === editingItem.id ? {
          ...d,
          num_desk: formData.num,
          center: formData.center,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female
        } : d));
      } else {
        setDesksData([{
          id: desksData.length + 1,
          num_desk: formData.num,
          center: formData.center,
          male: formData.male,
          female: formData.female,
          total: formData.male + formData.female
        }, ...desksData]);
      }
    }
    setIsModalOpen(false);
  };

  const tabs = [
    { id: "wilayas", label: "Wilayas", icon: Globe },
    { id: "communes", label: "Communes", icon: MapPin },
    { id: "centers", label: "Centres", icon: Building2 },
    { id: "desks", label: "Bureaux", icon: Vote },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Infrastructure Électorale</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Gérez la hiérarchie administrative et les lieux de vote.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={downloadTemplate}
            className="h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
            title="Télécharger le modèle Excel"
          >
            <Download size={18} />
            Modèle
          </button>
          
          <label className="h-11 px-6 rounded-xl border-2 border-dashed border-algerian-green/30 text-algerian-green text-sm font-bold hover:bg-algerian-green/5 transition-all flex items-center gap-2 cursor-pointer relative">
            <FileUp size={18} />
            <span>{isImporting ? "Importation..." : "Importer Excel"}</span>
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
              disabled={isImporting}
            />
          </label>

          <button 
            onClick={() => openModal(activeTab === 'wilayas' ? 'wilaya' : activeTab === 'communes' ? 'commune' : activeTab === 'centers' ? 'center' : 'desk')}
            className="h-11 px-6 rounded-xl bg-algerian-green text-white text-sm font-bold shadow-lg shadow-algerian-green/20 hover:bg-algerian-green-dark transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter {activeTab === 'wilayas' ? 'Wilaya' : activeTab === 'communes' ? 'Commune' : activeTab === 'centers' ? 'Centre' : 'Bureau'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === tab.id
                ? "bg-white dark:bg-zinc-800 text-algerian-green shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Infrastructure Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          editingItem ? "Modifier " + (modalType === "wilaya" ? "la Wilaya" : modalType === "commune" ? "la Commune" : modalType === "center" ? "le Centre" : "le Bureau") :
          modalType === "wilaya" ? "Ajouter une Wilaya" : 
          modalType === "commune" ? "Ajouter une Commune" : 
          modalType === "center" ? "Ajouter un Centre de Vote" : "Ajouter un Bureau"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          {modalType === "wilaya" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Code Wilaya</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 16" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Numéro Wilaya</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 16" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nom de la Wilaya</label>
                <input required type="text" placeholder="Ex: Alger" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Sièges disponibles</label>
                <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 12" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.seats} onChange={(e) => setFormData({...formData, seats: e.target.value.replace(/\D/g, "")})} />
              </div>
            </div>
          )}

          {modalType === "commune" && (
            <div className="space-y-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Wilaya Parente</label>
                <select 
                  className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                  value={formData.wilaya} 
                  onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                >
                  <option value="">Sélectionner une Wilaya</option>
                  {wilayasData.map(w => <option key={w.id} value={w.name}>{w.num_wilaya} - {w.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Nom de la Commune</label>
                  <input required type="text" placeholder="Ex: Sidi M'hamed" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Numéro Commune</label>
                  <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 01" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
                </div>
              </div>
            </div>
          )}

          {modalType === "center" && (
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Wilaya</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm"
                    value={formData.wilaya}
                    onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                  >
                    <option value="">Choisir...</option>
                    {wilayasData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Commune</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm"
                    value={formData.location.split(', ')[0] === formData.wilaya ? "" : formData.location.split(', ')[1]}
                    onChange={(e) => setFormData({...formData, location: `${formData.wilaya}, ${e.target.value}`})}
                  >
                    <option value="">Choisir...</option>
                    {communesData.filter(c => c.wilaya === formData.wilaya).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    {communesData.filter(c => c.wilaya === formData.wilaya).length === 0 && <option disabled>Aucune commune</option>}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nom du Centre</label>
                <input required type="text" placeholder="Ex: Centre Pasteur" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Localisation / Adresse</label>
                <input required type="text" placeholder="Ex: Rue Didouche Mourad" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Hommes</label>
                  <input required type="number" placeholder="0" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.male} onChange={(e) => setFormData({...formData, male: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Femmes</label>
                  <input required type="number" placeholder="0" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.female} onChange={(e) => setFormData({...formData, female: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Total</label>
                  <div className="w-full h-11 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center text-algerian-green font-bold border border-zinc-200 dark:border-zinc-700">
                    {formData.male + formData.female}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Nombre de Bureaux</label>
                <input required type="number" placeholder="Ex: 12" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.desksCount} onChange={(e) => setFormData({...formData, desksCount: parseInt(e.target.value) || 0})} />
              </div>
            </div>
          )}

          {modalType === "desk" && (
            <div className="space-y-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Centre de Vote Parent</label>
                <select 
                  className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none text-sm" 
                  value={formData.center} 
                  onChange={(e) => setFormData({...formData, center: e.target.value})}
                >
                  <option value="">Sélectionner un Centre</option>
                  {centersData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Numéro du Bureau</label>
                <input required type="text" pattern="[0-9]*" inputMode="numeric" placeholder="Ex: 01" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.num} onChange={(e) => setFormData({...formData, num: e.target.value.replace(/\D/g, "")})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Hommes</label>
                  <input required type="number" placeholder="0" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.male} onChange={(e) => setFormData({...formData, male: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Femmes</label>
                  <input required type="number" placeholder="0" className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 outline-none" value={formData.female} onChange={(e) => setFormData({...formData, female: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Total</label>
                  <div className="w-full h-11 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center text-algerian-green font-bold border border-zinc-200 dark:border-zinc-700">
                    {formData.male + formData.female}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Annuler</button>
            <button type="submit" className="flex-1 h-12 rounded-xl bg-algerian-green text-white text-sm font-bold shadow-lg shadow-algerian-green/20 hover:bg-algerian-green-dark transition-all">
              {editingItem ? "Enregistrer les modifications" : "Confirmer l'Ajout"}
            </button>
          </div>
        </form>
      </Modal>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "wilayas" && (
          <DataTable 
            title="Liste des Wilayas"
            columns={[
              { header: "N° Wilaya", accessor: "num_wilaya" },
              { header: "Nom Wilaya", accessor: "name", render: (val) => <span className="font-bold">{val}</span> },
              { header: "Sièges disponibles", accessor: "seats_count" },
              { header: "Communes", accessor: "communes" },
              { header: "Centres", accessor: "centers" },
            ]}
            data={wilayasData}
            onEdit={(row) => openModal("wilaya", row)}
            onDelete={(row) => handleDelete(row.id, "wilaya")}
          />
        )}

        {activeTab === "communes" && (
          <DataTable 
            title="Liste des Communes (Baladias)"
            columns={[
              { header: "N° Bladia", accessor: "num_bladia" },
              { header: "Nom Commune", accessor: "name", render: (val) => <span className="font-bold">{val}</span> },
              { header: "Wilaya", accessor: "wilaya" },
              { header: "Centres", accessor: "centers" },
              { header: "Bureaux", accessor: "desks" },
            ]}
            data={communesData}
            onEdit={(row) => openModal("commune", row)}
            onDelete={(row) => handleDelete(row.id, "commune")}
          />
        )}

        {activeTab === "centers" && (
          <DataTable 
            title="Centres de Vote"
            columns={[
              { header: "Nom du Centre", accessor: "name", render: (val) => <span className="font-bold">{val}</span> },
              { header: "Localisation", accessor: "location" },
              { header: "Hommes", accessor: "male" },
              { header: "Femmes", accessor: "female" },
              { header: "Total", accessor: "total", render: (val) => <span className="text-algerian-green font-bold">{val.toLocaleString()}</span> },
              { header: "Bureaux", accessor: "numbers_desks" },
            ]}
            data={centersData}
            onEdit={(row) => openModal("center", row)}
            onDelete={(row) => handleDelete(row.id, "center")}
          />
        )}

        {activeTab === "desks" && (
          <DataTable 
            title="Bureaux de Vote"
            columns={[
              { header: "N° Bureau", accessor: "num_desk", render: (val) => <span className="font-bold">{val}</span> },
              { header: "Centre Parent", accessor: "center" },
              { header: "Hommes", accessor: "male" },
              { header: "Femmes", accessor: "female" },
              { header: "Total Inscrits", accessor: "total", render: (val) => <span className="text-algerian-green font-bold">{val}</span> },
            ]}
            data={desksData}
            onEdit={(row) => openModal("desk", row)}
            onDelete={(row) => handleDelete(row.id, "desk")}
          />
        )}
      </motion.div>
    </div>
  );
}



