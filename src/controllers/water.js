import createError from 'http-errors';
import * as waterServices from '../services/water.js';
// import { parsePaginationParams } from '../utils/parsePaginationParams.js';
// import { parseFilterParams } from '../utils/parseFilterParams.js';
import moment from 'moment';

// export const getWaterController = async (req, res) => {
//   const { page, perPage } = parsePaginationParams(req.query);
//   const filter = parseFilterParams(req.query);

//   filter.userId = req.user._id;

//   const data = await waterServices.getWater({ page, perPage });
//   res.json({ data });
// };

// export const getWaterByIdController = async (req, res) => {
//   const { _id: userId } = req.user;
//   const { id: _id } = req.params;
//   const data = await waterServices.getWaterById(_id, userId);

//   if (!data) {
//     throw createError(404, 'Not found');
//   }
//   res.json(data);
// };

export const updateDailyNormController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date, dailyNorm } = req.body;

    if (!date || !dailyNorm) {
      return res.status(400).json({ error: 'Date and dailyNorm are required' });
    }

    const updatedWaterRecord = await waterServices.updateDailyNorm({
      userId,
      date,
      dailyNorm,
    });
    res.status(200).json(updatedWaterRecord);
  } catch (error) {
    next(error);
  }
};

export const getWaterByDayController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const { waterRecord, totalWater, dailyNorm } =
      await waterServices.getWaterByDay(userId, date);

    if (!waterRecord) {
      return res.status(200).json({
        date: moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        dailyNorm: 'N/A',
        totalWater: 0,
        percentage: '0%',
        entries: [],
      });
    }

    const percentage = ((totalWater / dailyNorm) * 100).toFixed(0);

    res.status(200).json({
      date: moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      dailyNorm,
      totalWater,
      percentage: `${percentage}%`,
      entries: waterRecord.entries,
    });
  } catch (error) {
    next(error);
  }
};

export const getWaterByMonthController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { yearMonth } = req.params;

    if (!yearMonth) {
      return res.status(400).json({ error: 'Missing yearMonth parameter' });
    }

    if (!/^\d{4}-\d{2}$/.test(yearMonth)) {
      return res
        .status(400)
        .json({ error: 'Invalid date format. Expected YYYY-MM' });
    }

    const [year, month] = yearMonth.split('-');

    const waterRecords = await waterServices.getWaterByMonth({
      userId,
      year,
      month,
    });

    if (!waterRecords || waterRecords.length === 0) {
      return res
        .status(404)
        .json({ error: 'No water entries found for this month' });
    }

    const formattedData = waterRecords.map((record) => {
      const totalWater = record.totalWater;
      const dailyNorm = record.dailyNorm;
      const percentage = ((totalWater / dailyNorm) * 100).toFixed(0);
      const entryCount = record.entries.length;

      return {
        date: `${moment(record.date, 'YYYY-MM-DD').date()}, ${moment(
          record.date,
          'YYYY-MM-DD',
        ).format('MMMM')}`,
        dailyNorma: `${(dailyNorm / 1000).toFixed(1)} L`,
        percentage: `${percentage}%`,
        entryCount,
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
      return res
        .status(400)
        .json({ error: 'Date and entries array are required' });
    }

    entries.forEach((entry) => {
      if (!entry.time || !entry.waterVolume) {
        throw createError('Each entry must have time and waterVolume');
      }
    });

    const updatedWaterRecord = await waterServices.addWater({
      userId,
      date,
      entries,
    });

    res.status(201).json(updatedWaterRecord);
  } catch (error) {
    next(error);
  }
};

export const updateWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { newTime, waterVolume } = req.body;
    const { entryId } = req.params;

    if (!entryId || !newTime || !waterVolume) {
      return res
        .status(400)
        .json({ error: 'EntryId, newTime, and waterVolume are required' });
    }

    const updatedWaterRecord = await waterServices.updateWater({
      userId,
      entryId,
      newTime,
      waterVolume,
    });

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
    const { entryId } = req.params;

    if (!entryId) {
      return res.status(400).json({ error: 'Entry ID is required' });
    }

    const updatedWaterRecord = await waterServices.deleteWater({
      userId,
      entryId,
    });

    if (!updatedWaterRecord) {
      return res.status(404).json({ error: 'Water entry not found' });
    }

    res.status(200).json({
      message: 'Water entry deleted successfully',
      updatedWaterRecord,
    });
  } catch (error) {
    next(error);
  }
};
