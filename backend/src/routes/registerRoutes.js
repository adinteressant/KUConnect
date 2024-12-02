import express from 'express';
import registerController from './../controllers/registerController.js';
import registerMiddleware from './../middlewares/registerMiddleware.js';
import { checkSchema } from 'express-validator';
import { registerSchema } from '../utils/validationSchema.js'; // Validation schema

let router = express.Router();

// Register endpoint: Validate, then register
router.post(
  "/v1/api/user-register/",
  checkSchema(registerSchema), 
  registerMiddleware,           
  registerController           
);

export default router;
