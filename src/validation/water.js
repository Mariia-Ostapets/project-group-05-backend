import Joi from 'joi';

const dateRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export const addWaterSchema = Joi.object({
    date: Joi.string().pattern(dateRegexp).required(),
    waterVolume: Joi.number().required().min(1)
    .max(5000).messages({
        'number.min': 'WaterVolume must contain at least 1 ml',
        'number.max': 'WaterVolume must contain no more than 5000 ml',
        'any.required': 'WaterVolume is required',
      }),
  });

  export const updateWaterSchema = Joi.object({
    date: Joi.string().pattern(dateRegexp),
    waterVolume: Joi.number().min(1)
    .max(5000).messages({
        'number.min': 'WaterVolume must contain at least 1 ml',
        'number.max': 'WaterVolume must contain no more than 5000 ml',
      }),
  });
