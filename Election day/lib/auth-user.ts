import type { AuthUser, ElectionRole } from "./types";

const ALLOWED_ROLES: ElectionRole[] = ["observateur_bureau", "observateur_centre"];

function refId(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "object" && value !== null && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}

export function normalizeAuthUser(raw: Record<string, unknown> | null | undefined): AuthUser | null {
  if (!raw) return null;
  const role = raw.role as string;
  const electionRole = (raw.election_role || raw.electionRole) as string;

  // Only allow role_election_day with specific sub-roles
  if (role !== "role_election_day") return null;
  if (!electionRole || !ALLOWED_ROLES.includes(electionRole as ElectionRole)) return null;

  return {
    id: String(raw.id ?? raw._id),
    _id: String(raw._id ?? raw.id),
    full_name: String(raw.full_name ?? ""),
    email: String(raw.email ?? ""),
    phone: raw.phone ? String(raw.phone) : undefined,
    nin: raw.nin ? String(raw.nin) : undefined,
    role: "role_election_day",
    election_role: electionRole as ElectionRole,
    wilaya_id: raw.wilaya_id ? String(raw.wilaya_id) : refId(raw.wilaya),
    commune_id: raw.commune_id ? String(raw.commune_id) : refId(raw.commune),
    center_id: raw.center_id ? String(raw.center_id) : refId(raw.center),
    desk_id: raw.desk_id ? String(raw.desk_id) : refId(raw.desk),
    status: raw.status ? String(raw.status) : undefined,
  };
}

export function isObserver(user: AuthUser | null): boolean {
  return !!user && user.role === "role_election_day" && ALLOWED_ROLES.includes(user.election_role);
}

export function isBureau(user: AuthUser | null): boolean {
  return !!user && user.election_role === "observateur_bureau";
}

export function isCentre(user: AuthUser | null): boolean {
  return !!user && user.election_role === "observateur_centre";
}
