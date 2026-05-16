import Joi from "joi";
import { objectId, paginationQuery } from "../common/common.validator";

export const listSchema = Joi.object({
  query: Joi.object({ search: Joi.string().max(100).optional(), ...paginationQuery }).required(),
}).unknown(true);

export const getByIdSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
}).unknown(true);
