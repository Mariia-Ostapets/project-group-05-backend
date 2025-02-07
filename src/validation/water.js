import Joi from 'joi';
import { dateTimeRegexp } from '../constants/index.js';

export const addWaterSchema = Joi.object({
  time: Joi.string().pattern(dateTimeRegexp).required().messages({
    'string.pattern.base': 'Time must be in format YYYY-MM-DDTHH:mm',
    'any.required': 'Time is required',
  }),
  waterVolume: Joi.number().min(1).max(5000).required().messages({
    'number.min': 'WaterVolume must contain at least 1 ml',
    'number.max': 'WaterVolume must contain no more than 5000 ml',
    'any.required': 'WaterVolume is required',
  }),
});

export const updateWaterSchema = Joi.object({
  entryId: Joi.string().hex().optional().messages({
    "any.required": "Entry ID is required",
  }),
  newTime: Joi.string().pattern(dateTimeRegexp).required().messages({
    "string.pattern.base": "Time must be in format YYYY-MM-DDTHH:mm",
    "any.required": "Time is required",
  }),
  waterVolume: Joi.number().min(1).max(5000).required().messages({
    "number.min": "WaterVolume must be at least 1 ml",
    "number.max": "WaterVolume cannot exceed 5000 ml",
    "any.required": "WaterVolume is required",
  }),
});


