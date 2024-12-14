import authenticateJWT from '../middlewares/authenticateJWT.js';
import updatePictureController from '../controllers/updatePictureController.js';
import express from 'express';

const router = express.Router();

router.post('/api/update-pfp',authenticateJWT,updatePictureController);
export default router;
