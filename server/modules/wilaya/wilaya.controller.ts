import type { RequestHandler } from "express";
import * as wilayaService from "./wilaya.service";
import { Commune } from "../commune/commune.model";

export const list: RequestHandler = async (req, res, next) => {
  try {
    const data = await wilayaService.findAll();
    res.json({ ok: true, data });
  } catch (err) { next(err); }
};

export const getById: RequestHandler = async (req, res, next) => {
  try {
    const data = await wilayaService.findById(req.params.id as string);
    res.json({ ok: true, data });
  } catch (err: any) {
    res.status(err.status || 500).json({ ok: false, message: err.message });
  }
};

export const getCommunes: RequestHandler = async (req, res, next) => {
  try {
    const communes = await Commune.find({ wilaya: req.params.id as string }).sort({ name_fr: 1 }).lean();
    res.json({ ok: true, data: communes });
  } catch (err) { next(err); }
};
