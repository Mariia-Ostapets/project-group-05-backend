import { WaterCollection } from '../db/models/water.js';

export const getWater = async ({ page = 1, perPage = 1 }) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  return WaterCollection.find().skip(skip).limit(limit);
};

// export const getWaterById = (id) => WaterCollection.findById(id);

export const getWaterByDay = async ({ userId, date }) => {
  const waterRecord = await WaterCollection.findOne({ userId, date });

  return waterRecord || null;
};

export const getWaterByMonth = async ({ userId, year, month }) => {
  const startDate = `${year}-${month.padStart(2, "0")}-01`;
  const endDate = `${year}-${month.padStart(2, "0")}-31`;

  const waterRecords = await WaterCollection.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  return waterRecords;
};

export const addWater = async ({ userId, date, entries }) => {
  let waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    waterRecord = new WaterCollection({ userId, date, entries });
  } else {
    waterRecord.entries.push(...entries);
  }

  await waterRecord.save();
  return waterRecord;
};

export const updateWater = async ({
  userId,
  date,
  time,
  newTime,
  waterVolume,
}) => {
  const waterRecord = await WaterCollection.findOne({ userId, date });
  console.log(waterRecord);
  if (!waterRecord) {
    return null;
  }

  const entryIndex = waterRecord.entries.findIndex(
    (entry) => entry.time === time,
  );
  if (entryIndex === -1) {
    return null;
  }

  waterRecord.entries[entryIndex].time = newTime;
  waterRecord.entries[entryIndex].waterVolume = waterVolume;

  await waterRecord.save();
  return waterRecord;
};

export const deleteWater = async ({ userId, date, time }) => {
  const waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    return null;
  }

  const entryIndex = waterRecord.entries.findIndex(
    (entry) => entry.time === time,
  );
  if (entryIndex === -1) {
    return null;
  }

  waterRecord.entries.splice(entryIndex, 1);

  if (waterRecord.entries.length === 0) {
    await WaterCollection.deleteOne({ userId, date });
    return { message: 'All water entries for this day were deleted' };
  }

  await waterRecord.save();
  return waterRecord;
};
