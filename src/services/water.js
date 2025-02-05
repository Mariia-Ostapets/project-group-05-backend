import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { WaterCollection } from '../db/models/water.js';

// export const getWater = async ({ page = 1, perPage = 1 }) => {
//   const limit = perPage;
//   const skip = (page - 1) * limit;
//   return WaterCollection.find().skip(skip).limit(limit);
// };

// export const getWaterById = (id) => WaterCollection.findById(id);

export const updateDailyNorm = async ({ userId, date, dailyNorm }) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (typeof date !== 'string') {
    throw createHttpError(
      400,
      'Invalid date format. Expected string "YYYY-MM-DD"',
    );
  }

  let waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    waterRecord = new WaterCollection({
      userId,
      date,
      dailyNorm,
      totalWater: 0,
      entries: [],
    });
  } else {
    waterRecord.dailyNorm = dailyNorm;
  }

  await waterRecord.save();
  return waterRecord;
};

export const getWaterByDay = async (userId, date) => {
  const waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    return null;
  }

  const { dailyNorm, totalWater, entries } = waterRecord;

  const totalWaterCalculated =
    totalWater || entries.reduce((sum, entry) => sum + entry.waterVolume, 0);

  return { waterRecord, totalWater: totalWaterCalculated, dailyNorm };
};

export const getWaterByMonth = async ({ userId, year, month }) => {
  if (!userId || !year || !month) {
    throw new Error('Missing required parameters');
  }

  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  const waterRecords = await WaterCollection.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  return waterRecords.length ? waterRecords : null;
};

export const addWater = async ({ userId, date, entries }) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const dailyNorm = user.dailyNorm || 2000;

  let waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    waterRecord = new WaterCollection({
      userId,
      date,
      dailyNorm,
      totalWater: entries.reduce((sum, entry) => sum + entry.waterVolume, 0),
      entries,
    });
  } else {
    waterRecord.entries.push(...entries);
    waterRecord.totalWater += entries.reduce(
      (sum, entry) => sum + entry.waterVolume,
      0,
    );
  }

  await waterRecord.save();
  return waterRecord;
};

export const updateWater = async ({
  userId,
  entryId,
  newTime,
  waterVolume,
}) => {
  const waterRecord = await WaterCollection.findOne({
    userId,
    'entries._id': entryId,
  });

  if (!waterRecord) {
    return null;
  }

  const entry = waterRecord.entries.find(
    (entry) => entry._id.toString() === entryId,
  );
  if (!entry) {
    return null;
  }

  entry.time = newTime;
  entry.waterVolume = waterVolume;

  const totalWater = waterRecord.entries.reduce(
    (sum, entry) => sum + entry.waterVolume,
    0,
  );

  waterRecord.totalWater = totalWater;

  await waterRecord.save();
  return waterRecord;
};

export const deleteWater = async ({ userId, entryId }) => {
  const waterRecord = await WaterCollection.findOne({
    userId,
    'entries._id': entryId,
  });

  if (!waterRecord) {
    return null;
  }

  waterRecord.entries = waterRecord.entries.filter(
    (entry) => entry._id.toString() !== entryId,
  );

  const totalWater = waterRecord.entries.reduce(
    (sum, entry) => sum + entry.waterVolume,
    0,
  );

  waterRecord.totalWater = totalWater;

  await waterRecord.save();
  return waterRecord;
};
