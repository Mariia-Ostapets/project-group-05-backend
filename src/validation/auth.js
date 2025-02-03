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
  newPassword: Joi.string().min(8).max(64).messages({
    'string.min': 'Password should be at least 8 characters',
    'string.max': 'Password should be at most 64 characters',
  }),
  password: Joi.string().min(8).max(64).messages({
    'string.min': 'Password should be at least 8 characters',
    'string.max': 'Password should be at most 64 characters',
  }),
  email: Joi.string().pattern(emailRegexp).messages({
    'string.pattern.base': 'Email should be in format example@mail.com',
  }),
  name: Joi.string().max(32).messages({
    'string.max': 'Name should be at most 32 characters',
  }),
  gender: Joi.string().valid('male', 'female').messages({
    'any.only': 'Gender must be either "male" or "female"',
  }),
  dailyNorm: Joi.number().integer().min(1).max(15000).messages({
    'number.min': 'Daily norma should be at least 1',
    'number.max': 'Daily norma should be at most 15000',
  }),
  avatar: Joi.string(),
  token: Joi.string(),
});


