import { AdminWilaya } from "./admin-wilaya.model";
import * as crud from "../common/crud.helpers";
import { hashPassword } from "../auth/auth.service";

export async function create(data: any) {
  data.password = await hashPassword(data.password);
  return crud.createDoc(AdminWilaya, data);
}
export async function findAll(query: any) {
  const filter: any = {};
  if (query.wilaya) filter.wilaya = query.wilaya;
  if (query.status) filter.status = query.status;
  return crud.paginate(AdminWilaya, filter, query, undefined, "wilaya");
}
export async function findById(id: string) { return crud.findById(AdminWilaya, id, "wilaya"); }
export async function update(id: string, data: any) {
  if (data.password) data.password = await hashPassword(data.password);
  return crud.updateDoc(AdminWilaya, id, data);
}
export async function remove(id: string) { return crud.deleteDoc(AdminWilaya, id); }
