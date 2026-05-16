"use client";

// ────────────────────────────────────────────────────────────────
// DataContext — API-backed data provider for the ANIE dashboard.
// Replaces the previous 13,000-line hardcoded mock data context
// with live data from the backend API.
// ────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useCallback, type ReactNode } from "react";
import { useQuery, useMutation } from "@/lib/hooks/useApi";
import type {
  IWilaya,
  ICommune,
  ICenter,
  IDesk,
  IParty,
  ICandidat,
  IAdminWilaya,
  IAdminCommun,
  IMemberActif,
  IRoleElectionDay,
} from "@/lib/types";

export type ElectionScope = "national" | "wilaya" | "commun";

// Unified admin type for UI compatibility
export interface AdminRow {
  id: string;
  name: string;
  email: string;
  nin: string;
  phone: string;
  role: string;
  wilaya?: string;
  status: string;
  _type: "admin_wilaya" | "admin_commun";
  _id: string;
}

// Unified member type for UI compatibility
export interface MemberRow {
  id: string;
  name: string;
  email: string;
  nin: string;
  phone: string;
  birthday: string;
  party: string;
  goal: string;
  location: string;
  admin_commun: string;
  status: string;
  _id: string;
}

// Observer/election role row for UI compatibility
export interface ObserverRow {
  id: string;
  name: string;
  email: string;
  role: string;
  center: string;
  desk: string;
  location: string;
  code: string;
  status: string;
  expires: string;
  nin: string;
  phone: string;
  _id: string;
}

interface DataContextType {
  // Raw API data
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

  // Loading & error
  isLoading: boolean;
  error: string | null;

  // Setters (for UI compatibility — trigger refetch)
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

  // Scope
  electionScope: ElectionScope;
  setElectionScope: (scope: ElectionScope) => void;

  // Mutation helpers
  mutation: ReturnType<typeof useMutation>;

  // Refetch
  refetchAll: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [electionScope, setElectionScope] = React.useState<ElectionScope>("national");

  // ── API Queries ───────────────────────────────────────────────
  const wilayasQ = useQuery<IWilaya[]>("/wilayas", { limit: 100 });
  const communesQ = useQuery<ICommune[]>("/communes", { limit: 2000 });
  const centersQ = useQuery<ICenter[]>("/centers", { limit: 5000 });
  const desksQ = useQuery<IDesk[]>("/desks", { limit: 5000 });
  const partiesQ = useQuery<IParty[]>("/parties", { limit: 500 });
  const candidatsQ = useQuery<ICandidat[]>("/candidats", { limit: 1000 });
  const adminWilayaQ = useQuery<IAdminWilaya[]>("/admin-wilayas", { limit: 100 });
  const adminCommunQ = useQuery<IAdminCommun[]>("/admin-communs", { limit: 1000 });
  const membersQ = useQuery<IMemberActif[]>("/members-actifs", { limit: 5000 });
  const rolesQ = useQuery<IRoleElectionDay[]>("/roles-election-day");
  const resultsQ = useQuery<any[]>("/results/desk");

  const mutation = useMutation();

  // ── Transform data for UI compatibility ───────────────────────

  // Wilayas: map to UI format
  const wilayasData = React.useMemo(() => {
    if (!wilayasQ.data) return [];
    return (wilayasQ.data as IWilaya[]).map((w) => {
      const wId = String(w.id || w._id);
      return {
        id: wId,
        name: w.name_ar || w.name_fr,
        name_fr: w.name_fr,
        name_ar: w.name_ar,
        num_wilaya: String(w.wilaya_code).padStart(2, "0"),
        seats_count: w.seats_count || 0,
        communes: ((communesQ.data as any[]) || [])?.filter(c => String(c.wilaya?._id || c.wilaya?.id || c.wilaya) === wId).length || 0,
        centers: ((centersQ.data as any[]) || [])?.filter(c => String(c.wilaya?._id || c.wilaya?.id || c.wilaya) === wId).length || 0,
        desks: ((desksQ.data as any[]) || [])?.filter(d => {
          const center = d.center;
          if (typeof center === "object") {
            return String(center.wilaya?._id || center.wilaya?.id || center.wilaya) === wId;
          }
          return false; // Complex to filter desks by wilaya if not populated
        }).length || 0,
        _id: wId,
      };
    });
  }, [wilayasQ.data, communesQ.data, centersQ.data, desksQ.data]);

  // Communes
  const communesData = React.useMemo(() => {
    if (!communesQ.data) return [];
    return (communesQ.data as ICommune[]).map((c) => {
      const cId = String(c.id || c._id);
      return {
        id: cId,
        name: c.name_ar || c.name_fr,
        name_fr: c.name_fr,
        name_ar: c.name_ar,
        num_bladia: String(c.commune_id).padStart(2, "0"),
        wilaya: typeof c.wilaya === "object" ? (c.wilaya as IWilaya).name_ar || (c.wilaya as IWilaya).name_fr : c.wilaya,
        wilaya_id: c.wilaya ? String(typeof c.wilaya === "object" ? ((c.wilaya as any).id || (c.wilaya as any)._id) : c.wilaya) : "",
        centers: ((centersQ.data as any[]) || [])?.filter(ct => String(ct.commune?._id || ct.commune?.id || ct.commune) === cId).length || 0,
        desks: ((desksQ.data as any[]) || [])?.filter(d => {
          const center = d.center;
          if (typeof center === "object") {
            return String(center.commune?._id || center.commune?.id || center.commune) === cId;
          }
          return false;
        }).length || 0,
        _id: cId,
      };
    });
  }, [communesQ.data, centersQ.data, desksQ.data]);

