import { model, Schema } from 'mongoose';

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
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['female', 'male'],
      default: 'female',
    },
    dailyNorm: {
      type: Number,
      default: 1500,
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

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('user', userSchema);
