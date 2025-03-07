import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { updateUser } from '../services/user.js';
import * as authServices from '../services/auth.js';
import {
  saveFileToCloudinary,
  deleteFileFromCloudinary,
} from '../utils/saveFileToCloudinary.js';

export const refreshUser = (req, res) => {
  const user = req.user;
  res.json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    gender: user.gender,
    dailyNorm: user.dailyNorm,
  });
};

export const patchUser = async (req, res) => {
  const user = req.user;
  let photo;
  if (req.file) {
    if (user.avatar) {
      const splittedUrl = user.avatar.split('/');
      const photoPublicId = splittedUrl[splittedUrl.length - 1].replace(
        '.jpg',
        '',
      );
      await deleteFileFromCloudinary(photoPublicId);
    }
    photo = await saveFileToCloudinary(req.file);
  }

  const { id: _id } = user;

  const userEmail = await authServices.findUserByEmail(req.body.email);

  if (userEmail && _id !== userEmail.id) {
    throw createHttpError(409, 'Email in use!');
  }

  if (req.body.password) {
    const isPwdCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPwdCorrect) {
      throw createHttpError(401, 'password is incorrect');
    }
  }
  const { newPassword, ...newData } = req.body;
  newData.password = newPassword;
  newData.avatar = photo;
  const newUser = await updateUser({ _id }, newData);
  res.json(newUser.data);
};
