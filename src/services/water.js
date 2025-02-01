import { WaterCollection } from '../db/models/water.js';

export const getWater = async ({ page = 1, perPage = 1 }) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  return WaterCollection.find().skip(skip).limit(limit);
};

export const getWaterById = (id) => WaterCollection.findById(id);

export const getWaterByDay = async (userId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await WaterCollection.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        totalWaterVolume: { $sum: '$waterVolume' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalWaterVolume : null;
};

export const getWaterByMonth = async (userId, month, year) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await WaterCollection.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalWaterVolume: { $sum: '$waterVolume' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalWaterVolume : null;
};

export const addWater = (data) => WaterCollection.create(data);

export const updateWater = async (_id, data) => {
  const result = await WaterCollection.findOneAndUpdate({ _id }, data);
  return result;
};

export const deleteWater = (filter) => WaterCollection.findOneAndDelete(filter);
