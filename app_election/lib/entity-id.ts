/** Normalize MongoDB / API id fields to a comparable string. */
export function normalizeEntityId(val: unknown): string {
  if (val == null || val === "") return "";
  if (typeof val === "string") {
    const s = val.trim();
    return s === "[object Object]" ? "" : s;
  }
  if (typeof val === "number" && Number.isFinite(val)) return String(val);
  if (typeof val === "object") {
    const o = val as Record<string, unknown>;
    if (typeof o.$oid === "string") return o.$oid.trim();
    if (o._id != null) return normalizeEntityId(o._id);
    if (o.id != null) return normalizeEntityId(o.id);
  }
  return "";
}

export function wilayaEntityId(w: { _id?: unknown; id?: unknown }): string {
  return normalizeEntityId(w._id) || normalizeEntityId(w.id);
}

export function communeWilayaId(c: { wilaya?: unknown; wilaya_id?: unknown }): string {
  return normalizeEntityId(c.wilaya_id) || normalizeEntityId(c.wilaya);
}
