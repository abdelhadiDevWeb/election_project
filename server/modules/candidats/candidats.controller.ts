import type { RequestHandler } from "express";
import { Candidat } from "./candidats.model";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";

const handleImage = (body: any, req: any) => {
  if (req.file) {
    body.image = req.file.buffer;
    body.image_mimetype = req.file.mimetype;
  }
  return body;
};

export const list = makeListHandler(Candidat, (q) => {
  const f: any = {};
  if (q.wilaya) f.wilaya = q.wilaya;
  if (q.party) f.party = q.party;
  if (q.search) f.full_name = { $regex: q.search, $options: "i" };
  return f;
}, "full_name nin phone party wilaya is_favorite result createdAt", ["party", "wilaya"]);

export const getById = makeGetHandler(Candidat, ["party", "wilaya"]);
export const create = makeCreateHandler(Candidat, handleImage);
export const update = makeUpdateHandler(Candidat, handleImage);
export const remove = makeDeleteHandler(Candidat);

// Add endpoint to serve the image
export const getPortrait: RequestHandler = async (req, res, next) => {
  try {
    const cand = await Candidat.findById(req.params.id).select("+image +image_mimetype");
    if (!cand || !cand.image) {
      return res.status(404).json({ ok: false, message: "Image not found" });
    }
    res.set("Content-Type", cand.image_mimetype || "image/jpeg");
    res.send(cand.image);
  } catch (err) { next(err); }
};
