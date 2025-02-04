import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';

export const updateUser = async (_id, payload, options = {}) => {
  console.log(_id);
  if (payload.password) {
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const user = await UsersCollection.findOneAndUpdate(
      _id,
      { ...payload, password: hashPassword },
      {
        includeResultMetadata: true,
      },
    );
    if (!user || !user.value) {
      return null;
    }
    const newUser = { ...user.value };
    const { token, password, ...newData } = newUser._doc;
    return {
      data: newData,
    };
  } else {
    const user = await UsersCollection.findOneAndUpdate(_id, payload, {
      includeResultMetadata: true,
    });
    if (!user || !user.value) {
      return null;
    }
    const newUser = { ...user.value };
    const { token, password, ...newData } = newUser._doc;
    return {
      data: newData,
    };
  }
};
