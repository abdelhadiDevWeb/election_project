import { Notification } from "./notification.model";
import * as crud from "../common/crud.helpers";
export async function create(data: any) { return crud.createDoc(Notification, data); }
export async function findForUser(userId: string, query: any) {
  const f: any = { receivers: userId };
  if (query.is_read !== undefined) f.is_read = query.is_read === "true";
  if (query.type) f.type = query.type;
  return crud.paginate(Notification, f, query);
}
export async function markRead(id: string) { return crud.updateDoc(Notification, id, { is_read: true }); }
export async function markAllRead(userId: string) { return Notification.updateMany({ receivers: userId, is_read: false }, { $set: { is_read: true } }); }
