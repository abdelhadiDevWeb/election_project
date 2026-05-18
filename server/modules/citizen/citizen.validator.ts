import Joi from "joi";
import { objectId, email, password, nin, phone, paginationQuery } from "../common/common.validator";

export const createSchema = Joi.object({
  body: Joi.object({ full_name: Joi.string().trim().max(100).required(), email: email.optional(), phone: phone.required(), password: password.required(), date_of_birth: Joi.date().required(), nin: nin.required(), member_actif: objectId.optional(), party: objectId.optional() }).required(),
}).unknown(true);

export const updateSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
  body: Joi.object({ full_name: Joi.string().trim().max(100), email, phone, password: password.optional(), date_of_birth: Joi.date(), nin, member_actif: objectId, party: objectId }).min(1).required(),
}).unknown(true);

export const listSchema = Joi.object({
  query: Joi.object({ member_actif: objectId.optional(), party: objectId.optional(), search: Joi.string().max(100).optional(), ...paginationQuery }).required(),
}).unknown(true);

export const getByIdSchema = Joi.object({ params: Joi.object({ id: objectId.required() }).required() }).unknown(true);
