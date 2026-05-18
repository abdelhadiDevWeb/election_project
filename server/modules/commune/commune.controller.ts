import { Commune } from "./commune.model";
import { makeListHandler, makeGetHandler, makeCreateHandler, makeUpdateHandler, makeDeleteHandler } from "../common/crud.controller";

export const list = makeListHandler(Commune, (q) => {
  const filter: any = {};
  if (q.wilaya) filter.wilaya = q.wilaya;
  if (q.search) {
    filter.$or = [
      { name_fr: { $regex: q.search, $options: "i" } },
      { name_ar: { $regex: q.search, $options: "i" } },
    ];
  }
  return filter;
});

export const getById = makeGetHandler(Commune);

export const create = makeCreateHandler(Commune);

export const update = makeUpdateHandler(Commune);

export const remove = makeDeleteHandler(Commune);
