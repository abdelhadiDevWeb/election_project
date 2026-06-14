// ────────────────────────────────────────────────────────────────
// TypeScript interfaces matching all backend Mongoose models.
// Used across API hooks and page components.
// ────────────────────────────────────────────────────────────────

// ── Pagination ──────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  [key: string]: unknown;
}

// ── Auth ────────────────────────────────────────────────────────
export type AdminRole = "super_admin" | "admin_wilaya" | "admin_commun";

export type UserRole =
  | AdminRole
  | "member_actif"
  | "role_election_day"
  | "citizen";

export interface AuthUser {
  id: string;
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  nin?: string;
  role: UserRole;
  wilaya_id?: string;
  commune_id?: string;
  party_id?: string;
  status?: string;
  date_of_birth?: string;
  goal?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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

export interface MeResponse {
  ok: boolean;
  user: AuthUser;
}

// ── Electoral Infrastructure ────────────────────────────────────
export interface IWilaya {
  id: string;
  _id: string;
  name_fr: string;
  name_ar: string;
  wilaya_code: number;
  seats_count: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICommune {
  id: string;
  _id: string;
  name_fr: string;
  name_ar: string;
  commune_id: number;
  wilaya: string | IWilaya;
  createdAt?: string;
  updatedAt?: string;
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
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDesk {
  id: string;
  _id: string;
  desk_number: number;
  center: string | ICenter;
  wilaya?: string | IWilaya;
  commune?: string | ICommune;
  type?: "male" | "female";
  male_count: number;
  female_count: number;
  total_voters: number;
  createdAt?: string;
  updatedAt?: string;
}

// ── Political Entities ──────────────────────────────────────────
export interface IParty {
  id: string;
  _id: string;
  name: string;
  acronym: string;
  leader: string;
  wilaya_siege?: string;
  founded?: string;
  logo?: string;
  logo_mimetype?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICandidat {
  id: string;
  _id: string;
  full_name: string;
  nin: string;
  phone: string;
  date_of_birth: string;
  party: string | IParty;
  wilaya: string | IWilaya;
  commune?: string | ICommune;
  created_by?: string;
  is_favorite: boolean;
  result: number;
  createdAt?: string;
  updatedAt?: string;
}

// ── User Administration ─────────────────────────────────────────
export interface IAdmin {
  id: string;
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  nin: string;
  role: AdminRole;
  wilaya?: string | IWilaya;
  commune?: string | ICommune;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMemberActif {
  id: string;
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nin: string;
  goal?: string;
  wilaya: string | IWilaya;
  commune: string | ICommune;
  party: string | IParty;
  created_by?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ── Election Day Roles ──────────────────────────────────────────
export type ElectionRole =
  | "chef_centre"
  | "observateur_bureau"
  | "observateur_centre"
  | "scrutateur";

export interface IRoleElectionDay {
  id: string;
  _id: string;
  full_name: string;
  email: string;
  password_plain?: string;
  phone: string;
  nin: string;
  date_of_birth: string;
  role: ElectionRole;
  wilaya: string | IWilaya;
  commune: string | ICommune;
  center: string | ICenter;
  desk?: string | IDesk;
  location?: string;
  assigned_time?: string;
  assigned_date?: string;
  created_by?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ── Results ─────────────────────────────────────────────────────
export interface IResultDesk {
  id: string;
  _id: string;
  desk: string | IDesk;
  submitted_by: string;
  status: "pending" | "approved" | "rejected" | "human_review";
  ocr_done: boolean;
  image?: string;
  image_mimetype?: string;
  votes: { candidat: string; count: number }[];
  white_votes: number;
  null_votes: number;
  total_voters: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResultCenter {
  id: string;
  _id: string;
  center: string | ICenter;
  submitted_by: string;
  image?: string;
  image_mimetype?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AggregateResult {
  candidat: string;
  candidat_name?: string;
  total_votes: number;
  percentage: number;
}

export interface AggregateResponse {
  ok: boolean;
  total_voters: number;
  total_white: number;
  total_null: number;
  results: AggregateResult[];
}

// ── Messaging & Notifications ───────────────────────────────────
export interface IMessage {
  id: string;
  _id: string;
  sender: string;
  receiver: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt?: string;
}

export interface INotification {
  id: string;
  _id: string;
  user: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  createdAt?: string;
}

// ── Generic API response ────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  message?: string;
}
