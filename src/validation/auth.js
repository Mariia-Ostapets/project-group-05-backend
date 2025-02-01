import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const registerAndLoginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).max(64).required(),
});