  // Centers
  const centersData = React.useMemo(() => {
    if (!centersQ.data) return [];
    return (centersQ.data as ICenter[]).map((c) => {
      const cId = String(c.id || c._id);
      return {
        id: cId,
        name: c.name,
        location: c.location || c.address || "",
        male: c.male_count || 0,
        female: c.female_count || 0,
        total: c.total_voters || 0,
        numbers_desks: c.number_of_desks || 0,
        wilaya_id: c.wilaya ? String(typeof c.wilaya === "object" ? ((c.wilaya as any).id || (c.wilaya as any)._id) : c.wilaya) : "",
        commune_id: c.commune ? String(typeof c.commune === "object" ? ((c.commune as any).id || (c.commune as any)._id) : c.commune) : "",
        _id: cId,
      };
    });
  }, [centersQ.data]);

  // Desks
  const desksData = React.useMemo(() => {
    if (!desksQ.data) return [];
    return (desksQ.data as IDesk[]).map((d) => ({
      id: String(d.id || d._id),
      num_desk: String(d.desk_number).padStart(2, "0"),
      center: typeof d.center === "object" ? (d.center as ICenter).name : d.center,
      male: d.male_count || 0,
      female: d.female_count || 0,
      total: d.total_voters || 0,
      _id: String(d._id || d.id),
    }));
  }, [desksQ.data]);

  // Parties
  const partiesData = React.useMemo(() => {
    if (!partiesQ.data) return [];
    return (partiesQ.data as IParty[]).map((p) => ({
      id: String(p.id || p._id),
      name: p.name,
      short: p.acronym,
      leader: p.leader,
      wilaya_siege: typeof p.wilaya === "object" ? ((p.wilaya as any).name_ar || (p.wilaya as any).name_fr || (p.wilaya as any).name) : p.wilaya,
      founded: p.founded || "",
      _id: String(p._id || p.id),
    }));
  }, [partiesQ.data]);

  // Candidates
  const candidatesData = React.useMemo(() => {
    if (!candidatsQ.data) return [];
    return (candidatsQ.data as ICandidat[]).map((c) => ({
      id: String(c.id || c._id),
      full_name: c.full_name,
      nin: c.nin,
      phone: c.phone,
      birthday: c.date_of_birth,
      party: typeof c.party === "object" ? (c.party as IParty).acronym : c.party,
      party_id: c.party ? String(typeof c.party === "object" ? ((c.party as IParty)._id || (c.party as IParty).id) : c.party) : "",
      wilaya: typeof c.wilaya === "object" ? ((c.wilaya as IWilaya).name_ar || (c.wilaya as IWilaya).name_fr) : c.wilaya,
      wilaya_id: c.wilaya ? String(typeof c.wilaya === "object" ? (c.wilaya as IWilaya)._id : c.wilaya) : "",
      fav: c.is_favorite,
      result: c.result || 0,
      _id: String(c._id || c.id),
    }));
  }, [candidatsQ.data]);

  // Admins: merge admin_wilaya + admin_commun into flat list
  const adminsData = React.useMemo(() => {
    const wilayas = ((adminWilayaQ.data || []) as IAdminWilaya[]).map((a) => ({
      id: String(a.id || a._id),
      name: a.full_name,
      email: a.email,
      nin: a.nin,
      phone: a.phone,
      role: `Admin Wilaya`,
      wilaya: typeof a.wilaya === "object" ? ((a.wilaya as IWilaya).name_ar || (a.wilaya as IWilaya).name_fr) : a.wilaya,
      status: a.status === "active" ? "Actif" : "Inactif",
      _type: "admin_wilaya" as const,
      _id: String(a._id || a.id),
      wilaya_id: a.wilaya ? String(typeof a.wilaya === "object" ? (a.wilaya as any)._id : a.wilaya) : "",
    }));
    const communs = ((adminCommunQ.data || []) as IAdminCommun[]).map((a) => ({
      id: String(a.id || a._id),
      name: a.full_name,
      email: a.email,
      nin: a.nin,
      phone: a.phone,
      role: `Admin Commun`,
      wilaya: typeof a.wilaya === "object" ? ((a.wilaya as IWilaya).name_ar || (a.wilaya as IWilaya).name_fr) : a.wilaya,
      status: a.status === "active" ? "Actif" : "Inactif",
      _type: "admin_commun" as const,
      _id: String(a._id || a.id),
      wilaya_id: a.wilaya ? String(typeof a.wilaya === "object" ? (a.wilaya as any)._id : a.wilaya) : "",
      commune_id: a.commune ? String(typeof a.commune === "object" ? (a.commune as any)._id : a.commune) : "",
    }));
    return [...wilayas, ...communs];
  }, [adminWilayaQ.data, adminCommunQ.data]);

