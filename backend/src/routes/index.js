import { Router } from 'express';

import loginRouter from './loginRoutes.js';
import registerRouter from './registerRoutes.js'; 
import generateJWTRouter from './generateJWT.js';

const router = Router();

router.use(loginRouter);
router.use(registerRouter);
router.use(generateJWTRouter);

export default router;
