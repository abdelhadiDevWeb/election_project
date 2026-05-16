import Joi from "joi";
import { objectId, paginationQuery } from "../common/common.validator";

export const createSchema = Joi.object({
  body: Joi.object({ name: Joi.string().trim().max(200).required(), wilaya: objectId.required() }).required(),
}).unknown(true);

export const updateSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
  body: Joi.object({ name: Joi.string().trim().max(200).optional(), wilaya: objectId.optional() }).min(1).required(),
}).unknown(true);

export const listSchema = Joi.object({
  query: Joi.object({ wilaya: objectId.optional(), search: Joi.string().max(100).optional(), ...paginationQuery }).required(),
}).unknown(true);

export const getByIdSchema = Joi.object({ params: Joi.object({ id: objectId.required() }).required() }).unknown(true);
