import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const registerAndLoginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).max(64).required(),
});

export const changeEmailAndPasswordUserSchema = Joi.object({
  newPassword: Joi.string().min(8).max(64),
  password: Joi.string().min(8).max(64),
  email: Joi.string().pattern(emailRegexp),
  name: Joi.string(),
  gender: Joi.string(),
  dailyNorm: Joi.number(),
  avatar: Joi.string(),
  data: Joi.date(),
  token: Joi.string(),
});
