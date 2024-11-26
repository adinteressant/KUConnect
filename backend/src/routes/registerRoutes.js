import express from 'express';
import registerController from './../controllers/registerController.js';
import registerMiddleware from './../controllers/registerController.js';
import {body} from 'express-validator';

  let router = express.Router();
  router.post("/v1/api/user-register/",[
      body('username')
    .trim()
    .escape()
    .isLength({min:3})
    .withMessage('Length of username must be greater than 3!'),
    body('email')
    .trim()
    .escape()
    .isLength({min:12})
    .withMessage('Length of email must be greater than 3!'),
    body('password')
    .trim()
    .escape()
    .isLength({min:16})
    .withMessage('Password must be of 16 characters or more!')
  ],registerMiddleware,registerController);

export default router;
