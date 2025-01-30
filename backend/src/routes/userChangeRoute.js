import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import userPasswordChangeController from '../controllers/userChangeController.js'
   
const router = express.Router();
router.post('/api/change',authenticateJWT,userPasswordChangeController);

export default router;
