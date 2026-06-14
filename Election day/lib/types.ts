// ────────────────────────────────────────────────────────────────
// TypeScript interfaces for the Election Day observer frontend.
// ────────────────────────────────────────────────────────────────

export type ElectionRole = "observateur_bureau" | "observateur_centre";

export type UserRole = "role_election_day";

export interface AuthUser {
  id: string;
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  nin?: string;
  role: UserRole;
  election_role: ElectionRole;
  wilaya_id?: string;
  commune_id?: string;
  center_id?: string;
  desk_id?: string;
  status?: string;
}

export interface LoginResponse {
  ok: boolean;
  accessToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  ok: boolean;
  accessToken: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  message?: string;
}

// ── Electoral Infrastructure ────────────────────────────────────
export interface IWilaya {
  id: string;
  _id: string;
  name_fr: string;
  name_ar: string;
  wilaya_code: number;
}

export interface ICommune {
  id: string;
  _id: string;
  name_fr: string;
  name_ar: string;
  commune_id: number;
  wilaya: string | IWilaya;
}

export interface ICenter {
  id: string;
  _id: string;
  name: string;
  address?: string;
  wilaya: string | IWilaya;
  commune: string | ICommune;
  number_of_desks: number;
  male_count: number;
  female_count: number;
  total_voters: number;
}

export interface IDesk {
  id: string;
  _id: string;
  desk_number: number;
  center: string | ICenter;
  type?: "male" | "female";
  male_count: number;
  female_count: number;
  total_voters: number;
}

// ── Political Entities ──────────────────────────────────────────
export interface IParty {
  id: string;
  _id: string;
  name: string;
  acronym: string;
  leader: string;
  logo?: string;
}

export interface ICandidat {
  id: string;
  _id: string;
  full_name: string;
  party: string | IParty;
  wilaya: string | IWilaya;
  result: number;
}

// ── Results ─────────────────────────────────────────────────────
export interface IResultDesk {
  id: string;
  _id: string;
  desk: string | IDesk;
  party: string | IParty;
  candidat: string | ICandidat;
  total: number;
  status: "pending" | "ocr_done" | "ocr_human_done" | "rejected";
  owner: string;
}

export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
