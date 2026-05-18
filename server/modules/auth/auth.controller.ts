import type { RequestHandler } from "express";
import * as authService from "./auth.service";
import { env } from "../../config/env";

const REFRESH_COOKIE = "rt";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || "unknown";
    const result = await authService.login(email, password, ip);
    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTS);
    res.json({ ok: true, accessToken: result.accessToken, user: result.user });
  } catch (err: any) {
    const status = err.status || 500;
    res.status(status).json({ ok: false, message: err.message });
  }
};

export const refreshHandler: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] || req.signedCookies?.[REFRESH_COOKIE];
    if (!token) return res.status(401).json({ ok: false, message: "No refresh token" });
    const result = await authService.refreshTokens(token);
    res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTS);
    res.json({ ok: true, accessToken: result.accessToken });
  } catch (err: any) {
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
    res.status(err.status || 401).json({ ok: false, message: err.message });
  }
};

export const logoutHandler: RequestHandler = async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE] || req.signedCookies?.[REFRESH_COOKIE];
  if (token) await authService.logout(token);
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.json({ ok: true });
};

export const meHandler: RequestHandler = (req, res) => {
  res.json({ ok: true, user: req.user });
};