  // Members
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
      party_id: m.party ? String(typeof m.party === "object" ? ((m.party as any).id || (m.party as any)._id) : m.party) : "",
      goal: m.goal || "",
      location: typeof m.wilaya === "object" ? ((m.wilaya as IWilaya).name_ar || (m.wilaya as IWilaya).name_fr) : m.wilaya,
      wilaya_id: m.wilaya ? String(typeof m.wilaya === "object" ? ((m.wilaya as any).id || (m.wilaya as any)._id) : m.wilaya) : "",
      commune_id: m.commune ? String(typeof m.commune === "object" ? ((m.commune as any).id || (m.commune as any)._id) : m.commune) : "",
      admin_commun: m.created_by || "N/A",
      status: "Permanent",
      _id: String(m._id || m.id),
    }));
  }, [membersQ.data]);

  // Observers / election day roles
  const observersData = React.useMemo(() => {
    if (!rolesQ.data) return [];
    return (rolesQ.data as IRoleElectionDay[]).map((r) => ({
      id: r.id || r._id,
      name: r.full_name,
      email: r.email,
      role: r.role === "chef_centre" ? "Chef de Centre"
        : r.role === "observateur_bureau" ? "Observateur Bureau"
        : r.role === "observateur_centre" ? "Observateur Centre"
        : "Scrutateur",
      center: typeof r.center === "object" ? (r.center as ICenter).name : r.center,
      desk: typeof r.desk === "object" ? String((r.desk as IDesk).desk_number) : r.desk || "",
      location: r.location || "",
      code: `TMP-${String(r._id || r.id).slice(-3).toUpperCase()}`,
      status: "Actif",
      expires: r.assigned_time || "20:00",
      nin: r.nin,
      phone: r.phone,
      _id: r._id || r.id,
    }));
  }, [rolesQ.data]);

  // Results (PVs)
  const resultsData = React.useMemo(() => {
    if (!resultsQ.data) return [];
    return (resultsQ.data as any[]).map((r) => ({
      id: r._id || r.id,
      candidate: typeof r.candidate === "object" ? r.candidate.full_name : r.candidate,
      manual: r.manual_count || 0,
      ocr: r.ocr_count || 0,
      status: r.status || "pending",
      image: r.image_url || `/api/results/desk/${r._id}/image`,
      desk: typeof r.desk === "object" ? r.desk.desk_number : r.desk,
      center: typeof r.center === "object" ? r.center.name : r.center,
      wilaya: r.wilaya || "Alger",
      _id: r._id || r.id,
    }));
  }, [resultsQ.data]);

  // ── Loading & Error ───────────────────────────────────────────

  const isLoading =
    wilayasQ.isLoading ||
    communesQ.isLoading ||
    centersQ.isLoading ||
    desksQ.isLoading ||
    partiesQ.isLoading ||
    candidatsQ.isLoading ||
    adminWilayaQ.isLoading ||
    adminCommunQ.isLoading ||
    membersQ.isLoading ||
    rolesQ.isLoading ||
    resultsQ.isLoading;

  const error =
    wilayasQ.error ||
    communesQ.error ||
    centersQ.error ||
    desksQ.error ||
    partiesQ.error ||
    candidatsQ.error ||
    adminWilayaQ.error ||
    adminCommunQ.error ||
    membersQ.error ||
    rolesQ.error ||
    resultsQ.error;

  // ── Refetch all data ──────────────────────────────────────────

  const refetchAll = useCallback(() => {
    wilayasQ.refetch();
    communesQ.refetch();
    centersQ.refetch();
    desksQ.refetch();
    partiesQ.refetch();
    candidatsQ.refetch();
    adminWilayaQ.refetch();
    adminCommunQ.refetch();
    membersQ.refetch();
    rolesQ.refetch();
    resultsQ.refetch();
  }, [wilayasQ, communesQ, centersQ, desksQ, partiesQ, candidatsQ, adminWilayaQ, adminCommunQ, membersQ, rolesQ, resultsQ]);

  // ── Setters (trigger refetch instead of local state update) ───

  const refetchSetter = useCallback((refetchFn: () => Promise<void>) => {
    return (_data: any) => { refetchFn(); };
  }, []);

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
        isLoading,
        error,
        setWilayasData: refetchSetter(wilayasQ.refetch),
        setCommunesData: refetchSetter(communesQ.refetch),
        setCentersData: refetchSetter(centersQ.refetch),
        setDesksData: refetchSetter(desksQ.refetch),
        setPartiesData: refetchSetter(partiesQ.refetch),
        setCandidatesData: refetchSetter(candidatsQ.refetch),
        setAdminsData: () => { adminWilayaQ.refetch(); adminCommunQ.refetch(); },
        setMembersData: refetchSetter(membersQ.refetch),
        setObserversData: refetchSetter(rolesQ.refetch),
        setResultsData: refetchSetter(resultsQ.refetch),
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

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
