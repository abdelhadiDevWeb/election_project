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
  const wilayasQ = useQuery<IWilaya[]>("/wilayas");
  const communesQ = useQuery<ICommune[]>("/communes");
  const centersQ = useQuery<ICenter[]>("/centers");
  const desksQ = useQuery<IDesk[]>("/desks");
  const partiesQ = useQuery<IParty[]>("/parties");
  const candidatsQ = useQuery<ICandidat[]>("/candidats");
  const adminWilayaQ = useQuery<IAdminWilaya[]>("/admin-wilayas");
  const adminCommunQ = useQuery<IAdminCommun[]>("/admin-communs");
  const membersQ = useQuery<IMemberActif[]>("/members-actifs");
  const rolesQ = useQuery<IRoleElectionDay[]>("/roles-election-day");
  const resultsQ = useQuery<any[]>("/results/desk");

  const mutation = useMutation();

  // ── Transform data for UI compatibility ───────────────────────

  // Wilayas: map to UI format
  const wilayasData = React.useMemo(() => {
    if (!wilayasQ.data) return [];
    return (wilayasQ.data as IWilaya[]).map((w) => ({
      id: w.id || w._id,
      name: w.name_ar || w.name_fr,
      name_fr: w.name_fr,
      name_ar: w.name_ar,
      num_wilaya: String(w.wilaya_code).padStart(2, "0"),
      seats_count: w.seats_count || 0,
      communes: 0,
      centers: 0,
      desks: 0,
      _id: String(w.id || w._id || ""),
    }));
  }, [wilayasQ.data]);

  // Communes
  const communesData = React.useMemo(() => {
    if (!communesQ.data) return [];
    return (communesQ.data as ICommune[]).map((c) => ({
      id: c.id || c._id,
      name: c.name_ar || c.name_fr,
      name_fr: c.name_fr,
      name_ar: c.name_ar,
      num_bladia: String(c.commune_id).padStart(2, "0"),
      wilaya: typeof c.wilaya === "object" ? (c.wilaya as IWilaya).name_ar || (c.wilaya as IWilaya).name_fr : c.wilaya,
      wilaya_id: c.wilaya ? (typeof c.wilaya === "object" ? ((c.wilaya as any).id || (c.wilaya as any)._id) : String(c.wilaya)) : "",
      centers: 0,
      desks: 0,
      _id: String(c.id || c._id || ""),
    }));
  }, [communesQ.data]);

  // Centers
  const centersData = React.useMemo(() => {
    if (!centersQ.data) return [];
    return (centersQ.data as ICenter[]).map((c) => ({
      id: c.id || c._id,
      name: c.name,
      location: c.address || "",
      male: c.male_registered || 0,
      female: c.female_registered || 0,
      total: c.total_registered || 0,
      numbers_desks: c.numbers_desks || 0,
      _id: c._id || c.id,
    }));
  }, [centersQ.data]);

  // Desks
  const desksData = React.useMemo(() => {
    if (!desksQ.data) return [];
    return (desksQ.data as IDesk[]).map((d) => ({
      id: d.id || d._id,
      num_desk: String(d.desk_number).padStart(2, "0"),
      center: typeof d.center === "object" ? (d.center as ICenter).name : d.center,
      male: d.male_registered || 0,
      female: d.female_registered || 0,
      total: d.total_registered || 0,
      _id: d._id || d.id,
    }));
  }, [desksQ.data]);

  // Parties
  const partiesData = React.useMemo(() => {
    if (!partiesQ.data) return [];
    return (partiesQ.data as IParty[]).map((p) => ({
      id: p.id || p._id,
      name: p.name,
      short: p.acronym,
      leader: p.leader,
      wilaya_siege: p.wilaya_siege || "",
      founded: p.founded || "",
      _id: p._id || p.id,
    }));
  }, [partiesQ.data]);

  // Candidates
  const candidatesData = React.useMemo(() => {
    if (!candidatsQ.data) return [];
    return (candidatsQ.data as ICandidat[]).map((c) => ({
      id: c.id || c._id,
      full_name: c.full_name,
      nin: c.nin,
      phone: c.phone,
      birthday: c.date_of_birth,
      party: typeof c.party === "object" ? (c.party as IParty).acronym : c.party,
      party_id: typeof c.party === "object" ? (c.party as IParty)._id : c.party,
      wilaya: typeof c.wilaya === "object" ? ((c.wilaya as IWilaya).name_ar || (c.wilaya as IWilaya).name_fr) : c.wilaya,
      wilaya_id: typeof c.wilaya === "object" ? (c.wilaya as IWilaya)._id : c.wilaya,
      fav: c.is_favorite,
      result: c.result || 0,
      _id: c._id || c.id,
    }));
  }, [candidatsQ.data]);

  // Admins: merge admin_wilaya + admin_commun into flat list
  const adminsData = React.useMemo(() => {
    const wilayas = ((adminWilayaQ.data || []) as IAdminWilaya[]).map((a) => ({
      id: a.id || a._id,
      name: a.full_name,
      email: a.email,
      nin: a.nin,
      phone: a.phone,
      role: `Admin Wilaya`,
      wilaya: typeof a.wilaya === "object" ? ((a.wilaya as IWilaya).name_ar || (a.wilaya as IWilaya).name_fr) : a.wilaya,
      status: a.status === "active" ? "Actif" : "Inactif",
      _type: "admin_wilaya" as const,
      _id: a._id || a.id,
      wilaya_id: typeof a.wilaya === "object" ? (a.wilaya as any)._id : a.wilaya,
    }));
    const communs = ((adminCommunQ.data || []) as IAdminCommun[]).map((a) => ({
      id: a.id || a._id,
      name: a.full_name,
      email: a.email,
      nin: a.nin,
      phone: a.phone,
      role: `Admin Commun`,
      wilaya: typeof a.wilaya === "object" ? ((a.wilaya as IWilaya).name_ar || (a.wilaya as IWilaya).name_fr) : a.wilaya,
      status: a.status === "active" ? "Actif" : "Inactif",
      _type: "admin_commun" as const,
      _id: a._id || a.id,
      wilaya_id: typeof a.wilaya === "object" ? (a.wilaya as any)._id : a.wilaya,
      commune_id: typeof a.commune === "object" ? (a.commune as any)._id : a.commune,
    }));
    return [...wilayas, ...communs];
  }, [adminWilayaQ.data, adminCommunQ.data]);

  // Members
  const membersData = React.useMemo(() => {
    if (!membersQ.data) return [];
    return (membersQ.data as IMemberActif[]).map((m) => ({
      id: m.id || m._id,
      name: m.full_name,
      email: m.email,
      nin: m.nin,
      phone: m.phone,
      birthday: m.date_of_birth,
      party: typeof m.party === "object" ? (m.party as IParty).name : m.party,
      goal: m.goal || "",
      location: typeof m.wilaya === "object" ? ((m.wilaya as IWilaya).name_ar || (m.wilaya as IWilaya).name_fr) : m.wilaya,
      admin_commun: m.created_by || "N/A",
      status: "Permanent",
      _id: m._id || m.id,
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
