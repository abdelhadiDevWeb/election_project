import { Citizen } from "./citizen.model";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";
import { hashPassword } from "../auth/auth.service";

export const list = makeListHandler(Citizen, (q) => {
  const f: any = {};
  if (q.member_actif) f.member_actif = q.member_actif;
  if (q.party) f.party = q.party;
  if (q.search) f.full_name = { $regex: q.search, $options: "i" };
  return f;
}, "full_name email phone nin member_actif party createdAt", ["member_actif", "party"]);

export const getById = makeGetHandler(Citizen, ["member_actif", "party"]);
export const create = makeCreateHandler(Citizen, async (body) => { body.password = await hashPassword(body.password); return body; });
export const update = makeUpdateHandler(Citizen);
export const remove = makeDeleteHandler(Citizen);
