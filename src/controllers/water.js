import createError from 'http-errors';
import * as waterServices from '../services/water.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getWaterController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const filter = parseFilterParams(req.query);

  filter.userId = req.user._id;

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

// export const addWaterController = async (req, res) => {
//   const { _id: userId } = req.user;


//   const data = await waterServices.addWater({...req.body, userId});

//   res.status(201).json(data);
// };


export const addWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date, entries } = req.body;

    if (!date || !entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'Date and entries array are required' });
    }

    entries.forEach((entry) => {
      if (!entry.time || !entry.waterVolume) {
        throw new Error('Each entry must have time and waterVolume');
      }
    });

    const updatedWaterRecord = await waterServices.addWater({ userId, date, entries });

    res.status(201).json(updatedWaterRecord);
  } catch (error) {
    next(error);
  }
};



// export const updateWaterController = async (req, res) => {
//   const { _id: userId } = req.user;
//   const { id: _id } = req.params;
//   const result = await waterServices.updateWater({ _id, userId }, req.body);

//   if (!result) {
//     throw createError(404, 'Not found');
//   }

//   res.json( {data: result.data} );
// };

export const updateWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date, time, newTime, waterVolume } = req.body;

    if (!date || !time || !newTime || !waterVolume) {
      return res.status(400).json({ error: 'Date, time, newTime, and waterVolume are required' });
    }

    const updatedWaterRecord = await waterServices.editWaterEntry({ userId, date, time, newTime, waterVolume });

    if (!updatedWaterRecord) {
      return res.status(404).json({ error: 'Water entry not found' });
    }

    res.status(200).json(updatedWaterRecord);
  } catch (error) {
    next(error);
  }
};

// export const updateWaterController = async (req, res, next) => {
//   try {
//     const { _id: userId } = req.user;
//     const { date, entryId, time, waterVolume } = req.body;

//     if (!date || !entryId || !time || !waterVolume) {
//       return res.status(400).json({ error: 'Date, entryId, time, and waterVolume are required' });
//     }

//     const updatedWaterRecord = await waterServices.editWaterEntry({ userId, date, entryId, time, waterVolume });

//     if (!updatedWaterRecord) {
//       return res.status(404).json({ error: 'Water entry not found' });
//     }

//     res.status(200).json(updatedWaterRecord);
//   } catch (error) {
//     next(error);
//   }
// };


// export const deleteWaterController = async (req, res) => {
//   const { id: _id } = req.params;
//   const { _id: userId } = req.user;
//   const data = await waterServices.deleteWater({ _id, userId });

//   if (!data) {
//     throw createError(404, 'Not found');
//   }

//   res.status(204).send();
// };

export const deleteWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date, entryId } = req.params; // Отримуємо дату і ID конкретної порції

    const updatedWaterRecord = await waterServices.deleteWaterEntry({ userId, date, entryId });

    if (!updatedWaterRecord) {
      throw createError(404, 'Water entry not found or already deleted');
    }

    res.json({ message: 'Water entry deleted successfully', updatedWaterRecord });
  } catch (error) {
    next(error);
  }
};
