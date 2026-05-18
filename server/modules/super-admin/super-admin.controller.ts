import { SuperAdmin } from "./super-admin.model";
import * as service from "./super-admin.service";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";
import { hashPassword } from "../auth/auth.service";

export const list = makeListHandler(SuperAdmin, (q) => {
  const f: any = {};
  if (q.status) f.status = q.status;
  if (q.search) f.$or = [{ full_name: { $regex: q.search, $options: "i" } }, { email: { $regex: q.search, $options: "i" } }];
  return f;
}, "full_name email phone status nin createdAt");

export const getById = makeGetHandler(SuperAdmin);

export const create = makeCreateHandler(SuperAdmin, async (body) => {
  body.password = await hashPassword(body.password);
  return body;
});

export const update = makeUpdateHandler(SuperAdmin);
export const remove = makeDeleteHandler(SuperAdmin);
