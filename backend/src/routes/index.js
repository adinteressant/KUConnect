import { Router } from 'express';

import loginRouter from './loginRoutes.js';
import registerRouter from './registerRoutes.js'; 
import userRouter from './userRoutes.js';  
import logoutRouter from './logoutRoutes.js'
import postRouter from './postRoutes.js';

const router = Router();

router.use(loginRouter);
router.use(registerRouter);
router.use(userRouter);
router.use(logoutRouter);
router.use(postRouter);

export default router;
