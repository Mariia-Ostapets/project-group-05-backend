import { Router } from 'express';
import { checkToken } from '../middlewares/checkToken.js';

const router = new Router();

router.use(checkToken);
