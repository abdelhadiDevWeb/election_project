import type { RequestHandler } from "express";
import * as resultService from "./result-desk.service";
import * as crud from "../common/crud.helpers";
import { ResultDesk } from "./result-desk.model";
import { ResultCenter } from "../result-center/result-center.model";

export const submitDesk: RequestHandler = async (req, res, next) => {
  try {
    const data = { ...req.body, owner: req.user?.sub };
    if (req.file) { data.image = req.file.buffer; data.image_mimetype = req.file.mimetype; }
    const doc = await resultService.submitDeskResult(data);
    res.status(201).json({ ok: true, data: doc });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ ok: false, message: "Result already submitted for this desk/party/candidat" });
    res.status(err.status || 500).json({ ok: false, message: err.message });
  }
};

export const listDesk: RequestHandler = async (req, res, next) => {
  try { const result = await resultService.findAllDeskResults(req.query); res.json({ ok: true, ...result }); } catch (err) { next(err); }
};

export const getDeskById: RequestHandler = async (req, res) => {
  try { const data = await resultService.findDeskResultById(req.params.id as string); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const updateDeskStatus: RequestHandler = async (req, res) => {
  try { const data = await resultService.updateDeskResultStatus(req.params.id as string, req.body.status, req.body.ocr_result); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

// OCR placeholders
export const triggerOcr: RequestHandler = async (req, res) => {
  try { const data = await resultService.processOcr(req.params.id as string); res.json({ ok: true, data, message: "OCR processing initiated (placeholder)" }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const requestHumanReview: RequestHandler = async (req, res) => {
  try { const data = await resultService.requestHumanReview(req.params.id as string); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

// Aggregations
export const aggregateByCenter: RequestHandler = async (req, res) => {
  try { const data = await resultService.aggregateByCenter(req.params.centerId as string); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const aggregateByWilaya: RequestHandler = async (req, res) => {
  try { const data = await resultService.aggregateByWilaya(req.params.wilayaId as string); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const aggregateNational: RequestHandler = async (_req, res) => {
  try { const data = await resultService.aggregateNational(); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

// Result center
export const submitCenter: RequestHandler = async (req, res) => {
  try {
    const data = { ...req.body, owner: req.user?.sub };
    if (req.file) { data.image = req.file.buffer; data.image_mimetype = req.file.mimetype; }
    const doc = await crud.createDoc(ResultCenter, data);
    res.status(201).json({ ok: true, data: doc });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ ok: false, message: "Center result already exists" });
    res.status(err.status || 500).json({ ok: false, message: err.message });
  }
};

export const listCenter: RequestHandler = async (req, res, next) => {
  try {
    const f: any = {};
    if (req.query.center) f.center = req.query.center;
    if (req.query.party) f.party = req.query.party;
    if (req.query.status) f.status = req.query.status;
    const result = await crud.paginate(ResultCenter, f, req.query as any, undefined, ["center", "party"]);
    res.json({ ok: true, ...result });
  } catch (err) { next(err); }
};

export const getCenterById: RequestHandler = async (req, res) => {
  try { const data = await crud.findById(ResultCenter, req.params.id as string, ["center", "party"]); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};
