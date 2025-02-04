import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { WaterCollection } from '../db/models/water.js';

// export const getWater = async ({ page = 1, perPage = 1 }) => {
//   const limit = perPage;
//   const skip = (page - 1) * limit;
//   return WaterCollection.find().skip(skip).limit(limit);
// };

// export const getWaterById = (id) => WaterCollection.findById(id);

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

// export const getWaterByMonth = async ({ userId, year, month }) => {
//   const startDate = `${year}-${month.padStart(2, '0')}-01`;
//   const endDate = `${year}-${month.padStart(2, '0')}-31`;

//   const waterRecords = await WaterCollection.find({
//     userId,
//     date: { $gte: startDate, $lte: endDate },
//   });

//   return waterRecords;
// };

export const getWaterByMonth = async ({ userId, year, month }) => {
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;

  const waterRecords = await WaterCollection.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  return waterRecords;
};

// export const getWaterByMonth = async ({ userId, year, month }) => {
//   const monthPattern = `${year}-${month}`;

//   const waterRecords = await WaterCollection.find({
//     userId,
//     date: { $regex: `^${monthPattern}-\\d{2}$` },
//   });

//   return waterRecords;
// };

export const addWater = async ({ userId, date, entries }) => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const dailyNorm = user.dailyNorm || 1500;

  let waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    waterRecord = new WaterCollection({
      userId,
      date,
      dailyNorm,
      entries,
      totalWater: entries.reduce((sum, entry) => sum + entry.waterVolume, 0),
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

// export const updateWater = async ({
//   userId,
//   entryId,
//   newTime,
//   waterVolume,
// }) => {
//   const waterRecord = await WaterCollection.findOne({
//     userId,
//     'entries._id': entryId,
//   });

//   if (!waterRecord) {
//     return null;
//   }

//   const entry = waterRecord.entries.find(
//     (entry) => entry._id.toString() === entryId,
//   );
//   if (!entry) {
//     return null;
//   }

//   entry.time = newTime;
//   entry.waterVolume = waterVolume;

//   await waterRecord.save();
//   return waterRecord;
// };

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

// export const deleteWater = async ({ userId, entryId }) => {
//   const waterRecord = await WaterCollection.findOne({
//     userId,
//     'entries._id': entryId,
//   });

//   if (!waterRecord) {
//     return null;
//   }

//   waterRecord.entries = waterRecord.entries.filter(
//     (entry) => entry._id.toString() !== entryId,
//   );

//   await waterRecord.save();
//   return waterRecord;
// };

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
