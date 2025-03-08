import loginController from "../controllers/loginController.js";
import loginMiddleware from "../middlewares/loginMiddleware.js"
import express from "express";
import authenticateJWT from '../middlewares/authenticateJWT.js'
import { checkSchema } from 'express-validator'
import { loginSchema } from '../utils/validationSchema.js'
import { forgotPasswordController,setNewPasswordController } from '../controllers/loginController.js'

const router = express.Router();

router.post("/api/user-login",checkSchema(loginSchema),loginMiddleware,loginController);

router.get('/api/forgot-password',forgotPasswordController)

router.post('/api/set-new-password',setNewPasswordController)
export default router;
