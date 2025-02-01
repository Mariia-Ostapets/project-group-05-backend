import { Router } from 'express';
import { checkToken } from '../middlewares/checkToken.js';
import * as waterController from '../controllers/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {addWaterSchema, updateWaterSchema} from '../validation/water.js';

const waterRouter = new Router();

waterRouter.use(checkToken);

waterRouter.get('/',  ctrlWrapper(waterController.getWaterController));

waterRouter.get('/:id', isValidId, ctrlWrapper(waterController.getWaterByIdController));

waterRouter.get('/today', ctrlWrapper(waterController.getWaterByDayController));

waterRouter.get('/month', ctrlWrapper(waterController.getWaterByMonthController));

waterRouter.post('/', validateBody(addWaterSchema), ctrlWrapper(waterController.addWaterController));

waterRouter.patch('/:id', isValidId, validateBody(updateWaterSchema), ctrlWrapper(waterController.updateWaterController));

waterRouter.delete('/:id', isValidId, ctrlWrapper(waterController.deleteWaterController));


export default waterRouter;
