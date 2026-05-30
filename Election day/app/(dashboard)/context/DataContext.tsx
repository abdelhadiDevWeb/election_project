"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import type { IParty, IDesk, ICenter, IResultDesk } from "@/lib/types";

interface DataContextType {
  // Common
  parties: IParty[];
  loadingParties: boolean;
  
  // Observateur Bureau
  myDesk: any | null;
  loadingDesk: boolean;
  myResults: IResultDesk[];
  loadingResults: boolean;
  
  // Observateur Centre
  myCenter: ICenter | null;
  centerDesks: IDesk[];
  centerStats: {
    totalDesks: number;
    maleDesksCount: number;
    femaleDesksCount: number;
  } | null;
  loadingCenter: boolean;
  centerResults: any[];
  loadingCenterResults: boolean;

  // Actions
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [parties, setParties] = useState<IParty[]>([]);
  const [loadingParties, setLoadingParties] = useState(false);

  // Bureau state
  const [myDesk, setMyDesk] = useState<any | null>(null);
  const [loadingDesk, setLoadingDesk] = useState(false);
  const [myResults, setMyResults] = useState<IResultDesk[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Centre state
  const [myCenter, setMyCenter] = useState<ICenter | null>(null);
  const [centerDesks, setCenterDesks] = useState<IDesk[]>([]);
  const [centerStats, setCenterStats] = useState<any | null>(null);
  const [loadingCenter, setLoadingCenter] = useState(false);
  const [centerResults, setCenterResults] = useState<any[]>([]);
  const [loadingCenterResults, setLoadingCenterResults] = useState(false);

  const fetchPartiesAndCandidats = useCallback(async () => {
    if (!user) return;
    setLoadingParties(true);
    try {
      const res = await api.get<{ data: IParty[] }>("/observer/parties-candidats");
      if (res && res.data) {
        setParties(res.data);
      }
    } catch (err) {
      console.error("Error fetching parties and candidats:", err);
    } finally {
      setLoadingParties(false);
    }
  }, [user]);

  const fetchBureauData = useCallback(async () => {
    if (!user || user.election_role !== "observateur_bureau") return;
    setLoadingDesk(true);
    setLoadingResults(true);
    try {
      const [deskRes, resultsRes] = await Promise.all([
        api.get<{ data: any }>("/observer/my-desk"),
        api.get<{ data: IResultDesk[] }>("/observer/my-results")
      ]);
      if (deskRes && deskRes.data) setMyDesk(deskRes.data);
      if (resultsRes && resultsRes.data) setMyResults(resultsRes.data);
    } catch (err) {
      console.error("Error fetching bureau data:", err);
    } finally {
      setLoadingDesk(false);
      setLoadingResults(false);
    }
  }, [user]);

  const fetchCentreData = useCallback(async () => {
    if (!user || user.election_role !== "observateur_centre") return;
    setLoadingCenter(true);
    try {
      const centerRes = await api.get<{ data: { center: ICenter; desks: IDesk[]; stats: any } }>("/observer/my-center");
      if (centerRes && centerRes.data) {
        setMyCenter(centerRes.data.center);
        setCenterDesks(centerRes.data.desks);
        setCenterStats(centerRes.data.stats);
        
        // Fetch center aggregated results
        setLoadingCenterResults(true);
        const aggRes = await api.get<{ data: any[] }>(`/results/aggregate/center/${centerRes.data.center.id || centerRes.data.center._id}`);
        if (aggRes && aggRes.data) {
          setCenterResults(aggRes.data);
        }
        setLoadingCenterResults(false);
      }
    } catch (err) {
      console.error("Error fetching centre data:", err);
    } finally {
      setLoadingCenter(false);
      setLoadingCenterResults(false);
    }
  }, [user]);

  const refreshAll = useCallback(async () => {
    if (!user) return;
    await fetchPartiesAndCandidats();
    if (user.election_role === "observateur_bureau") {
      await fetchBureauData();
    } else if (user.election_role === "observateur_centre") {
      await fetchCentreData();
    }
  }, [user, fetchPartiesAndCandidats, fetchBureauData, fetchCentreData]);

  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      setParties([]);
      setMyDesk(null);
      setMyResults([]);
      setMyCenter(null);
      setCenterDesks([]);
      setCenterStats(null);
      setCenterResults([]);
    }
  }, [user, refreshAll]);

  return (
    <DataContext.Provider
      value={{
        parties,
        loadingParties,
        myDesk,
        loadingDesk,
        myResults,
        loadingResults,
        myCenter,
        centerDesks,
        centerStats,
        loadingCenter,
        centerResults,
        loadingCenterResults,
        refreshAll
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (ctx === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
