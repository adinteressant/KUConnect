import { Router } from 'express';

import loginRouter from './loginRoutes.js';
import registerRouter from './registerRoutes.js'; 
import userRouter from './userRoutes.js';  
import logoutRouter from './logoutRoutes.js'
import postRouter from './postRoutes.js';
import userChangePasswordRoute from '../routes/userChangePasswordRoute.js';
import getPictureRouter from '../routes/getPictureRoutes.js';
import updatePictureRouter from '../routes/updatePictureRouter.js';
import profileRouter from '../routes/profileRoute.js'
import messageRouter from '../routes/messageRoutes.js'

const router = Router();

router.use(loginRouter);
router.use(registerRouter);
router.use(userRouter);
router.use(logoutRouter);
router.use(postRouter);
router.use(userChangePasswordRoute);
router.use(getPictureRouter);
router.use(updatePictureRouter);
router.use(profileRouter)
router.use(messageRouter)

export default router;
