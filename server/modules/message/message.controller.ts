import type { RequestHandler } from "express";
import * as messageService from "./message.service";

export const send: RequestHandler = async (req, res) => {
  try {
    const data: any = { ...req.body, sender: req.user?.sub, sender_role: req.user?.role };
    if (req.files && Array.isArray(req.files)) {
      data.images = req.files.filter((f: any) => f.fieldname === "images").map((f: any) => f.buffer);
      data.images_mimetypes = req.files.filter((f: any) => f.fieldname === "images").map((f: any) => f.mimetype);
      const videoFile = req.files.find((f: any) => f.fieldname === "video");
      if (videoFile) { data.video = videoFile.buffer; data.video_mimetype = videoFile.mimetype; }
      const pdfFile = req.files.find((f: any) => f.fieldname === "pdf");
      if (pdfFile) { data.pdf = pdfFile.buffer; data.pdf_mimetype = pdfFile.mimetype; }
    }
    const doc = await messageService.send(data);
    res.status(201).json({ ok: true, data: doc });
  } catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const list: RequestHandler = async (req, res, next) => {
  try { const result = await messageService.findAll(req.query); res.json({ ok: true, ...result }); } catch (err) { next(err); }
};

export const getById: RequestHandler = async (req, res) => {
  try { const data = await messageService.findById(req.params.id as string); res.json({ ok: true, data }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};

export const markRead: RequestHandler = async (req, res) => {
  try { await messageService.markRead(req.params.id as string, req.user!.sub); res.json({ ok: true }); }
  catch (err: any) { res.status(err.status || 500).json({ ok: false, message: err.message }); }
};
