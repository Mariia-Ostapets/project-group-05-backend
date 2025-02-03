import Joi from 'joi';

const dateRegexp = /^\d{4}-\d{2}-\d{2}$/;
const dateTimeRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

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



