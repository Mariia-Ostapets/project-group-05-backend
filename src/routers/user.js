import { Router } from 'express';
import {
  changeEmailAndPasswordUserSchema,
  changeDailyNorm,
  changeAvatar,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';
import * as userController from '../controllers/user.js';
import { upload } from '../middlewares/multer.js';
import * as waterController from '../controllers/water.js';

const userRouter = Router();

userRouter.get('/current', checkToken, ctrlWrapper(userController.refreshUser));

userRouter.patch(
  '/',
  checkToken,
  validateBody(changeEmailAndPasswordUserSchema),
  ctrlWrapper(userController.patchUser),
);

userRouter.patch(
  '/avatar',
  upload.single('avatar'),
  checkToken,
  validateBody(changeAvatar),
  ctrlWrapper(userController.patchUser),
);

userRouter.patch(
  '/water-rate',
  checkToken,
  validateBody(changeDailyNorm),
  ctrlWrapper(waterController.updateDailyNormController),
  ctrlWrapper(userController.patchUser),
);

export default userRouter;
