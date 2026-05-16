import { SuperAdmin } from "./super-admin.model";
import * as crud from "../common/crud.helpers";
import { hashPassword } from "../auth/auth.service";

export async function create(data: any) {
  data.password = await hashPassword(data.password);
  return crud.createDoc(SuperAdmin, data);
}

export async function findAll(query: any) {
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { full_name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  return crud.paginate(SuperAdmin, filter as any, query, "full_name email phone status nin createdAt");
}

export async function findById(id: string) { return crud.findById(SuperAdmin, id); }

export async function update(id: string, data: any) {
  if (data.password) data.password = await hashPassword(data.password);
  return crud.updateDoc(SuperAdmin, id, data);
}

export async function remove(id: string) { return crud.deleteDoc(SuperAdmin, id); }
