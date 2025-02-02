import createHttpError from 'http-errors';
import * as authServices from '../services/auth.js';
import bcrypt from 'bcrypt';

export const registerController = async (req, res) => {
  await authServices.register(req.body);

  res.status(201).send();
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
      name: updatedUser.name,
      email: updatedUser.email,
    },
    token: updatedUser.token,
  });
};

export const loguotUserById = async (req, res) => {
  await authServices.clearToken(req.user._id);
  res.status(204).end();
};

export const refreshUser = (req, res) => {
  const user = req.user;
  res.json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    gender: user.gender,
  });
};
