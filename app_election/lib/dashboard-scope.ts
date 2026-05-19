export type ChartDatum = { label: string; value: number; color?: string };

export function matchWilaya(itemWilayaId: unknown, wilayaId: string): boolean {
  if (!wilayaId) return true;
  return String(itemWilayaId || "") === String(wilayaId);
}

export function matchCommune(itemCommuneId: unknown, communeId: string): boolean {
  if (!communeId) return true;
  return String(itemCommuneId || "") === String(communeId);
}

export function topChartSeries(
  data: ChartDatum[],
  maxItems = 8
): ChartDatum[] {
  return [...data]
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems);
}

export function countByCommune(
  communes: { id?: string; _id?: string; name?: string; name_fr?: string }[],
  items: { commune_id?: string }[],
  countKey: "candidates" | "members" | "desks"
): ChartDatum[] {
  const counts = new Map<string, number>();
  communes.forEach((c) => {
    const id = String(c._id || c.id);
    counts.set(id, 0);
  });
  items.forEach((item) => {
    const cid = String(item.commune_id || "");
    if (!cid) return;
    counts.set(cid, (counts.get(cid) || 0) + 1);
  });
  return communes.map((c) => {
    const id = String(c._id || c.id);
    return {
      label: c.name || c.name_fr || id.slice(-4),
      value: counts.get(id) || 0,
    };
  });
}

export function wilayaCommuneSeries(
  wilayas: { name?: string; name_fr?: string; communes?: number }[]
): ChartDatum[] {
  return wilayas.map((w) => ({
    label: w.name_fr || w.name || "—",
    value: Number(w.communes) || 0,
  }));
}

export function countByWilaya(
  wilayas: { id?: string; _id?: string; name?: string; name_fr?: string; name_ar?: string }[],
  items: { wilaya_id?: string }[]
): ChartDatum[] {
  const counts = new Map<string, number>();
  wilayas.forEach((w) => counts.set(String(w._id || w.id), 0));
  items.forEach((item) => {
    const wid = String(item.wilaya_id || "");
    if (!wid) return;
    counts.set(wid, (counts.get(wid) || 0) + 1);
  });
  return wilayas.map((w) => {
    const id = String(w._id || w.id);
    return {
      label: w.name_fr || w.name || w.name_ar || "—",
      value: counts.get(id) || 0,
    };
  });
}
