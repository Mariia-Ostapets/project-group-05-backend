import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { updateUser } from '../services/user.js';

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
  const { id: _id } = user;
  if (req.body.password) {
    const isPwdCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPwdCorrect) {
      throw createHttpError(401, 'password is incorrect');
    }
  }
  let { newPassword, ...newData } = req.body;
  newData.password = newPassword;
  const newUser = await updateUser({ _id }, newData);

  res.json({
    status: 200,
    message: 'Successfully update info!',
    data: newUser.data,
  });
};
