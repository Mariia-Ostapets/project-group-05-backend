import Joi from 'joi';
import { emailRegexp } from '../constants/index.js';

export const registerAndLoginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email should be in format example@mail.com',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(64).required().messages({
    'string.min': 'Password should be at least 8 characters',
    'string.max': 'Password should be at most 64 characters',
    'any.required': 'Password is required',
  }),
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


