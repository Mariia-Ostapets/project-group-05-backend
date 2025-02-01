import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../utils/env.js';

export const findUserByEmail = (email) => UsersCollection.findOne({ email });

export const updateUserWithToken = (userId) => {
  const token = jwt.sign(
    {
      id: userId,
    },
    env('JWT_SECRET'),
  );

  return UsersCollection.findByIdAndUpdate(userId, { token }, { new: true });
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });
  return updateUserWithToken(newUser._id);
};

export const clearToken = (userId) =>
  UsersCollection.findByIdAndUpdate(userId, { token: '' });

export const findUserById = (userId) => UsersCollection.findById(userId);
