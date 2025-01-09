import express from 'express';
import {getUserProfileController} from '../controllers/userController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import updateRoutesController from '../controllers/updateRoutesController.js';
import clearNotification from '../controllers/notificationController.js';
import { searchUsers } from '../controllers/userController.js';

const router = express.Router();

router.get("/api/get-user-profile",authenticateJWT,getUserProfileController);
router.get("/api/users/search", searchUsers);
router.post("/api/update-tags",authenticateJWT,updateRoutesController);
router.post("/api/clear-notifications",authenticateJWT,clearNotification);


export default router;

