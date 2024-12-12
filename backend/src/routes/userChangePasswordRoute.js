import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import userPasswordChangeController from '../controllers/userPasswordChangeController.js'
   
const router = express.Router();
router.post('/api/change-password',authenticateJWT,userPasswordChangeController);

export default router;
