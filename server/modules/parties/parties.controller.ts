import { Party } from "./parties.model";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";

export const list = makeListHandler(Party, (q) => {
  const f: any = {};
  if (q.wilaya) f.wilaya = q.wilaya;
  if (q.search) f.name = { $regex: q.search, $options: "i" };
  return f;
}, "name wilaya createdAt", "wilaya");

export const getById = makeGetHandler(Party, "wilaya");
export const create = makeCreateHandler(Party, async (body, req) => { body.created_by = req.user?.sub; return body; });
export const update = makeUpdateHandler(Party);
export const remove = makeDeleteHandler(Party);
