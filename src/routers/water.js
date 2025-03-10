import { Router } from 'express';
import { checkToken } from '../middlewares/checkToken.js';
import * as waterController from '../controllers/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addWaterSchema, updateWaterSchema } from '../validation/water.js';

const waterRouter = new Router();

waterRouter.use(checkToken);

waterRouter.get(
  '/day/:date',
  ctrlWrapper(waterController.getWaterByDayController),
);

waterRouter.get(
  '/month/:yearMonth',
  ctrlWrapper(waterController.getWaterByMonthController),
);

waterRouter.post(
  '/',
  validateBody(addWaterSchema),
  ctrlWrapper(waterController.addWaterController),
);

waterRouter.patch(
  '/:entryId',
  validateBody(updateWaterSchema),
  ctrlWrapper(waterController.updateWaterController),
);

waterRouter.delete(
  '/:entryId',
  ctrlWrapper(waterController.deleteWaterController),
);

export default waterRouter;
