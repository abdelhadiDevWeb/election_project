import { AdminCommun } from "./admin-commun.model";
import * as crud from "../common/crud.helpers";
import { hashPassword } from "../auth/auth.service";

export async function create(data: any) {
  data.password = await hashPassword(data.password);
  return crud.createDoc(AdminCommun, data);
}
export async function findAll(query: any) {
  const filter: any = {};
  if (query.wilaya) filter.wilaya = query.wilaya;
  if (query.commune) filter.commune = query.commune;
  if (query.status) filter.status = query.status;
  return crud.paginate(AdminCommun, filter, query, undefined, ["wilaya", "commune"]);
}
export async function findById(id: string) { return crud.findById(AdminCommun, id, ["wilaya", "commune"]); }
export async function update(id: string, data: any) {
  if (data.password) data.password = await hashPassword(data.password);
  return crud.updateDoc(AdminCommun, id, data);
}
export async function remove(id: string) { return crud.deleteDoc(AdminCommun, id); }
