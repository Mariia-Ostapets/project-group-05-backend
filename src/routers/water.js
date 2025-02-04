import { Router } from 'express';
import { checkToken } from '../middlewares/checkToken.js';
import * as waterController from '../controllers/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
// import { isValidId } from '../middlewares/isValidId.js';
import { addWaterSchema, updateWaterSchema } from '../validation/water.js';

const waterRouter = new Router();

waterRouter.use(checkToken);

// waterRouter.get('/',  ctrlWrapper(waterController.getWaterController));

// waterRouter.get('/:id', isValidId, ctrlWrapper(waterController.getWaterByIdController));

waterRouter.get(
  '/today/:date',
  ctrlWrapper(waterController.getWaterByDayController),
);
waterRouter.get('/:date', ctrlWrapper(waterController.getWaterByDayController));

waterRouter.get(
  '/:year/:month',
  ctrlWrapper(waterController.getWaterByMonthController),
);
waterRouter.get(
  '/:year/:month',
  ctrlWrapper(waterController.getWaterByMonthController),
);

// waterRouter.get('/:yearMonth', ctrlWrapper(waterController.getWaterByMonthController));

waterRouter.post(
  '/',
  validateBody(addWaterSchema),
  ctrlWrapper(waterController.addWaterController),
);

// waterRouter.patch('/:date/:time', validateBody(updateWaterSchema), ctrlWrapper(waterController.updateWaterController));
waterRouter.patch(
  '/:entryId',
  validateBody(updateWaterSchema),
  ctrlWrapper(waterController.updateWaterController),
);

// waterRouter.delete('/:date/:time', ctrlWrapper(waterController.deleteWaterController));
waterRouter.delete(
  '/:entryId',
  ctrlWrapper(waterController.deleteWaterController),
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
