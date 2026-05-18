import { Desk } from "./desk.model";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";
export const list = makeListHandler(Desk, (q) => { const f: any = {}; if (q.center) f.center = q.center; return f; }, undefined, "center");
export const getById = makeGetHandler(Desk, "center");
export const create = makeCreateHandler(Desk);
export const update = makeUpdateHandler(Desk);
export const remove = makeDeleteHandler(Desk);
