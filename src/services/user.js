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
    const isNew = Boolean(user.lastErrorObject.upserted);

    return {
      isNew,
      data: user.value,
    };
  } else {
    const user = await UsersCollection.findOneAndUpdate(filter, payload, {
      upsert,
      includeResultMetadata: true,
    });
    if (!user || !user.value) {
      return null;
    }
    const isNew = Boolean(user.lastErrorObject.upserted);
    // прибрати токен
    return {
      isNew,
      data: user.value,
    };
  }
};
