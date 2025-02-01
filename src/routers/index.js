import { Router } from 'express';
import waterRouter from './water.js';
import authRouter from './auth.js';

const router = Router();

router.use('/water', waterRouter);

router.use('/auth', authRouter);

export default router;
