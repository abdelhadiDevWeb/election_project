/** Routes accessible to member_actif role */
export const MEMBER_ACTIF_PATHS = ["/", "/mes-citoyens", "/settings"] as const;

export function isMemberActifPath(pathname: string): boolean {
  return MEMBER_ACTIF_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
