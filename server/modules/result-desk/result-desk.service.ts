import { ResultDesk } from "./result-desk.model";
import { ResultCenter } from "../result-center/result-center.model";
import * as crud from "../common/crud.helpers";
import mongoose from "mongoose";

export async function submitDeskResult(data: any) {
  const existing = await ResultDesk.findOne({
    desk: data.desk,
    party: data.party,
    candidat: data.candidat,
  });
  if (existing) {
    if (data.total !== undefined) existing.total = data.total;
    if (data.image) {
      existing.image = data.image;
      existing.image_mimetype = data.image_mimetype;
    }
    if (data.owner) existing.owner = data.owner;
    existing.status = "pending";
    return await existing.save();
  }
  return crud.createDoc(ResultDesk, data);
}

export async function findAllDeskResults(query: any) {
  const f: any = {};
  if (query.desk) f.desk = query.desk;
  if (query.party) f.party = query.party;
  if (query.status) f.status = query.status;
  if (query.owner) f.owner = query.owner;
  return crud.paginate(ResultDesk, f, query, undefined, ["owner", "party", "desk", "candidat"]);
}

export async function findDeskResultById(id: string) { return crud.findById(ResultDesk, id, ["owner", "party", "desk", "candidat"]); }

export async function updateDeskResultStatus(id: string, status: string, ocr_result?: string) {
  const update: any = { status };
  if (ocr_result !== undefined) update.ocr_result = ocr_result;
  return crud.updateDoc(ResultDesk, id, update);
}

// ── OCR Placeholder ──────────────────────────────────────────
export async function processOcr(resultId: string) {
  // TODO: Integrate actual OCR service (Tesseract / Google Vision / custom)
  // For now, mark as ocr_done with placeholder result
  return crud.updateDoc(ResultDesk, resultId, { status: "ocr_done", ocr_result: "OCR_PLACEHOLDER", none_ocr: false });
}

export async function requestHumanReview(resultId: string) {
  return crud.updateDoc(ResultDesk, resultId, { status: "pending", none_ocr: true });
}

// ── Aggregations ─────────────────────────────────────────────
export async function aggregateByCenter(centerId: string) {
  return ResultDesk.aggregate([
    { $lookup: { from: "desks", localField: "desk", foreignField: "_id", as: "deskInfo" } },
    { $unwind: "$deskInfo" },
    { $match: { "deskInfo.center": new mongoose.Types.ObjectId(centerId) } },
    { $group: { _id: { party: "$party", candidat: "$candidat" }, totalVotes: { $sum: "$total" }, count: { $sum: 1 } } },
    { $sort: { totalVotes: -1 } },
  ]);
}

export async function aggregateByWilaya(wilayaId: string) {
  return ResultCenter.aggregate([
    { $lookup: { from: "centers", localField: "center", foreignField: "_id", as: "centerInfo" } },
    { $unwind: "$centerInfo" },
    { $match: { "centerInfo.wilaya": new mongoose.Types.ObjectId(wilayaId), status: "validated" } },
    { $group: { _id: "$party", totalVotes: { $sum: "$result" }, centersCount: { $sum: 1 } } },
    { $sort: { totalVotes: -1 } },
    { $lookup: { from: "parties", localField: "_id", foreignField: "_id", as: "partyInfo" } },
    { $unwind: "$partyInfo" },
  ]);
}

export async function aggregateNational() {
  return ResultCenter.aggregate([
    { $match: { status: "validated" } },
    { $group: { _id: "$party", totalVotes: { $sum: "$result" }, centersCount: { $sum: 1 } } },
    { $sort: { totalVotes: -1 } },
    { $lookup: { from: "parties", localField: "_id", foreignField: "_id", as: "partyInfo" } },
    { $unwind: "$partyInfo" },
  ]);
}
