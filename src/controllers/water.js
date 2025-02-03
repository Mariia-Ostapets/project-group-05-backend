import createError from 'http-errors';
import * as waterServices from '../services/water.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import moment from 'moment';

export const getWaterController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const filter = parseFilterParams(req.query);

  filter.userId = req.user._id;

  const data = await waterServices.getWater({ page, perPage });
  res.json({ data });
 };

// export const getWaterByIdController = async (req, res) => {
//   const { _id: userId } = req.user;
//   const { id: _id } = req.params;
//   const data = await waterServices.getWaterById(_id, userId);

//   if (!data) {
//     throw createError(404, 'Not found');
//   }
//   res.json(data);
// };

export const getWaterByDayController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date } = req.params;
    const { dailyNorma } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    if (!dailyNorma || isNaN(dailyNorma) || dailyNorma<= 0) {
      return res.status(400).json({ error: 'Valid dailyNorma is required' });
    }

    const waterRecord = await waterServices.getWaterByDay({ userId, date });

    if (!waterRecord) {
      return res.status(404).json({ error: 'No water entries found for this date' });
    }

    const totalWater = waterRecord.entries.reduce((sum, entry) => sum + entry.waterVolume, 0);

    const percentage = ((totalWater / dailyNorma) * 100).toFixed(2);

    res.status(200).json({
      waterRecord,
      totalWater,
      percentage: `${percentage}%`
    });

  } catch (error) {
    next(error);
  }
};

export const getWaterByMonthController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { year, month } = req.params;
    const { dailyNorma } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required" });
    }

    if (!dailyNorma || isNaN(dailyNorma) || dailyNorma <= 0) {
      return res.status(400).json({ error: "Valid dailyNorma is required" });
    }

    const waterRecords = await waterServices.getWaterByMonth({ userId, year, month });

    if (!waterRecords || waterRecords.length === 0) {
      return res.status(404).json({ error: "No water entries found for this month" });
    }

    const formattedData = waterRecords.map(record => {
      const totalWater = record.entries.reduce((sum, entry) => sum + entry.waterVolume, 0);
      const percentage = ((totalWater / dailyNorma) * 100).toFixed(2);
      const entryCount = record.entries.length;

      return {
        date: `${moment(record.date, "YYYY-MM-DD").date()}, ${moment(record.date, "YYYY-MM-DD").format("MMMM")}`,
        dailyNorma: `${(dailyNorma / 1000).toFixed(1)} L`,
        percentage: `${percentage}%`,
        entryCount
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    next(error);
  }
};


export const addWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date, entries } = req.body;

    if (!date || !entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'Date and entries array are required' });
    }

    entries.forEach((entry) => {
      if (!entry.time || !entry.waterVolume) {
        throw createError('Each entry must have time and waterVolume');
      }
    });

    const updatedWaterRecord = await waterServices.addWater({ userId, date, entries });

    res.status(201).json(updatedWaterRecord);
  } catch (error) {
    next(error);
  }
};

export const updateWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date, time, newTime, waterVolume } = req.body;

    if (!date || !time || !newTime || !waterVolume) {
      return res.status(400).json({ error: 'Date, time, newTime, and waterVolume are required' });
    }

    const updatedWaterRecord = await waterServices.updateWater({ userId, date, time, newTime, waterVolume });

    if (!updatedWaterRecord) {
      return res.status(404).json({ error: 'Water entry not found' });
    }

    res.status(200).json(updatedWaterRecord);
  } catch (error) {
    next(error);
  }
};

export const deleteWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date, time } = req.params;

    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    const updatedWaterRecord = await waterServices.deleteWater({ userId, date, time });

    if (!updatedWaterRecord) {
      return res.status(404).json({ error: 'Water entry not found' });
    }

    res.status(200).json({ message: 'Water entry deleted successfully', updatedWaterRecord });
  } catch (error) {
    next(error);
  }
};
