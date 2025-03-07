import createHttpError from 'http-errors';
import * as authServices from '../services/auth.js';
import bcrypt from 'bcrypt';

export const registerController = async (req, res) => {
  const user = await authServices.register(req.body);
  res.status(201).json({
    email: user.email,
  });
};

export const loginUserController = async (req, res) => {
  const user = await authServices.findUserByEmail(req.body.email);

  if (!user) {
    throw createHttpError(401, 'Email or password are wrong');
  }

  const isPwdCorrect = await bcrypt.compare(req.body.password, user.password);

  if (!isPwdCorrect) {
    throw createHttpError(401, 'Email or password are wrong');
  }

  const updatedUser = await authServices.updateUserWithToken(user._id);

  res.json({
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      dailyNorm: updatedUser.dailyNorm,
      avatar: updatedUser.avatar,
    },
    token: updatedUser.token,
  });
};

export const loguotUserById = async (req, res) => {
  await authServices.clearToken(req.user._id);
  res.status(204).end();
};
