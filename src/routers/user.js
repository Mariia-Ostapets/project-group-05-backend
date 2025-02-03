import { Router } from 'express';
import {
  changeEmailAndPasswordUserSchema,
  changeDailyNorm,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';
import * as userController from '../controllers/user.js';

const userRouter = Router();

userRouter.get('/current', checkToken, ctrlWrapper(userController.refreshUser));

userRouter.patch(
  '/update',
  checkToken,
  validateBody(changeEmailAndPasswordUserSchema),
  ctrlWrapper(userController.patchUser),
);

userRouter.patch(
  '/update-water-rate',
  checkToken,
  validateBody(changeDailyNorm),
  ctrlWrapper(userController.patchUser),
);

export default userRouter;
