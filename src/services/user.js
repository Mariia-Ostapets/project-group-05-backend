import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';

export const updateUser = async (filter, payload, options = {}) => {
  const { upsert = false } = options;
  if (payload.password) {
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const user = await UsersCollection.findOneAndUpdate(
      filter,
      { ...payload, password: hashPassword },
      {
        upsert,
        includeResultMetadata: true,
      },
    );
    if (!user || !user.value) {
      return null;
    }
    const newUser = { ...user.value };
    let { token, password, ...newData } = newUser._doc;
    return {
      data: newData,
    };
  } else {
    const user = await UsersCollection.findOneAndUpdate(filter, payload, {
      upsert,
      includeResultMetadata: true,
    });
    if (!user || !user.value) {
      return null;
    }
    const newUser = { ...user.value };
    let { token, password, ...newData } = newUser._doc;
    return {
      data: newData,
    };
  }
};
