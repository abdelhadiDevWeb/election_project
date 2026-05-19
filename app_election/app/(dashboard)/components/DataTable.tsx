"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Edit2,
  Trash2,
  ArrowUpDown,
  Download,
  Printer,
  FileText,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  defaultCellValue,
  downloadTablePdf,
  printTable,
  type ExportScope,
  type TableExportColumn,
} from "@/lib/table-export";

export interface DataTableColumn {
  header: string;
  accessor: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  /** Plain text for PDF / print (required when `render` is custom UI) */
  exportValue?: (row: Record<string, unknown>) => string;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, unknown>[];
  title?: string;
  exportFileName?: string;
  onEdit?: (row: Record<string, unknown>) => void;
  onDelete?: (row: Record<string, unknown>) => void;
}

export default function DataTable({
  columns,
  data,
  title,
  exportFileName,
  onEdit,
  onDelete,
}: DataTableProps) {
  const { language, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportScope, setExportScope] = useState<ExportScope>("filtered");
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    const searchStr = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.accessor];
        return val != null && String(val).toLowerCase().includes(searchStr);
      }) ||
      Object.values(row).some(
        (val) =>
          (typeof val === "string" || typeof val === "number") &&
          String(val).toLowerCase().includes(searchStr)
      )
    );
  }, [data, searchTerm, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const exportColumns: TableExportColumn[] = useMemo(
    () =>
      columns.map((col) => ({
        header: col.header,
        getValue: (row) =>
          col.exportValue ? col.exportValue(row) : defaultCellValue(row, col.accessor),
      })),
    [columns]
  );

  const rowsForExport = exportScope === "page" ? paginatedData : filteredData;
  const exportTitle = title || (language === "ar" ? "تصدير البيانات" : "Export des données");
  const fileBase = exportFileName || exportTitle;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const runExport = async (mode: "print" | "pdf") => {
    if (rowsForExport.length === 0) {
      alert(language === "ar" ? "لا توجد بيانات للتصدير" : "Aucune donnée à exporter");
      return;
    }
    setExporting(true);
    try {
      const ok =
        mode === "print"
          ? printTable(exportTitle, exportColumns, rowsForExport)
          : await downloadTablePdf(exportTitle, exportColumns, rowsForExport, fileBase);
      if (!ok) {
        alert(language === "ar" ? "فشل التصدير" : "Échec de l'export");
      } else {
        setExportOpen(false);
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {title && (
          <div>
            <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{title}</h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              {language === "ar" ? "تحليل وإدارة البيانات العملياتية" : "Analyse et gestion des données opérationnelles"}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-algerian-green transition-colors" />
            <input
              type="text"
              placeholder={language === "ar" ? "البحث في السجلات..." : "Rechercher dans les registres..."}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 ps-11 pe-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-sm font-medium focus:ring-2 focus:ring-algerian-green/10 w-full md:w-72 transition-all text-start"
            />
          </div>
          <button
            type="button"
            className="h-11 px-4 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
          >
            <Filter size={16} className="text-zinc-400" />
            <span>{language === "ar" ? "تصفية" : "Filtres"}</span>
          </button>

          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen((o) => !o)}
              disabled={exporting}
              className="h-11 px-3 rounded-xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
              title={language === "ar" ? "تصدير / طباعة" : "Exporter / Imprimer"}
            >
              <Download size={18} className="text-zinc-400" />
              <ChevronDown size={14} className={cn("text-zinc-400 transition-transform", exportOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {exportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute end-0 top-full mt-2 z-50 w-72 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl p-3 space-y-3"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">
                    {language === "ar" ? "نطاق التصدير" : "Périmètre d'export"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setExportScope("filtered")}
                      className={cn(
                        "h-9 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all",
                        exportScope === "filtered"
                          ? "bg-algerian-green text-white border-algerian-green"
                          : "border-zinc-200 dark:border-white/10 text-zinc-500"
                      )}
                    >
                      {language === "ar" ? `الكل (${filteredData.length})` : `Tout (${filteredData.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportScope("page")}
                      className={cn(
                        "h-9 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-all",
                        exportScope === "page"
                          ? "bg-algerian-green text-white border-algerian-green"
                          : "border-zinc-200 dark:border-white/10 text-zinc-500"
                      )}
                    >
                      {language === "ar" ? `الصفحة (${paginatedData.length})` : `Page (${paginatedData.length})`}
                    </button>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-white/5 pt-2 space-y-1">
                    <button
                      type="button"
                      disabled={exporting}
                      onClick={() => runExport("pdf")}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/5 disabled:opacity-50"
                    >
                      <FileText size={16} className="text-emerald-600" />
                      {language === "ar" ? "تحميل PDF" : "Télécharger PDF"}
                    </button>
                    <button
                      type="button"
                      disabled={exporting}
                      onClick={() => runExport("print")}
                      className="w-full h-10 px-3 rounded-xl flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/5 disabled:opacity-50"
                    >
                      <Printer size={16} className="text-zinc-500" />
                      {language === "ar" ? "طباعة / حفظ PDF" : "Imprimer / Enregistrer PDF"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative glass rounded-[20px] overflow-hidden border border-zinc-200 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse" dir={dir}>
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-[#09090b] border-b border-zinc-200 dark:border-white/5 text-start">
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 text-start">
                    <div className="flex items-center gap-2">
                      {col.header}
                      <ArrowUpDown size={12} className="opacity-30" />
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-end text-zinc-500 dark:text-zinc-400">
                    {language === "ar" ? "العمليات" : "Opérations"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={String(row.id ?? row._id ?? rowIndex)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                    className="table-row-hover hover:bg-algerian-green/[0.01] dark:hover:bg-white/[0.01] transition-all group"
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 text-start">
                        {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor] ?? "")}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4.5 text-end">
                        <div className="flex items-center justify-end gap-3 transition-opacity">
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(row)}
                              className="p-1 text-algerian-green hover:text-emerald-600 transition-colors"
                              title={language === "ar" ? "تعديل" : "Modifier"}
                            >
                              <Edit2 size={16} strokeWidth={2.5} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(row)}
                              className="p-1 text-algerian-red hover:text-red-700 transition-colors"
                              title={language === "ar" ? "حذف" : "Supprimer"}
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
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
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-zinc-400">
                        <Search size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">
                          {language === "ar" ? "لا توجد نتائج" : "Aucun résultat"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {language === "ar" ? "حاول تعديل فلاتر البحث الخاصة بك." : "Essayez d'ajuster vos filtres de recherche."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="px-8 py-4 glass dark:bg-[#000000] rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-white/5 pagination-footer"
        dir={dir}
      >
        <div className="hidden sm:flex flex-col text-start">
          <p className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            {language === "ar" ? "السجل الانتخابي" : "Registre Électoral"}
          </p>
          <p className="text-xs text-zinc-700 dark:text-zinc-400 font-bold">
            <span className="text-algerian-green dark:text-white">{filteredData.length === 0 ? 0 : startIndex + 1}</span> -{" "}
            <span className="text-algerian-green dark:text-white">{Math.min(startIndex + rowsPerPage, filteredData.length)}</span>{" "}
            {language === "ar" ? "من" : "sur"}{" "}
            <span className="text-algerian-green dark:text-white">{filteredData.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-20 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all rtl:rotate-180"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-9 h-9 rounded-xl text-xs font-black transition-all",
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
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-20 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all rtl:rotate-180"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
