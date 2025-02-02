import { Router } from 'express';
import { registerAndLoginUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';
import * as authController from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(registerAndLoginUserSchema),
  ctrlWrapper(authController.registerController),
);

authRouter.post(
  '/login',
  validateBody(registerAndLoginUserSchema),
  ctrlWrapper(authController.loginUserController),
);

authRouter.post(
  '/logout',
  checkToken,
  ctrlWrapper(authController.loguotUserById),
);

authRouter.get('/current', checkToken, ctrlWrapper(authController.refreshUser));

export default authRouter;
