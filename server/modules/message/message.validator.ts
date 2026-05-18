import Joi from "joi";
import { objectId, paginationQuery } from "../common/common.validator";
export const sendSchema = Joi.object({ body: Joi.object({ content: Joi.string().trim().max(5000).required(), receivers: Joi.array().items(objectId).min(1).required() }).required() }).unknown(true);
export const listSchema = Joi.object({ query: Joi.object({ sender: objectId.optional(), receiver: objectId.optional(), ...paginationQuery }).required() }).unknown(true);
export const getByIdSchema = Joi.object({ params: Joi.object({ id: objectId.required() }).required() }).unknown(true);
