"use client";

import { useState } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Edit2,
  Trash2,
  ArrowUpDown,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export default function DataTable({ columns, data, title, onEdit, onDelete }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = data.filter((row) => {
    const searchStr = searchTerm.toLowerCase();
    return columns.some(col => {
      const val = row[col.accessor];
      return val && val.toString().toLowerCase().includes(searchStr);
    }) || 
    Object.values(row).some(val => 
      (typeof val === 'string' || typeof val === 'number') && 
      val.toString().toLowerCase().includes(searchStr)
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {title && (
          <div>
            <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{title}</h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">Analyse et gestion des données opérationnelles</p>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-algerian-green transition-colors" />
            <input
              type="text"
              placeholder="Rechercher dans les registres..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 pl-11 pr-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-sm font-medium focus:ring-2 focus:ring-algerian-green/10 w-full md:w-72 transition-all shadow-sm"
            />
          </div>
          <button className="h-11 px-4 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all shadow-sm">
            <Filter size={16} className="text-zinc-400" />
            <span>Filtres</span>
          </button>
          <button className="h-11 w-11 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all shadow-sm" title="Exporter">
            <Download size={18} className="text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="relative glass rounded-[20px] overflow-hidden border border-zinc-200 dark:border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-[#09090b] border-b border-zinc-200 dark:border-white/5">
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      {col.header}
                      <ArrowUpDown size={12} className="opacity-30" />
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-right text-zinc-500 dark:text-zinc-400">Opérations</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, rowIndex) => (
                  <motion.tr 
                    key={row.id || rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                    className="table-row-hover hover:bg-algerian-green/[0.01] dark:hover:bg-white/[0.01] transition-all group"
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button 
                              onClick={() => onEdit(row)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-algerian-green hover:bg-algerian-green/10 transition-all"
                              title="Modifier"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {onDelete && (
                            <button 
                              onClick={() => onDelete(row)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-algerian-red hover:bg-algerian-red/10 transition-all"
                              title="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-zinc-400">
                        <Search size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Aucun résultat</p>
                        <p className="text-xs text-zinc-500">Essayez d'ajuster vos filtres de recherche.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        
      {/* Floating Pagination Footer */}
      <div className="px-8 py-4 glass dark:bg-[#000000] rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-white/5 shadow-xl pagination-footer">
        <div className="hidden sm:flex flex-col">
          <p className="text-[10px] uppercase tracking-widest font-black text-zinc-500">Registre Électoral</p>
          <p className="text-xs text-zinc-700 dark:text-zinc-400 font-bold">
            <span className="text-algerian-green dark:text-white">{Math.min(startIndex + 1, filteredData.length)}</span> - <span className="text-algerian-green dark:text-white">{Math.min(startIndex + rowsPerPage, filteredData.length)}</span> sur <span className="text-algerian-green dark:text-white">{filteredData.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-20 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-9 h-9 rounded-xl text-xs font-black transition-all shadow-sm",
                    currentPage === pageNum 
                      ? "bg-algerian-green text-white dark:bg-white dark:text-black glow-emerald scale-110" 
                      : "bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-20 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
