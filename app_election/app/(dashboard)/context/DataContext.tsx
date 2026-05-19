"use client";

import React, { createContext, useContext, useCallback, type ReactNode } from "react";
import { useQuery, useMutation } from "@/lib/hooks/useApi";
import { useAuth } from "@/app/context/AuthContext";
import type {
  IWilaya,
  ICommune,
  ICenter,
  IDesk,
  IParty,
  ICandidat,
  IAdmin,
  IMemberActif,
  IRoleElectionDay,
} from "@/lib/types";
import { communeWilayaId, normalizeEntityId, wilayaEntityId } from "@/lib/entity-id";

export type ElectionScope = "national" | "wilaya" | "commun";

interface DataContextType {
  wilayasData: any[];
  communesData: any[];
  centersData: any[];
  desksData: any[];
  partiesData: any[];
  candidatesData: any[];
  adminsData: any[];
  membersData: any[];
  observersData: any[];
  resultsData: any[];
  citizensData: any[];
  memberWilaya: IWilaya | null;
  memberCommune: ICommune | null;
  isLoading: boolean;
  error: string | null;
  setWilayasData: (data: any) => void;
  setCommunesData: (data: any) => void;
  setCentersData: (data: any) => void;
  setDesksData: (data: any) => void;
  setPartiesData: (data: any) => void;
  setCandidatesData: (data: any) => void;
  setAdminsData: (data: any) => void;
  setMembersData: (data: any) => void;
  setObserversData: (data: any) => void;
  setResultsData: (data: any) => void;
  setCitizensData: (data: any) => void;
  electionScope: ElectionScope;
  setElectionScope: (scope: ElectionScope) => void;
  mutation: ReturnType<typeof useMutation>;
  refetchAll: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const ROLE_LABELS: Record<string, string> = {
  chef_centre: "Chef de Centre",
  observateur_bureau: "Observateur Bureau",
  observateur_centre: "Observateur Centre",
  scrutateur: "Scrutateur",
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [electionScope, setElectionScope] = React.useState<ElectionScope>("national");
  const { user } = useAuth();
  const canFetchAdmins = user?.role === "super_admin" || user?.role === "admin_wilaya";

  const isMemberActif = user?.role === "member_actif";

  const geoQueryParams = React.useMemo(() => {
    if (user?.role === "admin_wilaya" && user.wilaya_id) return { wilaya: user.wilaya_id };
    if (user?.role === "admin_commun" && user.commune_id) return { commune: user.commune_id };
    return {};
  }, [user?.role, user?.wilaya_id, user?.commune_id]);

  const wilayaQueryParams = React.useMemo(() => {
    if (user?.role === "admin_wilaya" && user.wilaya_id) return { wilaya: user.wilaya_id };
    if (user?.role === "admin_commun" && user.wilaya_id) return { wilaya: user.wilaya_id };
    return {};
  }, [user?.role, user?.wilaya_id]);

  const wilayasQ = useQuery<IWilaya[]>(
    isMemberActif ? null : "/wilayas",
    { limit: 100, sortBy: "wilaya_code", sortOrder: "asc" }
  );
  const communesQ = useQuery<ICommune[]>(
    isMemberActif ? null : "/communes",
    { limit: 5000, ...geoQueryParams },
    [user?.role, user?.wilaya_id, user?.commune_id]
  );
  const centersQ = useQuery<ICenter[]>(
    isMemberActif ? null : "/centers",
    { limit: 5000, ...geoQueryParams },
    [user?.role, user?.wilaya_id, user?.commune_id]
  );
  const desksQ = useQuery<IDesk[]>(isMemberActif ? null : "/desks", { limit: 5000 }, [user?.role, user?.wilaya_id, user?.commune_id]);
  const partiesQ = useQuery<IParty[]>(
    isMemberActif ? null : "/parties",
    { limit: 500, ...wilayaQueryParams },
    [user?.role, user?.wilaya_id]
  );
  const candidatsQueryParams = React.useMemo(() => {
    const base: Record<string, unknown> = { limit: 500 };
    if (user?.role === "admin_wilaya" && user.wilaya_id) base.wilaya = user.wilaya_id;
    if (user?.role === "admin_commun" && user.commune_id) base.commune = user.commune_id;
    return base;
  }, [user?.role, user?.wilaya_id, user?.commune_id]);

  const candidatsQ = useQuery<ICandidat[]>(
    isMemberActif ? null : "/candidats",
    candidatsQueryParams,
    [user?.role, user?.id, user?.wilaya_id, user?.commune_id]
  );
  const membersQ = useQuery<IMemberActif[]>(isMemberActif ? null : "/members-actifs", { limit: 5000 });
  const citizensQ = useQuery<any[]>(
    user ? "/citizens" : null,
    { limit: 5000, sortBy: "createdAt", sortOrder: "desc" },
    [user?.id, user?.role]
  );
  const adminsQ = useQuery<IAdmin[]>(
    canFetchAdmins ? "/admins" : null,
    { limit: 500, ...(user?.role === "admin_wilaya" ? { role: "admin_commun" } : {}) },
    [user?.role, user?.wilaya_id]
  );
  const rolesQ = useQuery<IRoleElectionDay[]>(isMemberActif ? null : "/roles-election-day");
  const resultsQ = useQuery<any[]>(isMemberActif ? null : "/results/desk");
  const memberWilayaQ = useQuery<IWilaya>(
    isMemberActif && user?.wilaya_id ? `/wilayas/${user.wilaya_id}` : null,
    undefined,
    [user?.wilaya_id]
  );
  const memberCommuneQ = useQuery<ICommune>(
    isMemberActif && user?.commune_id ? `/communes/${user.commune_id}` : null,
    undefined,
    [user?.commune_id]
  );

  const mutation = useMutation();

  const wilayaLabelById = React.useMemo(() => {
    const map = new Map<string, string>();
    ((wilayasQ.data || []) as IWilaya[]).forEach((w) => {
      const wId = wilayaEntityId(w);
      if (wId) map.set(wId, w.name_ar || w.name_fr || "");
    });
    return map;
  }, [wilayasQ.data]);

  const communesData = React.useMemo(() => {
    if (!communesQ.data) return [];
    const list = Array.isArray(communesQ.data) ? communesQ.data : [];
    return (list as ICommune[]).map((c, idx) => {
      const wId = communeWilayaId(c);
      const wName =
        typeof c.wilaya === "object" && c.wilaya !== null
          ? (c.wilaya as IWilaya).name_ar || (c.wilaya as IWilaya).name_fr
          : wilayaLabelById.get(wId) || "";
      return {
        id: normalizeEntityId(c.id) || normalizeEntityId(c._id),
        _id: normalizeEntityId(c._id) || normalizeEntityId(c.id),
        name: c.name_ar || c.name_fr,
        name_fr: c.name_fr,
        name_ar: c.name_ar,
        num_bladia: String(c.commune_id ?? idx + 1).padStart(2, "0"),
        wilaya: wName,
        wilaya_id: wId,
        centers: 0,
        desks: 0,
      };
    });
  }, [communesQ.data, wilayaLabelById]);

  const communeCountByWilayaId = React.useMemo(() => {
    const map = new Map<string, number>();
    communesData.forEach((c) => {
      const wId = String(c.wilaya_id || "");
      if (!wId) return;
      map.set(wId, (map.get(wId) || 0) + 1);
    });
    return map;
  }, [communesData]);

  const centerCountByWilayaId = React.useMemo(() => {
    const map = new Map<string, number>();
    ((centersQ.data || []) as ICenter[]).forEach((c) => {
      const wId = communeWilayaId({ wilaya: c.wilaya });
      if (!wId) return;
      map.set(wId, (map.get(wId) || 0) + 1);
    });
    return map;
  }, [centersQ.data]);

  const wilayasData = React.useMemo(() => {
    if (!wilayasQ.data || user?.role === "admin_commun") return [];
    const items = (wilayasQ.data as IWilaya[]).map((w) => {
      const wId = wilayaEntityId(w);
      return {
        id: wId,
        _id: wId,
        name: w.name_ar || w.name_fr,
        name_fr: w.name_fr,
        name_ar: w.name_ar,
        num_wilaya: String(w.wilaya_code),
        wilaya_code: w.wilaya_code,
        seats_count: w.seats_count || 0,
        communes: communeCountByWilayaId.get(wId) ?? 0,
        centers: centerCountByWilayaId.get(wId) ?? 0,
        desks: 0,
      };
    });
    items.sort((a, b) => (a.wilaya_code ?? 0) - (b.wilaya_code ?? 0));
    if (user?.role === "admin_wilaya" && user.wilaya_id) {
      return items.filter((w) => String(w.id) === String(user.wilaya_id));
    }
    return items;
  }, [wilayasQ.data, communeCountByWilayaId, centerCountByWilayaId, user?.role, user?.wilaya_id]);

  const centersData = React.useMemo(() => {
    if (!centersQ.data) return [];
    return (centersQ.data as ICenter[]).map((c) => ({
      id: String(c.id || c._id),
      _id: String(c._id || c.id),
      name: c.name,
      location: c.address || c.location || "",
      male: c.male_count || 0,
      female: c.female_count || 0,
      total: c.total_voters ?? (c.male_count || 0) + (c.female_count || 0),
      numbers_desks: c.number_of_desks || 0,
      wilaya_id: c.wilaya
        ? String(typeof c.wilaya === "object" ? (c.wilaya as IWilaya)._id || (c.wilaya as IWilaya).id : c.wilaya)
        : "",
      commune_id: c.commune
        ? String(typeof c.commune === "object" ? (c.commune as ICommune)._id || (c.commune as ICommune).id : c.commune)
        : "",
    }));
  }, [centersQ.data]);

  const desksData = React.useMemo(() => {
    if (!desksQ.data) return [];
    const centerMeta = new Map<string, { wilaya_id: string; commune_id: string }>();
    ((centersQ.data || []) as ICenter[]).forEach((c) => {
      const id = String(c._id || c.id);
      centerMeta.set(id, {
        wilaya_id: c.wilaya
          ? String(typeof c.wilaya === "object" ? (c.wilaya as IWilaya)._id || (c.wilaya as IWilaya).id : c.wilaya)
          : "",
        commune_id: c.commune
          ? String(typeof c.commune === "object" ? (c.commune as ICommune)._id || (c.commune as ICommune).id : c.commune)
          : "",
      });
    });
    return (desksQ.data as IDesk[]).map((d) => {
      const centerId = d.center
        ? String(typeof d.center === "object" ? (d.center as ICenter)._id || (d.center as ICenter).id : d.center)
        : "";
      const meta = centerMeta.get(centerId);
      return {
        id: String(d.id || d._id),
        _id: String(d._id || d.id),
        num_desk: String(d.desk_number).padStart(2, "0"),
        center: typeof d.center === "object" ? (d.center as ICenter).name : String(d.center || ""),
        center_id: centerId,
        wilaya_id: meta?.wilaya_id || "",
        commune_id: meta?.commune_id || "",
        male: d.male_count || 0,
        female: d.female_count || 0,
        total: d.total_voters || 0,
      };
    });
  }, [desksQ.data, centersQ.data]);

  const partiesData = React.useMemo(() => {
    if (!partiesQ.data) return [];
    const list = Array.isArray(partiesQ.data) ? partiesQ.data : [];
    return (list as (IParty & { wilaya?: string | IWilaya })[]).map((p) => {
      const wId = communeWilayaId({ wilaya: p.wilaya });
      const wName =
        typeof p.wilaya === "object" && p.wilaya !== null
          ? (p.wilaya as IWilaya).name_ar || (p.wilaya as IWilaya).name_fr || ""
          : wilayaLabelById.get(wId) || "";
      return {
        id: String(p.id || p._id),
        _id: String(p._id || p.id),
        name: p.name,
        short: p.acronym,
        acronym: p.acronym,
        leader: p.leader,
        wilaya_siege: wName,
        wilaya_id: wId,
        wilaya: wName,
        founded: p.founded || "",
      };
    });
  }, [partiesQ.data, wilayaLabelById]);

  const communeLabelById = React.useMemo(() => {
    const map = new Map<string, string>();
    ((communesQ.data || []) as ICommune[]).forEach((c) => {
      map.set(String(c._id || c.id), c.name_ar || c.name_fr || "");
    });
    return map;
  }, [communesQ.data]);

  const memberCommuneByCreator = React.useMemo(() => {
    const map = new Map<string, string>();
    ((membersQ.data || []) as IMemberActif[]).forEach((m) => {
      const creatorId = String(m._id || m.id);
      const communeId = m.commune
        ? String(typeof m.commune === "object" ? (m.commune as ICommune)._id || (m.commune as ICommune).id : m.commune)
        : "";
      if (communeId) map.set(creatorId, communeId);
    });
    return map;
  }, [membersQ.data]);

  const candidatesData = React.useMemo(() => {
    if (!candidatsQ.data) return [];
    return (candidatsQ.data as ICandidat[]).map((c) => {
      const communeIdFromDoc = c.commune
        ? String(typeof c.commune === "object" ? (c.commune as ICommune)._id || (c.commune as ICommune).id : c.commune)
        : "";
      const createdBy = c.created_by ? String(c.created_by) : "";
      const commune_id = communeIdFromDoc || (createdBy ? memberCommuneByCreator.get(createdBy) || "" : "");
      const communeNameFromDoc =
        typeof c.commune === "object" && c.commune !== null
          ? (c.commune as ICommune).name_ar || (c.commune as ICommune).name_fr
          : "";
      const commune = communeNameFromDoc || (commune_id ? communeLabelById.get(commune_id) || "" : "");

      return {
        id: String(c.id || c._id),
        full_name: c.full_name,
        nin: c.nin,
        phone: c.phone,
        birthday: c.date_of_birth,
        party: typeof c.party === "object" ? (c.party as IParty).acronym : c.party,
        party_id: c.party
          ? String(typeof c.party === "object" ? (c.party as IParty)._id || (c.party as IParty).id : c.party)
          : "",
        wilaya:
          typeof c.wilaya === "object" ? (c.wilaya as IWilaya).name_ar || (c.wilaya as IWilaya).name_fr : c.wilaya,
        wilaya_id: c.wilaya
          ? String(typeof c.wilaya === "object" ? (c.wilaya as IWilaya)._id || (c.wilaya as IWilaya).id : c.wilaya)
          : "",
        commune,
        commune_id,
        created_by: createdBy,
        fav: c.is_favorite,
        result: c.result || 0,
        _id: String(c._id || c.id),
      };
    });
  }, [candidatsQ.data, memberCommuneByCreator, communeLabelById]);

  const wilayaNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    ((wilayasQ.data || []) as IWilaya[]).forEach((w) => {
      map.set(String(w._id || w.id), w.name_ar || w.name_fr || "");
    });
    return map;
  }, [wilayasQ.data]);

  const wilayaExportById = React.useMemo(() => {
    const map = new Map<string, string>();
    ((wilayasQ.data || []) as IWilaya[]).forEach((w) => {
      map.set(String(w._id || w.id), w.name_fr || w.name_ar || "");
    });
    return map;
  }, [wilayasQ.data]);

  const communeNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    ((communesQ.data || []) as ICommune[]).forEach((c) => {
      map.set(String(c._id || c.id), c.name_ar || c.name_fr || "");
    });
    return map;
  }, [communesQ.data]);

  const communeExportById = React.useMemo(() => {
    const map = new Map<string, string>();
    ((communesQ.data || []) as ICommune[]).forEach((c) => {
      map.set(String(c._id || c.id), c.name_fr || c.name_ar || "");
    });
    return map;
  }, [communesQ.data]);

  const resolveWilayaName = React.useCallback(
    (val: unknown) => {
      if (!val) return "";
      if (typeof val === "object") return (val as IWilaya).name_ar || (val as IWilaya).name_fr || "";
      return wilayaNameById.get(String(val)) || wilayaExportById.get(String(val)) || "";
    },
    [wilayaNameById, wilayaExportById]
  );

  const resolveWilayaExport = React.useCallback(
    (val: unknown) => {
      if (!val) return "";
      if (typeof val === "object") return (val as IWilaya).name_fr || (val as IWilaya).name_ar || "";
      return wilayaExportById.get(String(val)) || wilayaNameById.get(String(val)) || "";
    },
    [wilayaExportById, wilayaNameById]
  );

  const resolveCommuneName = React.useCallback(
    (val: unknown) => {
      if (!val) return "";
      if (typeof val === "object") return (val as ICommune).name_ar || (val as ICommune).name_fr || "";
      return communeNameById.get(String(val)) || communeExportById.get(String(val)) || "";
    },
    [communeNameById, communeExportById]
  );

  const resolveCommuneExport = React.useCallback(
    (val: unknown) => {
      if (!val) return "";
      if (typeof val === "object") return (val as ICommune).name_fr || (val as ICommune).name_ar || "";
      return communeExportById.get(String(val)) || communeNameById.get(String(val)) || "";
    },
    [communeExportById, communeNameById]
  );

  const adminsData = React.useMemo(() => {
    if (!adminsQ.data) return [];
    return (adminsQ.data as IAdmin[]).map((a) => ({
      id: String(a.id || a._id),
      name: a.full_name,
      email: a.email,
      nin: a.nin,
      phone: a.phone,
      role: a.role,
      wilaya: resolveWilayaName(a.wilaya),
      wilaya_export: resolveWilayaExport(a.wilaya),
      commune: resolveCommuneName(a.commune),
      commune_export: resolveCommuneExport(a.commune),
      status: a.status === "active" ? "Actif" : "Inactif",
      _id: String(a._id || a.id),
      wilaya_id: a.wilaya
        ? String(typeof a.wilaya === "object" ? (a.wilaya as IWilaya)._id || (a.wilaya as IWilaya).id : a.wilaya)
        : "",
      commune_id: a.commune
        ? String(typeof a.commune === "object" ? (a.commune as ICommune)._id || (a.commune as ICommune).id : a.commune)
        : "",
    }));
  }, [adminsQ.data, resolveWilayaName, resolveWilayaExport, resolveCommuneName, resolveCommuneExport]);

  const membersData = React.useMemo(() => {
    if (!membersQ.data) return [];
    return (membersQ.data as IMemberActif[]).map((m) => ({
      id: String(m.id || m._id),
      name: m.full_name,
      email: m.email,
      nin: m.nin,
      phone: m.phone,
      birthday: m.date_of_birth,
      party: typeof m.party === "object" ? (m.party as IParty).name : m.party,
      party_id: m.party
        ? String(typeof m.party === "object" ? (m.party as IParty)._id || (m.party as IParty).id : m.party)
        : "",
      goal: m.goal || "",
      location:
        typeof m.wilaya === "object" ? (m.wilaya as IWilaya).name_ar || (m.wilaya as IWilaya).name_fr : m.wilaya,
      wilaya_id: m.wilaya
        ? String(typeof m.wilaya === "object" ? (m.wilaya as IWilaya)._id || (m.wilaya as IWilaya).id : m.wilaya)
        : "",
      commune_id: m.commune
        ? String(typeof m.commune === "object" ? (m.commune as ICommune)._id || (m.commune as ICommune).id : m.commune)
        : "",
      admin_commun: m.created_by || "N/A",
      status: "Permanent",
      _id: String(m._id || m.id),
    }));
  }, [membersQ.data]);

  const citizensData = React.useMemo(() => {
    if (!citizensQ.data) return [];
    return (citizensQ.data as any[]).map((c) => {
      const member = c.member_actif as any;
      return {
        id: String(c.id || c._id),
        _id: String(c._id || c.id),
        full_name: c.full_name,
        nin: c.nin,
        phone: c.phone,
        email: c.email || "",
        wilaya_id: c.wilaya
          ? String(typeof c.wilaya === "object" ? c.wilaya._id || c.wilaya.id : c.wilaya)
          : (member?.wilaya ? String(typeof member.wilaya === "object" ? member.wilaya._id || member.wilaya.id : member.wilaya) : ""),
        commune_id: c.commune
          ? String(typeof c.commune === "object" ? c.commune._id || c.commune.id : c.commune)
          : (member?.commune ? String(typeof member.commune === "object" ? member.commune._id || member.commune.id : member.commune) : ""),
        added_by: member?.full_name || "",
        party: typeof c.party === "object" ? c.party?.acronym || c.party?.name : c.party,
        party_id: c.party ? String(typeof c.party === "object" ? c.party._id || c.party.id : c.party) : "",
        createdAt: c.createdAt,
      };
    });
  }, [citizensQ.data]);

  const observersData = React.useMemo(() => {
    if (!rolesQ.data) return [];
    return (rolesQ.data as IRoleElectionDay[]).map((r) => ({
      id: String(r.id || r._id),
      name: r.full_name,
      email: r.email,
      role: ROLE_LABELS[r.role] || r.role,
      center: typeof r.center === "object" ? (r.center as ICenter).name : String(r.center || ""),
      center_id: r.center
        ? String(typeof r.center === "object" ? (r.center as ICenter)._id || (r.center as ICenter).id : r.center)
        : "",
      desk: r.desk
        ? typeof r.desk === "object"
          ? String((r.desk as IDesk).desk_number)
          : String(r.desk)
        : "",
      location: r.location || resolveCommuneName(r.commune) || resolveWilayaName(r.wilaya),
      code: r.nin ? `TMP-${r.nin.slice(-4)}` : "—",
      status: "Actif",
      expires: r.assigned_time || "20:00",
      nin: r.nin,
      phone: r.phone,
      birthday: r.date_of_birth,
      _id: String(r._id || r.id),
    }));
  }, [rolesQ.data, resolveCommuneName, resolveWilayaName]);

  const resultsData = React.useMemo(() => {
    if (!resultsQ.data) return [];
    return (resultsQ.data as any[]).map((r) => ({
      id: String(r.id || r._id),
      status: r.status,
      image: r.image_url || `/api/results/desk/${r._id}/image`,
      desk: typeof r.desk === "object" ? r.desk.desk_number : r.desk,
      center: typeof r.center === "object" ? r.center.name : r.center,
      wilaya: r.wilaya || "Alger",
      _id: r._id || r.id,
    }));
  }, [resultsQ.data]);

  const isLoading =
    wilayasQ.isLoading ||
    communesQ.isLoading ||
    centersQ.isLoading ||
    desksQ.isLoading ||
    partiesQ.isLoading ||
    candidatsQ.isLoading ||
    adminsQ.isLoading ||
    membersQ.isLoading ||
    citizensQ.isLoading ||
    rolesQ.isLoading ||
    resultsQ.isLoading ||
    (isMemberActif && (memberWilayaQ.isLoading || memberCommuneQ.isLoading));

  const error =
    wilayasQ.error ||
    communesQ.error ||
    centersQ.error ||
    desksQ.error ||
    partiesQ.error ||
    candidatsQ.error ||
    adminsQ.error ||
    membersQ.error ||
    citizensQ.error ||
    rolesQ.error ||
    resultsQ.error ||
    memberWilayaQ.error ||
    memberCommuneQ.error;

  const refetchAll = useCallback(() => {
    void wilayasQ.refetch();
    void communesQ.refetch();
    void centersQ.refetch();
    void desksQ.refetch();
    void partiesQ.refetch();
    void candidatsQ.refetch();
    void adminsQ.refetch();
    void membersQ.refetch();
    void citizensQ.refetch();
    void rolesQ.refetch();
    void resultsQ.refetch();
  }, [wilayasQ, communesQ, centersQ, desksQ, partiesQ, candidatsQ, adminsQ, membersQ, citizensQ, rolesQ, resultsQ]);

  const refetchSetter = useCallback((refetchFn: () => Promise<void>) => () => void refetchFn(), []);

  return (
    <DataContext.Provider
      value={{
        wilayasData,
        communesData,
        centersData,
        desksData,
        partiesData,
        candidatesData,
        adminsData,
        membersData,
        observersData,
        resultsData,
        citizensData,
        memberWilaya: memberWilayaQ.data,
        memberCommune: memberCommuneQ.data,
        isLoading,
        error,
        setWilayasData: refetchSetter(wilayasQ.refetch),
        setCommunesData: refetchSetter(communesQ.refetch),
        setCentersData: refetchSetter(centersQ.refetch),
        setDesksData: refetchSetter(desksQ.refetch),
        setPartiesData: refetchSetter(partiesQ.refetch),
        setCandidatesData: refetchSetter(candidatsQ.refetch),
        setAdminsData: refetchSetter(adminsQ.refetch),
        setMembersData: refetchSetter(membersQ.refetch),
        setObserversData: refetchSetter(rolesQ.refetch),
        setResultsData: refetchSetter(resultsQ.refetch),
        setCitizensData: refetchSetter(citizensQ.refetch),
        electionScope,
        setElectionScope,
        mutation,
        refetchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
