import Joi from "joi";
import { email, password } from "../common/common.validator";

export const loginSchema = Joi.object({
  body: Joi.object({
    email: email.required(),
    password: Joi.string().min(1).required(),
  }).required(),
}).unknown(true);
