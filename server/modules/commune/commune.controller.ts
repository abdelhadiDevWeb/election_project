import type { RequestHandler } from "express";
import * as communeService from "./commune.service";

export const list: RequestHandler = async (req, res, next) => {
  try {
    const result = await communeService.findAllPaginated(req.query);
    res.json({ ok: true, ...result });
  } catch (err) { next(err); }
};

export const getById: RequestHandler = async (req, res, next) => {
  try {
    const data = await communeService.findById(req.params.id as string);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(err.status || 500).json({ ok: false, message: err.message });
  }
};
