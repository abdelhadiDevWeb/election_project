import type { RequestHandler } from "express";
import * as notifService from "./notification.service";

export const list: RequestHandler = async (req, res, next) => {
  try { const result = await notifService.findForUser(req.user!.sub, req.query); res.json({ ok: true, ...result }); } catch (err) { next(err); }
};

export const markRead: RequestHandler = async (req, res) => {
  try { await notifService.markRead(req.params.id as string); res.json({ ok: true }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const markAllRead: RequestHandler = async (req, res) => {
  try { await notifService.markAllRead(req.user!.sub); res.json({ ok: true }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const create: RequestHandler = async (req, res) => {
  try { const doc = await notifService.create({ ...req.body, sender: req.user?.sub }); res.status(201).json({ ok: true, data: doc }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};
