import { AdminWilaya } from "./admin-wilaya.model";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";
import { hashPassword } from "../auth/auth.service";

export const list = makeListHandler(AdminWilaya, (q) => {
  const f: any = {};
  if (q.wilaya) f.wilaya = q.wilaya;
  if (q.status) f.status = q.status;
  if (q.search) f.$or = [{ full_name: { $regex: q.search, $options: "i" } }, { email: { $regex: q.search, $options: "i" } }];
  return f;
}, "full_name email phone status nin wilaya createdAt", "wilaya");

export const getById = makeGetHandler(AdminWilaya, "wilaya");

export const create = makeCreateHandler(AdminWilaya, async (body, req) => {
  body.password = await hashPassword(body.password);
  body.created_by = req.user?.sub;
  return body;
});

export const update = makeUpdateHandler(AdminWilaya);
export const remove = makeDeleteHandler(AdminWilaya);
