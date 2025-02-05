import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { dateRegexp, dateTimeRegexp } from '../../constants/index.js';

const waterEntrySchema = new Schema({
  time: {
    type: String,
    match: dateTimeRegexp,
    required: true,
  },
  waterVolume: {
    type: Number,
    required: true,
    min: 1,
  },
});

const waterSchema = new Schema(
  {
    date: {
      type: String,
      match: dateRegexp,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    dailyNorm: {
      type: Number,
      required: true,
      default: 2000
    },
    totalWater: {
      type: Number,
      required: true,
      default: 0,
    },
    entries: [waterEntrySchema],
  },
  {
    versionKey: false,
  },
);

waterSchema.post('save', handleSaveError);

waterSchema.pre('findOneAndUpdate', setUpdateSettings);

waterSchema.post('findOneAndUpdate', handleSaveError);

export const WaterCollection = model('water', waterSchema);
