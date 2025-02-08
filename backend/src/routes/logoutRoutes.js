import express from "express";
import authenticateJWT from '../middlewares/authenticateJWT.js'
import logoutController  from "../controllers/logoutController.js";
import { checkAuth } from "../controllers/checkAuth.js";
const router = express.Router();

router.get("/api/user-logout",authenticateJWT,logoutController);
router.get('/api/verify', authenticateJWT, checkAuth); 

export default router;
