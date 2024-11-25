import loginController from "../controllers/loginController.js";
import loginMiddleware from "../middlewares/loginMiddleware.js"
import express from "express";
import {body} from 'express-validator';

const router = express.Router();

router.post("/v1/api/user-login",
  [
    body('email')
      .trim()
      .escape()
      .isLength({ min: 10 })
      .withMessage('Username must be at least 3 characters long'),
    body('password')
      .trim()
      .escape()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
],loginMiddleware,loginController);

export default router;
