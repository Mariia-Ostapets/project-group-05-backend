import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    date: {
      type: String,
      match: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      required: true,
    },
    waterVolume: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterCollection = model('water', waterSchema);
