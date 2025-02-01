import createError from 'http-errors';
import * as waterServices from '../services/water.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
// import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getWaterController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  // const filter = parseFilterParams(req.query);

  // filter.userId = req.user._id;

  const data = await waterServices.getWater({ page, perPage });
  res.json({ data });
};

export const getWaterByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: _id } = req.params;
  const data = await waterServices.getWaterById(_id, userId);

  if (!data) {
    throw createError(404, 'Not found');
  }
  res.json(data);
};

export const getWaterByDayController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date } = req.query;

    if (!date) {
      throw createError(400, 'Date query parameter is required');
    }

    const dayWaterVolume = await waterServices.getWaterByDay(userId, date);

    if (dayWaterVolume === null) {
      throw createError(404, 'No water intake records found for this date');
    }

    res.json({ date, waterVolume: dayWaterVolume });
  } catch (error) {
    next(error);
  }
};

export const getWaterByMonthController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { month, year } = req.query;

    if (!month || !year) {
      throw createError(400, 'Month and year query parameters are required');
    }

    const monthlyWaterVolume = await waterServices.getWaterByMonth(userId, month, year);

    if (monthlyWaterVolume === null) {
      throw createError(404, 'No water intake records found for this month');
    }

    res.json({ month, year, waterVolume: monthlyWaterVolume });
  } catch (error) {
    next(error);
  }
};

export const addWaterController = async (req, res) => {
  const { _id: userId } = req.user;

  const data = await waterServices.addWater({...req.body, userId});

  res.status(201).json(data);
};


export const updateWaterController = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: _id } = req.params;
  const result = await waterServices.updateWater({ _id, userId }, req.body);

  if (!result) {
    throw createError(404, 'Not found');
  }

  res.json({ data: result.data });
};

export const deleteWaterController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const data = await waterServices.deleteWater({ _id, userId });

  if (!data) {
    throw createError(404, 'Not found');
  }

  res.status(204).send();
};
