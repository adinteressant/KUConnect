import express from 'express';
import registerController from './../controllers/registerController.js';
import registerMiddleware from './../controllers/registerController.js';

import { checkSchema } from 'express-validator'
import { registerSchema } from '../utils/validationSchema.js'

  let router = express.Router();

  router.post("/v1/api/user-register/",checkSchema(registerSchema)
  ,registerMiddleware,registerController);

export default router;
