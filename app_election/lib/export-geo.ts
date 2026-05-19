/** Latin-friendly label for jsPDF / print (Helvetica cannot render Arabic). */

export type GeoListItem = {
  id?: string;
  _id?: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
};

const LATIN_PRINTABLE = /^[\x20-\x7E\u00C0-\u024F\u1E00-\u1EFF'-]+$/;

export function geoLabelLatin(item?: GeoListItem | null): string {
  if (!item) return "";
  if (item.name_fr) return item.name_fr;
  if (item.name && LATIN_PRINTABLE.test(item.name)) return item.name;
  if (item.name_ar && LATIN_PRINTABLE.test(item.name_ar)) return item.name_ar;
  return item.name_fr || item.name || item.name_ar || "";
}

export function resolveGeoLabelForExport(
  geoId: string | undefined,
  catalog: GeoListItem[],
  displayFallback?: string
): string {
  if (geoId) {
    const found = catalog.find((x) => String(x.id ?? x._id) === String(geoId));
    const label = geoLabelLatin(found);
    if (label) return label;
  }
  if (displayFallback) {
    const byName = catalog.find(
      (x) =>
        x.name === displayFallback ||
        x.name_fr === displayFallback ||
        x.name_ar === displayFallback
    );
    const label = geoLabelLatin(byName);
    if (label) return label;
    if (/^[\x20-\x7E\u00C0-\u024F\u1E00-\u1EFF'-]+$/.test(displayFallback)) {
      return displayFallback;
    }
  }
  return "";
}
