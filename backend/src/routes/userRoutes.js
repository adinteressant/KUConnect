import express from 'express';
import {getUserProfileController} from '../controllers/userController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import updateRoutesController from '../controllers/updateRoutesController.js';

const router = express.Router();

router.get("/api/get-user-profile",authenticateJWT,getUserProfileController);
router.post("/api/update-tags",authenticateJWT,updateRoutesController);
export default router;

