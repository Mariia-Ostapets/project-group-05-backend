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

// export const addWater = (data) => WaterCollection.create(data);

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

// export const updateWater = async (_id, data) => {
//   const result = await WaterCollection.findOneAndUpdate({ _id }, data);
//   return result;
// };

export const updateWater = async ({ userId, date, time, newTime, waterVolume }) => {
  const waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    return null;
  }

  const entryIndex = waterRecord.entries.findIndex(entry => entry.time === time);
  if (entryIndex === -1) {
    return null;
  }

  waterRecord.entries[entryIndex].time = newTime;
  waterRecord.entries[entryIndex].waterVolume = waterVolume;

  await waterRecord.save();
  return waterRecord;
};

// export const updateWater = async ({ userId, date, entryId, time, waterVolume }) => {
//   const waterRecord = await WaterCollection.findOne({ userId, date });

//   if (!waterRecord) {
//     return null;
//   }

//   const entryIndex = waterRecord.entries.findIndex(entry => entry._id.toString() === entryId);
//   if (entryIndex === -1) {
//     return null;
//   }

//   waterRecord.entries[entryIndex].time = time;
//   waterRecord.entries[entryIndex].waterVolume = waterVolume;

//   await waterRecord.save();
//   return waterRecord;
// };

// export const deleteWater = (filter) => WaterCollection.findOneAndDelete(filter);

export const deleteWater = async ({ userId, date, entryId }) => {
  // Шукаємо запис за userId та датою
  const waterRecord = await WaterCollection.findOne({ userId, date });

  if (!waterRecord) {
    return null; // Якщо запису за день немає
  }

  // Шукаємо запис у масиві `entries`
  const entryIndex = waterRecord.entries.findIndex(
    (entry) => entry._id.toString() === entryId,
  );

  if (entryIndex === -1) {
    return null; // Якщо порція води не знайдена
  }

  // Видаляємо порцію води
  waterRecord.entries.splice(entryIndex, 1);

  // Якщо після видалення масив `entries` порожній — видаляємо весь запис дня
  if (waterRecord.entries.length === 0) {
    await WaterCollection.findByIdAndDelete(waterRecord._id);
    return { message: 'All entries for this day were deleted' };
  }

  await waterRecord.save();
  return waterRecord;
};
