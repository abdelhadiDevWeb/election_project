import { RoleElectionDay } from "./role-election-day.model";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";
import { hashPassword } from "../auth/auth.service";

export const list = makeListHandler(RoleElectionDay, (q) => {
  const f: any = {};
  if (q.wilaya) f.wilaya = q.wilaya;
  if (q.center) f.center = q.center;
  if (q.role) f.role = q.role;
  if (q.search) f.full_name = { $regex: q.search, $options: "i" };
  return f;
}, undefined, ["wilaya", "commune", "center", "desk"]);

export const getById = makeGetHandler(RoleElectionDay, ["wilaya", "commune", "center", "desk"]);
export const create = makeCreateHandler(RoleElectionDay, async (body, req) => { body.password = await hashPassword(body.password); body.created_by = req.user?.sub; return body; });
export const update = makeUpdateHandler(RoleElectionDay);
export const remove = makeDeleteHandler(RoleElectionDay);
