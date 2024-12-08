import express from 'express';
import {getUserProfileController} from '../controllers/userController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js'

const router = express.Router();

router.get("/v1/api/get-user-profile/",authenticateJWT,getUserProfileController);

export default router;

