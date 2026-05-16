import Joi from "joi";
import { objectId, email, password, nin, phone, statusEnum, paginationQuery } from "../common/common.validator";

const adminBase = {
  full_name: Joi.string().trim().max(100),
  email,
  phone,
  nin,
  status: statusEnum,
};

export const createSuperAdminSchema = Joi.object({
  body: Joi.object({ ...adminBase, full_name: adminBase.full_name.required(), email: email.required(), password: password.required(), phone: phone.required(), nin: nin.required() }).unknown(true).required(),
}).unknown(true);

export const updateSuperAdminSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
  body: Joi.object({ ...adminBase, password: password.optional() }).unknown(true).min(1).required(),
}).unknown(true);

export const createAdminWilayaSchema = Joi.object({
  body: Joi.object({ ...adminBase, full_name: adminBase.full_name.required(), email: email.required(), password: password.required(), phone: phone.required(), nin: nin.required(), wilaya: objectId.required() }).unknown(true).required(),
}).unknown(true);

export const updateAdminWilayaSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
  body: Joi.object({ ...adminBase, password: password.optional(), wilaya: objectId.optional() }).unknown(true).min(1).required(),
}).unknown(true);

export const createAdminCommunSchema = Joi.object({
  body: Joi.object({ ...adminBase, full_name: adminBase.full_name.required(), email: email.required(), password: password.required(), phone: phone.required(), nin: nin.required(), wilaya: objectId.required(), commune: objectId.required() }).unknown(true).required(),
}).unknown(true);

export const updateAdminCommunSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
  body: Joi.object({ ...adminBase, password: password.optional(), wilaya: objectId.optional(), commune: objectId.optional() }).unknown(true).min(1).required(),
}).unknown(true);

export const listAdminSchema = Joi.object({
  query: Joi.object({ wilaya: objectId.optional(), commune: objectId.optional(), status: statusEnum.optional(), search: Joi.string().max(100).optional(), ...paginationQuery }).required(),
}).unknown(true);

export const getByIdSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }).required(),
}).unknown(true);
