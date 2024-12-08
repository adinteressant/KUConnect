import { Router } from 'express';

import loginRouter from './loginRoutes.js';
import registerRouter from './registerRoutes.js'; 
import userRouter from './userRoutes.js';  

const router = Router();

router.use(loginRouter);
router.use(registerRouter);
router.use(userRouter);

export default router;
