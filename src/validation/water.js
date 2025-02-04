import Joi from 'joi';
import { dateRegexp, dateTimeRegexp } from '../constants/index.js';


export const addWaterSchema = Joi.object({
  date: Joi.string().pattern(dateRegexp).required().messages({
    'string.pattern.base': 'Date must be in format YYYY-MM-DD',
    'any.required': 'Date is required',
  }),
  entries: Joi.array()
    .items(
      Joi.object({
        time: Joi.string().pattern(dateTimeRegexp).required().messages({
          'string.pattern.base': 'Time must be in format YYYY-MM-DDTHH:mm',
          'any.required': 'Time is required',
        }),
        waterVolume: Joi.number().min(1).max(5000).required().messages({
          'number.min': 'WaterVolume must contain at least 1 ml',
          'number.max': 'WaterVolume must contain no more than 5000 ml',
          'any.required': 'WaterVolume is required',
        }),
      })
    )
    .min(1)
    .required(),
  userId: Joi.string().hex().required(),
});



// export const updateWaterSchema = Joi.object({
//   date: Joi.string().pattern(dateRegexp).required().messages({
//     'string.pattern.base': 'Date must be in format YYYY-MM-DD',
//     'any.required': 'Date is required',
//   }),
//   time: Joi.string().pattern(dateTimeRegexp).required().messages({
//     'string.pattern.base': 'Time must be in format YYYY-MM-DDTHH:mm',
//     'any.required': 'Time is required',
//   }),
//   newTime: Joi.string().pattern(dateTimeRegexp).required().messages({
//     'string.pattern.base': 'NewTime must be in format YYYY-MM-DDTHH:mm',
//     'any.required': 'NewTime is required',
//   }),
//   waterVolume: Joi.number().min(1).max(5000).required().messages({
//     'number.min': 'WaterVolume must contain at least 1 ml',
//     'number.max': 'WaterVolume must contain no more than 5000 ml',
//     'any.required': 'WaterVolume is required',
//   }),
// });

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


// {
//   "_id": {"679f411d17ee1564c85862b9"},
//   "date": "2025-02-01",
//   "userId": {"679e4401bc57f36af82b14a2"},
//   "entries": [
//     {
//       "time": "2025-02-01T10:03",
//       "waterVolume": 300,
//       "_id": {"679f412817ee1564c85862bf"}
//     },],
//   "dailyNorma": "1.8 L",
//   "totalWater": 1400
// }
