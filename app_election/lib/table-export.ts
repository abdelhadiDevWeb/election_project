"use client";

export type TableExportColumn = {
  header: string;
  getValue: (row: Record<string, unknown>) => string;
};

export type ExportScope = "filtered" | "page";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtmlTable(title: string, columns: TableExportColumn[], rows: Record<string, unknown>[]) {
  const head = columns.map((c) => `<th>${escapeHtml(c.header)}</th>`).join("");
  const body = rows
    .map((row) => {
      const cells = columns.map((c) => `<td>${escapeHtml(c.getValue(row))}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #111; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    p { font-size: 11px; color: #666; margin: 0 0 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
    th { background: #006233; color: #fff; font-weight: 700; font-size: 10px; }
    tr:nth-child(even) td { background: #f4faf6; }
    @media print { body { padding: 12px; } @page { margin: 12mm; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${rows.length} enregistrement(s) — ${new Date().toLocaleString()}</p>
  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table>
  <script>
    window.onload = function() {
      setTimeout(function() { window.focus(); window.print(); }, 150);
    };
  </script>
</body>
</html>`;
}

export function printTable(title: string, columns: TableExportColumn[], rows: Record<string, unknown>[]) {
  if (rows.length === 0) return false;
  const html = buildHtmlTable(title, columns, rows);

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(iframe);
  const win = iframe.contentWindow;
  const doc = win?.document;
  if (!doc) {
    iframe.remove();
    const popup = window.open("", "_blank");
    if (!popup) return false;
    popup.document.write(html);
    popup.document.close();
    setTimeout(() => { popup.focus(); popup.print(); }, 300);
    return true;
  }
  doc.open();
  doc.write(html);
  doc.close();
  setTimeout(() => {
    win?.focus();
    win?.print();
    setTimeout(() => iframe.remove(), 2000);
  }, 300);
  return true;
}

/** jsPDF Helvetica cannot render Arabic — drop non-Latin glyphs from PDF cells. */
function pdfSafeText(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^[\x20-\x7E\u00C0-\u024F\u1E00-\u1EFF'-]+$/.test(trimmed)) return trimmed;
  return "";
}

export async function downloadTablePdf(
  title: string,
  columns: TableExportColumn[],
  rows: Record<string, unknown>[],
  fileName: string
) {
  if (rows.length === 0) return false;
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const safeTitle = pdfSafeText(title) || "Export";
  doc.setFontSize(14);
  doc.text(safeTitle, 40, 36);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`${rows.length} enregistrement(s) — ${new Date().toLocaleString()}`, 40, 52);
  doc.setTextColor(0);
  autoTable(doc, {
    startY: 64,
    head: [columns.map((c) => pdfSafeText(c.header) || c.header)],
    body: rows.map((row) => columns.map((c) => pdfSafeText(c.getValue(row)))),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [0, 98, 51], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 40, right: 40 },
    tableWidth: pageWidth - 80,
  });
  doc.save(`${(fileName || "export").replace(/[^\w\-]+/g, "_")}.pdf`);
  return true;
}

export function defaultCellValue(row: Record<string, unknown>, accessor: string): string {
  const val = row[accessor];
  if (val == null) return "";
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return String(val);
  return "";
}
