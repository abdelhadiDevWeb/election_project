import type { AuthUser, AdminRole, UserRole } from "./types";

export const DASHBOARD_ADMIN_ROLES: AdminRole[] = ["super_admin", "admin_wilaya", "admin_commun"];

/** Roles allowed to open the dashboard after login */
export const DASHBOARD_ROLES: UserRole[] = [...DASHBOARD_ADMIN_ROLES, "member_actif"];

function refId(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "object" && value !== null && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}

export function normalizeAuthUser(raw: Record<string, unknown> | null | undefined): AuthUser | null {
  if (!raw) return null;
  const role = raw.role as AuthUser["role"];
  if (!role || !DASHBOARD_ROLES.includes(role)) return null;

  return {
    id: String(raw.id ?? raw._id),
    _id: String(raw._id ?? raw.id),
    full_name: String(raw.full_name ?? ""),
    email: String(raw.email ?? ""),
    phone: raw.phone ? String(raw.phone) : undefined,
    nin: raw.nin ? String(raw.nin) : undefined,
    role,
    wilaya_id: raw.wilaya_id ? String(raw.wilaya_id) : refId(raw.wilaya),
    commune_id: raw.commune_id ? String(raw.commune_id) : refId(raw.commune),
    party_id: raw.party_id ? String(raw.party_id) : refId(raw.party),
    status: raw.status ? String(raw.status) : undefined,
    date_of_birth: raw.date_of_birth ? String(raw.date_of_birth) : undefined,
    goal: raw.goal ? String(raw.goal) : undefined,
  };
}

export function isDashboardUser(user: AuthUser | null): boolean {
  return !!user && DASHBOARD_ROLES.includes(user.role);
}

/** @deprecated use isDashboardUser */
export function isDashboardAdmin(user: AuthUser | null): boolean {
  return isDashboardUser(user);
}
