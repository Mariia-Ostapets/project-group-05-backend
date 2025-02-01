import { Router } from 'express';

import waterRouter from './water.js';

const router = Router();

router.use('/water', waterRouter);

import authRouter from './auth.js';

router.use('/auth', authRouter);


export default router;
