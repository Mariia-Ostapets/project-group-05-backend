import { model, Schema } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/index.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
    },
    newPassword: {
      type: String,
      minlength: 8,
    },
    gender: {
      type: String,
      enum: ['female', 'male'],
      default: 'female',
    },
    dailyNorm: {
      type: Number,
      default: 2000,
    },
    avatar: {
      type: String,
      default: null,
    },
    token: {
      type: String,
    },
  },
  { versionKey: false },
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', handleSaveError);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('user', userSchema);
