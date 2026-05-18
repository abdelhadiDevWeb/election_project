import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { SuperAdmin } from "../super-admin/super-admin.model";
import { AdminWilaya } from "../admin-wilaya/admin-wilaya.model";
import { AdminCommun } from "../admin-commun/admin-commun.model";
import { MemberActif } from "../member-actif/member-actif.model";
import { RoleElectionDay } from "../role-election-day/role-election-day.model";
import { getRedis } from "../../db/redis";
import type { UserRole, JwtUser } from "../../middleware/auth";
import crypto from "node:crypto";

const BCRYPT_ROUNDS = 12;
const ACCESS_EXPIRES = "7d";
const REFRESH_EXPIRES_SEC = 7 * 24 * 60 * 60; // 7 days
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SEC = 15 * 60; // 15 min

// Collections to search during login, in priority order
const USER_COLLECTIONS = [
  { model: SuperAdmin, role: "super_admin" as UserRole },
  { model: AdminWilaya, role: "admin_wilaya" as UserRole },
  { model: AdminCommun, role: "admin_commun" as UserRole },
  { model: MemberActif, role: "member_actif" as UserRole },
  { model: RoleElectionDay, role: "role_election_day" as UserRole },
] as const;

function signAccessToken(user: JwtUser): string {
  return jwt.sign(
    { role: user.role, wilaya_id: user.wilaya_id, commune_id: user.commune_id },
    env.jwt.accessSecret,
    { subject: user.sub, issuer: env.jwt.issuer, audience: env.jwt.audience, expiresIn: ACCESS_EXPIRES }
  );
}

function signRefreshToken(sub: string, familyId: string): { token: string; jti: string } {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { familyId },
    env.jwt.accessSecret,
    { subject: sub, jwtid: jti, issuer: env.jwt.issuer, audience: env.jwt.audience, expiresIn: `${REFRESH_EXPIRES_SEC}s` }
  );
  return { token, jti };
}

// ── Brute-force helpers ──────────────────────────────────────

async function checkLockout(key: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const attempts = await redis.get(`lockout:${key}`);
  return attempts !== null && parseInt(attempts, 10) >= MAX_LOGIN_ATTEMPTS;
}

async function recordFailedAttempt(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const k = `lockout:${key}`;
  await redis.incr(k);
  await redis.expire(k, LOCKOUT_SEC);
}

async function clearAttempts(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.del(`lockout:${key}`);
}

// ── Public API ───────────────────────────────────────────────

export async function login(emailInput: string, passwordInput: string, ip: string) {
  // Check IP lockout
  if (await checkLockout(`ip:${ip}`)) {
    throw Object.assign(new Error("Too many login attempts. Try again later."), { status: 429 });
  }

  for (const { model, role } of USER_COLLECTIONS) {
    const user = await (model as any).findOne({ email: emailInput, status: "active" }).select("+password").lean();
    if (!user) continue;

    // Check account lockout
    if (await checkLockout(`acct:${user._id}`)) {
      throw Object.assign(new Error("Account locked. Try again later."), { status: 429 });
    }

    const match = await bcrypt.compare(passwordInput, user.password);
    if (!match) {
      await recordFailedAttempt(`ip:${ip}`);
      await recordFailedAttempt(`acct:${user._id}`);
      continue;
    }

    // Successful login — clear lockout counters
    await clearAttempts(`ip:${ip}`);
    await clearAttempts(`acct:${user._id}`);

    const jwtUser: JwtUser = {
      sub: String(user._id),
      role,
      wilaya_id: (user as any).wilaya ? String((user as any).wilaya) : undefined,
      commune_id: (user as any).commune ? String((user as any).commune) : undefined,
    };

    const accessToken = signAccessToken(jwtUser);
    const familyId = crypto.randomUUID();
    const { token: refreshToken, jti } = signRefreshToken(jwtUser.sub, familyId);

    // Store refresh token family in Redis
    const redis = getRedis();
    if (redis) {
      await redis.set(`rt:${jti}`, JSON.stringify({ familyId, sub: jwtUser.sub, used: false }), "EX", REFRESH_EXPIRES_SEC);
    }

    // Strip password from returned user
    const { password: _pw, ...safeUser } = user;

    return { accessToken, refreshToken, user: { ...safeUser, id: safeUser._id, role } };
  }

  // No match found — record failed attempt
  await recordFailedAttempt(`ip:${ip}`);
  throw Object.assign(new Error("Invalid email or password"), { status: 401 });
}

export async function refreshTokens(oldRefreshToken: string) {
  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(oldRefreshToken, env.jwt.accessSecret, {
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
    }) as jwt.JwtPayload;
  } catch {
    throw Object.assign(new Error("Invalid refresh token"), { status: 401 });
  }

  const jti = decoded.jti;
  const sub = decoded.sub;
  const familyId = decoded.familyId as string;
  if (!jti || !sub || !familyId) {
    throw Object.assign(new Error("Invalid refresh token"), { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    throw Object.assign(new Error("Refresh tokens require Redis"), { status: 500 });
  }

  const stored = await redis.get(`rt:${jti}`);
  if (!stored) {
    throw Object.assign(new Error("Refresh token expired or revoked"), { status: 401 });
  }

  const meta = JSON.parse(stored) as { familyId: string; sub: string; used: boolean };

  // REUSE DETECTION — if already used, revoke entire family
  if (meta.used) {
    // Scan and delete all tokens in this family
    const keys = await redis.keys(`rt:*`);
    for (const key of keys) {
      const val = await redis.get(key);
      if (val) {
        try {
          const parsed = JSON.parse(val);
          if (parsed.familyId === familyId) await redis.del(key);
        } catch { /* skip */ }
      }
    }
    throw Object.assign(new Error("Refresh token reuse detected — session revoked"), { status: 401 });
  }

  // Mark old token as used
  await redis.set(`rt:${jti}`, JSON.stringify({ ...meta, used: true }), "EX", 60);

  // Find user to rebuild access token
  let role: UserRole = "citizen";
  let userDoc: any = null;
  for (const { model, role: r } of USER_COLLECTIONS) {
    userDoc = await (model as any).findById(sub).lean();
    if (userDoc) { role = r; break; }
  }
  if (!userDoc) throw Object.assign(new Error("User not found"), { status: 401 });

  const jwtUser: JwtUser = {
    sub,
    role,
    wilaya_id: userDoc.wilaya ? String(userDoc.wilaya) : undefined,
    commune_id: userDoc.commune ? String(userDoc.commune) : undefined,
  };

  const accessToken = signAccessToken(jwtUser);
  const { token: newRefreshToken, jti: newJti } = signRefreshToken(sub, familyId);
  await redis.set(`rt:${newJti}`, JSON.stringify({ familyId, sub, used: false }), "EX", REFRESH_EXPIRES_SEC);

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    const decoded = jwt.verify(refreshToken, env.jwt.accessSecret, {
      issuer: env.jwt.issuer, audience: env.jwt.audience,
    }) as jwt.JwtPayload;
    const redis = getRedis();
    if (redis && decoded.jti) await redis.del(`rt:${decoded.jti}`);
  } catch { /* token already expired — that's fine */ }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}
