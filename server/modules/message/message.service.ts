import { Message } from "./message.model";
import * as crud from "../common/crud.helpers";
export async function send(data: any) { return crud.createDoc(Message, data); }
export async function findAll(query: any) { const f: any = {}; if (query.sender) f.sender = query.sender; if (query.receiver) f.receivers = query.receiver; return crud.paginate(Message, f, query, "content sender sender_role receivers sent_at read_by images_mimetypes video_mimetype pdf_mimetype"); }
export async function findById(id: string) { return crud.findById(Message, id); }
export async function markRead(id: string, userId: string) { return Message.findByIdAndUpdate(id, { $addToSet: { read_by: userId } }, { new: true }).lean(); }
