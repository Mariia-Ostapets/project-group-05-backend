import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

// const dateRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const dateRegexp = /^\d{4}-\d{2}-\d{2}$/;
const dateTimeRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

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
    // waterVolume: {
    //   type: Number,
    //   required: true,
    // },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
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
